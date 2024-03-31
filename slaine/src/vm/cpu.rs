use super::*;
use std::rc::Rc;

pub struct Cpu {
  bus: Rc<Bus>,
  ip: Addr,
  ir: Data,
  ix: Byte,
}

impl Cpu {
  pub fn new(bus: Rc<Bus>) -> Self {
    Cpu {
      bus,
      ip: 0x00,
      ir: [0u8, 0u8, 0u8, 0u8],
      ix: 0x00,
    }
  }

  pub fn run<T: FnMut() -> bool>(&mut self, mut power_off: T) -> Result<(), Error> {
    while !power_off() && self.ix != 0xff {
      self.ir = self.bus.read(self.ip)?;
      // @todo: self.ip += DATA_SIZE as u16;
      self.exec();
    }

    Ok(())
  }

  fn exec(&mut self) {
    let opcode = self.ir[0];
    if opcode == 0xff {
      self.ix = 0xff;
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::vm::Device;

  #[test]
  fn fails_if_no_device_is_registered_at_begin_addr() {
    let bus = Bus::new();
    let mut cpu = Cpu::new(Rc::new(bus));

    let res = cpu.run(|| false);

    assert!(matches!(res, Err(Error::NoDevice)));
  }

  #[test]
  fn terminate_with_power_off() {
    let mut bus = Bus::new();
    let dev = Dev {};
    let _ = bus.register(Box::new(dev), 0x00);
    let mut cpu = Cpu::new(Rc::new(bus));

    let res = cpu.run(|| true);

    assert!(res.is_ok());
  }

  #[test]
  fn terminate_with_halt_code() {
    let mut bus = Bus::new();
    let dev = Dev {};
    let _ = bus.register(Box::new(dev), 0x00);
    let mut cpu = Cpu::new(Rc::new(bus));

    let res = cpu.run(|| false);

    assert!(res.is_ok());
  }

  struct Dev {}
  impl Device for Dev {
    fn read(&self, _addr: Addr) -> Data {
      [0xff, 0x00, 0x00, 0x00] // halt instruction
    }
  }
}
