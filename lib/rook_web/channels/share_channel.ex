defmodule RookWeb.ShareChannel do
  use Phoenix.Channel

  def join("share:" <> token, _params, socket) do
    if token == socket.assigns[:token] do
      {:ok, socket}
    else
      {:error, %{reason: "Wrong token."}}
    end
  end
end
