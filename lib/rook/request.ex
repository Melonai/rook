defmodule Rook.Request do
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

  def init([token, share_token, channel_pid]) do
    Process.flag(:trap_exit, true)
    Process.link(channel_pid)
    Rook.Share.new_request(share_token, token)
    {:ok, %State{token: token, share_token: share_token, channel_pid: channel_pid}}
  end

  def start(token, share_token) do
    GenServer.start(__MODULE__, [token, share_token, self()], name: via(token))
  end

  def acknowledge_request(token) do
    cast(token, {:request_acknowledged})
  end

  def close(request_token, share_token) do
    Rook.Share.request_cancelled(share_token, request_token)
  end

  def close(request_token) do
    cast(request_token, {:share_cancelled})
  end

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

  def handle_cast({:request_acknowledged}, state) do
    notify(state.token, "request_acknowledged", %{})
    {:noreply, state}
  end

  def handle_cast({:share_cancelled}, state) do
    notify(state.token, "share_cancelled", %{})
    {:stop, :shutdown, state}
  end

  def handle_info({:EXIT, pid, reason}, state) do
    if state.channel_pid == pid do
      Rook.Request.close(state.token, state.share_token)
    end

    {:stop, reason, state}
  end

  ## Helpers

  defp via(name), do: {:via, Registry, {Registry.Request, name}}
  defp cast(token, params), do: GenServer.cast(via(token), params)

  defp notify(token, event, params),
    do: RookWeb.Endpoint.broadcast!("request:" <> token, event, params)
end
