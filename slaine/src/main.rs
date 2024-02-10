use slaine::Client;

fn main() {
  let mut client = Client::new();

  loop {
    let mut cmd = String::new();
    std::io::stdin().read_line(&mut cmd).expect("error");

    let result = client.run(cmd.trim());

    println!("{}", result);
  }
}
