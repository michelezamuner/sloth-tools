pub struct Client {
  vm: Vm,
}

impl Client {
  pub fn new() -> Self {
    Self {
      vm: Vm::new(),
    }
  }
  pub fn run(self: &mut Self, cmd: &str) -> &str {
    match cmd {
      "status" => self.vm.status().into(),
      "start" => {
        self.vm.start();
        ""
      },
      "stop" => {
        self.vm.stop();
        ""
      },
      _ => ""
    }
  }
}

impl From<&Status> for &str {
  fn from(value: &Status) -> Self {
    match value {
      Status::OFF => "off",
      Status::ON => "on",
    }
  }
}

struct Vm {
  status: Status,
}

impl Vm {
  fn new() -> Self {
    Self {
      status: Status::OFF,
    }
  }

  fn status(self: &Self) -> &Status {
    &self.status
  }

  fn start(self: &mut Self) {
    self.status = Status::ON
  }

  fn stop(self: &mut Self) {
    self.status = Status::OFF;
  }
}

enum Status { ON, OFF }
