defmodule TimesheetsSpaWeb.Plugs.RequireAuth do
  import Plug.Conn

  def init(args), do: args

  @doc """
  This is a function plug, a function simply needs to accept a connection struct
  (%Plug.Conn{}) and options. It also needs to return a connection struct.
  """
  def call(conn, _args) do
    token = List.first(get_req_header(conn, "x-auth"))

    case Phoenix.Token.verify(TimesheetsSpaWeb.Endpoint, "session", token, max_age: 86400) do
      {:ok, user_id} ->
        assign(conn, :current_user, TimesheetsSpa.Users.get_user!(user_id))
      {:error, err} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity, Jason.encode!(%{"error" => err}))
        |> halt()
    end
  end
end
