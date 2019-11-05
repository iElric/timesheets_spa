defmodule TimesheetsSpa.Repo.Migrations.CreateSheets do
  use Ecto.Migration

  def change do
    create table(:sheets) do
      add :status, :boolean, default: false, null: false
      add :date, :date, null: false
      add :worker_id, references(:users, on_delete: :restrict), null: false

      timestamps()
    end

    create index(:sheets, [:worker_id])
    create unique_index(:sheets, [:worker_id, :date])
  end
end
