defmodule TimesheetsSpa.Repo.Migrations.AlterJobcode do
  use Ecto.Migration

  def change do
    rename table("jobs"), :jodcode, to: :jobcode
  end
end
