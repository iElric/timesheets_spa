defmodule TimesheetsSpaWeb.Router do
  use TimesheetsSpaWeb, :router

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

  pipeline :ajax do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  scope "/ajax", TimesheetsSpaWeb do
    pipe_through :ajax

    resources "/sessions", SessionController, only: [:create], singleton: true
    resources "/users", UserController, except: [:new, :edit]
    resources "/jobs", JobController, except: [:new, :edit]
    resources "/sheets", SheetController, except: [:new, :edit]
    resources "/tasks", TaskController, except: [:new, :edit]
  end

  scope "/", TimesheetsSpaWeb do
    pipe_through :browser

    get "/", PageController, :index
    # Add our paths to the Phoenix router, just loading our index page.
    # React-Router will figure out what to do from there.
    get "/*path", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", TimesheetsSpaWeb do
  #   pipe_through :api
  # end
end
