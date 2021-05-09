defmodule Rook.ShareMonitor do
  use GenServer

  def track(pid, token) do
    GenServer.call(__MODULE__, {:track, pid, token})
  end

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    Process.flag(:trap_exit, true)
    {:ok, {%{}, %{}}}
  end

  def handle_call({:track, pid, token}, _from, {pids, channels}) do
    Process.link(pid)

    {:reply, :ok, {Map.put(pids, pid, token), Map.put(channels, token, {pid, []})}}
  end

  def handle_info({:EXIT, pid, _reason}, {pids, channels}) do
    case Map.fetch(pids, pid) do
      :error ->
        {:noreply, {pids, channels}}

      {:ok, token} ->
        {_, requests} = Map.fetch!(channels, token)
        RookWeb.ShareChannel.handle_close(requests)
        {:noreply, {Map.delete(pids, pid), Map.delete(channels, token)}}
    end
  end
end
