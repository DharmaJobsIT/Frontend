import {
  ArrowUpDown,
  ChevronDown,
  Filter,
  Lock,
  Search,
  Sparkles,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

export default function FreeTrial({
  search = "",
  setSearch,
  statusFilter = "all",
  setStatusFilter,
  sortBy = "newest",
  setSortBy,
  onApplyFilters,
  onUpgrade,
}) {
  const handleSearchChange = (event) => {
    setSearch?.(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusFilter?.(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy?.(event.target.value);
  };

  return (
    <div className="space-y-4">
      {/* ========================================================= */}
      {/* APPLICANT MANAGEMENT                                      */}
      {/* ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#08152d]">
        {/* Header */}
        <div className="border-b border-gray-200 px-5 py-5 dark:border-slate-700">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={18}
                  className="shrink-0 text-blue-600 dark:text-blue-400"
                />

                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Applicant Management
                </h2>
              </div>

              <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
                Search and organize applicants.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:bg-slate-800 dark:text-gray-300">
              Free Trial
            </span>
          </div>
        </div>

        <div className="p-5">
          {/* Search */}
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Search Applicants
            </label>

            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search applicants..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="mt-4">
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Status
            </label>

            <div className="relative">
              <Filter
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-9 pr-8 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-gray-200"
              >
                <option value="all">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview_scheduled">Interview</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Apply Filters */}
            <button
              type="button"
              onClick={onApplyFilters}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Filter size={15} />
              Apply Filters
            </button>
          </div>

          {/* Sort */}
          <div className="mt-5 border-t border-gray-100 pt-5 dark:border-slate-700">
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Sort
            </label>

            <div className="relative">
              <ArrowUpDown
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-9 pr-8 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-gray-200"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name_asc">Name A–Z</option>
                <option value="name_desc">Name Z–A</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* Locked features */}
          <div className="mt-5 border-t border-gray-100 pt-5 dark:border-slate-700">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-gray-400" />

                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Advanced Filters
                  </p>
                </div>

                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Unlock advanced applicant filtering with Basic.
                </p>
              </div>

              <button
                type="button"
                onClick={onUpgrade}
                className="shrink-0 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
              >
                Upgrade
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <LockedFilter label="Experience" />
              <LockedFilter label="Qualification" />
              <LockedFilter label="Salary Range" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PRO TEASER                                                */}
      {/* ========================================================= */}

      <div className="relative overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:border-purple-500/20 dark:from-purple-500/10 dark:to-blue-500/10">
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              <Sparkles size={19} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Unlock Pro Intelligence
                </h3>

                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                  Pro
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-300">
                Find stronger candidates with AI-powered matching and
                recommendations.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-purple-500" />
              Candidate matching
            </div>

            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-purple-500" />
              Match scores
            </div>

            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-purple-500" />
              AI recommendations
            </div>
          </div>

          <button
            type="button"
            onClick={onUpgrade}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Unlock Pro
            <Sparkles size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* LOCKED FILTER */
/* -------------------------------- */

function LockedFilter({ label }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/30">
      <div className="flex items-center gap-2.5">
        <Lock size={14} className="text-gray-400" />

        <span className="text-sm text-gray-400 dark:text-gray-500">
          {label}
        </span>
      </div>

      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        Basic
      </span>
    </div>
  );
}
