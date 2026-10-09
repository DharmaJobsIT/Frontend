import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import API from "../../api/axios";

import JobCard from "./components/cards/JobCard";
import JobsToolbar from "./components/layout/JobsToolbar";
import JobsFilterSidebar from "./components/layout/JobsFilterSidebar";
import JobsPagination from "./components/layout/JobsPagination";

import LoadingJobs from "./components/ui/LoadingJobs";
import EmptyJobs from "./components/ui/EmptyJobs";

export default function AllJobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [total, setTotal] = useState(0);

  const [keyword, setKeyword] = useState("");

  const [sort, setSort] = useState("latest");

  const [filters, setFilters] = useState({
    subject: "",
    qualification: "",
    district: "",
    institute: "",
    freshness: "",
  });

  /*
   * ==========================================================
   * FOCUS SEARCH WHEN COMING FROM HERO
   * ==========================================================
   */

  useEffect(() => {
    if (searchParams.get("focus") === "search") {
      const timer = setTimeout(() => {
        const searchInput = document.querySelector(
          'input[placeholder*="Search"]',
        );

        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  /*
   * ==========================================================
   * FETCH JOBS
   * ==========================================================
   */

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(timeout);
  }, [page, keyword, sort, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      setError("");

      const params = {
        page,
        limit: 12,
        sort,
        status: "all",
      };

      if (keyword.trim()) {
        params.keyword = keyword.trim();
      }

      if (filters.subject) {
        params.subject = filters.subject;
      }

      if (filters.qualification) {
        params.qualification = filters.qualification;
      }

      if (filters.district) {
        params.district = filters.district;
      }

      if (filters.institute) {
        params.institute = filters.institute;
      }

      if (filters.freshness) {
        params.freshness = filters.freshness;
      }

      const response = await API.get("/jobs", {
        params,
      });

      setJobs(response?.data?.jobs || []);

      setTotal(response?.data?.total || 0);

      setTotalPages(
        response?.data?.totalPages || 1,
      );
    } catch (err) {
      console.error(
        "Failed to fetch jobs:",
        err,
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load jobs.",
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  /*
   * ==========================================================
   * SEARCH
   * ==========================================================
   */

  const handleKeywordChange = (value) => {
    setKeyword(value);

    setPage(1);
  };

  /*
   * ==========================================================
   * SORT
   * ==========================================================
   */

  const handleSortChange = (value) => {
    setSort(value);

    setPage(1);
  };

  /*
   * ==========================================================
   * FILTERS
   * ==========================================================
   */

  const handleFiltersChange = (updater) => {
    setFilters(updater);

    setPage(1);
  };

  /*
   * ==========================================================
   * UI
   * ==========================================================
   */

  return (
    <main className="min-h-screen bg-gray-50 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">

        {/* ==================================================
            BACK TO HOME
        ================================================== */}

        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Home
          </button>
        </div>

        {/* ==================================================
            TOOLBAR
        ================================================== */}

        <JobsToolbar
          keyword={keyword}
          setKeyword={handleKeywordChange}
          sort={sort}
          setSort={handleSortChange}
          total={total}
        />

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">

          {/* ==================================================
              FILTERS
          ================================================== */}

          <JobsFilterSidebar
            filters={filters}
            setFilters={handleFiltersChange}
            jobs={jobs}
          />

          {/* ==================================================
              JOBS
          ================================================== */}

          <div>
            {!loading && (
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                {total} job{total !== 1 ? "s" : ""} found
              </p>
            )}

            {loading ? (
              <LoadingJobs />
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                {error}
              </div>
            ) : jobs.length === 0 ? (
              <EmptyJobs />
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                    />
                  ))}
                </div>

                <JobsPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}