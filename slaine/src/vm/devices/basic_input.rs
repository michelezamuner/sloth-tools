use crate::vm::{Addr, Byte, Device, Error, Word};
use std::cell::RefCell;
use std::rc::Rc;

pub trait Input {
  fn fetch(&self) -> Option<Vec<Byte>>;
  fn reset(&mut self);
}

pub struct BasicInput {
  input: Rc<RefCell<dyn Input>>,
}

impl BasicInput {
  pub fn new(input: Rc<RefCell<dyn Input>>) -> Self {
    Self { input }
  }
}

impl Device for BasicInput {
  fn read(&self, addr: Addr) -> Word {
    let data = self.input.borrow().fetch();
    if addr == 0x00 {
      if data.is_none() {
        [0x00, 0x00, 0x00, 0x00]
      } else {
        [0x00, 0x00, 0x00, 0x01]
      }
    } else if let Some(val) = data {
      self.input.borrow_mut().reset();
      match val.len() {
        0 => panic!("Empty input"),
        1 => [0x00, 0x00, 0x00, val[0]],
        2 => [0x00, 0x00, val[0], val[1]],
        3 => [0x00, val[0], val[1], val[2]],
        _ => [val[0], val[1], val[2], val[3]],
      }
    } else {
      [0x00, 0x00, 0x00, 0x00]
    }
  }

  fn write(&mut self, _: Addr, _: Word) -> Result<(), Error> {
    Err(Error::CannotWriteToDevice)
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn cannot_write() {
    let mut input = BasicInput::new(Rc::new(RefCell::new(InputSpy::new(None))));

    let result = input.write(0x00, [0x00, 0x00, 0x00, 0x00]);

    assert!(matches!(result, Err(Error::CannotWriteToDevice)));
  }

  #[test]
  fn read_zero_from_first_address_if_no_input_is_available() {
    let input = BasicInput::new(Rc::new(RefCell::new(InputSpy::new(None))));

    let result = input.read(0x00);

    assert_eq!(result, [0x00, 0x00, 0x00, 0x00]);
  }

  #[test]
  fn read_zero_from_second_address_if_no_input_is_available() {
    let input = BasicInput::new(Rc::new(RefCell::new(InputSpy::new(None))));

    let result = input.read(0x01);

    assert_eq!(result, [0x00, 0x00, 0x00, 0x00]);
  }

  #[test]
  fn read_one_from_first_address_if_input_is_available() {
    let input = BasicInput::new(Rc::new(RefCell::new(InputSpy::new(Some(vec![0x12, 0x34])))));

    let result = input.read(0x00);

    assert_eq!(result, [0x00, 0x00, 0x00, 0x01]);

    let additional_check = input.read(0x00);

    assert_eq!(additional_check, [0x00, 0x00, 0x00, 0x01]);
  }

  #[test]
  fn read_input_from_second_address_if_input_is_available() {
    let input = BasicInput::new(Rc::new(RefCell::new(InputSpy::new(Some(vec![0x12, 0x34])))));

    let result = input.read(0x01);

    assert_eq!(result, [0x00, 0x00, 0x12, 0x34]);

    let additional_check = input.read(0x00);

    assert_eq!(additional_check, [0x00, 0x00, 0x00, 0x00]);

    let additional_read = input.read(0x01);

    assert_eq!(additional_read, [0x00, 0x00, 0x00, 0x00]);
  }

  struct InputSpy {
    input: Option<Vec<Byte>>,
  }

  impl InputSpy {
    pub fn new(input: Option<Vec<Byte>>) -> Self {
      Self { input }
    }
  }

  impl Input for InputSpy {
    fn fetch(&self) -> Option<Vec<Byte>> {
      self.input.clone()
    }

    fn reset(&mut self) {
      self.input = None
    }
  }
}
