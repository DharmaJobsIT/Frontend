import { Link } from "react-router-dom";
import {
  MapPin,
  GraduationCap,
  Clock3,
  IndianRupee,
  Sparkles,
} from "lucide-react";
import Card from "./ui/Card";

export default function JobCard({ job }) {
  const {
    _id,
    title,
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

  const isExpired = status === "expired";

  const postedAgo = () => {
    if (!createdAt) return "Recently";

    const now = new Date();
    const posted = new Date(createdAt);

    const diff = Math.floor((now - posted) / (1000 * 60 * 60));

    if (diff < 1) return "Just now";
    if (diff < 24) return `${diff} hrs ago`;

    return `${Math.floor(diff / 24)} days ago`;
  };

  const expiredAgo = () => {
    if (!expiryDate) return "Expired";

    const now = new Date();
    const expiry = new Date(expiryDate);

    const diff = Math.floor((now - expiry) / (1000 * 60 * 60));

    if (diff < 24) return `Expired ${diff} hrs ago`;

    return `Expired ${Math.floor(diff / 24)} days ago`;
  };

  return (
    <Card
      className={`group overflow-hidden ${
        isExpired ? "bg-gray-50 border border-red-200" : ""
      }`}
    >
      <div className="p-6">
        {/* Badges */}

        <div className="flex flex-wrap gap-2 mb-4">
          {isExpired ? (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
              🔴 Expired
            </span>
          ) : promotion?.isBoosted ? (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
              🚀 Boosted
            </span>
          ) : recommended ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              <Sparkles size={14} />
              Recommended
            </span>
          ) : null}
        </div>

        {/* Title */}

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-1 text-gray-500 dark:text-gray-400">{instituteName}</p>

        {/* Details */}

        <div className="space-y-3 mt-6">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <MapPin size={18} />
            {district}
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <IndianRupee size={18} />
            {salaryRange || "Not Disclosed"}
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <GraduationCap size={18} />
            {qualification || "Qualification Flexible"}
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Clock3 size={18} />
            {isExpired ? expiredAgo() : postedAgo()}
          </div>
        </div>

        {/* Apply */}

        {isExpired ? (
          <button
            disabled
            className="mt-8 w-full rounded-xl bg-gray-300 px-5 py-3 font-medium text-gray-600 cursor-not-allowed"
          >
            Applications Closed
          </button>
        ) : (
          <Link
            to={`/job/${_id}`}
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-white font-medium transition hover:bg-blue-700"
          >
            View Job
          </Link>
        )}
      </div>
    </Card>
  );
}
