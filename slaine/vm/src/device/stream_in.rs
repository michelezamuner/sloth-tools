use crate::{Addr, Byte, Device, Error, Word};
use std::cell::RefCell;
use std::rc::Rc;

pub trait Source {
  fn fetch(&self) -> Option<Vec<Byte>>;
  fn reset(&mut self);
}

pub struct StreamIn {
  source: Rc<RefCell<dyn Source>>,
}

impl StreamIn {
  pub fn new(source: Rc<RefCell<dyn Source>>) -> Self {
    Self { source }
  }
}

impl Device for StreamIn {
  fn read(&self, addr: Addr) -> Word {
    let data = self.source.borrow().fetch();

    match addr {
      0x00 => {
        if data.is_none() {
          [0x00, 0x00, 0x00, 0x00]
        } else {
          [0x00, 0x00, 0x00, 0x01]
        }
      }
      0x01 => match data {
        Some(val) => {
          self.source.borrow_mut().reset();
          match val.len() {
            1 => [0x00, 0x00, 0x00, val[0]],
            2 => [0x00, 0x00, val[0], val[1]],
            3 => [0x00, val[0], val[1], val[2]],
            _ => [val[0], val[1], val[2], val[3]],
          }
        }
        None => [0x00, 0x00, 0x00, 0x00],
      },
      _ => [0x00, 0x00, 0x00, 0x00],
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
    let mut input = StreamIn::new(Rc::new(RefCell::new(SourceSpy::new(None))));

    let result = input.write(0x00, [0x00, 0x00, 0x00, 0x00]);

    assert!(matches!(result, Err(Error::CannotWriteToDevice)));
  }

  #[test]
  fn read_zero_from_first_address_if_no_input_is_available() {
    let input = StreamIn::new(Rc::new(RefCell::new(SourceSpy::new(None))));

    let result = input.read(0x00);

    assert_eq!(result, [0x00, 0x00, 0x00, 0x00]);
  }

  #[test]
  fn read_zero_from_second_address_if_no_input_is_available() {
    let input = StreamIn::new(Rc::new(RefCell::new(SourceSpy::new(None))));

    let result = input.read(0x01);

    assert_eq!(result, [0x00, 0x00, 0x00, 0x00]);
  }

  #[test]
  fn read_one_from_first_address_if_input_is_available() {
    let input = StreamIn::new(Rc::new(RefCell::new(SourceSpy::new(Some(vec![
      0x12, 0x34,
    ])))));

    let result = input.read(0x00);

    assert_eq!(result, [0x00, 0x00, 0x00, 0x01]);

    let additional_check = input.read(0x00);

    assert_eq!(additional_check, [0x00, 0x00, 0x00, 0x01]);
  }

  #[test]
  fn read_input_from_second_address_if_input_is_available() {
    let input = StreamIn::new(Rc::new(RefCell::new(SourceSpy::new(Some(vec![
      0x12, 0x34, 0x56, 0x78,
    ])))));

    let result = input.read(0x01);

    assert_eq!(result, [0x12, 0x34, 0x56, 0x78]);

    let next_check = input.read(0x00);

    assert_eq!(next_check, [0x00, 0x00, 0x00, 0x00]);

    let next_read = input.read(0x01);

    assert_eq!(next_read, [0x00, 0x00, 0x00, 0x00]);
  }

  #[test]
  fn read_short_input_from_second_address_if_input_is_available() {
    let input = StreamIn::new(Rc::new(RefCell::new(SourceSpy::new(Some(vec![
      0x12, 0x34,
    ])))));

    let result = input.read(0x01);

    assert_eq!(result, [0x00, 0x00, 0x12, 0x34]);
  }

  #[test]
  fn read_zero_from_inactive_address() {
    let input = StreamIn::new(Rc::new(RefCell::new(SourceSpy::new(None))));

    let result = input.read(0x02);

    assert_eq!(result, [0x00, 0x00, 0x00, 0x00]);
  }

  struct SourceSpy {
    input: Option<Vec<Byte>>,
  }

  impl SourceSpy {
    pub fn new(input: Option<Vec<Byte>>) -> Self {
      Self { input }
    }
  }

  impl Source for SourceSpy {
    fn fetch(&self) -> Option<Vec<Byte>> {
      self.input.clone()
    }
    fn reset(&mut self) {
      self.input = None
    }
  }
}
