defmodule Rook.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      RookWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Rook.PubSub},
      # Start the Endpoint (http/https)
      RookWeb.Endpoint,
      # Start a worker by calling: Rook.Worker.start_link(arg)
      # {Rook.Worker, arg}
      {Registry, keys: :unique, name: Registry.Share},
      {Registry, keys: :unique, name: Registry.Request}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Rook.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    RookWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
