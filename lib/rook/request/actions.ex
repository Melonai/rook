defmodule Rook.Request.Actions do
  @moduledoc """
  Defines any actions a request is able to perform.
  Should only be called from other Request modules.
  """

  def start(token, share_token, info) do
    GenServer.start(Rook.Request, [token, share_token, info, self()], name: via(token))
  end

  def accept_share(token, description) do
    cast(token, {:accept_share, description})
  end

  def ice_candidate(token, candidate) do
    cast(token, {:ice_candidate, candidate})
  end

  def close(request_token, share_token) do
    Rook.Share.Events.request_cancelled(share_token, request_token)
  end

  defp via(name), do: {:via, Registry, {Registry.Request, name}}
  defp cast(token, params), do: GenServer.cast(via(token), params)
end
