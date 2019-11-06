defmodule TimesheetsSpaWeb.JobControllerTest do
  use TimesheetsSpaWeb.ConnCase

  alias TimesheetsSpa.Jobs
  alias TimesheetsSpa.Jobs.Job

  @create_attrs %{
    budget: 42,
    desc: "some desc",
    jobcode: "some jobcode",
    name: "some name"
  }
  @update_attrs %{
    budget: 43,
    desc: "some updated desc",
    jobcode: "some updated jobcode",
    name: "some updated name"
  }
  @invalid_attrs %{budget: nil, desc: nil, jobcode: nil, name: nil}

  def fixture(:job) do
    {:ok, job} = Jobs.create_job(@create_attrs)
    job
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all jobs", %{conn: conn} do
      conn = get(conn, Routes.job_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create job" do
    test "renders job when data is valid", %{conn: conn} do
      conn = post(conn, Routes.job_path(conn, :create), job: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.job_path(conn, :show, id))

      assert %{
               "id" => id,
               "budget" => 42,
               "desc" => "some desc",
               "jobcode" => "some jobcode",
               "name" => "some name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.job_path(conn, :create), job: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update job" do
    setup [:create_job]

    test "renders job when data is valid", %{conn: conn, job: %Job{id: id} = job} do
      conn = put(conn, Routes.job_path(conn, :update, job), job: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.job_path(conn, :show, id))

      assert %{
               "id" => id,
               "budget" => 43,
               "desc" => "some updated desc",
               "jobcode" => "some updated jobcode",
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, job: job} do
      conn = put(conn, Routes.job_path(conn, :update, job), job: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete job" do
    setup [:create_job]

    test "deletes chosen job", %{conn: conn, job: job} do
      conn = delete(conn, Routes.job_path(conn, :delete, job))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.job_path(conn, :show, job))
      end
    end
  end

  defp create_job(_) do
    job = fixture(:job)
    {:ok, job: job}
  end
end
