defmodule Rook.Identity do
  def get_ip_from_connect_info(%{peer_data: %{address: ip}, x_headers: _x_headers}) do
    ip_to_string(ip)
  end

  def get_location_from_ip(_ip) do
    # TODO: Try to get location from IP
    "Unknown Location"
  end

  def get_client_from_user_agent(user_agent) do
    # TODO: Parse user agent to get client
    "Unknown Client"
  end

  defp ip_to_string(ip) do
    ip |> :inet.ntoa() |> to_string()
  end
end
