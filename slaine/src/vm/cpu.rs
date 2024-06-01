use super::*;
use std::cell::RefCell;
use std::rc::Rc;

pub struct Cpu {
  bus: Rc<RefCell<Bus>>,
  ip: Addr,
  ir: Data,
  ix: Byte,
  a: Data,
}

impl Cpu {
  pub fn new(bus: Rc<RefCell<Bus>>) -> Self {
    Cpu {
      bus,
      ip: 0x00,
      ir: [0x00, 0x00, 0x00, 0x00],
      ix: 0x00,
      a: [0x00, 0x00, 0x00, 0x00],
    }
  }

  pub fn run<T: FnMut() -> bool>(&mut self, mut power_off: T) -> Result<(), Error> {
    while !power_off() && self.ix != 0xff {
      self.ir = self.bus.borrow().read(self.ip)?;
      self.ip += 4;
      self.exec();
    }

    Ok(())
  }

  fn exec(&mut self) {
    let opcode = self.ir[0];
    match opcode {
      // noop
      0x00 => {}
      // mov_i
      0x01 => match self.ir[1] {
        // a
        0x00 => self.a = [0x00, 0x00, self.ir[2], self.ir[3]],
        _ => panic!("Unknown register"),
      },
      // mov_m
      0x07 => match self.ir[1] {
        // a
        0x00 => {
          // @todo: handle errors
          _ = self
            .bus
            .borrow_mut()
            .write(self.ir[2] as Addr * 256 + self.ir[3] as Addr, self.a)
        }
        _ => panic!("Unknown register"),
      },
      // jmp
      0x30 => self.ip = self.ir[2] as Addr * 256 + self.ir[3] as Addr,
      // halt
      0xff => self.ix = 0xff,
      _ => panic!("Unknown instruction"),
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::vm::Device;
  use std::cell::RefCell;

  #[test]
  fn fails_if_no_device_is_registered_at_begin_addr() {
    let bus = Bus::new();
    let mut cpu = Cpu::new(Rc::new(RefCell::new(bus)));

    let res = cpu.run(|| false);

    assert!(matches!(res, Err(Error::NoDevice)));
  }

  #[test]
  fn terminate_with_power_off() {
    let mut bus = Bus::new();
    let dev = Dev::new(vec![0x00, 0x00, 0x00, 0x00]);
    let _ = bus.register(Box::new(dev), 0x00);
    let mut cpu = Cpu::new(Rc::new(RefCell::new(bus)));

    let res = cpu.run(|| true);

    assert!(res.is_ok());
  }

  #[test]
  fn terminate_with_halt_instruction() {
    let instructions = vec![
      0xff, 0x00, 0x00, 0x00, // halt
    ];
    let dev = Dev::new(instructions);
    let mut bus = Bus::new();
    let _ = bus.register(Box::new(dev), 0x00);
    let mut cpu = Cpu::new(Rc::new(RefCell::new(bus)));

    let res = cpu.run(|| false);

    assert_eq!(res, Ok(()));
  }

  #[test]
  fn write_to_memory() {
    let instructions = vec![
      0x01, 0x00, 0x12, 0x34, // mov_i a 0x1234
      0x07, 0x00, 0x00, 0x12, // mov_m a 0x0012
      0xff, 0x00, 0x00, 0x00, // halt
    ];
    let written = Rc::new(RefCell::new(Written {
      addr: None,
      data: None,
    }));
    let dev = Dev::new_with_written(instructions, Rc::clone(&written));
    let mut bus = Bus::new();
    let _ = bus.register(Box::new(dev), 0x00);
    let mut cpu = Cpu::new(Rc::new(RefCell::new(bus)));

    let res = cpu.run(|| false);

    assert_eq!(res, Ok(()));
    assert_eq!(written.borrow().addr, Some(0x12));
    assert_eq!(written.borrow().data, Some([0x00, 0x00, 0x12, 0x34]));
  }

  #[test]
  fn jump_to_absolute_address() {
    let instructions = vec![
      0x30, 0x00, 0x00, 0x08, // jmp 0x0008
      0x00, 0x00, 0x00, 0x00, // noop
      0xff, 0x00, 0x00, 0x00, // halt
    ];
    let dev = Dev::new(instructions);
    let mut bus = Bus::new();
    let _ = bus.register(Box::new(dev), 0x00);
    let mut cpu = Cpu::new(Rc::new(RefCell::new(bus)));

    let res = cpu.run(|| false);

    assert_eq!(res, Ok(()));
  }

  struct Written {
    addr: Option<Addr>,
    data: Option<Data>,
  }

  struct Dev {
    instructions: Vec<u8>,
    written: Option<Rc<RefCell<Written>>>,
  }

  impl Dev {
    pub fn new(instructions: Vec<u8>) -> Self {
      Self {
        instructions,
        written: None,
      }
    }

    pub fn new_with_written(instructions: Vec<u8>, written: Rc<RefCell<Written>>) -> Self {
      Self {
        instructions,
        written: Some(written),
      }
    }
  }

  impl Device for Dev {
    fn read(&self, addr: Addr) -> Data {
      self.instructions[(addr as usize)..(addr as usize) + 4]
        .try_into()
        .unwrap()
    }

    fn write(&mut self, addr: Addr, data: Data) -> Result<(), Error> {
      self.written.as_mut().unwrap().borrow_mut().addr = Some(addr);
      self.written.as_mut().unwrap().borrow_mut().data = Some(data);

      Ok(())
    }
  }
}
