defmodule TimesheetsSpaWeb.SheetControllerTest do
  use TimesheetsSpaWeb.ConnCase

  alias TimesheetsSpa.Sheets
  alias TimesheetsSpa.Sheets.Sheet

  @create_attrs %{
    date: ~D[2010-04-17],
    status: true
  }
  @update_attrs %{
    date: ~D[2011-05-18],
    status: false
  }
  @invalid_attrs %{date: nil, status: nil}

  def fixture(:sheet) do
    {:ok, sheet} = Sheets.create_sheet(@create_attrs)
    sheet
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all sheets", %{conn: conn} do
      conn = get(conn, Routes.sheet_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create sheet" do
    test "renders sheet when data is valid", %{conn: conn} do
      conn = post(conn, Routes.sheet_path(conn, :create), sheet: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.sheet_path(conn, :show, id))

      assert %{
               "id" => id,
               "date" => "2010-04-17",
               "status" => true
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.sheet_path(conn, :create), sheet: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update sheet" do
    setup [:create_sheet]

    test "renders sheet when data is valid", %{conn: conn, sheet: %Sheet{id: id} = sheet} do
      conn = put(conn, Routes.sheet_path(conn, :update, sheet), sheet: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.sheet_path(conn, :show, id))

      assert %{
               "id" => id,
               "date" => "2011-05-18",
               "status" => false
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, sheet: sheet} do
      conn = put(conn, Routes.sheet_path(conn, :update, sheet), sheet: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete sheet" do
    setup [:create_sheet]

    test "deletes chosen sheet", %{conn: conn, sheet: sheet} do
      conn = delete(conn, Routes.sheet_path(conn, :delete, sheet))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.sheet_path(conn, :show, sheet))
      end
    end
  end

  defp create_sheet(_) do
    sheet = fixture(:sheet)
    {:ok, sheet: sheet}
  end
end
