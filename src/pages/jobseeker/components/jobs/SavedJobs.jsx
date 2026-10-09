import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  BookmarkX,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  RefreshCw,
  Trash2,
  Building2,
  GraduationCap,
  IndianRupee,
  Wrench,
} from "lucide-react";

import API from "../../../../api/axios";

// ==========================================================
// HELPERS
// ==========================================================

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatSalary = (job) => {
  if (job?.salaryRange) {
    return `₹ ${job.salaryRange}`;
  }

  if (
    job?.salaryMin !== undefined &&
    job?.salaryMin !== null &&
    job?.salaryMax !== undefined &&
    job?.salaryMax !== null
  ) {
    return `₹ ${Number(job.salaryMin).toLocaleString("en-IN")} - ₹ ${Number(
      job.salaryMax
    ).toLocaleString("en-IN")}`;
  }

  if (job?.salaryMin !== undefined && job?.salaryMin !== null) {
    return `₹ ${Number(job.salaryMin).toLocaleString("en-IN")}+`;
  }

  return null;
};

const formatExperience = (experience) => {
  if (experience === undefined || experience === null || experience === "") {
    return null;
  }

  const years = Number(experience);

  return `${years} ${years === 1 ? "year" : "years"} experience`;
};

const getJobDetails = (savedJob) => {
  return savedJob?.jobDetails || {};
};

const getRecruiter = (job) => {
  return job?.recruiter || {};
};

// ==========================================================
// COMPONENT
// ==========================================================

