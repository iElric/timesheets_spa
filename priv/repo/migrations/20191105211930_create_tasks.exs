defmodule TimesheetsSpa.Repo.Migrations.CreateTasks do
  use Ecto.Migration

  def change do
    create table(:tasks) do
      add :spent_hours, :integer, null: false
      add :desc, :text, default: "No description"
      add :job_id, references(:jobs, on_delete: :restrict), null: false
      add :sheet_id, references(:sheets, on_delete: :restrict), null: false

      timestamps()
    end

    create index(:tasks, [:job_id])
    create index(:tasks, [:sheet_id])
  end
end
