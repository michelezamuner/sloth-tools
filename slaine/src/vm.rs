mod bus;
mod cpu;

use crate::vm::bus::Bus;
use crate::vm::cpu::Cpu;
use std::rc::Rc;

#[derive(Debug, PartialEq)]
pub enum Error {
  InvalidSegment,
  NoDevice,
}

pub trait Device {
  fn read(&self, addr: u16) -> u8;
}

pub trait Input {
  fn is_off(&self) -> bool;
}

pub struct Vm {
  _bus: Rc<Bus>,
  cpu: Cpu,
}

impl Vm {
  pub fn new() -> Self {
    let bus = Rc::new(Bus::new());
    let cpu = Cpu::new(Rc::clone(&bus));
    Self { _bus: bus, cpu }
  }

  pub fn with_rom(rom: Rom) -> Self {
    // @todo: pass device configuration from outside
    let mut bus = Bus::new();
    let dev: Box<dyn Device> = Box::new(rom);
    let _ = bus.register(dev, 0x00);

    let bus_ref = Rc::new(bus);
    let cpu = Cpu::new(Rc::clone(&bus_ref));

    Self { _bus: bus_ref, cpu }
  }

  pub fn run<T: Input>(&self, input: T) -> Result<(), Error> {
    self.cpu.run(|| input.is_off())
  }
}

#[derive(Debug)]
pub struct Rom {}

impl Rom {
  pub fn new() -> Self {
    Self {}
  }
}

impl Device for Rom {
  fn read(&self, _addr: u16) -> u8 {
    0xff
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn stop_when_is_off() {
    let vm = Vm::new();

    let res = vm.run(InputOff {});

    assert!(res.is_ok());
  }

  #[test]
  fn stop_with_rom() {
    let vm = Vm::with_rom(Rom::new());

    let res = vm.run(InputOn {});

    assert!(res.is_ok());
  }

  #[test]
  fn rom_just_has_exit_instruction() {
    let rom = Rom::new();
    let instruction = rom.read(0x00);
    assert_eq!(instruction, 0xff);
  }

  struct InputOff {}
  impl Input for InputOff {
    fn is_off(&self) -> bool {
      true
    }
  }

  struct InputOn {}
  impl Input for InputOn {
    fn is_off(&self) -> bool {
      false
    }
  }
}
