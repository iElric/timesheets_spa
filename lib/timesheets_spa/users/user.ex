defmodule TimesheetsSpa.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :name, :string
    field :password_hash, :string

    # do self-reference here
    belongs_to(:manager, TimesheetsSpa.Users.User)
    has_many(:workers, TimesheetsSpa.Users.User, foreign_key: :manager_id)
    has_many(:jobs, TimesheetsSpa.Jobs.Job, foreign_key: :manager_id)
    has_many(:sheets, TimesheetsSpa.Sheets.Sheet, foreign_key: :worker_id)

    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    # cast keys from attrs passed into the change set
    |> cast(attrs, [:email, :name, :password, :password_confirmation])
    # this validation will check if both "password" and "password_confirmation" in the parameter map matches
    |> validate_confirmation(:password)
    |> validate_length(:password, min: 12) # too short
    |> hash_password()
    |> validate_required([:email, :name, :password_hash])
  end

  def hash_password(cset) do
    pw = get_change(cset, :password)
    if pw do
      change(cset, Argon2.add_hash(pw))
    else
      cset
    end
  end
end
