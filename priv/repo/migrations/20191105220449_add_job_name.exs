defmodule TimesheetsSpa.Repo.Migrations.AddJobName do
  use Ecto.Migration

  def change do
    alter table("jobs") do
      add :name, :string, null: false
    end
  end
end
