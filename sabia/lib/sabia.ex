defmodule Sabia do
  @moduledoc """
  Sabia virtual machines system.
  """

  alias Sabia.Vm

  def run do
    vm = spawn(Vm, :listen, [])

    vm
  end

  def state(vm) do
    send vm, {self(), :state}

    state = receive do
      {:ok, val} -> val
    end

    state
  end
end
