defmodule Rook.Request.Events do
  @moduledoc """
  Defines any outside events which can happen during a request's lifetime.
  Usually called by Share modules.
  """

  def request_acknowledged(token) do
    cast(token, {:request_acknowledged})
  end

  def request_accepted(token, description) do
    cast(token, {:request_accepted, description})
  end

  def share_ice_candidate(token, candidate) do
    cast(token, {:share_ice_candidate, candidate})
  end

  def share_cancelled(request_token) do
    cast(request_token, {:share_cancelled})
  end

  defp via(name), do: {:via, Registry, {Registry.Request, name}}
  defp cast(token, params), do: GenServer.cast(via(token), params)
end
