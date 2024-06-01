use crate::vm::{Bus, Byte, Cli, CliOut, Device, Error, Input, Rom, Seg, Vm};
use std::cell::RefCell;
use std::rc::Rc;
use std::sync::{Arc, Mutex};
use std::thread;

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
  logs: Arc<Mutex<Vec<String>>>,
}

impl Hv {
  pub fn new() -> Self {
    Self {
      power_off: Arc::new(Mutex::new(false)),
      handle: None,
      plug_rom: None,
      plug_cli: None,
      logs: Arc::new(Mutex::new(vec![])),
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
    let input = HvInput::new(Arc::clone(&self.power_off));
    // @todo: should not copy the whole code from config!
    // @todo: maybe pass plug_rom as an argument so it can be moved
    let plug_rom = self.plug_rom.clone();
    let plug_cli = self.plug_cli;
    let logs = Arc::clone(&self.logs);
    self.handle = Some(thread::spawn(move || {
      let mut bus = Bus::new();
      if let Some((seg, code)) = plug_rom {
        let rom: Box<dyn Device> = Box::new(Rom::new(code));
        let result = bus.register(rom, seg);
        if let Err(e) = result {
          logs.lock().unwrap().push(String::from(e));

          return;
        }
      }
      if let Some(seg) = plug_cli {
        let log_cli = LogCli::new(Arc::clone(&logs));
        let cli_out: Box<dyn Device> = Box::new(CliOut::new(Rc::new(RefCell::new(log_cli))));
        let result = bus.register(cli_out, seg);
        if let Err(e) = result {
          logs.lock().unwrap().push(String::from(e));

          return;
        }
      }
      let mut vm = Vm::new(bus);
      let result = vm.run(input);
      if let Err(e) = result {
        logs.lock().unwrap().push(e.into())
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

  pub fn logs(&self) -> Vec<String> {
    self.logs.lock().unwrap().to_vec()
  }
}

struct HvInput {
  power_off: Arc<Mutex<bool>>,
}

impl HvInput {
  fn new(power_off: Arc<Mutex<bool>>) -> Self {
    Self { power_off }
  }
}

impl Input for HvInput {
  fn power_off(&self) -> bool {
    *self.power_off.lock().unwrap()
  }
}

struct LogCli {
  logs: Arc<Mutex<Vec<String>>>,
}

impl LogCli {
  pub fn new(logs: Arc<Mutex<Vec<String>>>) -> Self {
    Self { logs }
  }
}

impl Cli for LogCli {
  fn print(&mut self, text: String) {
    self.logs.lock().unwrap().push(text)
  }
}

impl From<Error> for String {
  fn from(value: Error) -> Self {
    match value {
      Error::NoDevice => "Error: No starting device found".to_string(),
      Error::InvalidSegment(seg) => {
        format!("Error: Cannot register device on invalid segment {}", seg)
      }
      Error::CannotWriteToDevice => "Error: Cannot write to device".to_string(),
    }
  }
}
