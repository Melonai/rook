defmodule RookWeb.AppView do
  use RookWeb, :view

  def render_app(conn, entrypoint) do
    render("entrypoint.html", conn: conn, entrypoint: entrypoint)
  end
end
