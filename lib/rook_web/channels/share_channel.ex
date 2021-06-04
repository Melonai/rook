defmodule RookWeb.ShareChannel do
  use Phoenix.Channel

  intercept ["new_request"]

  def join("share:" <> token, _params, socket) do
    if Rook.Token.match?(token, socket) do
      Rook.Share.Actions.start(token)
      {:ok, socket}
    else
      {:error, %{reason: "Wrong token."}}
    end
  end

  def handle_in("accept_request", %{"token" => request_token} = params, socket) do
    description = Map.delete(params, :token)
    token = socket.assigns.token
    Rook.Share.Actions.accept_request(token, request_token, description)
    {:noreply, socket}
  end

  def handle_in("accept_request", _params, _socket) do
    {:error, %{reason: "No request given to accept."}}
  end

  def handle_in("ice_candidate", %{"token" => request_token, "candidate" => candidate}, socket) do
    token = socket.assigns.token
    Rook.Share.Actions.ice_candidate(token, request_token, candidate)
    {:noreply, socket}
  end

  def handle_out("new_request", %{token: request_token} = msg, socket) do
    Rook.Request.Events.request_acknowledged(request_token)
    push(socket, "new_request", msg)
    {:noreply, socket}
  end
end
