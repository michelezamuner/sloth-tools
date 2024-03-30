use super::{Bus, Error};
use std::rc::Rc;

pub struct Cpu {
  bus: Rc<Bus>,
}

impl Cpu {
  pub fn new(bus: Rc<Bus>) -> Self {
    Cpu { bus }
  }

  pub fn run<T: FnMut() -> bool>(&self, mut power_off: T) -> Result<(), Error> {
    while !power_off() {
      let code = self.bus.read(0x00)?;
      if code == 0xff {
        break;
      }
    }

    Ok(())
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::vm::Device;

  #[test]
  fn fails_if_no_device_is_registered_at_begin_addr() {
    let bus = Bus::new();
    let cpu = Cpu::new(Rc::new(bus));

    let res = cpu.run(|| false);

    assert!(matches!(res, Err(Error::NoDevice)));
  }

  #[test]
  fn terminate_with_power_off() {
    let mut bus = Bus::new();
    let dev = Dev {};
    let _ = bus.register(Box::new(dev), 0x00);
    let cpu = Cpu::new(Rc::new(bus));

    let res = cpu.run(|| true);

    assert!(res.is_ok());
  }

  #[test]
  fn terminate_with_halt_code() {
    let mut bus = Bus::new();
    let dev = Dev {};
    let _ = bus.register(Box::new(dev), 0x00);
    let cpu = Cpu::new(Rc::new(bus));

    let res = cpu.run(|| false);

    assert!(res.is_ok());
  }

  struct Dev {}
  impl Device for Dev {
    fn read(&self, _addr: u16) -> u8 {
      0xff // halt instruction
    }
  }
}
