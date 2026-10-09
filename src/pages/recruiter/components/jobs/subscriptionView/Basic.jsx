import {
  ArrowUpDown,
  BarChart3,
  BriefcaseBusiness,
  ChevronDown,
  Filter,
  GraduationCap,
  IndianRupee,
  Lock,
  MapPin,
  Search,
  Sparkles,
  SlidersHorizontal,
  Users,
  Zap,
} from "lucide-react";

export default function Basic({
  applications = [],

  search = "",
  setSearch,

  statusFilter = "all",
  setStatusFilter,

  experienceFilter = "all",
  setExperienceFilter,

  qualificationFilter = "all",
  setQualificationFilter,

  salaryFilter = "all",
  setSalaryFilter,

  sortBy = "newest",
  setSortBy,

  onApplyFilters,
  onUpgrade,
}) {
  /* -------------------------------- */
  /* DERIVED INSIGHTS */
  /* -------------------------------- */

  const getApplicant = (application) => {
    return application?.applicant || {};
  };

  const districtCounts = applications.reduce((acc, application) => {
    const district =
      getApplicant(application)?.district?.trim() || "Not specified";

    acc[district] = (acc[district] || 0) + 1;

    return acc;
  }, {});

  const sortedDistricts = Object.entries(districtCounts).sort(
    (a, b) => b[1] - a[1],
  );

  const topDistrict = sortedDistricts[0]?.[0] || "No data";
  const topDistrictCount = sortedDistricts[0]?.[1] || 0;

  const districtCount = Object.keys(districtCounts).length;

  const qualifiedApplicants = applications.filter(
    (application) => getApplicant(application)?.highestQualification,
  ).length;

  const experiencedApplicants = applications.filter(
    (application) =>
      Number(getApplicant(application)?.experienceYears || 0) > 0,
  ).length;

  /* -------------------------------- */
  /* HANDLERS */
  /* -------------------------------- */

  const handleSearchChange = (event) => {
    setSearch?.(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusFilter?.(event.target.value);
  };

  const handleExperienceChange = (event) => {
    setExperienceFilter?.(event.target.value);
  };

  const handleQualificationChange = (event) => {
    setQualificationFilter?.(event.target.value);
  };

  const handleSalaryChange = (event) => {
    setSalaryFilter?.(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy?.(event.target.value);
  };

  /* -------------------------------- */
  /* RENDER */
  /* -------------------------------- */

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
                  className="text-blue-600 dark:text-blue-400"
                />

                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Applicant Management
                </h2>
              </div>

              <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
                Search, filter and organize applicants.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              Basic
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
                placeholder="Search name, email or district..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Status */}
            <FilterSelect
              label="Status"
              icon={<Filter size={15} />}
              value={statusFilter}
              onChange={handleStatusChange}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "applied", label: "Applied" },
                { value: "under_review", label: "Under Review" },
                { value: "shortlisted", label: "Shortlisted" },
                {
                  value: "interview_scheduled",
                  label: "Interview",
                },
                { value: "selected", label: "Selected" },
                { value: "rejected", label: "Rejected" },
                { value: "withdrawn", label: "Withdrawn" },
              ]}
            />

            {/* Experience */}
            <FilterSelect
              label="Experience"
              icon={<BriefcaseBusiness size={15} />}
              value={experienceFilter}
              onChange={handleExperienceChange}
              options={[
                { value: "all", label: "Any Experience" },
                { value: "fresher", label: "Fresher" },
                { value: "1_2", label: "1–2 years" },
                { value: "3_5", label: "3–5 years" },
                { value: "5_plus", label: "5+ years" },
              ]}
            />

            {/* Qualification */}
            <FilterSelect
              label="Qualification"
              icon={<GraduationCap size={15} />}
              value={qualificationFilter}
              onChange={handleQualificationChange}
              options={[
                { value: "all", label: "Any Qualification" },
                { value: "10th", label: "10th" },
                { value: "12th", label: "12th" },
                { value: "diploma", label: "Diploma" },
                { value: "ug", label: "Undergraduate" },
                { value: "pg", label: "Postgraduate" },
                { value: "other", label: "Other" },
              ]}
            />

            {/* Expected Salary */}
            <FilterSelect
              label="Expected Salary"
              icon={<IndianRupee size={15} />}
              value={salaryFilter}
              onChange={handleSalaryChange}
              options={[
                { value: "all", label: "Any Salary" },
                { value: "under_20k", label: "< ₹20K" },
                { value: "20_30k", label: "₹20K–30K" },
                { value: "30_40k", label: "₹30K–40K" },
                { value: "40_50k", label: "₹40K–50K" },
                { value: "50k_plus", label: "₹50K+" },
              ]}
            />
          </div>

          {/* Apply Filters */}
          <button
            type="button"
            onClick={onApplyFilters}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <Filter size={15} />
            Apply Filters
          </button>

          {/* Sort */}
          <div className="mt-5 border-t border-gray-100 pt-5 dark:border-slate-700">
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Sort Applicants
            </label>

            <div className="relative">
              <ArrowUpDown
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-gray-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-gray-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name_asc">Name A–Z</option>
                <option value="name_desc">Name Z–A</option>
                <option value="experience_high">Experience: High → Low</option>
                <option value="experience_low">Experience: Low → High</option>
                <option value="current_salary_high">
                  Current Salary: High → Low
                </option>
                <option value="current_salary_low">
                  Current Salary: Low → High
                </option>
                <option value="expected_salary_high">
                  Expected Salary: High → Low
                </option>
                <option value="expected_salary_low">
                  Expected Salary: Low → High
                </option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BASIC INSIGHTS                                            */}
      {/* ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#08152d]">
        {/* Header */}
        <div className="border-b border-gray-200 px-5 py-5 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <BarChart3 size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Applicant Insights
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                A quick overview of your applicant pool.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 p-5">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Applicants
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {applications.length}
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Applications
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Top District
            </p>

            <p className="mt-2 truncate text-lg font-bold text-gray-900 dark:text-white">
              {topDistrict}
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {topDistrictCount} applicant
              {topDistrictCount === 1 ? "" : "s"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              District Reach
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {districtCount}
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              District{districtCount === 1 ? "" : "s"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Experienced
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {experiencedApplicants.length}
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {applications.length
                ? Math.round(
                    (experiencedApplicants.length / applications.length) * 100,
                  )
                : 0}
              % of applicants
            </p>
          </div>
        </div>

        {/* District distribution */}
        <div className="border-t border-gray-200 px-5 py-5 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Applicant Distribution
              </h3>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Where applicants are applying from.
              </p>
            </div>

            <MapPin size={18} className="text-gray-400" />
          </div>

          <div className="mt-5 space-y-4">
            {sortedDistricts.slice(0, 4).map(([district, count]) => {
              const percentage = applications.length
                ? Math.round((count / applications.length) * 100)
                : 0;

              return (
                <div key={district}>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="truncate font-medium text-gray-700 dark:text-gray-300">
                      {district}
                    </span>

                    <span className="shrink-0 text-gray-500 dark:text-gray-400">
                      {count} · {percentage}%
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {sortedDistricts.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No district data available.
              </p>
            )}
          </div>
        </div>

        {/* Qualification note */}
        <div className="border-t border-gray-200 px-5 py-4 dark:border-slate-700">
          <div className="flex items-start gap-2.5">
            <Zap size={15} className="mt-0.5 shrink-0 text-blue-500" />

            <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
              {qualifiedApplicants.length} of {applications.length} applicant
              {applications.length === 1 ? "" : "s"} provided a qualification in
              their application.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PRO UPGRADE                                               */}
      {/* ========================================================= */}

      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-5 dark:border-purple-500/20 dark:from-purple-500/10 dark:to-blue-500/10">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
            <Sparkles size={18} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Go beyond Basic insights
              </h3>

              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                PRO
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-300">
              Use AI-powered matching, recommendations and candidate
              intelligence.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div>✦ Match Score</div>
          <div>✦ Recommendations</div>
          <div>✦ Match Breakdown</div>
          <div>✦ AI Insights</div>
        </div>

        <button
          type="button"
          onClick={onUpgrade}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700"
        >
          Unlock Pro
          <Sparkles size={15} />
        </button>
      </div>
    </div>
  );
}

/* ================================================== */
/* FILTER SELECT */
/* ================================================== */

function FilterSelect({ label, icon, value, onChange, options = [] }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>

        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-gray-200 dark:focus:border-blue-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}

/* ================================================== */
/* INSIGHT CARD */
/* ================================================== */

function InsightCard({ icon, label, value, description }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-2 truncate text-xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm dark:bg-slate-800 dark:text-gray-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* LOCKED PRO FEATURE */
/* ================================================== */

function LockedFeature({ label }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <Lock size={13} className="shrink-0 text-purple-400" />

      <span>{label}</span>
    </div>
  );
}
