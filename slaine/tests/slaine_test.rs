#[test]
fn hypervisor_inspects_state_of_vm_when_it_is_off() {
  let mut client = slaine::Client::new();

  assert_eq!(client.run("status"), "off");
}

#[test]
fn hypervisor_inspects_state_of_vm_when_it_is_on() {
  let mut client = slaine::Client::new();
  client.run("start");

  assert_eq!(client.run("status"), "on");
}

#[test]
fn hypervisor_turns_off_vm() {
  let mut client = slaine::Client::new();
  client.run("start");
  client.run("stop");

  assert_eq!(client.run("status"), "off");
}
