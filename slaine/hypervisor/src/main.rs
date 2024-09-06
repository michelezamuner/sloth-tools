use hypervisor::client::{Client, Response};
use std::io::Write;

fn main() {
  let mut client = Client::new();
  loop {
    print!("> ");
    std::io::stdout().flush().unwrap();
    let mut cmd = String::new();
    std::io::stdin().read_line(&mut cmd).expect("error");

    let output = client.exec(cmd.trim());

    match output {
      Some(Response::Msg(msg)) => println!("{}", msg),
      Some(Response::Quit) => break,
      _ => {}
    }
  }
}
