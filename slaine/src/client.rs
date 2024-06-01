use crate::hv::{Hv, Status};
use crate::vm::Seg;
use std::i64;

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
        if cmd.starts_with("plug") {
          let parts: Vec<&str> = cmd.split(' ').collect();
          let device = parts[1];
          let seg = parts[2].parse::<Seg>().unwrap();
          let code: Vec<u8> = if parts.len() > 3 {
            parts[3]
              .split(',')
              .map(|c| i64::from_str_radix(c.strip_prefix("0x").unwrap(), 16).unwrap() as u8)
              .collect()
          } else {
            vec![]
          };

          match device {
            "rom" => {
              self.hv.plug_rom(seg, code);
              None
            }
            "cli" => {
              self.hv.plug_cli(seg);
              None
            }
            _ => Some(Response::Msg("invalid plug".into())),
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
