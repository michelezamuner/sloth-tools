use slaine::client::{Client, Cmd, Output};
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
      Some(Output::Msg(msg)) => println!("{}", msg),
      Some(Output::Cmd(Cmd::QUIT)) => break,
      _ => {}
    }
  }
}
