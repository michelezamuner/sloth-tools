#[test]
fn hypervisor_inspects_state_of_vm_when_it_is_off() {
    let vm = slaine::Vm::new();
    assert!(matches!(vm.status(), slaine::Status::OFF));
}

#[test]
fn hypervisor_inspects_state_of_vm_when_it_is_on() {
    let mut vm = slaine::Vm::new();
    vm.start();
    assert!(matches!(vm.status(), slaine::Status::ON));
}

#[test]
fn hypervisor_turns_off_vm() {
    let mut vm = slaine::Vm::new();
    vm.start();
    vm.stop();
    assert!(matches!(vm.status(), slaine::Status::OFF));
}
