defmodule RookWeb.RequestChannel do
  use RookWeb, :channel

  def join("request:" <> token, %{"share" => share_token}, socket) do
    if Rook.Token.match?(token, socket) do
      if Rook.Share.exists?(share_token) do
        Rook.Request.Actions.start(token, share_token)
        {:ok, socket}
      else
        {:error, %{reason: "No such share exists."}}
      end
    else
      {:error, %{reason: "Wrong token."}}
    end
  end

  def join("request:" <> _token, _params, _socket) do
    {:error, %{reason: "No share given to request."}}
  end

  def handle_in("accept_share", description, socket) do
    Rook.Request.Actions.accept_share(socket.assigns.token, description)
    {:noreply, socket}
  end

  def handle_in("ice_candidate", %{"candidate" => candidate}, socket) do
    Rook.Request.Actions.ice_candidate(socket.assigns.token, candidate)
    {:noreply, socket}
  end
end
