mod adapter;

use adapter::Adapter;

#[derive(Debug, PartialEq)]
pub enum Status {
  On,
  Off,
}

pub struct Hv {
  adapter: Adapter,
}

impl Hv {
  pub fn new() -> Self {
    Self {
      adapter: Adapter::new(),
    }
  }

  pub fn status(&self) -> Status {
    if self.adapter.is_running() {
      Status::On
    } else {
      Status::Off
    }
  }

  pub fn start(&mut self) {
    self.adapter.start()
  }

  pub fn stop(&mut self) {
    self.adapter.stop()
  }

  pub fn plug(&mut self) {
    self.adapter.plug()
  }
}
