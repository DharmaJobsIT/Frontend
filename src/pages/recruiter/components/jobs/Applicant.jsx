import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  ExternalLink,
  FileText,
  GraduationCap,
  IndianRupee,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../../../../api/axios";

const Applicant = () => {
  const navigate = useNavigate();
  const { jobId, applicationId } = useParams();

  // ==========================================================
  // STATE
  // ==========================================================

  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [applicantProfile, setApplicantProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // ==========================================================
  // FETCH APPLICATION
  // ==========================================================

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/applications/detail/${applicationId}`
      );

      const data = response.data;

      setApplication(data.application || null);
      setJob(data.job || null);
      setApplicantProfile(data.applicantProfile || null);
    } catch (err) {
      console.error("Failed to load application:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load applicant details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  // ==========================================================
  // DATA
  // ==========================================================

  const snapshot = application?.applicantSnapshot || {};

  const applicantName =
    snapshot.fullName ||
    applicantProfile?.fullName ||
    applicantProfile?.user?.name ||
    "Applicant";

  const email =
    snapshot.email ||
    applicantProfile?.user?.email ||
    "";

  const phone =
    snapshot.phone ||
    applicantProfile?.phone ||
    "";

  const district =
    snapshot.district ||
    applicantProfile?.district ||
    "";

  const highestQualification =
    snapshot.highestQualification ||
    applicantProfile?.highestQualification ||
    "";

  const experienceYears =
    snapshot.experienceYears ??
    applicantProfile?.experienceYears ??
    0;

  const currentSalary =
    snapshot.currentSalary ??
    applicantProfile?.currentSalary ??
    null;

  const expectedSalary =
    snapshot.expectedSalary ??
    applicantProfile?.expectedSalary ??
    null;

  const skills =
    Array.isArray(snapshot.skills) && snapshot.skills.length
      ? snapshot.skills
      : applicantProfile?.skills || [];

  const experience =
    Array.isArray(snapshot.experience) && snapshot.experience.length
      ? snapshot.experience
      : applicantProfile?.experience || [];

  const resumeUrl =
    snapshot.resumeUrl ||
    applicantProfile?.resumeUrl ||
    "";

  const applicationQuestions =
    application?.applicationQuestions || [];

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
        : Number(String(value).replace(/,/g, ""));

    if (Number.isNaN(numericValue)) {
      return String(value);
    }

    return `₹${numericValue.toLocaleString("en-IN")}/month`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAnswer = (answer) => {
    if (
      answer === null ||
      answer === undefined ||
      answer === ""
    ) {
      return "No answer provided";
    }

    if (Array.isArray(answer)) {
      return answer.join(", ");
    }

    return String(answer);
  };

  // ==========================================================
  // STATUS
  // ==========================================================

  const statusConfig = {
    applied: {
      label: "Applied",
      className:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
    },

    under_review: {
      label: "Under Review",
      className:
        "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-400",
    },

    shortlisted: {
      label: "Shortlisted",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    },

    interview_scheduled: {
      label: "Interview Scheduled",
      className:
        "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400",
    },

    selected: {
      label: "Selected",
      className:
        "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400",
    },

    rejected: {
      label: "Rejected",
      className:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
    },

    withdrawn: {
      label: "Withdrawn",
      className:
        "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-500/20 dark:bg-gray-500/10 dark:text-gray-400",
    },
  };

  const currentStatus =
    statusConfig[application?.status] ||
    statusConfig.applied;

  // ==========================================================
  // TIMELINE
  // ==========================================================

  const timeline = useMemo(() => {
    if (!application) return [];

    const activity = application.recruiterActivity || {};

    return [
      {
        label: "Application submitted",
        date: application.createdAt,
        completed: Boolean(application.createdAt),
        icon: FileText,
      },

      {
        label:
          application.status === "shortlisted"
            ? "Shortlisted"
            : application.status === "rejected"
            ? "Rejected"
            : "Application reviewed",

        date:
          application.status === "shortlisted" ||
          application.status === "rejected"
            ? application.updatedAt
            : activity.viewedAt,

        completed:
          Boolean(activity.viewedAt) ||
          application.status !== "applied",

        icon:
          application.status === "rejected"
            ? X
            : Check,
      },

      {
        label: "Proceed",
        date: activity.proceededAt,
        completed: Boolean(activity.proceededAt),
        icon: ChevronRight,
      },

      {
        label: "Contacted",
        date: activity.lastContactedAt,
        completed: Boolean(activity.lastContactedAt),
        icon: Phone,
      },
    ];
  }, [application]);

  // ==========================================================
  // PROCEED
  // ==========================================================

  const handleProceed = async () => {
    if (!applicationId || actionLoading) return;

    try {
      setActionLoading(true);

      const response = await API.patch(
        `/applications/${applicationId}/proceed`,
        {}
      );

      if (response.data?.application) {
        setApplication(response.data.application);
      } else {
        await fetchApplication();
      }
    } catch (err) {
      console.error("Failed to proceed:", err);

      alert(
        err?.response?.data?.message ||
          "Unable to proceed with this application."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================================
  // REJECT
  // ==========================================================

  const handleReject = async () => {
    if (!applicationId || actionLoading) return;

    try {
      setActionLoading(true);

      const response = await API.patch(
        `/applications/${applicationId}/status`,
        {
          status: "rejected",
        }
      );

      if (response.data?.application) {
        setApplication(response.data.application);
      } else {
        await fetchApplication();
      }

      setShowRejectModal(false);
    } catch (err) {
      console.error("Failed to reject:", err);

      alert(
        err?.response?.data?.message ||
          "Unable to reject this application."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================================
  // EMAIL
  // ==========================================================

  const handleEmail = async () => {
    if (!email) {
      alert("Applicant email address is not available.");
      return;
    }

    try {
      await API.patch(
        `/applications/${applicationId}/contact`,
        {
          method: "email",
        }
      );

      setApplication((prev) => ({
        ...prev,

        recruiterActivity: {
          ...(prev?.recruiterActivity || {}),

          lastContactedAt:
            new Date().toISOString(),

          contactHistory: [
            ...(prev?.recruiterActivity
              ?.contactHistory || []),

            {
              method: "email",
              initiatedAt:
                new Date().toISOString(),
            },
          ],
        },
      }));
    } catch (err) {
      console.error(
        "Failed to record email contact:",
        err
      );
    }

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1&to=` +
      encodeURIComponent(email);

    window.open(
      gmailUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================================
  // PHONE
  // ==========================================================

  const handlePhone = async () => {
    if (!phone) {
      alert("Applicant phone number is not available.");
      return;
    }

    try {
      await API.patch(
        `/applications/${applicationId}/contact`,
        {
          method: "mobile",
        }
      );

      setApplication((prev) => ({
        ...prev,

        recruiterActivity: {
          ...(prev?.recruiterActivity || {}),

          lastContactedAt:
            new Date().toISOString(),

          contactHistory: [
            ...(prev?.recruiterActivity
              ?.contactHistory || []),

            {
              method: "mobile",
              initiatedAt:
                new Date().toISOString(),
            },
          ],
        },
      }));
    } catch (err) {
      console.error(
        "Failed to record mobile contact:",
        err
      );
    }

    window.location.href = `tel:${phone}`;
  };

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

            <div className="h-40 rounded-2xl bg-white shadow-sm dark:bg-white/5" />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="h-80 rounded-2xl bg-white shadow-sm dark:bg-white/5 lg:col-span-2" />

              <div className="h-80 rounded-2xl bg-white shadow-sm dark:bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-[#09090b] dark:text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
              <X size={26} />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Unable to load applicant
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {error || "Application not found."}
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <ArrowLeft size={16} />
              Go Back
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
            BACK NAVIGATION
        ================================================== */}

        <div className="mb-6">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/recruiter/jobs/${jobId}/applicants`
              )
            }
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Applicants
          </button>
        </div>

        {/* ==================================================
            APPLICANT HEADER
        ================================================== */}

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

              {/* Candidate */}

              <div className="flex min-w-0 items-start gap-4">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 text-blue-600 ring-1 ring-blue-100 dark:from-blue-500/20 dark:to-purple-500/20 dark:text-blue-400 dark:ring-white/10">
                  <User size={28} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">

                    <h1 className="truncate text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                      {applicantName}
                    </h1>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${currentStatus.className}`}
                    >
                      {currentStatus.label}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">

                    {email && (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail size={14} />
                        {email}
                      </span>
                    )}

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
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/recruiter/applicants/${jobId}/${applicationId}/profile`
                      )
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    <User size={15} />
                    View Profile
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              {/* Actions */}

              <div className="flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={handleProceed}
                  disabled={
                    actionLoading ||
                    Boolean(
                      application?.recruiterActivity
                        ?.proceededAt
                    ) ||
                    application?.status === "rejected"
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Check size={16} />

                  {application?.recruiterActivity
                    ?.proceededAt
                    ? "Proceeded"
                    : "Proceed"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowRejectModal(true)
                  }
                  disabled={
                    actionLoading ||
                    application?.status === "rejected"
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                >
                  <X size={16} />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            MAIN GRID
        ================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* ==================================================
              LEFT / MAIN
          ================================================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* ==================================================
                APPLICATION DETAILS
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <div className="border-b border-gray-200 px-5 py-4 dark:border-white/10 sm:px-6">
                <div className="flex items-center gap-2">
                  <FileText
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />

                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Application Details
                  </h2>
                </div>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Information submitted by the candidate for
                  this application
                </p>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">

                <InfoCard
                  icon={<User size={16} />}
                  label="Full Name"
                  value={applicantName}
                />

                <InfoCard
                  icon={<Mail size={16} />}
                  label="Email"
                  value={email || "Not provided"}
                />

                <InfoCard
                  icon={<Phone size={16} />}
                  label="Mobile"
                  value={phone || "Not provided"}
                />

                <InfoCard
                  icon={<MapPin size={16} />}
                  label="District"
                  value={district || "Not provided"}
                />

                <InfoCard
                  icon={<GraduationCap size={16} />}
                  label="Highest Qualification"
                  value={
                    highestQualification ||
                    "Not provided"
                  }
                />

                <InfoCard
                  icon={<BriefcaseBusiness size={16} />}
                  label="Experience"
                  value={`${experienceYears} ${
                    Number(experienceYears) === 1
                      ? "year"
                      : "years"
                  }`}
                />

                <InfoCard
                  icon={<IndianRupee size={16} />}
                  label="Current Salary"
                  value={formatSalary(currentSalary)}
                />

                <InfoCard
                  icon={<IndianRupee size={16} />}
                  label="Expected Salary"
                  value={formatSalary(expectedSalary)}
                />

              </div>
            </section>

            {/* ==================================================
                ABOUT
            ================================================== */}

            {(snapshot.about ||
              applicantProfile?.about) && (
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

                <SectionHeader title="About the Applicant" />

                <div className="p-5 sm:p-6">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700 dark:text-gray-300">
                    {snapshot.about ||
                      applicantProfile?.about}
                  </p>
                </div>
              </section>
            )}

            {/* ==================================================
                WORK EXPERIENCE
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <SectionHeader
                icon={
                  <BriefcaseBusiness
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                }
                title="Work Experience"
              />

              <div className="p-5 sm:p-6">

                {experience.length > 0 ? (
                  <div className="space-y-6">

                    {experience.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="relative border-l border-gray-200 pl-5 dark:border-white/10"
                        >
                          <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-[#09090b]" />

                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {item.designation ||
                              "Position not specified"}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {item.organization ||
                              "Organization not specified"}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-500">

                            {item.startDate && (
                              <span>
                                {formatDate(
                                  item.startDate
                                )}
                              </span>
                            )}

                            {item.startDate &&
                              item.endDate && (
                                <span>—</span>
                              )}

                            {item.endDate ? (
                              <span>
                                {formatDate(
                                  item.endDate
                                )}
                              </span>
                            ) : item.currentlyWorking ? (
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                Present
                              </span>
                            ) : null}
                          </div>
                        </div>
                      )
                    )}

                  </div>
                ) : (
                  <EmptyState text="No work experience provided." />
                )}

              </div>
            </section>

            {/* ==================================================
                SKILLS
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <SectionHeader title="Skills" />

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
                  <EmptyState text="No skills provided." />
                )}

              </div>
            </section>

            {/* ==================================================
                RESUME
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <SectionHeader
                icon={
                  <FileText
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                }
                title="Resume"
              />

              <div className="p-5 sm:p-6">

                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    <ExternalLink size={16} />
                    View Resume
                  </a>
                ) : (
                  <EmptyState text="No resume was provided." />
                )}

              </div>
            </section>

            {/* ==================================================
                APPLICATION QUESTIONS
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <SectionHeader
                icon={
                  <MessageSquare
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                }
                title="Application Questions"
                subtitle="Answers submitted by the candidate"
              />

              <div className="divide-y divide-gray-200 dark:divide-white/10">

                {applicationQuestions.length > 0 ? (
                  applicationQuestions.map(
                    (question, index) => (
                      <div
                        key={
                          question.questionId ||
                          index
                        }
                        className="p-5 sm:p-6"
                      >
                        <p className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                          {index + 1}.{" "}
                          {question.question}
                        </p>

                        <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-300">
                            {formatAnswer(
                              question.answer
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="p-6">
                    <EmptyState text="No application questions were asked for this job." />
                  </div>
                )}

              </div>
            </section>
          </div>

          {/* ==================================================
              RIGHT SIDEBAR
          ================================================== */}

          <div className="space-y-6">

            {/* ==================================================
                CONTACT APPLICANT
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <SectionHeader
                title="Contact Applicant"
                subtitle="Contact the candidate directly"
              />

              <div className="space-y-3 p-5">

                {/* Email */}

                <button
                  type="button"
                  onClick={handleEmail}
                  disabled={!email}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-left transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <span className="flex min-w-0 items-center gap-3">

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Mail size={17} />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-gray-900 dark:text-white">
                        Email
                      </span>

                      <span className="block max-w-[190px] truncate text-xs text-gray-500 dark:text-gray-500">
                        {email || "Not available"}
                      </span>
                    </span>
                  </span>

                  <ExternalLink
                    size={15}
                    className="shrink-0 text-gray-400"
                  />
                </button>

                {/* Phone */}

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={handlePhone}
                    disabled={!phone}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-left transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <Phone size={17} />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-gray-900 dark:text-white">
                        Phone
                      </span>

                      <span className="block truncate text-xs text-gray-500">
                        {phone || "Not available"}
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    disabled={!phone}
                    title={
                      copied
                        ? "Copied"
                        : "Copy phone number"
                    }
                    className="flex h-[67px] w-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    {copied ? (
                      <Check
                        size={17}
                        className="text-emerald-500"
                      />
                    ) : (
                      <Copy size={17} />
                    )}
                  </button>
                </div>

                {/* Message */}

                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-left opacity-50 dark:border-white/10 dark:bg-white/5"
                >
                  <span className="flex items-center gap-3">

                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                      <MessageSquare size={17} />
                    </span>

                    <span>
                      <span className="block text-sm font-medium text-gray-900 dark:text-white">
                        Message
                      </span>

                      <span className="block text-xs text-gray-500">
                        Coming soon
                      </span>
                    </span>
                  </span>

                  <ShieldCheck
                    size={15}
                    className="text-gray-400"
                  />
                </button>
              </div>
            </section>

            {/* ==================================================
                APPLICATION TIMELINE
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <SectionHeader
                icon={
                  <Clock3
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                }
                title="Application Timeline"
              />

              <div className="p-5">

                <div className="space-y-0">

                  {timeline.map(
                    (item, index) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className="relative flex gap-3 pb-6 last:pb-0"
                        >
                          {index !==
                            timeline.length - 1 && (
                            <div
                              className={`absolute left-[11px] top-7 h-[calc(100%-14px)] w-px ${
                                item.completed
                                  ? "bg-blue-200 dark:bg-blue-500/40"
                                  : "bg-gray-200 dark:bg-white/10"
                              }`}
                            />
                          )}

                          <div
                            className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                              item.completed
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                                : "bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-600"
                            }`}
                          >
                            <Icon size={13} />
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                item.completed
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-400 dark:text-gray-600"
                              }`}
                            >
                              {item.label}
                            </p>

                            {item.date && (
                              <p className="mt-1 text-xs text-gray-500">
                                {formatDateTime(
                                  item.date
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}

                </div>
              </div>
            </section>

            {/* ==================================================
                APPLIED FOR
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

              <SectionHeader
                icon={
                  <BriefcaseBusiness
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                }
                title="Applied For"
              />

              <div className="space-y-4 p-5">

                <div>
                  <p className="text-xs text-gray-500">
                    Position
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {job?.title || "—"}
                  </p>
                </div>

                {job?.subject && (
                  <div>
                    <p className="text-xs text-gray-500">
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

                {job?.qualification && (
                  <div className="flex items-start gap-2">
                    <GraduationCap
                      size={15}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {job.qualification}
                    </span>
                  </div>
                )}

                {job?.experienceRequired && (
                  <div className="flex items-start gap-2">
                    <BriefcaseBusiness
                      size={15}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {job.experienceRequired}
                    </span>
                  </div>
                )}

                {job?.createdAt && (
                  <div className="flex items-start gap-2">
                    <CalendarDays
                      size={15}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Posted{" "}
                      {formatDate(job.createdAt)}
                    </span>
                  </div>
                )}

              </div>
            </section>

            {/* ==================================================
                ACTIVITY
            ================================================== */}

            {application?.recruiterActivity
              ?.lastContactedAt && (
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">

                <p className="text-xs text-gray-500">
                  Last contacted
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {formatDateTime(
                    application.recruiterActivity
                      .lastContactedAt
                  )}
                </p>
              </section>
            )}

          </div>
        </div>
      </div>

      {/* ======================================================
          REJECT MODAL
      ====================================================== */}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm dark:bg-black/70">

          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#111113]">

            <div className="flex items-start justify-between gap-4">

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reject Application?
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  Are you sure you want to reject{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {applicantName}
                  </span>
                  's application?
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowRejectModal(false)
                }
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <X size={18} />
              </button>

            </div>

            <div className="mt-6 flex justify-end gap-2">

              <button
                type="button"
                onClick={() =>
                  setShowRejectModal(false)
                }
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={actionLoading}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {actionLoading
                  ? "Rejecting..."
                  : "Reject Application"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================================
// INFO CARD
// ==========================================================

const InfoCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-colors dark:border-white/10 dark:bg-black/10">

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
// SECTION HEADER
// ==========================================================

const SectionHeader = ({
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
// EMPTY STATE
// ==========================================================

const EmptyState = ({ text }) => {
  return (
    <p className="text-sm text-gray-500 dark:text-gray-500">
      {text}
    </p>
  );
};

export default Applicant;