defmodule SabiaTest do
  use ExUnit.Case

  test "run vm" do
    vm = Sabia.run()

    assert :running == Sabia.state(vm)

    Sabia.halt(vm)

    assert :halted == Sabia.state(vm)
  end

  test "run multiple vms" do
    vm1 = Sabia.run()
    vm2 = Sabia.run()

    assert :running == Sabia.state(vm1)
    assert :running == Sabia.state(vm2)

    Sabia.halt(vm1)
    Sabia.halt(vm2)
  end

  test "vm terminates on its own" do
    vm = Sabia.run()

    Process.sleep(2000)

    assert :halted == Sabia.state(vm)
  end
end
