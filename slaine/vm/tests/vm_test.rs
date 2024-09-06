use std::cell::{Cell, RefCell};
use std::rc::Rc;
use std::sync::{Arc, Mutex};
use std::thread;
use vm::device::cli_out::{Cli, CliOut};
use vm::device::rom::Rom;
use vm::device::stream_in::{Source, StreamIn};
use vm::{Byte, Device, Error, Interrupt, Vm};

#[test]
fn stops_when_power_is_off() {
  let is_power_off = Arc::new(Mutex::new(false));
  let interrupt = InterruptStub::new(Some(Arc::clone(&is_power_off)));

  thread::spawn(move || {
    let mut vm = Vm::new();
    let result = vm.run(&interrupt);

    assert!(result.is_ok());
  });

  *is_power_off.lock().unwrap() = true;
}

#[test]
fn fails_if_boot_device_is_missing() {
  let mut vm = Vm::new();
  let result = vm.run(&InterruptStub::new(None));

  assert!(matches!(result, Err(Error::MissingDevice)));
}

#[test]
fn fails_if_device_is_plugged_to_an_invalid_segment() {
  let rom: Box<dyn Device> = Box::new(Rom::new(vec![0x00, 0x00, 0x00, 0x00]));
  let mut vm = Vm::new();

  let result = vm.plug(rom, 0x10);

  assert!(matches!(result, Err(Error::InvalidSegment(0x10))));
}

#[test]
fn stops_via_halt_instruction() {
  let rom: Box<dyn Device> = Box::new(Rom::new(vec![0xff, 0x00, 0x00, 0x00]));
  let mut vm = Vm::new();
  let _ = vm.plug(rom, 0x00);

  let result = vm.run(&InterruptStub::new(None));

  assert!(result.is_ok());
}

// @todo: this should be in the cli_device module
// @todo: this should be "writes to device"
#[test]
fn prints_data_to_cli_device() {
  let code = vec![
    0x01, 0x00, 0x12, 0x34, // mov a 0x1234 (4660)
    0x10, 0x00, 0x10, 0x00, // write a 0x1000
    0xff, 0x00, 0x00, 0x08, // halt
  ];
  let rom: Box<dyn Device> = Box::new(Rom::new(code));
  let cli_spy = Rc::new(RefCell::new(CliOutSpy::new()));
  let cli: Box<dyn Device> = Box::new(CliOut::new(Rc::clone(&cli_spy) as Rc<RefCell<dyn Cli>>));

  let mut vm = Vm::new();
  let _ = vm.plug(rom, 0x00);
  let _ = vm.plug(cli, 0x01);

  let result = vm.run(&InterruptStub::new(None));

  assert!(result.is_ok());
  assert_eq!(cli_spy.borrow().printed.as_ref().unwrap(), "4660");
}

#[test]
fn read_from_input_device() {
  let code = vec![
    0x11, 0x00, 0x10, 0x00, // read a 0x2000
    0x31, 0x00, 0x00, 0x00, // jz a 0x0000
    0x11, 0x00, 0x10, 0x01, // read a 0x2001
    0xff, 0x00, 0x00, 0x00, // halt
  ];
  let rom: Box<dyn Device> = Box::new(Rom::new(code));
  let stream_spy = Rc::new(RefCell::new(StreamSpy::new()));
  let stream: Box<dyn Device> = Box::new(StreamIn::new(
    Rc::clone(&stream_spy) as Rc<RefCell<dyn Source>>
  ));

  let mut vm = Vm::new();
  let _ = vm.plug(rom, 0x00);
  let _ = vm.plug(stream, 0x01);

  let result = vm.run(&InterruptStub::new(None));

  assert!(result.is_ok());
  assert_eq!(stream_spy.borrow().has_data.get(), true);
  assert_eq!(stream_spy.borrow().has_finished, true);
}

struct InterruptStub {
  is_power_off: Option<Arc<Mutex<bool>>>,
}

impl InterruptStub {
  fn new(is_power_off: Option<Arc<Mutex<bool>>>) -> Self {
    Self { is_power_off }
  }
}

impl Interrupt for InterruptStub {
  fn is_power_off(&self) -> bool {
    match &self.is_power_off {
      Some(is_power_off) => *is_power_off.lock().unwrap(),
      None => false,
    }
  }
}

struct CliOutSpy {
  pub printed: Option<String>,
}

impl CliOutSpy {
  pub fn new() -> Self {
    Self { printed: None }
  }
}

impl Cli for CliOutSpy {
  fn print(&mut self, text: String) {
    self.printed = Some(text)
  }
}

struct StreamSpy {
  pub has_data: Cell<bool>,
  pub has_finished: bool,
}

impl StreamSpy {
  pub fn new() -> Self {
    Self {
      has_data: Cell::new(false),
      has_finished: false,
    }
  }
}

impl Source for StreamSpy {
  fn fetch(&self) -> Option<Vec<Byte>> {
    if !self.has_data.get() {
      self.has_data.replace(true);
      None
    } else {
      Some(vec![0x12, 0x34, 0x56, 0x78])
    }
  }

  fn reset(&mut self) {
    self.has_finished = true
  }
}
