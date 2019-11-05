defmodule TimesheetsSpa.Repo.Migrations.CreateJobs do
  use Ecto.Migration

  def change do
    create table(:jobs) do
      add :budget, :integer, null: false
      add :jodcode, :string, null: false, unique: true
      add :desc, :text, default: "No description"
      add :manager_id, references(:users, on_delete: :restrict), null: false

      timestamps()
    end

    create index(:jobs, [:manager_id])
  end
end
