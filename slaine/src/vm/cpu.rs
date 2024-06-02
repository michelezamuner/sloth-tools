use super::*;
use std::cell::RefCell;
use std::rc::Rc;

pub struct Cpu {
  bus: Rc<RefCell<Bus>>,
  ip: Addr,
  ir: Word,
  ix: Byte,
  a: Word,
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
      // mov - write immediate to register
      0x01 => match self.ir[1] {
        // a - register
        0x00 => self.a = [0x00, 0x00, self.ir[2], self.ir[3]],
        _ => panic!("Unknown register"),
      },
      // write - write register to memory
      0x10 => match self.ir[1] {
        // a - register
        0x00 =>
        // @todo: handle errors
        {
          self
            .bus
            .borrow_mut()
            // @todo: move this to an util function
            .write(u16::from_be_bytes([self.ir[2], self.ir[3]]) as Addr, self.a)
            .unwrap()
        }
        _ => panic!("Unknown register"),
      },
      // read - read memory to register
      0x11 => match self.ir[1] {
        // a - register
        0x00 => {
          // @todo: handle errors
          let data = self
            .bus
            .borrow()
            .read(u16::from_be_bytes([self.ir[2], self.ir[3]]))
            .unwrap();
          self.a = data;
        }
        _ => panic!("Unknown register"),
      },
      // dec - decrease register
      0x21 => match self.ir[1] {
        // a - register
        0x00 => {
          // @todo: handle errors
          let value = u32::from_be_bytes(self.a) - 1;
          self.a = value.to_be_bytes();
        }
        _ => panic!("Unknown register"),
      },
      // jmp - jump to address
      0x30 => self.ip = u16::from_be_bytes([self.ir[2], self.ir[3]]) as Addr,
      // jz - jump if register is zero
      0x31 => match self.ir[1] {
        // a - register
        0x00 => {
          if self.a == [0x00, 0x00, 0x00, 0x00] {
            self.ip = u16::from_be_bytes([self.ir[2], self.ir[3]]) as Addr;
          }
        }
        _ => panic!("Unknown register"),
      },
      // halt - terminate execution
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
    let dev = Memory::new(vec![0x00, 0x00, 0x00, 0x00]);
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
    let memory = Memory::new(instructions);
    let mut bus = Bus::new();
    let _ = bus.register(Box::new(memory), 0x00);
    let mut cpu = Cpu::new(Rc::new(RefCell::new(bus)));

    let res = cpu.run(|| false);

    assert_eq!(res, Ok(()));
  }

  #[test]
  fn write_to_memory() {
    let instructions = vec![
      0x01, 0x00, 0x12, 0x34, // mov a 0x1234
      0x10, 0x00, 0x00, 0x12, // write a 0x0012
      0xff, 0x00, 0x00, 0x00, // halt
    ];
    let written = Rc::new(RefCell::new(Written::default()));
    let memory = Memory::new_with_written(instructions, Rc::clone(&written));
    let mut bus = Bus::new();
    let _ = bus.register(Box::new(memory), 0x00);
    let mut cpu = Cpu::new(Rc::new(RefCell::new(bus)));

    let res = cpu.run(|| false);

    assert_eq!(res, Ok(()));
    assert_eq!(written.borrow().addr, Some(0x12));
    assert_eq!(written.borrow().data, Some([0x00, 0x00, 0x12, 0x34]));
  }

  #[test]
  fn read_from_memory() {
    let instructions = vec![
      0x11, 0x00, 0x00, 0x04, // read a 0x04
      0x10, 0x00, 0x00, 0x12, // write a 0x0012
      0xff, 0x00, 0x00, 0x00, // halt
    ];
    let written = Rc::new(RefCell::new(Written::default()));
    let memory = Memory::new_with_written(instructions, Rc::clone(&written));
    let mut bus = Bus::new();
    let _ = bus.register(Box::new(memory), 0x00);
    let mut cpu = Cpu::new(Rc::new(RefCell::new(bus)));

    let res = cpu.run(|| false);

    assert_eq!(res, Ok(()));
    assert_eq!(written.borrow().addr, Some(0x0012));
    assert_eq!(written.borrow().data, Some([0x10, 0x00, 0x00, 0x12]));
  }

  #[test]
  fn decrease() {
    let instructions = vec![
      0x01, 0x00, 0x12, 0x34, // mov a 0x1234
      0x21, 0x00, 0x00, 0x00, // dec a
      0x10, 0x00, 0x00, 0x12, // write a 0x0012
      0xff, 0x00, 0x00, 0x00, // halt
    ];
    let written = Rc::new(RefCell::new(Written::default()));
    let memory = Memory::new_with_written(instructions, Rc::clone(&written));
    let mut bus = Bus::new();
    let _ = bus.register(Box::new(memory), 0x00);
    let mut cpu = Cpu::new(Rc::new(RefCell::new(bus)));

    let res = cpu.run(|| false);

    assert_eq!(res, Ok(()));
    assert_eq!(written.borrow().addr, Some(0x0012));
    assert_eq!(written.borrow().data, Some([0x00, 0x00, 0x12, 0x33]));
  }

  #[test]
  fn jump_to_absolute_address() {
    let instructions = vec![
      0x30, 0x00, 0x00, 0x08, // jmp 0x0008
      0x01, 0xff, 0x00, 0x00, // mov ? 0x0000 THIS PANICS IF EXECUTED
      0xff, 0x00, 0x00, 0x00, // halt
    ];
    let memory = Memory::new(instructions);
    let mut bus = Bus::new();
    let _ = bus.register(Box::new(memory), 0x00);
    let mut cpu = Cpu::new(Rc::new(RefCell::new(bus)));

    let res = cpu.run(|| false);

    assert_eq!(res, Ok(()));
  }

  #[test]
  fn jump_if_zero() {
    let instructions = vec![
      0x01, 0x00, 0x00, 0x02, // mov a 0x0002
      0x31, 0x00, 0x00, 0x10, // jz a 0x0010
      0x21, 0x00, 0x00, 0x00, // dec a
      0x30, 0x00, 0x00, 0x04, // jmp 0x0004
      0xff, 0x00, 0x00, 0x00, // halt
    ];
    let memory = Memory::new(instructions);
    let mut bus = Bus::new();
    let _ = bus.register(Box::new(memory), 0x00);
    let mut cpu = Cpu::new(Rc::new(RefCell::new(bus)));

    let res = cpu.run(|| false);

    assert_eq!(res, Ok(()));
  }

  #[derive(Default)]
  struct Written {
    addr: Option<Addr>,
    data: Option<Word>,
  }

  struct Memory {
    instructions: Vec<u8>,
    written: Option<Rc<RefCell<Written>>>,
  }

  impl Memory {
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

  impl Device for Memory {
    fn read(&self, addr: Addr) -> Word {
      self.instructions[(addr as usize)..(addr as usize) + 4]
        .try_into()
        .unwrap()
    }

    fn write(&mut self, addr: Addr, data: Word) -> Result<(), Error> {
      self.written.as_mut().unwrap().borrow_mut().addr = Some(addr);
      self.written.as_mut().unwrap().borrow_mut().data = Some(data);

      Ok(())
    }
  }
}
