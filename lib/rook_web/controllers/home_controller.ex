defmodule RookWeb.HomeController do
  use RookWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
