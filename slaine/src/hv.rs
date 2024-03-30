mod adapter;

use crate::vm::Error;
use adapter::Adapter;

#[derive(Debug, PartialEq)]
pub enum Status {
  On,
  Off(Option<Error>),
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

  pub fn status(&mut self) -> Status {
    self.adapter.status()
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
