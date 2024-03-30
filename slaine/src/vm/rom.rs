use super::Device;

pub struct Rom {
  code: u8,
}

impl Rom {
  pub fn new(code: u8) -> Self {
    Self { code }
  }
}

impl Device for Rom {
  fn read(&self, _addr: u16) -> u8 {
    self.code
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn read_rom_code() {
    let rom = Rom::new(0x12);

    let code = rom.read(0x00);

    assert_eq!(code, 0x12);
  }
}
