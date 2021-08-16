defmodule Rook.Share.Events do
  @moduledoc """
  Defines any outside events which can happen during a share's lifetime.
  Usually called by Request modules.
  """

  def new_request(share_token, request_token, info) do
    cast(share_token, {:new_request, request_token, info})
  end

  def share_accepted(share_token, request_token, description) do
    cast(share_token, {:share_accepted, request_token, description})
  end

  def request_ice_candidate(token, request_token, candidate) do
    cast(token, {:request_ice_candidate, request_token, candidate})
  end

  def request_cancelled(share_token, request_token) do
    cast(share_token, {:request_cancelled, request_token})
  end

  defp via(name), do: {:via, Registry, {Registry.Share, name}}
  defp cast(token, params), do: GenServer.cast(via(token), params)
end
