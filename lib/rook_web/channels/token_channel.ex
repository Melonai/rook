defmodule RookWeb.TokenChannel do
  use Phoenix.Channel

  def join("token", _params, socket) do
    {:ok, socket}
  end

  def handle_in("get_token", _attrs, socket) do
    {:reply, {:ok, %{token: socket.assigns[:token]}}, socket}
  end
end
