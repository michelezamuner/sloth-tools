pub trait Interrupt {
  fn is_power_off(&self) -> bool;
}
