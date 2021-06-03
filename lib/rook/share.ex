defmodule Rook.Share do
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

  def init([token, channel_pid]) do
    Process.flag(:trap_exit, true)
    Process.link(channel_pid)
    {:ok, %State{token: token, channel_pid: channel_pid}}
  end

  def start(token) do
    GenServer.start(__MODULE__, [token, self()], name: via(token))
  end

  def new_request(share_token, request_token) do
    cast(share_token, {:new_request, request_token})
  end

  def request_cancelled(share_token, request_token) do
    cast(share_token, {:request_cancelled, request_token})
  end

  def close(requests) do
    Enum.each(requests, &Rook.Request.close/1)
  end

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

  def handle_cast({:new_request, request_token}, state) do
    # TODO: Check whether request exists.
    %State{token: token, requests: requests} = state
    notify(token, "new_request", %{token: request_token})
    {:noreply, %{state | requests: [request_token | requests]}}
  end

  def handle_cast({:request_cancelled, request_token}, state) do
    %State{token: token, requests: requests} = state
    notify(token, "request_cancelled", %{request: request_token})
    {:noreply, %{state | requests: List.delete(requests, request_token)}}
  end

  def handle_info({:EXIT, pid, reason}, state) do
    if state.channel_pid == pid do
      Rook.Share.close(state.requests)
    end

    {:stop, reason, state}
  end

  ## Helpers

  defp via(name), do: {:via, Registry, {Registry.Share, name}}
  defp cast(token, params), do: GenServer.cast(via(token), params)

  defp notify(token, event, params),
    do: RookWeb.Endpoint.broadcast!("share:" <> token, event, params)
end
