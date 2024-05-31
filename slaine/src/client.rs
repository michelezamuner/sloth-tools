use crate::hv::{Hv, Status};
use crate::vm::{Byte, Error, Seg};
use serde::Deserialize;

pub struct Client {
  hv: Hv,
}

impl Client {
  pub fn new() -> Self {
    Client { hv: Hv::new() }
  }

  pub fn exec(&mut self, cmd: &str) -> Option<Response> {
    match cmd {
      "status" => Some(Response::Msg(self.hv.status().into())),
      "start" => {
        self.hv.start();
        None
      }
      "stop" => {
        self.hv.stop();
        None
      }
      "logs" => Some(Response::Msg(
        self
          .hv
          .logs()
          .into_iter()
          .map(|e| format!("Error: {}", String::from(e)))
          .collect::<Vec<String>>()
          .join("\n"),
      )),
      "quit" => {
        self.hv.stop();
        Some(Response::Quit)
      }
      _ => {
        if let Some(conf) = cmd.strip_prefix("plug rom ") {
          let config: Config = serde_json::from_str(conf).unwrap();
          self.hv.plug_rom(config.seg, config.code);
          None
        } else {
          Some(Response::Msg("invalid command".into()))
        }
      }
    }
  }
}

impl Default for Client {
  fn default() -> Self {
    Self::new()
  }
}

impl From<Status> for String {
  fn from(value: Status) -> Self {
    match value {
      Status::Off => "off".to_string(),
      Status::On => "on".to_string(),
    }
  }
}

impl From<Error> for String {
  fn from(value: Error) -> Self {
    match value {
      Error::NoDevice => "No starting device found".to_string(),
      Error::InvalidSegment(seg) => format!("Cannot register device on invalid segment {}", seg),
      Error::CannotWriteToDevice => "Cannot write to device".to_string(),
    }
  }
}

#[derive(Debug, PartialEq)]
pub enum Response {
  Msg(String),
  Quit,
}

#[derive(Deserialize)]
struct Config {
  seg: Seg,
  code: Vec<Byte>,
}
