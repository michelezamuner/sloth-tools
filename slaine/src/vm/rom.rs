use super::Device;
use crate::vm::{Addr, Data};

pub struct Rom {
  code: Data,
}

impl Rom {
  pub fn new(code: Data) -> Self {
    Self { code }
  }
}

impl Device for Rom {
  fn read(&self, _addr: Addr) -> Data {
    self.code
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn read_rom_code() {
    let rom = Rom::new([0x00, 0x00, 0x00, 0x12]);

    let code = rom.read(0x00);

    assert_eq!(code, [0x00, 0x00, 0x00, 0x12]);
  }
}
