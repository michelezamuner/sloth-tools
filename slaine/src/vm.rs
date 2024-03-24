mod bus;

use crate::vm::bus::Bus;

pub trait Device {
  fn read(&self) -> u8;
}

pub trait Input {
  fn is_off(&self) -> bool;
}

pub struct Vm {
  bus: Bus,
}

impl Vm {
  pub fn new() -> Self {
    Self { bus: Bus::new() }
  }

  pub fn with_rom(rom: Rom) -> Self {
    let mut bus = Bus::new();
    let b: Box<dyn Device> = Box::new(rom);
    bus.register(b);

    Self { bus }
  }

  pub fn run<T: Input>(&self, input: T) {
    while !input.is_off() {
      // @todo: fail if rom is missing
      if self.bus.read() == 0xff {
        break;
      }
    }
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
  fn read(&self) -> u8 {
    0xff
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn stop_when_is_off() {
    let vm = Vm::new();
    let output = vm.run(InputOff {});

    assert_eq!(output, ());
  }

  #[test]
  fn stop_with_rom() {
    let vm = Vm::with_rom(Rom::new());

    let output = vm.run(InputOn {});

    assert_eq!(output, ());
  }

  #[test]
  fn rom_just_has_exit_instruction() {
    let rom = Rom::new();
    let instruction = rom.read();
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
