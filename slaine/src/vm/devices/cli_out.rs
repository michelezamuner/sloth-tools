use crate::vm::{Addr, Data, Device, Error};
use std::cell::RefCell;
use std::rc::Rc;

pub trait Cli {
  fn print(&mut self, text: String);
}

pub struct CliOut {
  cli: Rc<RefCell<dyn Cli>>,
}

impl CliOut {
  pub fn new(cli: Rc<RefCell<dyn Cli>>) -> Self {
    Self { cli }
  }
}

impl Device for CliOut {
  fn read(&self, _addr: Addr) -> Data {
    // @todo: this should return information useful to identify the device
    [0, 0, 0, 0]
  }

  fn write(&mut self, _addr: Addr, data: Data) -> Result<(), Error> {
    self.cli.borrow_mut().print(format!(
      "0x{:x} 0x{:x} 0x{:x} 0x{:x}",
      data[0], data[1], data[2], data[3]
    ));

    Ok(())
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn print_formatted_data_to_the_cli() {
    let cli = Rc::new(RefCell::new(CliSpy::new()));
    let mut dev = CliOut::new(Rc::clone(&cli) as Rc<RefCell<dyn Cli>>);

    let result = dev.write(0u16, [0x12, 0x34, 0x56, 0x78].into());

    assert_eq!(result, Ok(()));
    assert_eq!(cli.borrow().printed(), Some("0x12 0x34 0x56 0x78"));
  }

  #[test]
  fn provide_device_information() {
    let dev = CliOut::new(Rc::new(RefCell::new(CliSpy::new())) as Rc<RefCell<dyn Cli>>);

    // @todo: update this
    let data = dev.read(0u16);

    assert_eq!(data, [0, 0, 0, 0]);
  }

  #[derive(Clone)]
  struct CliSpy {
    printed: Option<String>,
  }

  impl CliSpy {
    pub fn new() -> Self {
      Self { printed: None }
    }

    pub fn printed(&self) -> Option<&str> {
      self.printed.as_deref()
    }
  }

  impl Cli for CliSpy {
    fn print(&mut self, text: String) {
      self.printed = Some(text);
    }
  }
}
