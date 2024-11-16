defmodule SabiaTest do
  use ExUnit.Case

  test "run vm" do
    vm = Sabia.run()
    state = Sabia.state(vm)

    assert state == :running
  end
end
