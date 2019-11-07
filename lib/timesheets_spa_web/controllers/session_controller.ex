defmodule TimesheetsSpaWeb.SessionController do
  use TimesheetsSpaWeb, :controller

  action_fallback TimesheetsSpaWeb.FallbackController

  alias TimesheetsSpa.Users

  def create(conn, %{"email" => email, "password" => password}) do
    user = Users.authenticate(email, password)
    is_manager = Users.is_manager?(user.id)
    if user do
      token = Phoenix.Token.sign(conn, "session", user.id)
      resp = %{token: token, user_id: user.id, user_name: user.name, is_manager: is_manager}
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:created, Jason.encode!(resp))
      |> put_session(:user_id, user.id)
    else
      resp = %{errors: ["Authentication Failed"]}
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:unauthorized, Jason.encode!(resp))
    end
  end
end
