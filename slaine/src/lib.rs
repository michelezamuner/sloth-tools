pub enum Status { ON, OFF }

pub struct Vm { status: Status }

impl Vm {
    pub fn new() -> Vm {
        Vm {
            status: Status::OFF,
        }
    }

    pub fn status(self: &Self) -> &Status {
        &self.status
    }

    pub fn start(self: &mut Self) {
        self.status = Status::ON
    }

    pub fn stop(self: &mut Self) {
        self.status = Status::OFF;
    }
}
