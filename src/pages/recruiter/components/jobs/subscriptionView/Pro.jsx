import {
  ArrowUpDown,
  BarChart3,
  BriefcaseBusiness,
  Bot,
  ChevronDown,
  Filter,
  GraduationCap,
  IndianRupee,
  MapPin,
  MessageCircle,
  Minimize2,
  Search,
  Send,
  Sparkles,
  SlidersHorizontal,
  TrendingUp,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";

import { useMemo, useState } from "react";

export default function Pro({
  applications = [],

  job = null,
  jobDetails = null,

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
  onViewApplicant,
}) {
  const [isAiOpen, setIsAiOpen] = useState(false);

  const [aiMessage, setAiMessage] = useState("");

  const [aiMessages, setAiMessages] = useState([
    {
      role: "assistant",
      text: `I’m your AI recruiter assistant for ${
        job?.title || "this position"
      }. I can help you understand the applicant pool, identify strong matches and review candidate fit.`,
    },
  ]);

  /* ================================================== */
  /* PRO ANALYTICS */
  /* ================================================== */

  const applicantsWithScore = useMemo(() => {
    return applications
      .filter(
        (application) =>
          application?.applicant?.matchScore !== null &&
          application?.applicant?.matchScore !== undefined,
      )
      .map((application) => ({
        ...application,
        score: Number(application?.applicant?.matchScore || 0),
      }))
      .sort((a, b) => b.score - a.score);
  }, [applications]);

  const topCandidate = applicantsWithScore[0] || null;

  const averageMatchScore =
    applicantsWithScore.length > 0
      ? Math.round(
          applicantsWithScore.reduce(
            (total, application) => total + application.score,
            0,
          ) / applicantsWithScore.length,
        )
      : 0;

  const strongMatches = applicantsWithScore.filter(
    (application) => application.score >= 80,
  ).length;

  const goodMatches = applicantsWithScore.filter(
    (application) => application.score >= 60,
  ).length;

  /* ================================================== */
  /* AI SUMMARY */
  /* ================================================== */

  const jobSkills = Array.isArray(jobDetails?.skills) ? jobDetails.skills : [];

  const jobPurpose = jobDetails?.jobPurpose || "";

  /* ================================================== */
  /* HANDLERS */
  /* ================================================== */

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

  const handleSendAiMessage = (event) => {
    event?.preventDefault();

    const trimmedMessage = aiMessage.trim();

    if (!trimmedMessage) return;

    setAiMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: trimmedMessage,
      },
      {
        role: "assistant",
        text: "AI analysis will be connected here. Once the Pro AI service is enabled, I’ll analyze this job and its applicants to provide a contextual answer.",
      },
    ]);

    setAiMessage("");
  };

  /* ================================================== */
  /* RENDER */
  /* ================================================== */

  return (
    <>
      <div className="space-y-4">
        {/* ======================================================= */}
        {/* APPLICANT MANAGEMENT                                    */}
        {/* ======================================================= */}

        <div className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm dark:border-purple-500/20 dark:bg-[#08152d]">
          {/* Header */}
          <div className="border-b border-purple-100 px-5 py-5 dark:border-purple-500/10">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <SlidersHorizontal
                    size={18}
                    className="text-purple-600 dark:text-purple-400"
                  />

                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Applicant Management
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-1 text-[10px] font-bold uppercase text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                    <Sparkles size={10} />
                    Pro
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Advanced filters and candidate intelligence.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                Pro
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
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-purple-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                />
              </div>
            </div>

            {/* Filters */}
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
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
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
                  className="w-full appearance-none rounded-xl border border-purple-200 bg-purple-50 py-3 pl-10 pr-10 text-sm font-medium text-purple-800 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name_asc">Name A–Z</option>
                  <option value="name_desc">Name Z–A</option>
                  <option value="experience_high">
                    Experience: High → Low
                  </option>
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
                  <option value="match_high">✨ Match Score: High → Low</option>
                  <option value="match_low">✨ Match Score: Low → High</option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* AI CANDIDATE INTELLIGENCE                               */}
        {/* ======================================================= */}

        <div className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm dark:border-purple-500/20 dark:bg-[#08152d]">
          <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50 px-5 py-5 dark:border-purple-500/10 dark:from-purple-500/10 dark:to-blue-500/10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                  <Sparkles size={19} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    AI Candidate Intelligence
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Understand candidate fit at a glance.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiOpen(true)}
                className="rounded-lg bg-purple-600 p-2.5 text-white hover:bg-purple-700"
                title="Ask AI"
              >
                <Sparkles size={15} />
              </button>
            </div>
          </div>

          {/* 2 × 2 metrics */}
          <div className="grid grid-cols-2 gap-3 p-5">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Applicants
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {applications.length}
              </p>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Total
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Avg Match
              </p>

              <p className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
                {applicantsWithScore.length ? `${averageMatchScore}%` : "—"}
              </p>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {applicantsWithScore.length
                  ? `${applicantsWithScore.length} scored`
                  : "No scores"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Top Match
              </p>

              <p className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
                {topCandidate?.score != null ? `${topCandidate.score}%` : "—"}
              </p>

              <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                {topCandidate?.applicant?.name || "No scored candidate"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Strong Matches
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {strongMatches}
              </p>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {goodMatches} at 60%+
              </p>
            </div>
          </div>

          {/* AI summary */}
          <div className="border-t border-purple-100 px-5 py-4 dark:border-purple-500/10">
            <div className="flex items-start gap-2.5">
              <Bot size={16} className="mt-0.5 shrink-0 text-purple-500" />

              <p className="text-xs leading-5 text-gray-600 dark:text-gray-300">
                {applicantsWithScore.length > 0
                  ? `${strongMatches} ${
                      strongMatches === 1 ? "candidate is" : "candidates are"
                    } currently showing a strong match of 80% or higher.`
                  : "Match scores will appear here when candidate matching data is available."}
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* TOP AI MATCHES                                          */}
        {/* ======================================================= */}

        {applicantsWithScore.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#08152d]">
            <div className="border-b border-gray-200 px-5 py-4 dark:border-slate-700">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy size={17} className="text-purple-500" />

                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Top AI Matches
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Strongest candidates for this job.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAiOpen(true)}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400"
                >
                  Ask AI
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {applicantsWithScore.slice(0, 5).map((application, index) => {
                const applicant = application?.applicant || {};

                return (
                  <div key={application?._id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-xs font-bold text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                        #{index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {applicant.name || "Applicant"}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                          {applicant.district || "Location not specified"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {application.score}%
                        </p>

                        {onViewApplicant && (
                          <button
                            type="button"
                            onClick={() => onViewApplicant(application)}
                            className="mt-1 text-[11px] font-semibold text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* JOB AI CONTEXT                                          */}
        {/* ======================================================= */}

        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-500/20 dark:bg-blue-500/5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Bot size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                Job AI Context
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-800/80 dark:text-blue-300/70">
                {jobPurpose ||
                  "AI evaluates candidates against the requirements of this position."}
              </p>

              {jobSkills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {jobSkills.slice(0, 6).map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-blue-700 shadow-sm dark:bg-slate-900 dark:text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* FLOATING AI BUTTON                                      */}
      {/* ======================================================= */}

      {!isAiOpen && (
        <button
          type="button"
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 sm:bottom-8 sm:right-8"
        >
          <Sparkles size={17} />

          <span className="hidden sm:inline">AI Recruiter</span>

          <span className="sm:hidden">AI</span>
        </button>
      )}

      {/* ======================================================= */}
      {/* AI ASSISTANT                                            */}
      {/* ======================================================= */}

      {isAiOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-[420px] overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-2xl dark:border-purple-500/20 dark:bg-[#08152d]">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Sparkles size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold">AI Recruiter</p>

                  <p className="truncate text-xs text-white/75">
                    {job?.title || "Current position"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsAiOpen(false)}
                  className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
                  aria-label="Minimize AI assistant"
                >
                  <Minimize2 size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsAiOpen(false)}
                  className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
                  aria-label="Close AI assistant"
                >
                  <X size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* Context */}
          <div className="border-b border-gray-100 bg-purple-50/60 px-4 py-3 dark:border-slate-700 dark:bg-purple-500/5">
            <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300">
              <Bot size={14} />

              <span>
                Analyzing {applications.length} applicant
                {applications.length === 1 ? "" : "s"} for this job
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="max-h-[320px] space-y-3 overflow-y-auto p-4">
            {aiMessages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "ml-8 rounded-xl bg-purple-600 px-3 py-2.5 text-xs text-white"
                    : "mr-6 rounded-xl bg-gray-100 px-3 py-2.5 text-xs leading-5 text-gray-700 dark:bg-slate-800 dark:text-gray-300"
                }
              >
                {message.text}
              </div>
            ))}
          </div>

          {/* Quick prompts */}
          <div className="border-t border-gray-100 px-4 py-3 dark:border-slate-700">
            <div className="flex flex-wrap gap-2">
              {[
                "Who are my top candidates?",
                "Show strong matches",
                "Summarize applicants",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setAiMessage(prompt);

                    setAiMessages((previous) => [
                      ...previous,
                      {
                        role: "user",
                        text: prompt,
                      },
                      {
                        role: "assistant",
                        text: "AI analysis will be connected here. Once the Pro AI service is enabled, I’ll analyze this job and its applicants to provide a contextual answer.",
                      },
                    ]);
                  }}
                  className="rounded-full border border-purple-200 px-3 py-1.5 text-[11px] font-medium text-purple-700 dark:border-purple-500/20 dark:text-purple-400"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendAiMessage}
            className="border-t border-gray-100 p-3 dark:border-slate-700"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiMessage}
                onChange={(event) => setAiMessage(event.target.value)}
                placeholder="Ask about your applicants..."
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-900 outline-none focus:border-purple-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <button
                type="submit"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white hover:bg-purple-700"
              >
                <Send size={15} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
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
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-gray-200 dark:focus:border-purple-500"
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
/* PRO METRIC */
/* ================================================== */

function ProMetric({ icon, label, value, description }) {
  return (
    <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-500/10 dark:bg-purple-500/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-purple-500 shadow-sm dark:bg-slate-800 dark:text-purple-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
