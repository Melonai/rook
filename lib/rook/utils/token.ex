defmodule Rook.Token do
  @alphabet "abcdefghijklmnopqrstuvw0123456789"


  def token() do
    Nanoid.generate(21, @alphabet)
  end

  def match?(token, socket) do
    token == socket.assigns[:token]
  end
end
