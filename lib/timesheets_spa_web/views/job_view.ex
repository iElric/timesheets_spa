defmodule TimesheetsSpaWeb.JobView do
  use TimesheetsSpaWeb, :view
  alias TimesheetsSpaWeb.JobView

  def render("index.json", %{jobs: jobs}) do
    %{data: render_many(jobs, JobView, "job.json")}
  end

  def render("jobcodes.json", %{jobcodes: jobcodes}) do
    %{jobcodes: jobcodes}
  end

  def render("show.json", %{job: job}) do
    %{data: render_one(job, JobView, "job.json")}
  end

  def render("job.json", %{job: job}) do
    %{id: job.id,
      budget: job.budget,
      jobcode: job.jobcode,
      desc: job.desc,
      name: job.name}
  end
end
