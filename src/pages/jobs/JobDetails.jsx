import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import SimilarJobs from "./SimilarJobs";
import ApplyJob from "./components/ApplyJob";

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [details, setDetails] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);
  // const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/jobs/${jobId}`);

        setJob(response.data?.job || null);
        setDetails(response.data?.details || null);
        try {
          const applicationResponse = await API.get(
            `/applications/${jobId}/status`,
          );

          setHasApplied(applicationResponse.data?.applied || false);

          // setApplicationStatus(applicationResponse.data?.application || null);
        } catch (applicationError) {
          console.error(
            "Failed to fetch application status:",
            applicationError,
          );
        }
        try {
          const savedResponse = await API.get(`/saved-jobs/status/${jobId}`);
          setIsSaved(savedResponse.data?.saved || false);
        } catch (savedError) {
          console.error("Failed to fetch saved job status:", savedError);
        }
      } catch (err) {
        console.error("Failed to fetch job details:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load this job. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const handleSaveJob = async () => {
    try {
      setSavingJob(true);

      if (isSaved) {
        await API.delete(`/saved-jobs/${jobId}`);

        setIsSaved(false);
      } else {
        await API.post(`/saved-jobs/${jobId}`);

        setIsSaved(true);
      }
    } catch (err) {
      console.error("Failed to update saved job:", err);

      alert(err.response?.data?.message || "Unable to update saved job.");
    } finally {
      setSavingJob(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-6 w-24 rounded bg-gray-200 mb-8" />

          <div className="h-56 rounded-3xl bg-white border border-gray-200 mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 rounded-2xl bg-white border border-gray-200" />
              <div className="h-64 rounded-2xl bg-white border border-gray-200" />
              <div className="h-48 rounded-2xl bg-white border border-gray-200" />
            </div>

            <div className="h-72 rounded-2xl bg-white border border-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-md w-full">
          <div className="text-4xl mb-4">⚠️</div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Job not found
          </h2>

          <p className="text-gray-500 mb-6">
            {error ||
              "This job may have been removed or is no longer available."}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isExpired =
    job.status === "expired" ||
    (job.expiryDate && new Date(job.expiryDate) < new Date());

  const applicationQuestions = Array.isArray(details?.applicationQuestions)
    ? details.applicationQuestions
    : [];

  const duties = Array.isArray(details?.duties) ? details.duties : [];
  const keyDecisions = Array.isArray(details?.keyDecisions)
    ? details.keyDecisions
    : [];
  const majorChallenges = Array.isArray(details?.majorChallenges)
    ? details.majorChallenges
    : [];
  const skills = Array.isArray(details?.skills) ? details.skills : [];

  const education = details?.education || {};

  const ugQualifications = Array.isArray(education.ug) ? education.ug : [];

  const pgQualifications = Array.isArray(education.pg) ? education.pg : [];

  const professionalQualifications = Array.isArray(education.professional)
    ? education.professional
    : [];

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const companyName = job.instituteName || "Institution not specified";

  const salary = job.salaryRange || job.salary || "Salary not specified";

  const experience =
    job.experienceRequired || job.experience || "Experience not specified";

  const qualification = job.qualification || "Not specified";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header / Back */}
      <div className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
          >
            <span className="text-xl">←</span>
            Back to Jobs
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* =========================================================
          JOB HERO
      ========================================================== */}

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              {/* Left */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  {job.category && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                      {job.category}
                    </span>
                  )}

                  <span
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                      isExpired
                        ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                        : "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300"
                    }`}
                  >
                    {isExpired ? "Expired" : "Active"}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {job.title || "Untitled Position"}
                </h1>

                {job.positionLevel && (
                  <p className="mt-3 text-lg text-blue-600 dark:text-blue-400 font-semibold">
                    {job.positionLevel}
                  </p>
                )}

                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                  {companyName}
                </p>

                {/* Job summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  <div className="rounded-2xl bg-gray-50 dark:bg-slate-800 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Location
                    </p>

                    <p className="font-semibold text-gray-900 dark:text-white">
                      {job.district || "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 dark:bg-slate-800 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Salary
                    </p>

                    <p className="font-semibold text-gray-900 dark:text-white">
                      {salary}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 dark:bg-slate-800 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Experience
                    </p>

                    <p className="font-semibold text-gray-900 dark:text-white">
                      {experience}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 dark:bg-slate-800 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Qualification
                    </p>

                    <p className="font-semibold text-gray-900 dark:text-white">
                      {qualification}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
          MAIN CONTENT + APPLY SIDEBAR
      ========================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* =======================================================
            LEFT CONTENT
        ======================================================== */}

          <div className="lg:col-span-2 space-y-6">
            {/* Job Purpose */}
            {details?.jobPurpose && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  About the Job
                </h2>

                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Job Purpose
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-7 whitespace-pre-line">
                  {details.jobPurpose}
                </p>
              </section>
            )}

            {/* Responsibilities */}
            {duties.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                  Responsibilities
                </h2>

                <div className="space-y-4">
                  {duties.map((duty, index) => (
                    <div
                      key={index}
                      className="flex gap-3 text-gray-600 dark:text-gray-300 leading-7"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-500" />
                      <span>{duty}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Decisions */}
            {keyDecisions.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                  Key Decisions
                </h2>

                <div className="space-y-4">
                  {keyDecisions.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 text-gray-600 dark:text-gray-300 leading-7"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Major Challenges */}
            {majorChallenges.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                  Major Challenges
                </h2>

                <div className="space-y-4">
                  {majorChallenges.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 text-gray-600 dark:text-gray-300 leading-7"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                  Skills Required
                </h2>

                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Employment Details */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Employment Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoItem
                  label="Employment Type"
                  value={details?.employmentType}
                />

                <InfoItem label="Department" value={details?.department} />

                <InfoItem label="Role Category" value={details?.roleCategory} />

                <InfoItem label="Industry Type" value={details?.industryType} />
              </div>
            </section>

            {/* Education */}
            {(ugQualifications.length > 0 ||
              pgQualifications.length > 0 ||
              professionalQualifications.length > 0) && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Education
                </h2>

                <div className="space-y-7">
                  <EducationSection
                    title="UG Qualifications"
                    items={ugQualifications}
                  />

                  <EducationSection
                    title="PG Qualifications"
                    items={pgQualifications}
                  />

                  <EducationSection
                    title="Professional Qualifications"
                    items={professionalQualifications}
                  />
                </div>
              </section>
            )}

            {/* Additional Information */}
            {details?.additionalInformation && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                  Additional Information
                </h2>

                <p className="text-gray-600 dark:text-gray-300 leading-7 whitespace-pre-line">
                  {details.additionalInformation}
                </p>
              </section>
            )}

            {/* Application Requirements */}
            {applicationQuestions.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
                    ?
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Application Requirements
                    </h2>

                    <p className="mt-2 text-gray-600 dark:text-gray-300 leading-6">
                      This employer has included{" "}
                      <strong className="text-gray-900 dark:text-white">
                        {applicationQuestions.length} application{" "}
                        {applicationQuestions.length === 1
                          ? "question"
                          : "questions"}
                      </strong>{" "}
                      that you will need to answer while applying.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Similar Jobs */}
            <SimilarJobs jobId={jobId} />
          </div>

          {/* =======================================================
            RIGHT SIDEBAR
        ======================================================== */}

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-5">
              {/* Apply Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Ready to apply?
                </h2>

                <p className="mt-2 text-gray-600 dark:text-gray-300 leading-6">
                  Review the job details and submit your application when you're
                  ready.
                </p>

                {/* Application Action */}
                {hasApplied ? (
                  <div className="mt-6">
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-xl bg-green-100 dark:bg-green-950/40 px-6 py-4 text-green-700 dark:text-green-400 font-semibold text-lg cursor-not-allowed border border-green-200 dark:border-green-900"
                    >
                      ✓ Applied
                    </button>

                    <p className="mt-3 text-center text-sm text-green-600 dark:text-green-400">
                      You have already applied for this job.
                    </p>
                  </div>
                ) : isExpired ? (
                  <div className="mt-6">
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-xl bg-gray-100 dark:bg-slate-800 px-6 py-4 text-gray-500 dark:text-gray-400 font-semibold text-lg cursor-not-allowed"
                    >
                      Job Expired
                    </button>

                    <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
                      This job is no longer accepting applications.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(true)}
                    className="w-full mt-6 rounded-xl bg-blue-600 px-6 py-4 text-white font-semibold text-lg hover:bg-blue-700 transition shadow-sm"
                  >
                    Apply for this Job
                  </button>
                )}

                {/* Save / Notify Button */}
                <button
                  type="button"
                  onClick={handleSaveJob}
                  disabled={savingJob}
                  className={`w-full mt-3 rounded-xl border px-6 py-3 font-medium transition ${
                    isSaved
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-400"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {isExpired
                    ? "🔔 Notify Me"
                    : savingJob
                      ? "Saving..."
                      : isSaved
                        ? "♥ Saved Job"
                        : "♡ Save Job"}
                </button>
              </div>

              {/* Apply Job Modal */}
              {showApplyModal && (
                <ApplyJob
                  jobId={jobId}
                  onClose={() => setShowApplyModal(false)}
                  onApplied={() => {
                    setHasApplied(true);
                  }}
                />
              )}

              {/* Job Information */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
                  Job Information
                </h2>

                <div className="space-y-5">
                  <InfoItem label="Category" value={job.category} />

                  <InfoItem label="Position" value={job.positionLevel} />

                  <InfoItem label="Location" value={job.district} />

                  <InfoItem label="Posted" value={formatDate(job.createdAt)} />

                  <InfoItem
                    label="Application Deadline"
                    value={formatDate(job.expiryDate)}
                  />
                </div>
              </div>

              {/* Application Process */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Application Process
                </h2>

                <div className="space-y-4">
                  <ProcessStep number="1" text="Review your profile" />

                  <ProcessStep number="2" text="Answer employer questions" />

                  <ProcessStep number="3" text="Review your application" />

                  <ProcessStep number="4" text="Submit your application" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SMALL REUSABLE UI COMPONENTS
========================================================= */

function InfoItem({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>

      <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function EducationSection({ title, items }) {
  if (!items.length) {
    return null;
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 text-gray-600 dark:text-gray-300"
          >
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-500" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcessStep({ number, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
        {number}
      </div>

      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {text}
      </span>
    </div>
  );
}
