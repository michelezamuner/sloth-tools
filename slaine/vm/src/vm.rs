use crate::{Bus, Cpu, Device, Error, Interrupt, Seg};
use std::cell::RefCell;
use std::rc::Rc;

pub struct Vm {
  bus: Rc<RefCell<Bus>>,
  cpu: Cpu,
}

impl Vm {
  pub fn new() -> Self {
    let bus = Rc::new(RefCell::new(Bus::new()));
    let cpu = Cpu::new(Rc::clone(&bus));

    Self { bus, cpu }
  }

  pub fn run<I: Interrupt>(&mut self, interrupt: &I) -> Result<(), Error> {
    self.cpu.run(|| interrupt.is_power_off())
  }

  pub fn plug(&mut self, dev: Box<dyn Device>, seg: Seg) -> Result<(), Error> {
    self.bus.borrow_mut().register(dev, seg)
  }
}

impl Default for Vm {
  fn default() -> Self {
    Self::new()
  }
}
