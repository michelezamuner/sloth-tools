use crate::vm::{Bus, Data, Device, Error, Input, Rom, Seg, Vm};
use std::sync::{Arc, Mutex};
use std::thread;

#[derive(Debug, PartialEq)]
pub enum Status {
  On,
  Off(Option<Error>),
}

pub struct Hv {
  power_off: Arc<Mutex<bool>>,
  handle: Option<thread::JoinHandle<Result<(), Error>>>,
  plug: Option<(Seg, Data)>,
}

impl Hv {
  pub fn new() -> Self {
    Self {
      power_off: Arc::new(Mutex::new(false)),
      handle: None,
      plug: None,
    }
  }

  pub fn status(&mut self) -> Status {
    if self.handle.is_none() {
      return Status::Off(None);
    }

    let handle_ref = self.handle.as_ref().unwrap();
    if !handle_ref.is_finished() {
      return Status::On;
    }

    let handle_owned = self.handle.take().unwrap();
    Status::Off(match handle_owned.join().unwrap() {
      Ok(_) => None,
      Err(e) => Some(e),
    })
  }

  pub fn start(&mut self) {
    let input = HvInput::new(Arc::clone(&self.power_off));
    let plug = self.plug;
    self.handle = Some(thread::spawn(move || {
      let mut bus = Bus::new();
      if let Some((seg, code)) = plug {
        let rom: Box<dyn Device> = Box::new(Rom::new(code));
        bus.register(rom, seg)?;
      }
      let mut vm = Vm::new(bus);
      vm.run(input)
    }))
  }

  pub fn stop(&mut self) {
    *self.power_off.lock().unwrap() = true
  }

  pub fn plug(&mut self, seg: Seg, code: Data) {
    self.plug = Some((seg, code));
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
