use std::{
  collections::HashMap,
  sync::mpsc::{Receiver, Sender},
};

use super::Error;

pub type Byte = u8;
pub type Addr = u16;
pub type Word = [Byte; 4];
pub type Seg = usize;
pub type DevId = String;

const MAX_SEGMENTS: Seg = 16;

pub enum Msg {
  Read(DevId, Addr),
  Write(DevId, Addr, Word),
}

pub trait Device {
  fn read(&self, addr: Addr) -> Word;
  fn write(&mut self, addr: Addr, data: Word) -> Result<(), Error>;
}

#[derive(Default)]
pub struct Bus {
  devices: [Option<Box<dyn Device>>; MAX_SEGMENTS],
  bus_tx: Option<Sender<Msg>>,
  dev_rx: Option<Receiver<Word>>,
  devices_channel: HashMap<Seg, String>,
}

impl Bus {
  pub fn new() -> Self {
    Self {
      devices: Default::default(),
      bus_tx: None,
      dev_rx: None,
      devices_channel: HashMap::new(),
    }
  }

  pub fn set_channel(&mut self, bus_tx: Sender<Msg>, dev_rx: Receiver<Word>) {
    self.bus_tx = Some(bus_tx);
    self.dev_rx = Some(dev_rx);
  }

  pub fn register(&mut self, device: Box<dyn Device>, seg: Seg) -> Result<(), Error> {
    if seg > (MAX_SEGMENTS - 1) {
      return Err(Error::InvalidSegment(seg));
    }

    self.devices[seg] = Some(device);

    Ok(())
  }

  pub fn register_channel(&mut self, device_id: &str, seg: Seg) -> Result<(), Error> {
    if seg > (MAX_SEGMENTS - 1) {
      return Err(Error::InvalidSegment(seg));
    }

    self.devices_channel.insert(seg, device_id.to_string());

    Ok(())
  }

  pub fn read(&self, addr: Addr) -> Result<Word, Error> {
    let seg = (addr >> 12) as Seg;
    let off = (addr & 0x0fff) as Addr;

    let dev = self.devices[seg].as_ref();
    if dev.is_none() {
      return Err(Error::MissingDevice);
    }

    Ok(dev.unwrap().read(off))
  }

  pub fn read_channel(&self, addr: Addr) -> Result<Word, Error> {
    let seg = (addr >> 12) as Seg;
    let off = (addr & 0x0fff) as Addr;

    let dev_id = match self.devices_channel.get(&seg) {
      Some(val) => val,
      None => return Err(Error::MissingDevice),
    };

    let msg = Msg::Read(dev_id.clone(), off);

    self.bus_tx.as_ref().unwrap().send(msg).unwrap();

    Ok(self.dev_rx.as_ref().unwrap().recv().unwrap())
  }

  pub fn write(&mut self, addr: Addr, data: Word) -> Result<(), Error> {
    let seg = (addr >> 12) as Seg;
    let off = (addr & 0x0fff) as Addr;

    let dev = self.devices[seg].as_mut();
    if dev.is_none() {
      return Err(Error::MissingDevice);
    }

    dev.unwrap().write(off, data)
  }

