import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  GraduationCap,
  MapPin,
  Phone,
  IndianRupee,
  Users,
  Mail,
  Sparkles,
} from "lucide-react";

import API from "../../../../api/axios";

import FreeTrial from "./subscriptionView/FreeTrial";
import Basic from "./subscriptionView/Basic";
import Pro from "./subscriptionView/Pro";

export default function ApplicantsTable() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // Applied filters — these control the actual table
  const [statusFilter, setStatusFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [qualificationFilter, setQualificationFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");

  // Pending filters — these control the dropdown selections
  const [pendingStatusFilter, setPendingStatusFilter] = useState("all");
  const [pendingExperienceFilter, setPendingExperienceFilter] = useState("all");
  const [pendingQualificationFilter, setPendingQualificationFilter] =
    useState("all");
  const [pendingSalaryFilter, setPendingSalaryFilter] = useState("all");

  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/applications/applications/${jobId}`);

        const data = response.data;

        const fetchedApplications = data?.applications || [];

        setApplications(fetchedApplications);
        setJob(data?.job || null);
        setJobDetails(data?.jobDetails || null);
        setPlan(data?.plan || null);
      } catch (err) {
        console.error("Failed to fetch applicants:", err);

        setError(err.response?.data?.message || "Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = (salary) => {
    if (salary === null || salary === undefined || salary === "") {
      return "Not disclosed";
    }

    return `₹${Number(salary).toLocaleString("en-IN")}/month`;
  };
  const getEmploymentType = () => {
    return jobDetails?.employmentType || job?.employmentType || "Not specified";
  };

  const getDepartment = () => {
    return jobDetails?.department || "Not specified";
  };

  const getRoleCategory = () => {
    return jobDetails?.roleCategory || "Not specified";
  };

  const getSkills = () => {
    if (Array.isArray(jobDetails?.skills)) {
      return jobDetails.skills;
    }

    return [];
  };

  const getApplicationQuestionCount = () => {
    if (Array.isArray(jobDetails?.applicationQuestions)) {
      return jobDetails.applicationQuestions.length;
    }

    return 0;
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

      case "under_review":
        return "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

      case "shortlisted":
        return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";

      case "interview_scheduled":
        return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";

      case "selected":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";

      case "rejected":
        return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";

      case "withdrawn":
        return "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400";

      default:
        return "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleApplyFilters = () => {
    setStatusFilter(pendingStatusFilter);
    setExperienceFilter(pendingExperienceFilter);
    setQualificationFilter(pendingQualificationFilter);
    setSalaryFilter(pendingSalaryFilter);
  };

  const filteredApplications = applications
    .filter((application) => {
      const applicant = application?.applicant || {};

      // Search
      if (search.trim()) {
        const searchTerm = search.toLowerCase();

        const matchesSearch =
          applicant.name?.toLowerCase().includes(searchTerm) ||
          applicant.email?.toLowerCase().includes(searchTerm) ||
          applicant.phone?.toLowerCase().includes(searchTerm) ||
          applicant.district?.toLowerCase().includes(searchTerm) ||
          applicant.highestQualification?.toLowerCase().includes(searchTerm);

        if (!matchesSearch) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "all" && application.status !== statusFilter) {
        return false;
      }

      // Experience
      if (experienceFilter !== "all") {
        const experience = Number(applicant?.experienceYears || 0);

        if (experienceFilter === "fresher" && experience !== 0) {
          return false;
        }

        if (experienceFilter === "1_2" && (experience < 1 || experience > 2)) {
          return false;
        }

        if (experienceFilter === "3_5" && (experience < 3 || experience > 5)) {
          return false;
        }

        if (experienceFilter === "5_plus" && experience < 5) {
          return false;
        }
      }

      // Qualification
      if (qualificationFilter !== "all") {
        const qualification = (
          applicant.highestQualification || ""
        ).toLowerCase();

        if (
          qualificationFilter === "ug" &&
          !/(b\.?a|b\.?sc|b\.?com|b\.?e|b\.?tech|bachelor)/i.test(qualification)
        ) {
          return false;
        }

        if (
          qualificationFilter === "pg" &&
          !/(m\.?a|m\.?sc|m\.?com|m\.?e|m\.?tech|master|mba|mca)/i.test(
            qualification,
          )
        ) {
          return false;
        }

        if (
          qualificationFilter === "professional" &&
          !/(phd|doctor|bed|med|ded|professional)/i.test(qualification)
        ) {
          return false;
        }
      }

      // Expected salary
      if (salaryFilter !== "all") {
        const salary = Number(applicant?.expectedSalary || 0);

        if (salaryFilter === "under_20k" && salary >= 20000) {
          return false;
        }

        if (salaryFilter === "20_30k" && (salary < 20000 || salary > 30000)) {
          return false;
        }

        if (salaryFilter === "30_40k" && (salary < 30000 || salary > 40000)) {
          return false;
        }

        if (salaryFilter === "40_50k" && (salary < 40000 || salary > 50000)) {
          return false;
        }

        if (salaryFilter === "50k_plus" && salary < 50000) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const applicantA = a?.applicant || {};
      const applicantB = b?.applicant || {};

      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);

        case "name_asc":
          return (applicantA.name || "").localeCompare(applicantB.name || "");

        case "name_desc":
          return (applicantB.name || "").localeCompare(applicantA.name || "");

        case "experience_high":
          return (
            Number(applicantB.experienceYears || 0) -
            Number(applicantA.experienceYears || 0)
          );

        case "experience_low":
          return (
            Number(applicantA.experienceYears || 0) -
            Number(applicantB.experienceYears || 0)
          );

        case "current_salary_high":
          return (
            Number(applicantB.currentSalary || 0) -
            Number(applicantA.currentSalary || 0)
          );

        case "current_salary_low":
          return (
            Number(applicantA.currentSalary || 0) -
            Number(applicantB.currentSalary || 0)
          );

        case "expected_salary_high":
          return (
            Number(applicantB.expectedSalary || 0) -
            Number(applicantA.expectedSalary || 0)
          );

        case "expected_salary_low":
          return (
            Number(applicantA.expectedSalary || 0) -
            Number(applicantB.expectedSalary || 0)
          );

        case "match_high":
          return (
            Number(applicantB.matchScore || 0) -
            Number(applicantA.matchScore || 0)
          );

        case "match_low":
          return (
            Number(applicantA.matchScore || 0) -
            Number(applicantB.matchScore || 0)
          );

        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const getApplicantType = (application) => {
    const applicant = application?.applicant;

    if (!applicant) {
      return "limited";
    }

    // Pro applicants contain matchScore.
    if (Object.prototype.hasOwnProperty.call(applicant, "matchScore")) {
      return "pro";
    }

    // Basic contains email and the complete applicant profile.
    if (
      applicant.email !== undefined ||
      applicant.highestQualification !== undefined
    ) {
      return "basic";
    }

    return "trial";
  };

  const handleUpgrade = () => {
    navigate("/recruiter/plans");
  };

  const handleViewApplicant = (application) => {
    navigate(`/recruiter/applicants/${jobId}/${application._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#020817] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500 animate-spin" />

          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading applicants...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-[#020817] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ========================================================= */}
        {/* HEADER                                                    */}
        {/* ========================================================= */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Users size={22} />
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Applicants
                  </h1>

                  {job && (
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{job.title}</span>

                      {job.subject && (
                        <>
                          <span>•</span>
                          <span>{job.subject}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Applicant count */}
            <div className="rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm dark:border-slate-700 dark:bg-[#08152d]">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Applicants
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {applications.length}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN DESKTOP LAYOUT                                       */}
        {/* ========================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          {/* ======================================================= */}
          {/* LEFT SIDE                                                */}
          {/* JOB OVERVIEW + APPLICANT TABLE                          */}
          {/* ======================================================= */}

          <div className="min-w-0">
            {/* ----------------------------------------------------- */}
            {/* JOB OVERVIEW                                          */}
            {/* ----------------------------------------------------- */}

            {job && (
              <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#08152d]">
                {/* Job overview header */}
                <div className="border-b border-gray-200 px-6 py-5 dark:border-slate-700">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Job Overview
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                        {job.title || "Untitled Position"}
                      </h2>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                        {job.subject && <span>{job.subject}</span>}

                        {job.district && (
                          <>
                            <span>•</span>
                            <span>{job.district}</span>
                          </>
                        )}

                        {job.createdAt && (
                          <>
                            <span>•</span>
                            <span>Posted {formatDate(job.createdAt)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {plan?.name && (
                      <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold capitalize text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                        {plan.name.replace("_", " ")} Plan
                      </span>
                    )}
                  </div>
                </div>

                {/* Job summary */}
                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                  {/* Experience */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Experience
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                      <BriefcaseBusiness
                        size={16}
                        className="shrink-0 text-gray-400"
                      />

                      {job.experienceRequired || "Not specified"}
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Salary
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                      <IndianRupee
                        size={16}
                        className="shrink-0 text-gray-400"
                      />

                      {job.salaryRange || "Not disclosed"}
                    </div>
                  </div>

                  {/* Qualification */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Qualification
                    </p>

                    <div className="mt-2 flex items-start gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                      <GraduationCap
                        size={16}
                        className="mt-0.5 shrink-0 text-gray-400"
                      />

                      <span className="line-clamp-2">
                        {job.qualification || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Employment Type */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Employment Type
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                      <BriefcaseBusiness
                        size={16}
                        className="shrink-0 text-gray-400"
                      />

                      {getEmploymentType()}
                    </div>
                  </div>

                  {/* Department */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Department
                    </p>

                    <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                      {getDepartment()}
                    </p>
                  </div>

                  {/* Role Category */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Role Category
                    </p>

                    <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                      {getRoleCategory()}
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 sm:col-span-2 dark:border-slate-700 dark:bg-slate-900/40">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Required Skills
                    </p>

                    {getSkills().length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {getSkills().map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        No specific skills listed
                      </p>
                    )}
                  </div>

                  {/* Application Questions */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Application Questions
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {getApplicationQuestionCount()}
                      </span>

                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getApplicationQuestionCount() === 1
                          ? "question"
                          : "questions"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job purpose */}
                {jobDetails?.jobPurpose && (
                  <div className="border-t border-gray-200 px-6 py-5 dark:border-slate-700">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Job Purpose
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {jobDetails.jobPurpose}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------- */}
            {/* ERROR                                                  */}
            {/* ----------------------------------------------------- */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900/40 dark:bg-red-900/20">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* ----------------------------------------------------- */}
            {/* EMPTY STATE                                            */}
            {/* ----------------------------------------------------- */}

            {!error && applications.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-[#08152d]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Users size={25} />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
                  No applicants yet
                </h2>

                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Applicants for this job will appear here once candidates
                  submit their applications.
                </p>
              </div>
            )}

            {/* ----------------------------------------------------- */}
            {/* APPLICANTS                                             */}
            {/* ----------------------------------------------------- */}

            {!error && applications.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#08152d]">
                {/* Table header */}
                <div className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Applicants
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {filteredApplications.length === applications.length
                        ? `${applications.length} applicant${
                            applications.length === 1 ? "" : "s"
                          }`
                        : `Showing ${filteredApplications.length} of ${applications.length} applicants`}
                    </p>
                  </div>
                </div>

                {/* ================================================= */}
                {/* DESKTOP TABLE                                    */}
                {/* ================================================= */}

                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-900/50">
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Applicant
                        </th>

                        <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Experience
                        </th>

                        <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Salary
                        </th>

                        <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Status
                        </th>

                        <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Applied
                        </th>

                        <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                      {filteredApplications.map((application) => {
                        const applicant = application?.applicant || {};
                        const applicantType = getApplicantType(application);

                        return (
                          <tr
                            key={application._id}
                            className="transition hover:bg-gray-50 dark:hover:bg-slate-900/40"
                          >
                            {/* Applicant */}
                            <td className="px-4 py-5">
                              <div className="flex min-w-0 items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                  {(applicant.name || "A")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-gray-900 dark:text-white">
                                    {applicant.name || "Applicant"}
                                  </p>

                                  {applicant.district && (
                                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                      <MapPin size={12} />
                                      {applicant.district}
                                    </p>
                                  )}

                                  {applicant.highestQualification && (
                                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                      <GraduationCap size={12} />
                                      <span className="line-clamp-1">
                                        {applicant.highestQualification}
                                      </span>
                                    </p>
                                  )}

                                  {applicant.email && (
                                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                                      {applicant.email}
                                    </p>
                                  )}

                                  {applicantType === "pro" && (
                                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-1 text-[10px] font-semibold text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                                      <Sparkles size={10} />
                                      Pro
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Experience */}
                            <td className="px-3 py-5">
                              <div className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                <BriefcaseBusiness
                                  size={15}
                                  className="shrink-0 text-gray-400"
                                />
                                {applicant.experienceYears ?? 0}{" "}
                                {applicant.experienceYears === 1
                                  ? "year"
                                  : "years"}
                              </div>
                            </td>

                            {/* Salary */}
                            <td className="px-3 py-5">
                              <div className="space-y-1 text-sm">
                                <p className="flex items-center gap-1 whitespace-nowrap text-gray-700 dark:text-gray-200">
                                  <IndianRupee size={13} />

                                  {applicant.currentSalary != null
                                    ? `₹${Number(
                                        applicant.currentSalary,
                                      ).toLocaleString("en-IN")}/month`
                                    : "Not disclosed"}
                                </p>

                                <p className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                                  Expected:{" "}
                                  {applicant.expectedSalary != null
                                    ? `₹${Number(
                                        applicant.expectedSalary,
                                      ).toLocaleString("en-IN")}/month`
                                    : "Not disclosed"}
                                </p>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-3 py-5">
                              <span
                                className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyles(
                                  application.status,
                                )}`}
                              >
                                {formatStatus(application.status)}
                              </span>
                            </td>

                            {/* Applied */}
                            <td className="px-3 py-5">
                              <div className="flex items-center gap-1.5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                <CalendarDays
                                  size={14}
                                  className="text-gray-400"
                                />

                                {formatDate(application.createdAt)}
                              </div>
                            </td>

                            {/* Action */}
                            <td className="px-4 py-5 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/recruiter/applicants/${jobId}/${application._id}`,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                              >
                                View
                                <ChevronRight size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ================================================= */}
                {/* MOBILE / TABLET CARDS                            */}
                {/* ================================================= */}

                <div className="divide-y divide-gray-200 dark:divide-slate-700 lg:hidden">
                  {filteredApplications.map((application) => {
                    const applicant = application?.applicant || {};

                    return (
                      <div key={application._id} className="p-5 sm:p-6">
                        {/* Applicant header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                              {(applicant.name || "A").charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate font-semibold text-gray-900 dark:text-white">
                                {applicant.name || "Applicant"}
                              </h3>

                              {applicant.email && (
                                <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                                  {applicant.email}
                                </p>
                              )}
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                              application.status,
                            )}`}
                          >
                            {formatStatus(application.status)}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* Location */}
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Location
                            </p>

                            <p className="mt-1 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                              <MapPin size={15} />
                              {applicant.district || "Not specified"}
                            </p>
                          </div>

                          {/* Qualification */}
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Qualification
                            </p>

                            <p className="mt-1 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                              <GraduationCap size={15} />
                              {applicant.highestQualification ||
                                "Not specified"}
                            </p>
                          </div>

                          {/* Experience */}
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Experience
                            </p>

                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                              {applicant.experienceYears ?? 0}{" "}
                              {applicant.experienceYears === 1
                                ? "year"
                                : "years"}
                            </p>
                          </div>

                          {/* Current Salary */}
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Current Salary
                            </p>

                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                              {formatSalary(applicant.currentSalary)}
                            </p>
                          </div>

                          {/* Expected Salary */}
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Expected Salary
                            </p>

                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                              {formatSalary(applicant.expectedSalary)}
                            </p>
                          </div>

                          {/* Applied */}
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Applied
                            </p>

                            <p className="mt-1 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                              <CalendarDays size={15} />
                              {formatDate(application.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Pro score */}
                        {applicant.matchScore != null && (
                          <div className="mt-5 rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-500/20 dark:bg-purple-500/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Sparkles
                                  size={17}
                                  className="text-purple-600 dark:text-purple-400"
                                />

                                <span className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                                  Match Score
                                </span>
                              </div>

                              <span className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                {applicant.matchScore}%
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Action */}
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/recruiter/applicants/${jobId}/${application._id}`,
                            )
                          }
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                          View Applicant
                          <ChevronRight size={17} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* No results after filtering */}
                {filteredApplications.length === 0 &&
                  applications.length > 0 && (
                    <div className="px-6 py-12 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-500">
                        <Users size={22} />
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                        No matching applicants
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Try changing your search or filters.
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* RIGHT SIDE                                               */}
          {/* PLAN MANAGEMENT / INSIGHTS / AI                        */}
          {/* ======================================================= */}

          <div className="min-w-0 lg:sticky lg:top-6 lg:self-start">
            {/* Free Trial */}
            {plan?.name === "free_trial" && (
              <FreeTrial
                search={search}
                setSearch={setSearch}
                // Pending filter — applied only when Apply Filters is clicked
                statusFilter={pendingStatusFilter}
                setStatusFilter={setPendingStatusFilter}
                // Sorting remains immediate
                sortBy={sortBy}
                setSortBy={setSortBy}
                onApplyFilters={handleApplyFilters}
                onUpgrade={handleUpgrade}
              />
            )}

            {/* Basic */}
            {plan?.name === "basic" && (
              <Basic
                applications={applications}
                search={search}
                setSearch={setSearch}
                // Pending filters — Apply Filters controls when they reach the table
                statusFilter={pendingStatusFilter}
                setStatusFilter={setPendingStatusFilter}
                experienceFilter={pendingExperienceFilter}
                setExperienceFilter={setPendingExperienceFilter}
                qualificationFilter={pendingQualificationFilter}
                setQualificationFilter={setPendingQualificationFilter}
                salaryFilter={pendingSalaryFilter}
                setSalaryFilter={setPendingSalaryFilter}
                // Sorting remains immediate
                sortBy={sortBy}
                setSortBy={setSortBy}
                onApplyFilters={handleApplyFilters}
                onUpgrade={handleUpgrade}
              />
            )}

            {/* Pro */}
            {plan?.name === "pro" && (
              <Pro
                applications={applications}
                job={job}
                jobDetails={jobDetails}
                search={search}
                setSearch={setSearch}
                // Pending filters — Apply Filters controls when they reach the table
                statusFilter={pendingStatusFilter}
                setStatusFilter={setPendingStatusFilter}
                experienceFilter={pendingExperienceFilter}
                setExperienceFilter={setPendingExperienceFilter}
                qualificationFilter={pendingQualificationFilter}
                setQualificationFilter={setPendingQualificationFilter}
                salaryFilter={pendingSalaryFilter}
                setSalaryFilter={setPendingSalaryFilter}
                // Sorting remains immediate
                sortBy={sortBy}
                setSortBy={setSortBy}
                onApplyFilters={handleApplyFilters}
                onViewApplicant={handleViewApplicant}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
