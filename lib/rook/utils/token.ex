defmodule Rook.Utils.Token do
  @alphabet "abcdefghijklmnopqrstuvw0123456789"

  def token() do
    Nanoid.generate(21, @alphabet)
  end
end
