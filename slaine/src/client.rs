use crate::hv::{Hv, Status};
use crate::vm::{Byte, Seg};
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
      "logs" => Some(Response::Msg(self.hv.logs().join("\n"))),
      "quit" => {
        self.hv.stop();
        Some(Response::Quit)
      }
      _ => {
        if let Some(plug) = cmd.strip_prefix("plug ") {
          if let Some(conf) = plug.strip_prefix("rom ") {
            let config: Config = serde_json::from_str(conf).unwrap();
            self.hv.plug_rom(config.seg, config.code);
            None
          } else if let Some(conf) = plug.strip_prefix("cli ") {
            let config: Config = serde_json::from_str(conf).unwrap();
            self.hv.plug_cli(config.seg);
            None
          } else {
            Some(Response::Msg("invalid plug".into()))
          }
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