  pub fn write_channel(&self, addr: Addr, data: Word) -> Result<(), Error> {
    let seg = (addr >> 12) as Seg;
    let off = (addr & 0x0fff) as Addr;

    let dev_id = match self.devices_channel.get(&seg) {
      Some(val) => val,
      None => return Err(Error::MissingDevice),
    };

    let msg = Msg::Write(dev_id.clone(), off, data);

    self.bus_tx.as_ref().unwrap().send(msg).unwrap();

    Ok(())
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use std::cell::RefCell;
  use std::rc::Rc;
  use std::sync::mpsc::{Receiver, Sender};
  use std::sync::{mpsc, Arc, Mutex};
  use std::thread;

  #[test]
  fn fails_trying_to_register_to_an_invalid_segment() {
    let mut bus = Bus::new();
    let dev = Dev::new();

    let res = bus.register(Box::new(dev), 0xff);

    assert!(matches!(res, Err(Error::InvalidSegment(0xff))));
  }

  #[test]
  fn fails_if_register_to_invalid_segment_channel() {
    let mut bus = Bus::new();

    let res = bus.register_channel("DEV", 0xff);

    assert!(matches!(res, Err(Error::InvalidSegment(0xff))));
  }

  #[test]
  fn fails_if_no_device_is_registered_for_given_address() {
    let mut bus = Bus::new();
    let dev = Dev::new();
    let _ = bus.register(Box::new(dev), 0x00);

    let res_read = bus.read(0x1234);
    assert!(matches!(res_read, Err(Error::MissingDevice)));

    let res_write = bus.write(0x1234, [0x00, 0x00, 0x00, 0x00]);
    assert!(matches!(res_write, Err(Error::MissingDevice)));
  }

  #[test]
  fn fails_if_no_device_is_registered_for_given_address_channel() {
    let mut bus = Bus::new();
    let _ = bus.register_channel("DEV", 0x00);

    let res_read = bus.read_channel(0x1234);
    assert!(matches!(res_read, Err(Error::MissingDevice)));

    let res_write = bus.write_channel(0x1234, [0x00, 0x00, 0x00, 0x00]);
    assert!(matches!(res_write, Err(Error::MissingDevice)));
  }

  #[test]
  fn reads_from_registered_device() {
    let mut bus = Bus::new();
    let dev = Dev::new();
    let _ = bus.register(Box::new(dev), 0x01);

    let res = bus.read(0x1234);

    assert_eq!(res.unwrap(), [0x00, 0x00, 0x00, 0x12]);
  }

  #[test]
  fn read_from_device_channel() {
    let mut bus = Bus::new();
    let (bus_tx, bus_rx): (Sender<Msg>, Receiver<Msg>) = mpsc::channel();
    let (dev_tx, dev_rx): (Sender<Word>, Receiver<Word>) = mpsc::channel();
    bus.set_channel(bus_tx, dev_rx);
    let _ = bus.register_channel("DEV", 0x01);

    thread::spawn(move || loop {
      let res = bus_rx.try_recv();
      if let Ok(msg) = res {
        match msg {
          Msg::Read(dev_id, 0x0234) if &dev_id == "DEV" => {
            dev_tx.send([0x00, 0x00, 0x00, 0x12]).unwrap();
          }
          _ => (),
        }
      }
    });

    let res = bus.read_channel(0x1234);
    assert_eq!(res.unwrap(), [0x00, 0x00, 0x00, 0x12]);
  }

  #[test]
  fn writes_to_registered_device() {
    let written = Rc::new(RefCell::new(Written {
      addr: None,
      data: None,
    }));
    let dev = Dev::new_with_written(Rc::clone(&written));
    let mut bus = Bus::new();
    let _ = bus.register(Box::new(dev), 0x02);

    let res = bus.write(0x2345, [0x98, 0x76, 0x54, 0x32]);

    assert_eq!(res, Ok(()));
    assert_eq!(written.borrow().addr, Some(0x0345));
    assert_eq!(written.borrow().data, Some([0x98, 0x76, 0x54, 0x32]));
  }

  #[test]
  fn write_to_device_channel() {
    let mut bus = Bus::new();
    let (bus_tx, bus_rx): (Sender<Msg>, Receiver<Msg>) = mpsc::channel();
    let (_, dev_rx): (Sender<Word>, Receiver<Word>) = mpsc::channel();
    bus.set_channel(bus_tx, dev_rx);
    let _ = bus.register_channel("DEV", 0x02);
    let written = Arc::new(Mutex::new(false));

    let written_ref = Arc::clone(&written);
    let handle = thread::spawn(move || loop {
      let res = bus_rx.try_recv();
      if let Ok(msg) = res {
        match msg {
          Msg::Write(dev_id, 0x0345, [0x98, 0x76, 0x54, 0x32]) if &dev_id == "DEV" => {
            *written_ref.lock().unwrap() = true;
            break;
          }
          _ => (),
        }
      }
    });

    let res = bus.write_channel(0x2345, [0x98, 0x76, 0x54, 0x32]);
    assert!(res.is_ok());

    handle.join().unwrap();
    assert!(*written.lock().unwrap());
  }

  struct Written {
    addr: Option<Addr>,
    data: Option<Word>,
  }

  struct Dev {
    written: Option<Rc<RefCell<Written>>>,
  }

  impl Dev {
    pub fn new() -> Self {
      Self { written: None }
    }

    pub fn new_with_written(written: Rc<RefCell<Written>>) -> Self {
      Self {
        written: Some(written),
      }
    }
  }

  impl Device for Dev {
    fn read(&self, addr: Addr) -> Word {
      match addr {
        0x0234 => [0x00, 0x00, 0x00, 0x12],
        _ => [0x00, 0x00, 0x00, 0x00],
      }
    }

    fn write(&mut self, addr: Addr, data: Word) -> Result<(), Error> {
      self.written.as_mut().unwrap().borrow_mut().addr = Some(addr);
      self.written.as_mut().unwrap().borrow_mut().data = Some(data);

      Ok(())
    }
  }
}
