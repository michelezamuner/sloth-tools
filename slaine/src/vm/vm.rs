pub trait Input {
  fn is_off(&self) -> bool;
}

pub struct Vm {
  rom: Option<Rom>,
}

impl Vm {
  pub fn new() -> Self {
    Self { rom: None }
  }

  pub fn plug(&mut self, rom: Rom) {
    self.rom = Some(rom);
  }

  pub fn run<I: Input>(&self, input: I) {
    while !input.is_off() {
      if self.rom.as_ref().is_some_and(|r| r.read() == 0xff) {
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

  pub fn read(&self) -> u8 {
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
    let mut vm = Vm::new();
    vm.plug(Rom::new());

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
