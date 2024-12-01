defmodule Sabia.Vm do
  @moduledoc """
  Local virtual machine implementation
  """

  use Agent

  def create do
    System.unique_integer()
  end

  def start(vm) do
    Agent.start_link(
      fn -> %{start: :os.system_time(:millisecond), state: :running} end,
      name: {:global, vm}
    )
  end

  def halt(vm) do
    Agent.update({:global, vm}, fn data -> %{data | state: :halted} end)
  end

  def state(vm) do
    Agent.get(
      {:global, vm},
      fn
        %{state: :halted} -> :halted
        # @todo: fake implementation, we need a process that actually terminates
        data -> if :os.system_time(:millisecond) - Map.get(data, :start) > 1000 do
          :halted
        else
          :running
        end
      end
    )
  end
end
