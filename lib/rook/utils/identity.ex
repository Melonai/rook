defmodule Rook.Identity do
  def get_ip_from_connect_info(%{peer_data: %{address: ip}, x_headers: _x_headers}) do
    ip_to_string(ip)
  end

  def get_location_from_ip(_ip) do
    # TODO: Try to get location from IP
    "Unknown Location"
  end

  def get_client_from_user_agent(user_agent) do
    ua = UAInspector.parse_client(user_agent)

    if ua.client != nil do
      browser_family = ua.client.name
      browser_version = ua.client.version

      browser = if browser_family != :unknown do
        if browser_version != :unknown do
          browser_family <> " " <> browser_version
        else
          browser_family
        end
      else
        "Unknown Browser"
      end

      if ua.os_family != :unknown do
        browser <> " on " <> ua.os_family
      else
        browser
      end
    else
      "Unknown Client"
    end
  end

  defp ip_to_string(ip) do
    ip |> :inet.ntoa() |> to_string()
  end
end
