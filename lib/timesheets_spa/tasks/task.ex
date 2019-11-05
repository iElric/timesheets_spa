defmodule TimesheetsSpa.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tasks" do
    field :desc, :string
    field :spent_hours, :integer

    belongs_to(:job, TimesheetsSpa.Jobs.Job)
    belongs_to(:sheet, TimesheetsSpa.Sheets.Sheet)

    timestamps()
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:spent_hours, :desc, :job_id, :sheet_id])
    |> validate_required([:spent_hours, :desc, :job_id, :sheet_id])
  end
end