export default function SavedJobs() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingJobId, setRemovingJobId] = useState(null);

  // ========================================================
  // FETCH SAVED JOBS
  // ========================================================

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get("/saved-jobs");

      setSavedJobs(data?.savedJobs || []);
    } catch (err) {
      console.error("Failed to load saved jobs:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load your saved jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // INITIAL LOAD
  // ========================================================

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  // ========================================================
  // VIEW JOB
  // ========================================================

  const handleViewJob = (jobId) => {
    if (!jobId) {
      return;
    }

    navigate(`/jobs/${jobId}`);
  };

  // ========================================================
  // REMOVE SAVED JOB
  // ========================================================

  const handleRemoveJob = async (jobId) => {
    if (!jobId) {
      return;
    }

    try {
      setRemovingJobId(jobId);

      await API.delete(`/saved-jobs/${jobId}`);

      setSavedJobs((currentJobs) =>
        currentJobs.filter(
          (savedJob) => savedJob?.job?._id !== jobId
        )
      );
    } catch (err) {
      console.error("Failed to remove saved job:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to remove the saved job."
      );
    } finally {
      setRemovingJobId(null);
    }
  };

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <section className="w-full px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Job Seeker
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Saved Jobs
            </h1>

            {!loading && !error && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                {savedJobs.length}
              </span>
            )}
          </div>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Keep track of opportunities you want to explore later.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSavedJobs}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* ================================================== */}
      {/* LOADING */}
      {/* ================================================== */}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex gap-4">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-200 dark:bg-slate-800" />

                <div className="min-w-0 flex-1">
                  <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-slate-800" />

                  <div className="mt-3 h-4 w-1/3 rounded bg-gray-200 dark:bg-slate-800" />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="h-4 rounded bg-gray-200 dark:bg-slate-800" />
                <div className="h-4 rounded bg-gray-200 dark:bg-slate-800" />
                <div className="h-4 rounded bg-gray-200 dark:bg-slate-800" />
                <div className="h-4 rounded bg-gray-200 dark:bg-slate-800" />
              </div>

              <div className="mt-6 h-10 rounded bg-gray-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      )}

      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
          <p className="font-semibold text-red-700 dark:text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchSavedJobs}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <RefreshCw size={15} />

            Try Again
          </button>
        </div>
      )}

      {/* ================================================== */}
      {/* EMPTY STATE */}
      {/* ================================================== */}

      {!loading &&
        !error &&
        savedJobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Bookmark size={26} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              No saved jobs yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
              Save interesting job opportunities while browsing and
              come back to them whenever you are ready to apply.
            </p>

            <button
              type="button"
              onClick={() => navigate("/jobs")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse Jobs
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      {/* ================================================== */}
      {/* SAVED JOBS */}
      {/* ================================================== */}

      {!loading &&
        !error &&
        savedJobs.length > 0 && (
          <div className="space-y-4">
            {savedJobs.map((savedJob) => {
              const job = savedJob?.job;

              if (!job) {
                return null;
              }

              const jobDetails = getJobDetails(savedJob);
              const recruiter = getRecruiter(job);

              const salary = formatSalary(job);
              const experience = formatExperience(
                job?.experienceRequired
              );

              const employmentType =
                jobDetails?.employmentType ||
                job?.employmentType ||
                null;

              const skills = Array.isArray(jobDetails?.skills)
                ? jobDetails.skills
                : [];

              const savedDate = formatDate(savedJob?.createdAt);

              return (
                <article
                  key={savedJob?._id}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-800"
                >
                  {/* ====================================== */}
                  {/* TOP SECTION */}
                  {/* ====================================== */}

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                          <BriefcaseBusiness size={22} />
                        </div>

                        <div className="min-w-0">
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {job?.title || "Untitled Job"}
                          </h2>

                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                              {recruiter?.instituteName ||
                                job?.instituteName ||
                                "Institution"}
                            </span>

                            {recruiter?.isVerified && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={13} />
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Saved indicator */}
                    <div className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                      <Bookmark
                        size={14}
                        className="fill-current"
                      />
                      Saved
                    </div>
                  </div>

                  {/* ====================================== */}
                  {/* JOB INFORMATION */}
                  {/* ====================================== */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {job?.district && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin
                          size={16}
                          className="shrink-0 text-gray-400 dark:text-gray-500"
                        />

                        <span>{job.district}</span>
                      </div>
                    )}

                    {(job?.positionLevel || job?.category) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <BriefcaseBusiness
                          size={16}
                          className="shrink-0 text-gray-400 dark:text-gray-500"
                        />

                        <span>
                          {job?.positionLevel ||
                            job?.category}
                        </span>
                      </div>
                    )}

                    {experience && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock3
                          size={16}
                          className="shrink-0 text-gray-400 dark:text-gray-500"
                        />

                        <span>{experience}</span>
                      </div>
                    )}

                    {employmentType && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Building2
                          size={16}
                          className="shrink-0 text-gray-400 dark:text-gray-500"
                        />

                        <span>{employmentType}</span>
                      </div>
                    )}
                  </div>

                  {/* ====================================== */}
                  {/* SECONDARY INFORMATION */}
                  {/* ====================================== */}

                  {(salary ||
                    job?.subject ||
                    jobDetails?.roleCategory ||
                    jobDetails?.department) && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {salary && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <IndianRupee
                            size={16}
                            className="shrink-0 text-gray-400 dark:text-gray-500"
                          />

                          <span>{salary}</span>
                        </div>
                      )}

                      {job?.subject && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <GraduationCap
                            size={16}
                            className="shrink-0 text-gray-400 dark:text-gray-500"
                          />

                          <span>{job.subject}</span>
                        </div>
                      )}

                      {jobDetails?.roleCategory && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-gray-400 dark:text-gray-500">
                            Role:
                          </span>{" "}
                          {jobDetails.roleCategory}
                        </div>
                      )}

                      {jobDetails?.department && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-gray-400 dark:text-gray-500">
                            Department:
                          </span>{" "}
                          {jobDetails.department}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ====================================== */}
                  {/* JOB PURPOSE */}
                  {/* ====================================== */}

                  {jobDetails?.jobPurpose && (
                    <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-slate-800/60">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Job Overview
                      </p>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {jobDetails.jobPurpose}
                      </p>
                    </div>
                  )}

                  {/* ====================================== */}
                  {/* SKILLS */}
                  {/* ====================================== */}

                  {skills.length > 0 && (
                    <div className="mt-5">
                      <div className="mb-2 flex items-center gap-2">
                        <Wrench
                          size={15}
                          className="text-gray-400 dark:text-gray-500"
                        />

                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Required Skills
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {skills.slice(0, 8).map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 dark:bg-slate-800 dark:text-gray-300"
                          >
                            {skill}
                          </span>
                        ))}

                        {skills.length > 8 && (
                          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500 dark:bg-slate-800 dark:text-gray-400">
                            +{skills.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ====================================== */}
                  {/* BOTTOM ACTION BAR */}
                  {/* ====================================== */}

                  <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <CalendarDays size={15} />

                      <span>
                        Saved {savedDate}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveJob(job?._id)
                        }
                        disabled={
                          removingJobId === job?._id
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:border-red-900/50 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                      >
                        {removingJobId === job?._id ? (
                          <RefreshCw
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={15} />
                        )}

                        {removingJobId === job?._id
                          ? "Removing..."
                          : "Remove"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewJob(job?._id)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Job
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
    </section>
  );
}