import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  RefreshCw,
} from "lucide-react";

import API from "../../../../api/axios";

const statusStyles = {
  applied: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

  under_review:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",

  reviewed:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",

  processed:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",

  contacted:
    "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

  shortlisted:
    "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

  interview_scheduled:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",

  selected:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

  rejected: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",

  withdrawn: "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400",
};

const formatStatus = (status = "applied") => {
  const labels = {
    applied: "Applied",
    reviewed: "Application Reviewed",
    processed: "Application Processed",
    contacted: "Contacted",
    under_review: "Application Reviewed",
    shortlisted: "Shortlisted",
    interview_scheduled: "Interview Scheduled",
    selected: "Selected",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  };

  return labels[status] || "Applied";
};

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

const getApplicationDate = (application) => {
  return application?.createdAt || application?.appliedAt || null;
};

const getCandidateStatus = (application) => {
  const status = application?.status || "applied";
  const activity = application?.recruiterActivity || {};

  // Final application states always take priority
  if (status === "rejected") {
    return "rejected";
  }

  if (status === "selected") {
    return "selected";
  }

  if (status === "interview_scheduled") {
    return "interview_scheduled";
  }

  if (status === "shortlisted") {
    return "shortlisted";
  }

  // Recruiter activity
  if (activity.lastContactedAt) {
    return "contacted";
  }

  if (activity.proceededAt) {
    return "processed";
  }

  if (activity.viewedAt || status === "under_review") {
    return "reviewed";
  }

  return "applied";
};

export default function AppliedJobs() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get("/applications/my");

      setApplications(data?.applications || []);
    } catch (err) {
      console.error("Failed to load applications:", err);

      setError(
        err?.response?.data?.message || "Failed to load your applications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleViewJob = (jobId) => {
    if (!jobId) {
      return;
    }

    navigate(`/jobs/${jobId}`);
  };

  return (
    <section className="w-full px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Job Seeker
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            My Applications
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track the jobs you've applied for and follow their application
            status.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchApplications}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-slate-800" />

              <div className="mt-3 h-4 w-1/3 rounded bg-gray-200 dark:bg-slate-800" />

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="h-4 rounded bg-gray-200 dark:bg-slate-800" />
                <div className="h-4 rounded bg-gray-200 dark:bg-slate-800" />
                <div className="h-4 rounded bg-gray-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
          <p className="font-semibold text-red-700 dark:text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchApplications}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      )}
      {/* Empty State */}
      {!loading && !error && applications.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <BriefcaseBusiness size={26} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
            No applications yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
            You haven't applied for any jobs yet. Explore available
            opportunities and submit your first application.
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
      {/* Applications */}
      {!loading && !error && applications.length > 0 && (
        <div className="space-y-4">
          {applications.map((application) => {
            const job = application?.job;

            if (!job) {
              return null;
            }

            const status = getCandidateStatus(application);
            return (
              <article
                key={application._id}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-800"
              >
                {/* Top row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <BriefcaseBusiness size={21} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold text-gray-900 dark:text-white">
                          {job.title || "Untitled Job"}
                        </h2>

                        <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                          {job.instituteName || "Institution"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`inline-flex w-fit shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-bold ${
                      statusStyles[status] || statusStyles.applied
                    }`}
                  >
                    {formatStatus(status)}
                  </span>
                </div>

                {/* Job details */}
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={16} className="shrink-0" />

                    <span>{job.district || "Location not specified"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <BriefcaseBusiness size={16} className="shrink-0" />

                    <span>
                      {job.positionLevel || job.category || "Position"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock3 size={16} className="shrink-0" />

                    <span>
                      {job.experienceRequired ?? 0}{" "}
                      {Number(job.experienceRequired) === 1 ? "year" : "years"}{" "}
                      experience
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CalendarDays size={16} className="shrink-0" />

                    <span>
                      Applied {formatDate(getApplicationDate(application))}
                    </span>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {job.subject && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-slate-800 dark:text-gray-300">
                        {job.subject}
                      </span>
                    )}

                    {job.salaryRange && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-slate-800 dark:text-gray-300">
                        ₹ {job.salaryRange}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleViewJob(job._id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    View Job
                    <ChevronRight size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
