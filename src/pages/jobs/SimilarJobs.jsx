import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import ClosedBadge from "./components/ui/ClosedBadge";

export default function SimilarJobs({ jobId }) {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      try {
        setLoading(true);

        const response = await API.get(`/jobs/${jobId}/similar`);

        setJobs(response.data?.jobs || []);
      } catch (error) {
        console.error("Failed to fetch similar jobs:", error);

        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchSimilarJobs();
    }
  }, [jobId]);

  if (loading) {
    return (
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
          Similar Jobs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (jobs.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Similar Jobs
          </h2>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            You may also be interested in these opportunities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {jobs.map((job) => {
          const isClosed =
            job.status === "inactive" || job.status === "expired";

          return (
            <div
              key={job._id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="p-6">
                {/* Badges */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {isClosed && <ClosedBadge status={job.status} />}

                  {!isClosed && job.category && (
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {job.category}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                  {job.title}
                </h3>

                {/* Institute */}
                <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-1">
                  {job.instituteName || "Institute Not Available"}
                </p>

                {/* Details */}
                <div className="mt-5 space-y-3">
                  {job.district && (
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <span>📍</span>
                      <span>{job.district}</span>
                    </div>
                  )}

                  {job.salaryRange && (
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <span>₹</span>
                      <span>{job.salaryRange}</span>
                    </div>
                  )}

                  {job.qualification && (
                    <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                      <span>🎓</span>
                      <span className="line-clamp-2">{job.qualification}</span>
                    </div>
                  )}
                </div>

                {/* Button */}
                {isClosed ? (
                  <button
                    type="button"
                    disabled
                    className="w-full mt-6 rounded-xl bg-gray-200 dark:bg-slate-700 px-5 py-3 font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  >
                    Applications Closed
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="w-full mt-6 rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    View Job
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
