defmodule TimesheetsSpaWeb.SheetView do
  use TimesheetsSpaWeb, :view
  alias TimesheetsSpaWeb.SheetView

  def render("index.json", %{sheets: sheets}) do
    %{data: render_many(sheets, SheetView, "sheet.json")}
  end

  def render("status.json", %{status: status}) do
    %{status: status}
  end

  def render("show.json", %{sheet: sheet}) do
    %{data: render_one(sheet, SheetView, "sheet.json")}
  end

  def render("sheet.json", %{sheet: sheet}) do
    %{id: sheet.id,
      status: sheet.status,
      date: sheet.date}
  end
end
