defmodule Sabia.Vm do
  @moduledoc """
  Local virtual machine implementation
  """

  def listen do
    receive do
      {caller, :state} -> send caller, {:ok, :running}
    end

    listen()
  end
end
