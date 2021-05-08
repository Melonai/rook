defmodule RookWeb.AppController do
  use RookWeb, :controller

  def share(conn, _params) do
    render(conn, "share.html")
  end

  def request(conn, _params) do
    render(conn, "request.html")
  end
end
