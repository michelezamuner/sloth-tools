use crate::vm::{Bus, Device, Error, Input, Rom, Vm};
use std::sync::{Arc, Mutex};
use std::thread;

#[derive(Debug, PartialEq)]
pub enum Status {
  On,
  Off(Option<Error>),
}

pub struct Hv {
  should_stop: Arc<Mutex<bool>>,
  handle: Option<thread::JoinHandle<Result<(), Error>>>,
  plug: Option<(u8, u8)>,
}

impl Hv {
  pub fn new() -> Self {
    Self {
      should_stop: Arc::new(Mutex::new(false)),
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
    let input = HvInput::new(Arc::clone(&self.should_stop));
    let plug = self.plug;
    self.handle = Some(thread::spawn(move || {
      let mut bus = Bus::new();
      if let Some((seg, code)) = plug {
        let rom: Box<dyn Device> = Box::new(Rom::new(code));
        bus.register(rom, seg)?;
      }
      let vm = Vm::new(bus);
      vm.run(input)
    }))
  }

  pub fn stop(&mut self) {
    *self.should_stop.lock().unwrap() = true
  }

  pub fn plug(&mut self, seg: u8, code: u8) {
    self.plug = Some((seg, code));
  }
}

struct HvInput {
  should_stop: Arc<Mutex<bool>>,
}

impl HvInput {
  fn new(should_stop: Arc<Mutex<bool>>) -> Self {
    Self { should_stop }
  }
}

impl Input for HvInput {
  fn is_off(&self) -> bool {
    *self.should_stop.lock().unwrap()
  }
}
