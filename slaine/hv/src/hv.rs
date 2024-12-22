use std::cell::RefCell;
use std::rc::Rc;
use std::sync::{Arc, Mutex};
use std::thread;
use vm::device::output::Output;
use vm::device::rom::Rom;
use vm::device::stream_in::{Source, StreamIn};
use vm::{Byte, Device, Error, Interrupt, Seg, Vm};

#[derive(Debug, PartialEq)]
pub enum Status {
  On,
  Off,
}

pub struct Hv {
  power_off: Arc<Mutex<bool>>,
  handle: Option<thread::JoinHandle<()>>,
  plug_rom: Option<(Seg, Vec<Byte>)>,
  plug_cli: Option<Seg>,
  plug_input: Option<Seg>,
  logs: Arc<Mutex<Vec<String>>>,
  input: Arc<Mutex<Option<Vec<Byte>>>>,
}

impl Hv {
  pub fn new() -> Self {
    Self {
      power_off: Arc::new(Mutex::new(false)),
      handle: None,
      plug_rom: None,
      plug_cli: None,
      plug_input: None,
      logs: Arc::new(Mutex::new(vec![])),
      input: Arc::new(Mutex::new(None)),
    }
  }

  pub fn status(&self) -> Status {
    if self.handle.is_none() {
      return Status::Off;
    }

    if self.handle.as_ref().unwrap().is_finished() {
      return Status::Off;
    }

    Status::On
  }

  pub fn start(&mut self) {
    let interrupt = HvInterrupt::new(Arc::clone(&self.power_off));
    // @todo: should not copy the whole code from config!
    // @todo: maybe pass plug_rom as an argument so it can be moved
    let plug_rom = self.plug_rom.clone();
    let plug_cli = self.plug_cli;
    let plug_input = self.plug_input;
    let logs = Arc::clone(&self.logs);
    let input = Arc::clone(&self.input);
    self.handle = Some(thread::spawn(move || {
      let mut vm = Vm::new();

      if let Some((seg, code)) = plug_rom {
        let rom: Box<dyn Device> = Box::new(Rom::new(code));
        let result = vm.plug(rom, seg);
        if let Err(e) = result {
          logs.lock().unwrap().push(error(e));

          return;
        }
      }

      if let Some(seg) = plug_cli {
        let logs2 = Arc::clone(&logs);
        let output: Box<dyn Device> = Box::new(Output::new(move |data| {
          logs2
            .lock()
            .unwrap()
            .push(u32::from_be_bytes(data).to_string());

          Ok(())
        }));
        let result = vm.plug(output, seg);
        if let Err(e) = result {
          logs.lock().unwrap().push(error(e));

          return;
        }
      }

      if let Some(seg) = plug_input {
        let hv_input = HvInput::new(Arc::clone(&input));
        let stream_in: Box<dyn Device> = Box::new(StreamIn::new(Rc::new(RefCell::new(hv_input))));
        let result = vm.plug(stream_in, seg);
        if let Err(e) = result {
          logs.lock().unwrap().push(error(e));

          return;
        }
      }

      let result = vm.run(&interrupt);
      if let Err(e) = result {
        logs.lock().unwrap().push(error(e))
      }
    }))
  }
  pub fn stop(&mut self) {
    *self.power_off.lock().unwrap() = true
  }

  pub fn plug_rom(&mut self, seg: Seg, code: Vec<Byte>) {
    self.plug_rom = Some((seg, code));
  }

  pub fn plug_cli(&mut self, seg: Seg) {
    self.plug_cli = Some(seg);
  }

  pub fn plug_input(&mut self, seg: Seg) {
    self.plug_input = Some(seg);
  }

  pub fn logs(&self) -> Vec<String> {
    self.logs.lock().unwrap().to_vec()
  }

  pub fn input(&mut self, data: Vec<Byte>) {
    // @todo: should be some kind of queue instead
    *self.input.lock().unwrap() = Some(data);
  }
}

struct HvInterrupt {
  power_off: Arc<Mutex<bool>>,
}

impl HvInterrupt {
  fn new(power_off: Arc<Mutex<bool>>) -> Self {
    Self { power_off }
  }
}

impl Interrupt for HvInterrupt {
  fn is_power_off(&self) -> bool {
    *self.power_off.lock().unwrap()
  }
}

fn error(e: Error) -> String {
  match e {
    Error::MissingDevice => "Error: No starting device found".to_string(),
    Error::InvalidSegment(seg) => {
      format!("Error: Cannot register device on invalid segment {}", seg)
    }
    Error::CannotWriteToDevice => "Error: Cannot write to device".to_string(),
  }
}

struct HvInput {
  data: Arc<Mutex<Option<Vec<Byte>>>>,
}

impl HvInput {
  pub fn new(data: Arc<Mutex<Option<Vec<Byte>>>>) -> Self {
    Self { data }
  }
}

impl Source for HvInput {
  fn fetch(&self) -> Option<Vec<Byte>> {
    self.data.lock().unwrap().clone()
  }

  fn reset(&mut self) {
    *self.data.lock().unwrap() = None;
  }
}
