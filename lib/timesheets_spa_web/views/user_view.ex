defmodule TimesheetsSpaWeb.UserView do
  use TimesheetsSpaWeb, :view
  alias TimesheetsSpaWeb.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      name: user.name,
      email: user.email,
      password_hash: user.password_hash}
  end

  def render("show_workers.json", %{worker_names: worker_names}) do
    %{worker_names: worker_names}
  end
end
