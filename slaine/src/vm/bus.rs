use super::{Device, Error};

pub type Data = u32;
// @todo: pub const DATA_SIZE: u8 = 0x20;
pub type Addr = u16;

#[derive(Default)]
pub struct Bus {
  devices: [Option<Box<dyn Device>>; 16],
}

impl Bus {
  pub fn new() -> Self {
    Self {
      devices: Default::default(),
    }
  }
  pub fn register(&mut self, device: Box<dyn Device>, seg: u8) -> Result<(), Error> {
    if seg > 15 {
      return Err(Error::InvalidSegment(seg));
    }

    self.devices[seg as usize] = Some(device);

    Ok(())
  }

  pub fn read(&self, addr: Addr) -> Result<Data, Error> {
    let seg = addr >> 12;
    let off = addr & 0x0fff;

    let dev = self.devices[seg as usize].as_ref();
    if dev.is_none() {
      return Err(Error::NoDevice);
    }

    Ok(dev.unwrap().read(off))
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn fails_trying_to_register_to_an_invalid_segment() {
    let mut bus = Bus::new();
    let dev = Dev {};

    let res = bus.register(Box::new(dev), 0xff);

    assert!(matches!(res, Err(Error::InvalidSegment(0xff))));
  }
  #[test]
  fn fails_if_no_device_is_registered_for_given_address() {
    let mut bus = Bus::new();
    let dev = Dev {};
    let _ = bus.register(Box::new(dev), 0x00);

    let res = bus.read(0x1234);

    assert!(matches!(res, Err(Error::NoDevice)));
  }

  #[test]
  fn reads_from_registered_device() {
    let mut bus = Bus::new();
    let dev = Dev {};
    let _ = bus.register(Box::new(dev), 0x01);

    let res = bus.read(0x1234);

    assert_eq!(res.unwrap(), 0x12);
  }

  struct Dev {}
  impl Device for Dev {
    fn read(&self, addr: Addr) -> Data {
      match addr {
        0x0234 => 0x12,
        _ => 000,
      }
    }
  }
}
