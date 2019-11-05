defmodule TimesheetsSpa.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string, null: false
      add :email, :string, null: false, unique: true
      add :password_hash, :string, null: false
      add :manager_id, references(:users, on_delete: :restrict)

      timestamps()
    end

    create index(:users, [:manager_id])
  end
end
