use super::Error;

pub type Byte = u8;
pub type Addr = u16;
pub type Word = [Byte; 4];
pub type Seg = usize;

const MAX_SEGMENTS: Seg = 16;

pub trait Device {
  fn read(&self, addr: Addr) -> Word;
  fn write(&mut self, addr: Addr, data: Word) -> Result<(), Error>;
}

#[derive(Default)]
pub struct Bus {
  devices: [Option<Box<dyn Device>>; MAX_SEGMENTS],
}

impl Bus {
  pub fn new() -> Self {
    Self {
      devices: Default::default(),
    }
  }
  pub fn register(&mut self, device: Box<dyn Device>, seg: Seg) -> Result<(), Error> {
    if seg > (MAX_SEGMENTS - 1) {
      return Err(Error::InvalidSegment(seg));
    }

    self.devices[seg] = Some(device);

    Ok(())
  }

  pub fn read(&self, addr: Addr) -> Result<Word, Error> {
    let seg = (addr >> 12) as Seg;
    let off = (addr & 0x0fff) as Addr;

    let dev = self.devices[seg].as_ref();
    if dev.is_none() {
      return Err(Error::MissingDevice);
    }

    Ok(dev.unwrap().read(off))
  }

  pub fn write(&mut self, addr: Addr, data: Word) -> Result<(), Error> {
    let seg = (addr >> 12) as Seg;
    let off = (addr & 0x0fff) as Addr;

    let dev = self.devices[seg].as_mut();
    if dev.is_none() {
      return Err(Error::MissingDevice);
    }

    dev.unwrap().write(off, data)
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use std::cell::RefCell;
  use std::rc::Rc;

  #[test]
  fn fails_trying_to_register_to_an_invalid_segment() {
    let mut bus = Bus::new();
    let dev = Dev::new();

    let res = bus.register(Box::new(dev), 0xff);

    assert!(matches!(res, Err(Error::InvalidSegment(0xff))));
  }
  #[test]
  fn fails_if_no_device_is_registered_for_given_address() {
    let mut bus = Bus::new();
    let dev = Dev::new();
    let _ = bus.register(Box::new(dev), 0x00);

    let res_read = bus.read(0x1234);
    assert!(matches!(res_read, Err(Error::MissingDevice)));

    let res_write = bus.write(0x1234, [0x00, 0x00, 0x00, 0x00]);
    assert!(matches!(res_write, Err(Error::MissingDevice)));
  }

  #[test]
  fn reads_from_registered_device() {
    let mut bus = Bus::new();
    let dev = Dev::new();
    let _ = bus.register(Box::new(dev), 0x01);

    let res = bus.read(0x1234);

    assert_eq!(res.unwrap(), [0x00, 0x00, 0x00, 0x12]);
  }

  #[test]
  fn writes_to_registered_device() {
    let written = Rc::new(RefCell::new(Written {
      addr: None,
      data: None,
    }));
    let dev = Dev::new_with_written(Rc::clone(&written));
    let mut bus = Bus::new();
    let _ = bus.register(Box::new(dev), 0x02);

    let res = bus.write(0x2345, [0x98, 0x76, 0x54, 0x32]);

    assert_eq!(res, Ok(()));
    assert_eq!(written.borrow().addr, Some(0x0345));
    assert_eq!(written.borrow().data, Some([0x98, 0x76, 0x54, 0x32]));
  }

  struct Written {
    addr: Option<Addr>,
    data: Option<Word>,
  }

  struct Dev {
    written: Option<Rc<RefCell<Written>>>,
  }

  impl Dev {
    pub fn new() -> Self {
      Self { written: None }
    }

    pub fn new_with_written(written: Rc<RefCell<Written>>) -> Self {
      Self {
        written: Some(written),
      }
    }
  }

  impl Device for Dev {
    fn read(&self, addr: Addr) -> Word {
      match addr {
        0x0234 => [0x00, 0x00, 0x00, 0x12],
        _ => [0x00, 0x00, 0x00, 0x00],
      }
    }

    fn write(&mut self, addr: Addr, data: Word) -> Result<(), Error> {
      self.written.as_mut().unwrap().borrow_mut().addr = Some(addr);
      self.written.as_mut().unwrap().borrow_mut().data = Some(data);

      Ok(())
    }
  }
}
