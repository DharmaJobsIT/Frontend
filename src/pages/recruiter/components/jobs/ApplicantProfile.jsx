import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../../../../api/axios";

const ApplicantProfile = () => {
  const navigate = useNavigate();

  const { jobId, applicationId } = useParams();

  // ==========================================================
  // STATE
  // ==========================================================

  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [applicantProfile, setApplicantProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);

  // ==========================================================
  // FETCH PROFILE
  // ==========================================================

  const fetchApplicantProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/applications/detail/${applicationId}`
      );

      const data = response.data;

      setApplication(data.application || null);
      setJob(data.job || null);
      setApplicantProfile(
        data.applicantProfile || null
      );
    } catch (err) {
      console.error(
        "Failed to load applicant profile:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load applicant profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) {
      fetchApplicantProfile();
    }
  }, [applicationId]);

  // ==========================================================
  // PROFILE DATA
  // ==========================================================

  const profile = applicantProfile || {};

  const user = profile.user || {};

  const name =
    profile.fullName ||
    user.name ||
    application?.applicantSnapshot?.fullName ||
    "Applicant";

  const email =
    user.email ||
    application?.applicantSnapshot?.email ||
    "";

  const phone =
    profile.phone ||
    application?.applicantSnapshot?.phone ||
    "";

  const district =
    profile.district ||
    application?.applicantSnapshot?.district ||
    "";

  const highestQualification =
    profile.highestQualification ||
    application?.applicantSnapshot
      ?.highestQualification ||
    "";

  const experienceYears =
    profile.experienceYears ??
    application?.applicantSnapshot
      ?.experienceYears ??
    0;

  const currentSalary =
    profile.currentSalary ??
    application?.applicantSnapshot?.currentSalary ??
    null;

  const expectedSalary =
    profile.expectedSalary ??
    application?.applicantSnapshot?.expectedSalary ??
    null;

  const about =
    profile.about ||
    application?.applicantSnapshot?.about ||
    "";

  const skills =
    Array.isArray(profile.skills) &&
    profile.skills.length > 0
      ? profile.skills
      : application?.applicantSnapshot?.skills || [];

  const experience =
    Array.isArray(profile.experience) &&
    profile.experience.length > 0
      ? profile.experience
      : application?.applicantSnapshot?.experience ||
        [];

  const resumeUrl =
    profile.resumeUrl ||
    application?.applicantSnapshot?.resumeUrl ||
    "";

  const resumeFileName =
    profile.resumeFileName ||
    "Candidate Resume";

  // ==========================================================
  // FORMATTERS
  // ==========================================================

  const formatSalary = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Not provided";
    }

    const numericValue =
      typeof value === "number"
        ? value
        : Number(
            String(value).replace(/,/g, "")
          );

    if (Number.isNaN(numericValue)) {
      return String(value);
    }

    return `₹${numericValue.toLocaleString(
      "en-IN"
    )}/month`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getExperienceDuration = (item) => {
    if (!item?.startDate) {
      return "";
    }

    const start = new Date(item.startDate);

    const end = item.currentlyWorking
      ? new Date()
      : item.endDate
      ? new Date(item.endDate)
      : null;

    if (!end || Number.isNaN(start.getTime())) {
      return "";
    }

    const months = Math.max(
      0,
      (end.getFullYear() - start.getFullYear()) *
        12 +
        (end.getMonth() - start.getMonth())
    );

    if (months < 1) {
      return "Less than 1 month";
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0) {
      return `${years}y ${remainingMonths}m`;
    }

    if (years > 0) {
      return `${years} ${
        years === 1 ? "year" : "years"
      }`;
    }

    return `${remainingMonths} ${
      remainingMonths === 1
        ? "month"
        : "months"
    }`;
  };

  // ==========================================================
  // EXPERIENCE SUMMARY
  // ==========================================================

  const experienceSummary = useMemo(() => {
    if (!experience.length) {
      return "No professional experience provided.";
    }

    const currentRole = experience.find(
      (item) => item.currentlyWorking
    );

    if (currentRole) {
      return `${
        currentRole.designation ||
        "Professional"
      } at ${
        currentRole.organization ||
        "Current organization"
      }`;
    }

    return `${experience.length} ${
      experience.length === 1
        ? "professional experience"
        : "professional experiences"
    }`;
  }, [experience]);

  // ==========================================================
  // COPY PHONE
  // ==========================================================

  const handleCopyPhone = async () => {
    if (!phone) return;

    try {
      await navigator.clipboard.writeText(phone);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(
        "Failed to copy phone:",
        err
      );
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-[#09090b] dark:text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">

            <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-white/10" />

            <div className="h-56 rounded-2xl bg-white shadow-sm dark:bg-white/5" />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="h-[500px] rounded-2xl bg-white shadow-sm dark:bg-white/5 lg:col-span-2" />

              <div className="h-[500px] rounded-2xl bg-white shadow-sm dark:bg-white/5" />
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !applicantProfile) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-[#09090b] dark:text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">

          <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.03]">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
              <User size={26} />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Unable to load profile
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {error ||
                "Applicant profile could not be found."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/recruiter/applicants/${jobId}/${applicationId}`
                )
              }
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <ArrowLeft size={16} />
              Back to Application
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-[#09090b] dark:text-white">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ==================================================
            TOP NAVIGATION
        ================================================== */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/recruiter/applicants/${jobId}/${applicationId}`
              )
            }
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Application
          </button>

          {job?.title && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <BriefcaseBusiness size={15} />
              <span className="max-w-[280px] truncate">
                {job.title}
              </span>
            </div>
          )}

        </div>

        {/* ==================================================
            PROFILE HERO
        ================================================== */}

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

          {/* Top accent */}

          <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />

          <div className="p-6 sm:p-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              {/* Identity */}

              <div className="flex min-w-0 items-center gap-5">

                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-blue-600 ring-1 ring-blue-100 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 dark:text-blue-400 dark:ring-white/10">
                  <User size={34} />
                </div>

                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-3">

                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                      {name}
                    </h1>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <ShieldCheck size={13} />
                      Applicant Profile
                    </span>

                  </div>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {experienceSummary}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">

                    {district && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} />
                        {district}
                      </span>
                    )}

                    {highestQualification && (
                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap size={14} />
                        {highestQualification}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseBusiness size={14} />
                      {experienceYears}{" "}
                      {Number(experienceYears) === 1
                        ? "year"
                        : "years"}{" "}
                      experience
                    </span>

                  </div>

                </div>
              </div>

              {/* Contact actions */}

              <div className="flex flex-wrap gap-2">

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    <Mail size={16} />
                    Email
                  </a>
                )}

                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                  >
                    <Phone size={16} />
                    Call
                  </a>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* ==================================================
              MAIN PROFILE
          ================================================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* ==================================================
                PERSONAL INFORMATION
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <ProfileSectionHeader
                icon={
                  <User
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                }
                title="Personal Information"
                subtitle="Candidate's current profile information"
              />

              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">

                <ProfileInfo
                  icon={<User size={16} />}
                  label="Full Name"
                  value={name}
                />

                <ProfileInfo
                  icon={<Mail size={16} />}
                  label="Email Address"
                  value={email || "Not provided"}
                />

                <ProfileInfo
                  icon={<Phone size={16} />}
                  label="Mobile Number"
                  value={phone || "Not provided"}
                />

                <ProfileInfo
                  icon={<MapPin size={16} />}
                  label="District"
                  value={district || "Not provided"}
                />

              </div>
            </section>

            {/* ==================================================
                PROFESSIONAL INFORMATION
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <ProfileSectionHeader
                icon={
                  <BriefcaseBusiness
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                }
                title="Professional Information"
                subtitle="Career and compensation details"
              />

              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">

                <ProfileInfo
                  icon={<GraduationCap size={16} />}
                  label="Highest Qualification"
                  value={
                    highestQualification ||
                    "Not provided"
                  }
                />

                <ProfileInfo
                  icon={<BriefcaseBusiness size={16} />}
                  label="Total Experience"
                  value={`${experienceYears} ${
                    Number(experienceYears) === 1
                      ? "year"
                      : "years"
                  }`}
                />

                <ProfileInfo
                  icon={<IndianRupee size={16} />}
                  label="Current Salary"
                  value={formatSalary(currentSalary)}
                />

                <ProfileInfo
                  icon={<IndianRupee size={16} />}
                  label="Expected Salary"
                  value={formatSalary(expectedSalary)}
                />

              </div>
            </section>

            {/* ==================================================
                ABOUT
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <ProfileSectionHeader
                title="About"
                subtitle="Professional summary"
              />

              <div className="p-5 sm:p-6">

                {about ? (
                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700 dark:text-gray-300">
                    {about}
                  </p>
                ) : (
                  <EmptyState text="No professional summary has been provided." />
                )}

              </div>
            </section>

            {/* ==================================================
                WORK EXPERIENCE
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <ProfileSectionHeader
                icon={
                  <BriefcaseBusiness
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                }
                title="Work Experience"
                subtitle="Professional career history"
              />

              <div className="p-5 sm:p-6">

                {experience.length > 0 ? (
                  <div className="space-y-7">

                    {experience.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="relative pl-8"
                        >

                          {/* Timeline line */}

                          {index !==
                            experience.length - 1 && (
                            <div className="absolute left-[8px] top-8 h-[calc(100%+12px)] w-px bg-gray-200 dark:bg-white/10" />
                          )}

                          {/* Timeline dot */}

                          <div className="absolute left-0 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-50 ring-4 ring-white dark:bg-blue-500/20 dark:ring-[#09090b]">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                          </div>

                          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/10">

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                              <div>

                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {item.designation ||
                                    "Position not specified"}
                                </h3>

                                <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                                  {item.organization ||
                                    "Organization not specified"}
                                </p>

                              </div>

                              {getExperienceDuration(
                                item
                              ) && (
                                <span className="w-fit rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                                  {getExperienceDuration(
                                    item
                                  )}
                                </span>
                              )}

                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-500">

                              <CalendarDays
                                size={13}
                              />

                              <span>
                                {item.startDate
                                  ? formatDate(
                                      item.startDate
                                    )
                                  : "Start date unavailable"}
                              </span>

                              <span>—</span>

                              {item.currentlyWorking ? (
                                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                  Present
                                </span>
                              ) : item.endDate ? (
                                <span>
                                  {formatDate(
                                    item.endDate
                                  )}
                                </span>
                              ) : (
                                <span>
                                  End date unavailable
                                </span>
                              )}

                            </div>

                          </div>
                        </div>
                      )
                    )}

                  </div>
                ) : (
                  <EmptyState text="No work experience has been provided." />
                )}

              </div>
            </section>

            {/* ==================================================
                SKILLS
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <ProfileSectionHeader
                title="Skills"
                subtitle="Skills listed in the candidate's profile"
              />

              <div className="p-5 sm:p-6">

                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">

                    {skills.map(
                      (skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>
                ) : (
                  <EmptyState text="No skills have been added to the profile." />
                )}

              </div>
            </section>

          </div>

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <div className="space-y-6">

            {/* ==================================================
                CONTACT
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <ProfileSectionHeader
                title="Contact"
                subtitle="Candidate contact information"
              />

              <div className="space-y-3 p-5">

                {/* Email */}

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Mail size={18} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-gray-900 dark:text-white">
                        {email || "Not provided"}
                      </p>

                    </div>

                  </div>

                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Send Email
                      <ExternalLink size={12} />
                    </a>
                  )}

                </div>

                {/* Phone */}

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <Phone size={18} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Mobile
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                        {phone || "Not provided"}
                      </p>

                    </div>

                    {phone && (
                      <button
                        type="button"
                        onClick={handleCopyPhone}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white"
                        title={
                          copied
                            ? "Copied"
                            : "Copy number"
                        }
                      >
                        {copied ? (
                          <CheckCircle2
                            size={16}
                            className="text-emerald-500"
                          />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    )}

                  </div>

                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Call Applicant
                      <ExternalLink size={12} />
                    </a>
                  )}

                </div>

              </div>
            </section>

            {/* ==================================================
                RESUME
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <ProfileSectionHeader
                icon={
                  <FileText
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                }
                title="Resume"
              />

              <div className="p-5">

                {resumeUrl ? (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
                        <FileText size={18} />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {resumeFileName}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          Candidate resume
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">

                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                      >
                        <ExternalLink size={14} />
                        View
                      </a>

                      <a
                        href={resumeUrl}
                        download
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                      >
                        <Download size={14} />
                        Download
                      </a>

                    </div>

                  </div>
                ) : (
                  <EmptyState text="No resume has been provided." />
                )}

              </div>
            </section>

            {/* ==================================================
                CURRENT APPLICATION
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <ProfileSectionHeader
                icon={
                  <BriefcaseBusiness
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                }
                title="Current Application"
              />

              <div className="space-y-4 p-5">

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Applied Position
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {job?.title || "—"}
                  </p>

                </div>

                {job?.subject && (
                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Subject
                    </p>

                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {job.subject}
                    </p>

                  </div>
                )}

                {job?.district && (
                  <div className="flex items-start gap-2">

                    <MapPin
                      size={15}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {job.district}
                    </span>

                  </div>
                )}

                {application?.createdAt && (
                  <div className="flex items-start gap-2">

                    <CalendarDays
                      size={15}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Applied{" "}
                      {formatDate(
                        application.createdAt
                      )}
                    </span>

                  </div>
                )}

              </div>
            </section>

            {/* ==================================================
                BACK TO APPLICATION
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/recruiter/applicants/${jobId}/${applicationId}`
                )
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/10 dark:shadow-none"
            >
              <ArrowLeft size={16} />
              Back to Application
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================
// PROFILE SECTION HEADER
// ==========================================================

const ProfileSectionHeader = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <div className="border-b border-gray-200 px-5 py-4 dark:border-white/10 sm:px-6">

      <div className="flex items-center gap-2">

        {icon}

        <h2 className="font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>

      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}

    </div>
  );
};

// ==========================================================
// PROFILE INFO
// ==========================================================

const ProfileInfo = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/10">

      <div className="flex items-center gap-2 text-gray-500">

        {icon}

        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>

      </div>

      <p className="mt-2 break-words text-sm font-medium text-gray-900 dark:text-white">
        {value}
      </p>

    </div>
  );
};

// ==========================================================
// EMPTY STATE
// ==========================================================

const EmptyState = ({ text }) => {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center dark:border-white/10 dark:bg-black/10">

      <p className="text-sm text-gray-500 dark:text-gray-500">
        {text}
      </p>

    </div>
  );
};

export default ApplicantProfile;