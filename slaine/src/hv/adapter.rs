use crate::hv::Status;
use crate::vm::*;
use std::sync::{Arc, Mutex};
use std::thread;
use std::thread::JoinHandle;

pub struct Adapter {
  should_stop: Arc<Mutex<bool>>,
  handle: Option<JoinHandle<Result<(), Error>>>,
  plug: Option<(u8, u8)>,
}

impl Adapter {
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
    let input = AdapterInput::new(Arc::clone(&self.should_stop));
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

struct AdapterInput {
  should_stop: Arc<Mutex<bool>>,
}

impl AdapterInput {
  fn new(should_stop: Arc<Mutex<bool>>) -> Self {
    Self { should_stop }
  }
}

impl Input for AdapterInput {
  fn is_off(&self) -> bool {
    *self.should_stop.lock().unwrap()
  }
}
