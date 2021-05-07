defmodule RookWeb.Router do
  use RookWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", RookWeb do
    pipe_through :browser

    get "/", HomeController, :index
    get "/share", AppController, :share
    get "/:token", AppController, :request
  end

  # Other scopes may use custom stacks.
  # scope "/api", RookWeb do
  #   pipe_through :api
  # end
end
