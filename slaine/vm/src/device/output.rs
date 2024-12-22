use crate::bus::{Addr, Device, Word};
use crate::Error;

pub struct Output<F>
where
  F: FnMut(Word) -> Result<(), Error>,
{
  print: F,
}

impl<F> Output<F>
where
  F: FnMut(Word) -> Result<(), Error>,
{
  pub fn new(print: F) -> Self {
    Self { print }
  }
}

impl<F> Device for Output<F>
where
  F: FnMut(Word) -> Result<(), Error>,
{
  fn read(&self, _addr: Addr) -> Word {
    // @todo: this should return information useful to identify the device
    [0, 0, 0, 0]
  }

  // @todo: do we need it to be mutable?
  fn write(&mut self, _addr: Addr, data: Word) -> Result<(), Error> {
    // @todo: handle errors
    (self.print)(data)
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn print_formatted_data_to_the_cli() {
    let mut received: Option<Word> = None;
    let mut output = Output::new(|data| {
      received = Some(data);

      Ok(())
    });

    let result = output.write(0u16, [0x12, 0x34, 0x56, 0x78]);

    assert!(result.is_ok());
    assert_eq!(received, Some([0x12, 0x34, 0x56, 0x78]));
  }

  #[test]
  fn provide_device_information() {
    let output = Output::new(|_| Ok(()));

    // @todo: update this
    let data = output.read(0u16);

    assert_eq!(data, [0, 0, 0, 0]);
  }
}
