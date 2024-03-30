mod bus;
mod cpu;
mod rom;

pub use bus::Bus;
use cpu::Cpu;
pub use rom::Rom;
use std::rc::Rc;

#[derive(Debug, PartialEq)]
pub enum Error {
  InvalidSegment(u8),
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
  pub fn new(bus: Bus) -> Self {
    let bus_ref = Rc::new(bus);
    let cpu = Cpu::new(Rc::clone(&bus_ref));
    Self { _bus: bus_ref, cpu }
  }

  pub fn run<T: Input>(&self, input: T) -> Result<(), Error> {
    self.cpu.run(|| input.is_off())
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn stop_when_is_off() {
    let vm = Vm::new(Bus::new());

    let res = vm.run(InputOff {});

    assert!(res.is_ok());
  }

  #[test]
  fn stop_with_rom() {
    let mut bus = Bus::new();
    let rom: Box<dyn Device> = Box::new(Rom::new(0xff));
    let _ = bus.register(rom, 0x00);

    let vm = Vm::new(bus);

    let res = vm.run(InputOn {});

    assert!(res.is_ok());
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
