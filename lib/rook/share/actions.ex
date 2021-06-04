defmodule Rook.Share.Actions do
  @moduledoc """
  Defines any actions a share is able to perform.
  Should only be called from other Share modules.
  """

  def start(token) do
    GenServer.start(Rook.Share, [token, self()], name: via(token))
  end

  def accept_request(token, request_token, description) do
    cast(token, {:accept_request, request_token, description})
  end

  def ice_candidate(token, request_token, candidate) do
    cast(token, {:ice_candidate, request_token, candidate})
  end

  def close(requests) do
    Enum.each(requests, &Rook.Request.Events.share_cancelled/1)
  end

  defp via(name), do: {:via, Registry, {Registry.Share, name}}
  defp cast(token, params), do: GenServer.cast(via(token), params)
end
