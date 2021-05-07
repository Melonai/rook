defmodule RookWeb.AppView do
  use RookWeb, :view

  def render_app(conn, token, entrypoint) do
    render("entrypoint.html", conn: conn, token: token, entrypoint: entrypoint)
  end
end
