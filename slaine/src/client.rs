use crate::hv::{Hv, Status};

pub struct Client {
  hv: Hv,
}

impl Client {
  pub fn new() -> Self {
    Client { hv: Hv::new() }
  }

  pub fn exec(&mut self, cmd: &str) -> Option<Output> {
    match cmd {
      "status" => Some(Output::Msg(self.hv.status().into())),
      "start" => {
        self.hv.start();
        None
      }
      "stop" => {
        self.hv.stop();
        None
      }
      "plug" => {
        self.hv.plug();
        None
      }
      "quit" => {
        self.hv.stop();
        Some(Output::Cmd(Cmd::QUIT))
      }
      _ => Some(Output::Msg("invalid command".into())),
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
      Status::Off => "off",
      Status::On => "on",
    }
    .into()
  }
}

#[derive(Debug, PartialEq)]
pub enum Output {
  Cmd(Cmd),
  Msg(String),
}

#[derive(Debug, PartialEq)]
pub enum Cmd {
  QUIT,
}
