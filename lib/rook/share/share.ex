defmodule Rook.Share do
  @moduledoc """
  Auxiliary process which keeps any neccessary state of any RookWeb.ShareChannel process.
  It can be accessed either through Rook.Share.Actions or Rook.Share.Events.
  """

  use GenServer

  defmodule State do
    @type t :: %__MODULE__{
            token: String.t(),
            channel_pid: pid(),
            requests: [String.t()]
          }

    defstruct [:token, :channel_pid, requests: []]
  end

  ## Client

  def get(token) do
    case Registry.lookup(Registry.Share, token) do
      [{pid, _}] -> pid
      _ -> nil
    end
  end

  def exists?(token) do
    get(token) != nil
  end

  ## Server

  def init([token, channel_pid]) do
    Process.flag(:trap_exit, true)
    Process.link(channel_pid)
    {:ok, %State{token: token, channel_pid: channel_pid}}
  end

  def handle_cast({:new_request, request_token, info}, state) do
    # TODO: Check whether request exists.
    %State{token: token, requests: requests} = state
    notify(token, "new_request", Map.put(info, :token, request_token))
    {:noreply, %{state | requests: [request_token | requests]}}
  end

  def handle_cast({:accept_request, request_token, description}, state) do
    Rook.Request.Events.request_accepted(request_token, description)
    {:noreply, state}
  end

  def handle_cast({:share_accepted, request_token, description}, state) do
    message = Map.put(description, :token, request_token)
    notify(state.token, "share_accepted", message)
    {:noreply, state}
  end

  def handle_cast({:ice_candidate, request_token, candidate}, state) do
    Rook.Request.Events.share_ice_candidate(request_token, candidate)
    {:noreply, state}
  end

  def handle_cast({:request_ice_candidate, request_token, candidate}, state) do
    notify(state.token, "request_ice_candidate", %{token: request_token, candidate: candidate})
    {:noreply, state}
  end

  def handle_cast({:request_cancelled, request_token}, state) do
    %State{token: token, requests: requests} = state
    notify(token, "request_cancelled", %{token: request_token})
    {:noreply, %{state | requests: List.delete(requests, request_token)}}
  end

  def handle_info({:EXIT, pid, reason}, state) do
    if state.channel_pid == pid do
      Rook.Share.Actions.close(state.requests)
    end

    {:stop, reason, state}
  end

  ## Helpers

  defp notify(token, event, params),
    do: RookWeb.Endpoint.broadcast!("share:" <> token, event, params)
end
