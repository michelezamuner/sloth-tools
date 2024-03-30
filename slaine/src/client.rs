use crate::hv::{Hv, Status};
use crate::vm::Error;

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
      "plug" => {
        self.hv.plug();
        None
      }
      "quit" => {
        self.hv.stop();
        Some(Response::Quit)
      }
      _ => Some(Response::Msg("invalid command".into())),
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
      Status::Off(None) => "off".to_string(),
      Status::Off(Some(e)) => format!("off\nError: {}", String::from(e)),
      Status::On => "on".to_string(),
    }
  }
}

impl From<Error> for String {
  fn from(value: Error) -> Self {
    match value {
      Error::NoDevice => "No starting device found",
      _ => "",
    }
    .into()
  }
}

#[derive(Debug, PartialEq)]
pub enum Response {
  Msg(String),
  Quit,
}
