defmodule Sabia do
  @moduledoc """
  Sabia virtual machines system.
  """

  alias Sabia.Vm

  def run do
    vm = Vm.create()

    Vm.start(vm)

    vm
  end

  def halt(vm) do
    Vm.halt(vm)
  end

  def state(vm) do
    Vm.state(vm)
  end
end
