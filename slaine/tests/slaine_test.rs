use slaine::client::{Client, Response};
use std::thread;
use std::time::Duration;

#[test]
fn inspect_status_of_non_started_vm() {
  let mut client = Client::new();

  let status_response = client.exec("status");
  assert_eq!(status_response, Some(Response::Msg("off".into())));

  let quit_response = client.exec("quit");
  assert_eq!(quit_response, Some(Response::Quit));
}

#[test]
fn inspect_status_of_running_vm() {
  let mut client = Client::new();

  let plug_response = client.exec("plug rom 0 0x30,0x00,0x00,0x00");
  assert_eq!(plug_response, None);

  let start_response = client.exec("start");
  assert_eq!(start_response, None);
  thread::sleep(Duration::from_millis(100));

  let status_response_first = client.exec("status");
  assert_eq!(status_response_first, Some(Response::Msg("on".into())));

  thread::sleep(Duration::from_millis(100));

  let status_response_second = client.exec("status");
  assert_eq!(status_response_second, Some(Response::Msg("on".into())));

  client.exec("quit");
}

#[test]
fn inspect_status_of_stopped_vm() {
  let mut client = Client::new();

  client.exec("plug rom 0 0x30,0x00,0x00,0x00");

  client.exec("start");
  thread::sleep(Duration::from_millis(100));

  client.exec("stop");
  thread::sleep(Duration::from_millis(100));

  let status_response = client.exec("status");
  assert_eq!(status_response, Some(Response::Msg("off".into())));
}

#[test]
fn stop_vm_when_quitting() {
  let mut client = Client::new();

  client.exec("plug rom 0 0x30,0x00,0x00,0x00");

  client.exec("start");
  thread::sleep(Duration::from_millis(100));

  client.exec("quit");
  thread::sleep(Duration::from_millis(100));

  let status_response = client.exec("status");
  assert_eq!(status_response, Some(Response::Msg("off".into())));
}

#[test]
fn stop_vm_via_halt_instruction() {
  let mut client = Client::new();

  client.exec("plug rom 0 0xff,0x00,0x00,0x00");

  client.exec("start");
  thread::sleep(Duration::from_millis(100));

  let status_response = client.exec("status");
  assert_eq!(status_response, Some(Response::Msg("off".into())));
}

#[test]
fn log_error_if_starting_device_is_missing() {
  let mut client = Client::new();

  client.exec("start");
  thread::sleep(Duration::from_millis(100));

  let status_response = client.exec("status");
  assert_eq!(status_response, Some(Response::Msg("off".into())));

  let logs_response = client.exec("logs");
  assert_eq!(
    logs_response,
    Some(Response::Msg("Error: No starting device found".into()))
  );
}

#[test]
fn log_error_if_starting_device_is_plugged_to_an_invalid_segment() {
  let mut client = Client::new();

  client.exec("plug rom 16 0x00,0x00,0x00,0x00");

  client.exec("start");
  thread::sleep(Duration::from_millis(100));

  let status_response = client.exec("status");
  assert_eq!(status_response, Some(Response::Msg("off".to_string())));

  let logs_response = client.exec("logs");
  assert_eq!(
    logs_response,
    Some(Response::Msg(
      "Error: Cannot register device on invalid segment 16".to_string()
    ))
  );
}

#[test]
fn print_data_to_cli_device() {
  let mut client = Client::new();

  client.exec("plug rom 0 0x01,0x00,0x12,0x34,0x07,0x00,0x10,0x00,0x30,0x00,0x00,0x08");
  client.exec("plug cli 1");
  client.exec("start");
  thread::sleep(Duration::from_millis(100));

  let logs_response = client.exec("logs");
  assert_eq!(logs_response, Some(Response::Msg("4660".to_string())));
}
