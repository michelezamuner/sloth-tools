mod bus;
mod cpu;
mod rom;

pub use bus::*;
use cpu::*;
pub use rom::*;
use std::rc::Rc;

#[derive(Debug, PartialEq)]
pub enum Error {
  InvalidSegment(Seg),
  NoDevice,
}

pub trait Device {
  fn read(&self, addr: Addr) -> Data;
}

pub trait Input {
  fn power_off(&self) -> bool;
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

  pub fn run<T: Input>(&mut self, input: T) -> Result<(), Error> {
    self.cpu.run(|| input.power_off())
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn stop_when_power_off() {
    let mut vm = Vm::new(Bus::new());

    let res = vm.run(InputOff {});

    assert!(res.is_ok());
  }

  #[test]
  fn stop_with_halt_code() {
    let mut bus = Bus::new();
    let rom: Box<dyn Device> = Box::new(Rom::new([0xff, 0x00, 0x00, 0x00]));
    let _ = bus.register(rom, 0x00);

    let mut vm = Vm::new(bus);

    let res = vm.run(InputOn {});

    assert!(res.is_ok());
  }

  struct InputOff {}
  impl Input for InputOff {
    fn power_off(&self) -> bool {
      true
    }
  }

  struct InputOn {}
  impl Input for InputOn {
    fn power_off(&self) -> bool {
      false
    }
  }
}
