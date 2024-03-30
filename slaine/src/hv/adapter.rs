use crate::hv::Status;
use crate::vm::*;
use std::sync::{Arc, Mutex};
use std::thread;
use std::thread::JoinHandle;

pub struct Adapter {
  should_stop: Arc<Mutex<bool>>,
  handle: Option<JoinHandle<Result<(), Error>>>,
  plug: bool,
}

impl Adapter {
  pub fn new() -> Self {
    Self {
      should_stop: Arc::new(Mutex::new(false)),
      handle: None,
      plug: false,
    }
  }

  pub fn status(&mut self) -> Status {
    if let Some(handle) = self.handle.take() {
      return if handle.is_finished() {
        Status::Off(match handle.join().unwrap() {
          Ok(_) => None,
          Err(e) => Some(e),
        })
      } else {
        Status::On
      };
    }

    Status::Off(None)
  }

  pub fn start(&mut self) {
    let input = AdapterInput::new(Arc::clone(&self.should_stop));
    let plug = self.plug;
    self.handle = Some(thread::spawn(move || {
      let vm = if plug {
        Vm::with_rom(Rom::new())
      } else {
        Vm::new()
      };

      vm.run(input)
    }))
  }

  pub fn stop(&mut self) {
    *self.should_stop.lock().unwrap() = true
  }

  pub fn plug(&mut self) {
    self.plug = true;
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
