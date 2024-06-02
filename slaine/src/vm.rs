mod bus;
mod cpu;
mod devices;

pub use bus::*;
use cpu::*;
pub use devices::basic_input::*;
pub use devices::cli_out::*;
pub use devices::rom::*;
use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug, Clone, PartialEq)]
pub enum Error {
  InvalidSegment(Seg),
  NoDevice,
  CannotWriteToDevice,
}

pub trait Device {
  fn read(&self, addr: Addr) -> Word;
  fn write(&mut self, addr: Addr, data: Word) -> Result<(), Error>;
}

pub trait Interrupt {
  fn power_off(&self) -> bool;
}

pub struct Vm {
  _bus: Rc<RefCell<Bus>>,
  cpu: Cpu,
}

impl Vm {
  pub fn new(bus: Bus) -> Self {
    let bus_ref = Rc::new(RefCell::new(bus));
    let cpu = Cpu::new(Rc::clone(&bus_ref));
    Self { _bus: bus_ref, cpu }
  }

  pub fn run<T: Interrupt>(&mut self, input: T) -> Result<(), Error> {
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
    let rom: Box<dyn Device> = Box::new(Rom::new([0xff, 0x00, 0x00, 0x00].to_vec()));
    let _ = bus.register(rom, 0x00);

    let mut vm = Vm::new(bus);

    let res = vm.run(InputOn {});

    assert!(res.is_ok());
  }

  struct InputOff {}
  impl Interrupt for InputOff {
    fn power_off(&self) -> bool {
      true
    }
  }

  struct InputOn {}
  impl Interrupt for InputOn {
    fn power_off(&self) -> bool {
      false
    }
  }
}
