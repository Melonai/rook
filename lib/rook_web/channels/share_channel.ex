defmodule RookWeb.ShareChannel do
  use Phoenix.Channel

  def join("share:" <> token, _params, socket) do
    if token == socket.assigns[:token] do
      :ok = Rook.ShareMonitor.track(self(), token)
      {:ok, socket}
    else
      {:error, %{reason: "Wrong token."}}
    end
  end

  def handle_close(_requests) do
    # Notify all requests that share is gone.
  end
end
