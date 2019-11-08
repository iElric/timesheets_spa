defmodule TimesheetsSpaWeb.SheetController do
  use TimesheetsSpaWeb, :controller

  alias TimesheetsSpa.Sheets
  alias TimesheetsSpa.Sheets.Sheet

  action_fallback TimesheetsSpaWeb.FallbackController

  def index(conn, _params) do
    sheets = Sheets.list_sheets()
    render(conn, "index.json", sheets: sheets)
  end

  def create(conn, %{"sheet" => sheet_params}) do
    with {:ok, %Sheet{} = sheet} <- Sheets.create_sheet(sheet_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.sheet_path(conn, :show, sheet))
      |> render("show.json", sheet: sheet)
    end
  end

  def create(conn, %{
        "user_id" => user_id,
        "jobcodes" => jobcodes,
        "hours" => hours,
        "descs" => descs,
        "date" => date
      }) do
    date =
      if date === "" do
        Date.utc_today()
      else
        {_, date} = Date.from_iso8601(date)
        date
      end

    # map hours from string to in
    # filer to have only int greater than 0
    hours =
      Enum.map(hours, fn h ->
        if h === "" do
          0
        else
          # if the input is float, only count the integer part, if is other string, count as 0
          case Integer.parse(h) do
            :error ->
              0

            {h, _} ->
              if h < 0 do
                0
              else
                h
              end
          end
        end
      end)

    total_hours = Enum.reduce(hours, 0, fn h, acc -> h + acc end)

    if total_hours === 8 do
      current_user = user_id

      {ok_or_error, sheet_or_info} =
        TimesheetsSpa.Sheets.create_sheet(%{
          worker_id: current_user,
          date: date,
          status: false
        })

      # this sheet not exist
      if ok_or_error === :ok do
        # insert these tasks
        # here we use a not elegant solution to solve the problem, since in the previous version
        # of timesheets, jobcode can not be empty, but now it can be. To get this work on front end
        # is not easy so I fix this in the backend. We assume the default id 0 is choosed for empty
        # jobcode
        job_ids =
          Enum.map(jobcodes, fn jobcode ->
            if jobcode === "" do
              1
            else
              TimesheetsSpa.Jobs.get_job_id_by_jobcode(jobcode)
            end
          end)

        itr = Enum.zip(hours, job_ids)
        itr = Enum.zip(itr, descs)
        IO.inspect(itr)

        Enum.map(itr, fn {{hour, job_id}, desc} ->
          if hour > 0 do
            desc =
              if desc === "" do
                "No description"
              else
                desc
              end

            TimesheetsSpa.Tasks.create_task(%{
              spent_hours: hour,
              desc: desc,
              job_id: job_id,
              sheet_id: sheet_or_info.id
            })
          end
        end)

        render(conn, "status.json", %{status: "Succeeded"})
      else
        # this sheet exist
        render(conn, "status.json", %{status: "Sheet alreaday exist"})
      end
    else
      render(conn, "status.json", %{status: "8 hours required"})
    end
  end

  def show_sheet(conn, %{"user_id" => user_id, "date" => date}) do
    date =
    if date === "" do
      Date.utc_today()
    else
      {_, date} = Date.from_iso8601(date)
      date
    end
    current_user = user_id
    status = TimesheetsSpa.Sheets.get_status_by_worker_id_date(current_user, date)
    sheet_id = TimesheetsSpa.Sheets.get_id_by_worker_id_date(current_user, date)
    IO.inspect(date)
    IO.inspect(status)
    IO.inspect(sheet_id)

    tasks =
      if is_nil(sheet_id) do
        []
      else
        TimesheetsSpa.Tasks.get_tasks_by_sheet_id(sheet_id)
      end

    tasks =
      if tasks !== [] do
        tasks
        |> Enum.map(fn task ->
          %{
            desc: task.desc,
            spent_hours: task.spent_hours,
            job_code: TimesheetsSpa.Jobs.get_jobcode(task.job_id),
            status: status
          }
        end)
      else
        []
      end

    IO.inspect(tasks)

    render(conn, "show_sheet.json", tasks: tasks)
  end

  def show(conn, %{"id" => id}) do
    sheet = Sheets.get_sheet!(id)
    render(conn, "show.json", sheet: sheet)
  end

  def update(conn, %{"id" => id, "sheet" => sheet_params}) do
    sheet = Sheets.get_sheet!(id)

    with {:ok, %Sheet{} = sheet} <- Sheets.update_sheet(sheet, sheet_params) do
      render(conn, "show.json", sheet: sheet)
    end
  end

  def delete(conn, %{"id" => id}) do
    sheet = Sheets.get_sheet!(id)

    with {:ok, %Sheet{}} <- Sheets.delete_sheet(sheet) do
      send_resp(conn, :no_content, "")
    end
  end
end
