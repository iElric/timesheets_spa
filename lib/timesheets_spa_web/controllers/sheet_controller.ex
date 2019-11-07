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

  def create(conn, %{"user_id"=>user_id, "jobcodes" => jobcodes, "hours"=> hours, "descs"=>descs, "date"=>date}) do
    date = if date === "" do
            Date.utc_today()
          else
            {_, date} = Date.from_iso8601(date)
            date
          end
    IO.inspect "aaaaaaaaaaaaaaaaaa"
    IO.inspect date
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
    IO.inspect "bbbbbbbbbbbbbbbbbb"
    IO.inspect total_hours

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
        job_ids =
          Enum.map(jobcodes, fn jobcode -> TimesheetsSpa.Jobs.get_job_id_by_jobcode(jobcode) end)

        itr = Enum.zip(hours, job_ids)
        itr = Enum.zip(itr, descs)

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
