defmodule RookWeb.ShareChannel do
  use Phoenix.Channel

  intercept ["new_request"]

  def join("share:" <> token, _params, socket) do
    if Rook.Token.match?(token, socket) do
      Rook.Share.start(token)
      {:ok, socket}
    else
      {:error, %{reason: "Wrong token."}}
    end
  end

  def handle_in("accept_request", %{"request" => _request_token}, socket) do
    # TODO: Send request accept message.
    {:noreply, socket}
  end

  def handle_in("accept_request", _params, _socket) do
    {:error, %{reason: "No request given to accept."}}
  end

  def handle_out("new_request", %{request: request_token} = msg, socket) do
    Rook.Request.acknowledge_request(request_token)
    push(socket, "new_request", msg)
    {:noreply, socket}
  end
end
