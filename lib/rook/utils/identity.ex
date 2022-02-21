defmodule Rook.Identity do
  def get_ip_from_connect_info(%{peer_data: %{address: ip}, x_headers: x_headers}) do
    real_ip = Enum.find(x_headers, fn {key, _value} -> key == 'x-real-ip' end)

    case real_ip do
      nil ->
        ip_to_string(ip)

      {_key, ip} ->
        ip
    end
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

      browser =
        if browser_family != :unknown do
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
