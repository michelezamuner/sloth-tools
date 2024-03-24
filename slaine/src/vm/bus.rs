use super::Device;

#[derive(Default)]
pub struct Bus {
  devices: Vec<Box<dyn Device>>,
}

impl Bus {
  pub fn new() -> Self {
    Self { devices: vec![] }
  }
  pub fn register(&mut self, device: Box<dyn Device>) {
    self.devices.push(device)
  }

  pub fn read(&self) -> u8 {
    // @todo: handle missing device
    self.devices[0].read()
  }
}
