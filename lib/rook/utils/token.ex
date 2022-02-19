defmodule Rook.Token do
  @alphabet "abcdefghijklmnopqrstuvw0123456789"

  def token() do
    # TODO: Check for collisions!
    Nanoid.generate(6, @alphabet)
  end

  def match?(token, socket) do
    token == socket.assigns[:token]
  end
end
