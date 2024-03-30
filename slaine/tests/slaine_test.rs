use slaine::client::{Client, Response};
use std::thread;
use std::time::Duration;

#[test]
fn inspect_state_of_non_started_vm() {
  let mut client = Client::new();

  let status_output = client.exec("status");
  assert_eq!(status_output, Some(Response::Msg("off".into())));

  let quit_output = client.exec("quit");
  assert_eq!(quit_output, Some(Response::Quit));
}

#[test]
fn inspect_state_of_running_vm() {
  let mut client = Client::new();

  client.exec("start");

  let output = client.exec("status");
  assert_eq!(output, Some(Response::Msg("on".into())));
}

#[test]
fn inspect_state_of_stopped_vm() {
  let mut client = Client::new();

  client.exec("start");
  client.exec("stop");
  thread::sleep(Duration::from_millis(100));

  let output = client.exec("status");
  assert_eq!(output, Some(Response::Msg("off".into())));
}

#[test]
fn stop_vm_when_quitting() {
  let mut client = Client::new();

  client.exec("start");
  client.exec("quit");
  thread::sleep(Duration::from_millis(100));

  let output = client.exec("status");
  assert_eq!(output, Some(Response::Msg("off".into())));
}

#[test]
fn stop_vm_via_code_in_device() {
  let mut client = Client::new();

  // @todo: for now the "plug" command adds a ROM that just turns of the vm immediately
  client.exec("plug");
  client.exec("start");
  thread::sleep(Duration::from_millis(100));

  let output = client.exec("status");
  assert_eq!(output, Some(Response::Msg("off".into())));
}

#[test]
fn print_error_if_starting_device_is_missing() {
  let mut client = Client::new();

  client.exec("start");
  thread::sleep(Duration::from_millis(100));

  let output = client.exec("status");

  assert_eq!(
    output,
    Some(Response::Msg("off\nError: No starting device found".into()))
  );
}
