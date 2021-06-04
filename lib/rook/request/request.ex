defmodule Rook.Request do
  @moduledoc """
  Auxiliary process which keeps any neccessary state of any RookWeb.RequestChannel process.
  It can be accessed either through Rook.Request.Actions or Rook.Request.Events.
  """

  use GenServer

  defmodule State do
    @type t :: %__MODULE__{
            token: String.t(),
            share_token: String.t(),
            channel_pid: pid()
          }

    defstruct [:token, :share_token, :channel_pid]
  end

  ## Client

  def get(token) do
    case Registry.lookup(Registry.Request, token) do
      [{pid, _}] -> pid
      _ -> nil
    end
  end

  def exists?(token) do
    get(token) != nil
  end

  ## Server

  def init([token, share_token, channel_pid]) do
    Process.flag(:trap_exit, true)
    Process.link(channel_pid)
    Rook.Share.Events.new_request(share_token, token)
    {:ok, %State{token: token, share_token: share_token, channel_pid: channel_pid}}
  end

  def handle_cast({:request_acknowledged}, state) do
    notify(state.token, "request_acknowledged", %{})
    {:noreply, state}
  end

  def handle_cast({:request_accepted, description}, state) do
    notify(state.token, "request_accepted", description)
    {:noreply, state}
  end

  def handle_cast({:accept_share, description}, state) do
    Rook.Share.Events.share_accepted(state.share_token, state.token, description)
    {:noreply, state}
  end

  def handle_cast({:ice_candidate, candidate}, state) do
    Rook.Share.Events.request_ice_candidate(state.share_token, state.token, candidate)
    {:noreply, state}
  end

  def handle_cast({:share_ice_candidate, candidate}, state) do
    notify(state.token, "ice_candidate", %{candidate: candidate})
    {:noreply, state}
  end

  def handle_cast({:share_cancelled}, state) do
    notify(state.token, "share_cancelled", %{})
    {:stop, :shutdown, state}
  end

  def handle_info({:EXIT, pid, reason}, state) do
    if state.channel_pid == pid do
      Rook.Request.Actions.close(state.token, state.share_token)
    end

    {:stop, reason, state}
  end

  ## Helpers

  defp notify(token, event, params),
    do: RookWeb.Endpoint.broadcast!("request:" <> token, event, params)
end
