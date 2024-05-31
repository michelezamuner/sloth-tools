use crate::vm::{Addr, Byte, Data, Device, Error};

pub struct Rom {
  code: Vec<Byte>,
}

impl Rom {
  pub fn new(code: Vec<Byte>) -> Self {
    Self { code }
  }
}

impl Device for Rom {
  fn read(&self, addr: Addr) -> Data {
    [
      self.code[addr as usize],
      self.code[addr as usize + 1],
      self.code[addr as usize + 2],
      self.code[addr as usize + 3],
    ]
  }

  fn write(&mut self, _: Addr, _: Data) -> Result<(), Error> {
    // @todo: update adding the type of device
    // @todo: update the bus adding the segment of the device
    Err(Error::CannotWriteToDevice)
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn read_rom_code() {
    let rom = Rom::new(vec![0x00, 0x00, 0x00, 0x12]);

    let code = rom.read(0x00);

    assert_eq!(code, [0x00, 0x00, 0x00, 0x12]);
  }

  #[test]
  fn cannot_write() {
    let mut rom = Rom::new(vec![0x00, 0x00, 0x00, 0x00]);

    let result = rom.write(0x00, [0x00, 0x00, 0x00, 0x00]);

    assert!(matches!(result, Err(Error::CannotWriteToDevice)));
  }
}
