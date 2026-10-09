import { Link } from "react-router-dom";
import {
  MapPin,
  GraduationCap,
  Clock3,
  IndianRupee,
  Sparkles,
} from "lucide-react";

import ClosedBadge from "../ui/ClosedBadge";

export default function JobCard({ job }) {
  const {
    _id,
    title,
    subject,
    instituteName,
    district,
    salaryRange,
    qualification,
    createdAt,
    expiryDate,
    status,
    promotion,
    recommended,
  } = job;

  const isClosed = status === "inactive" || status === "expired";

  const formatRelativeDate = (date) => {
    if (!date) return "Recently";

    const postedDate = new Date(date);

    return postedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getExpiryText = () => {
    if (status === "inactive") {
      return "Job Closed";
    }

    if (status === "expired") {
      if (!expiryDate) return "Expired";

      const date = new Date(expiryDate);

      return `Expired on ${date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
    }

    return `Posted ${formatRelativeDate(createdAt)}`;
  };

  return (
    <div
      className={`group rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg dark:bg-slate-900 ${
        isClosed
          ? "border-red-200 opacity-90"
          : "border-gray-200 dark:border-slate-700"
      }`}
    >
      {/* Badges */}

      <div className="mb-4 flex flex-wrap gap-2">
        {isClosed && <ClosedBadge status={status} />}

        {!isClosed && promotion?.isBoosted && (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            🚀 Boosted
          </span>
        )}

        {!isClosed && recommended && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            <Sparkles size={14} />
            Recommended
          </span>
        )}
      </div>

      {/* Subject */}

      {subject && (
        <p className="mb-2 text-sm font-medium text-blue-600">{subject}</p>
      )}

      {/* Title */}

      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h3>

      {/* Institute */}

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        {instituteName || "Institute Not Available"}
      </p>

      {/* Job Details */}

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <MapPin size={18} />

          <span>{district || "Not Specified"}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <IndianRupee size={18} />

          <span>{salaryRange || "Not Disclosed"}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <GraduationCap size={18} />

          <span>{qualification || "Qualification Flexible"}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <Clock3 size={18} />

          <span>{getExpiryText()}</span>
        </div>
      </div>

      {/* Button */}

      {isClosed ? (
        <button
          disabled
          className="mt-8 w-full cursor-not-allowed rounded-xl bg-gray-200 px-5 py-3 font-medium text-gray-500 dark:bg-slate-700 dark:text-gray-400"
        >
          Applications Closed
        </button>
      ) : (
        <Link
          to={`/jobs/${_id}`}
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          View Job
        </Link>
      )}
    </div>
  );
}
