defmodule RookWeb.AppController do
  use RookWeb, :controller

  def share(conn, _params) do
    render(conn, "share.html")
  end

  def request(conn, %{"token" => share_token}) do
    render(conn, "request.html", share_token: share_token)
  end
end
