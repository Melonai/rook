defmodule RookWeb.AppController do
  use RookWeb, :controller

  plug :add_token

  def share(conn, _params) do
    render(conn, "share.html")
  end

  def request(conn, _params) do
    render(conn, "request.html")
  end

  defp add_token(conn, _params) do
    if conn.assigns[:token] do
      conn
    else
      assign(conn, :token, Rook.Utils.Token.token())
    end
  end
end
