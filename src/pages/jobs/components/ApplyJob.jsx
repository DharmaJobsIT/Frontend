import { useEffect, useState } from "react";
import API from "../../../api/axios";
import likeAnimation from "../../../assets/like.png";

export default function ApplyJob({ jobId, onClose }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [job, setJob] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [step, setStep] = useState(1);

  const [applicant, setApplicant] = useState({
    fullName: "",
    phone: "",
    email: "",
    district: "",
    highestQualification: "",
    experienceYears: 0,
    experience: [],
    currentSalary: "",
    expectedSalary: "",
    about: "",
    skills: [],
    resumeUrl: "",
    resumeFileName: "",
  });

  const [answers, setAnswers] = useState({});

  // ------------------------------------------------------------
  // FETCH APPLICATION FORM
  // ------------------------------------------------------------

  useEffect(() => {
    const fetchApplyForm = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/applications/${jobId}/apply-form`);

        const data = response.data;

        setJob(data.job);

        setQuestions(data.jobDetails?.applicationQuestions || []);

        const profile = data.jobSeeker || {};

        setApplicant({
          fullName: profile.fullName || "",
          phone: profile.phone || "",
          email: profile.email || "",
          district: profile.district || "",
          highestQualification: profile.highestQualification || "",
          experienceYears: profile.experienceYears ?? 0,
          experience: profile.experience || [],
          currentSalary: profile.currentSalary ?? "",
          expectedSalary: profile.expectedSalary || "",
          about: profile.about || "",
          skills: profile.skills || [],
          resumeUrl: profile.resumeUrl || "",
          resumeFileName: profile.resumeFileName || "",
        });
      } catch (err) {
        console.error("Failed to load application form:", err);

        setError(
          err.response?.data?.message || "Failed to load application form.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplyForm();
    }
  }, [jobId]);

  // ------------------------------------------------------------
  // INPUT HANDLER
  // ------------------------------------------------------------

  const updateApplicant = (field, value) => {
    setApplicant((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ------------------------------------------------------------
  // QUESTION ANSWER
  // ------------------------------------------------------------

  const updateAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // ------------------------------------------------------------
  // STEP 1 VALIDATION
  // ------------------------------------------------------------

  const validateApplicantDetails = () => {
    if (!applicant.fullName.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (!applicant.phone.trim()) {
      setError("Please enter your mobile number.");
      return false;
    }

    if (!applicant.email.trim()) {
      setError("Please enter your email address.");
      return false;
    }

    if (!applicant.district.trim()) {
      setError("Please enter your current district/location.");
      return false;
    }

    if (!applicant.highestQualification.trim()) {
      setError("Please enter your highest qualification.");
      return false;
    }

    setError("");
    return true;
  };

  // ------------------------------------------------------------
  // QUESTION VALIDATION
  // ------------------------------------------------------------

  const validateQuestions = () => {
    for (const question of questions) {
      if (!question.required) {
        continue;
      }

      const answer = answers[question._id];

      if (
        answer === undefined ||
        answer === null ||
        answer === "" ||
        (Array.isArray(answer) && answer.length === 0)
      ) {
        setError(`Please answer: ${question.question}`);

        return false;
      }
    }

    setError("");
    return true;
  };

  // ------------------------------------------------------------
  // PROCEED FROM STEP 1
  // ------------------------------------------------------------

  const handleProceedFromDetails = () => {
    if (!validateApplicantDetails()) {
      return;
    }

    if (questions.length > 0) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  // ------------------------------------------------------------
  // PROCEED FROM QUESTIONS
  // ------------------------------------------------------------

  const handleProceedFromQuestions = () => {
    if (!validateQuestions()) {
      return;
    }

    setStep(3);
  };

  // ------------------------------------------------------------
  // SUBMIT APPLICATION
  // ------------------------------------------------------------

  const handleSubmitApplication = async () => {
    try {
      setSubmitting(true);
      setError("");

      const applicationQuestions = questions.map((question) => ({
        questionId: question._id,
        question: question.question,
        type: question.type,
        options: question.options || [],
        required: question.required || false,
        answer:
          answers[question._id] ??
          (question.type === "multiple_choice" ? [] : ""),
      }));

      const payload = {
        applicantSnapshot: {
          fullName: applicant.fullName.trim(),
          phone: applicant.phone.trim(),
          email: applicant.email.trim(),
          district: applicant.district.trim(),
          highestQualification: applicant.highestQualification.trim(),

          experienceYears: Number(applicant.experienceYears) || 0,

          experience: applicant.experience || [],

          currentSalary:
            applicant.currentSalary === ""
              ? null
              : Number(applicant.currentSalary),

          expectedSalary: applicant.expectedSalary.trim(),

          about: applicant.about.trim(),

          skills: applicant.skills || [],

          // Resume intentionally optional
          resumeUrl: applicant.resumeUrl || "",
        },

        applicationQuestions,
      };

      await API.post(`/applications/${jobId}`, payload);

      setShowSuccess(true);
    } catch (err) {
      console.error("Failed to submit application:", err);

      setError(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------------------------------------
  // LOADING
  // ------------------------------------------------------------

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-8 shadow-2xl">
          <div className="animate-pulse space-y-5">
            <div className="h-8 w-1/2 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // ERROR
  // ------------------------------------------------------------

  if (error && !job) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900 p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Unable to Apply
          </h2>

          <p className="mt-3 text-red-600 dark:text-red-400">{error}</p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col items-center px-6 py-10 text-center sm:px-10">
            {/* Success Animation */}
            <div className="mb-5 flex h-32 w-32 items-center justify-center">
              <img
                src={likeAnimation}
                alt="Application submitted successfully"
                className="h-full w-full object-contain"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Application Submitted!
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600 dark:text-gray-400">
              Your application has been successfully submitted. The recruiter
              can now review your application.
            </p>

            <button
              type="button"
              onClick={() => {
                setShowSuccess(false);
                onClose?.();
              }}
              className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // MAIN MODAL
  // ------------------------------------------------------------

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Apply for this Job
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {job?.title || "Job Application"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition text-xl"
          >
            ×
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 sm:px-8 py-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <StepIndicator
              number="1"
              label="Your Details"
              active={step === 1}
              completed={step > 1}
            />

            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />

            <StepIndicator
              number="2"
              label="Questions"
              active={step === 2}
              completed={step > 2}
              hidden={questions.length === 0}
            />

            {questions.length > 0 && (
              <>
                <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />

                <StepIndicator
                  number="3"
                  label="Review"
                  active={step === 3}
                  completed={false}
                />
              </>
            )}

            {questions.length === 0 && (
              <>
                <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />

                <StepIndicator
                  number="2"
                  label="Review"
                  active={step === 3}
                  completed={false}
                />
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {/* =====================================================
              STEP 1
          ====================================================== */}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Your Details
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  We have pre-filled these details from your DharmaJobs profile.
                  Please review them before proceeding.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  label="Full Name"
                  required
                  value={applicant.fullName}
                  onChange={(value) => updateApplicant("fullName", value)}
                />

                <FormField
                  label="Mobile Number"
                  required
                  value={applicant.phone}
                  onChange={(value) => updateApplicant("phone", value)}
                />

                <FormField
                  label="Email"
                  required
                  type="email"
                  value={applicant.email}
                  onChange={(value) => updateApplicant("email", value)}
                />

                <FormField
                  label="Current District / Location"
                  required
                  value={applicant.district}
                  onChange={(value) => updateApplicant("district", value)}
                />

                <FormField
                  label="Highest Qualification"
                  required
                  value={applicant.highestQualification}
                  onChange={(value) =>
                    updateApplicant("highestQualification", value)
                  }
                />

                <FormField
                  label="Years of Experience"
                  type="number"
                  min="0"
                  value={applicant.experienceYears}
                  onChange={(value) =>
                    updateApplicant("experienceYears", value)
                  }
                />

                <FormField
                  label="Current Salary (per month)"
                  type="number"
                  min="0"
                  value={applicant.currentSalary}
                  onChange={(value) => updateApplicant("currentSalary", value)}
                />

                <FormField
                  label="Expected Salary (per month)"
                  type="number"
                  min="0"
                  value={applicant.expectedSalary}
                  onChange={(value) => updateApplicant("expectedSalary", value)}
                />
              </div>

              {/* Experience */}
              {applicant.experience?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Previous Experience
                  </h4>

                  <div className="space-y-3">
                    {applicant.experience.map((experience, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-4"
                      >
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {experience.designation ||
                            "Designation not specified"}
                        </p>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {experience.organization ||
                            "Organization not specified"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {applicant.skills?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Skills
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume */}
              <div className="rounded-xl border border-gray-200 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Resume
                    </h4>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Optional for now.
                    </p>
                  </div>

                  {applicant.resumeFileName ? (
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {applicant.resumeFileName}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Not uploaded
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =====================================================
              STEP 2
          ====================================================== */}

          {step === 2 && questions.length > 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Employer Questions
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Please answer the questions provided by the employer.
                </p>
              </div>

              {questions.map((question, index) => (
                <QuestionField
                  key={question._id || index}
                  question={question}
                  value={answers[question._id]}
                  onChange={(value) => updateAnswer(question._id, value)}
                />
              ))}
            </div>
          )}

          {/* =====================================================
              STEP 3
          ====================================================== */}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Review Application
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Please review your application before submitting it.
                </p>
              </div>

              {/* Candidate */}
              <ReviewSection title="Candidate Details">
                <ReviewItem label="Name" value={applicant.fullName} />

                <ReviewItem label="Phone" value={applicant.phone} />

                <ReviewItem label="Email" value={applicant.email} />

                <ReviewItem label="Location" value={applicant.district} />

                <ReviewItem
                  label="Qualification"
                  value={applicant.highestQualification}
                />

                <ReviewItem
                  label="Experience"
                  value={`${applicant.experienceYears || 0} years`}
                />

                <ReviewItem
                  label="Current Salary"
                  value={
                    applicant.currentSalary
                      ? String(applicant.currentSalary)
                      : "Not provided"
                  }
                />

                <ReviewItem
                  label="Expected Salary"
                  value={applicant.expectedSalary || "Not provided"}
                />

                <ReviewItem
                  label="Resume"
                  value={applicant.resumeFileName || "Not provided"}
                />
              </ReviewSection>

              {/* Questions */}
              {questions.length > 0 && (
                <ReviewSection title="Employer Questions">
                  {questions.map((question, index) => {
                    const answer = answers[question._id];

                    let displayAnswer = answer;

                    if (Array.isArray(displayAnswer)) {
                      displayAnswer = displayAnswer.join(", ");
                    }

                    if (displayAnswer === undefined || displayAnswer === "") {
                      displayAnswer = "Not answered";
                    }

                    return (
                      <div
                        key={question._id || index}
                        className="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-0 last:pb-0"
                      >
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Question {index + 1}
                        </p>

                        <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                          {question.question}
                        </p>

                        <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {String(displayAnswer)}
                        </p>
                      </div>
                    );
                  })}
                </ReviewSection>
              )}

              <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  By submitting this application, you confirm that the
                  information provided is accurate.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-slate-700 px-6 sm:px-8 py-5">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (step === 1) {
                  onClose();
                } else if (step === 2) {
                  setStep(1);
                  setError("");
                } else {
                  setStep(questions.length > 0 ? 2 : 1);
                  setError("");
                }
              }}
              className="w-full sm:w-auto rounded-xl border border-gray-300 dark:border-slate-600 px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            {step === 1 && (
              <button
                type="button"
                onClick={handleProceedFromDetails}
                className="w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 transition"
              >
                Proceed
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={handleProceedFromQuestions}
                className="w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 transition"
              >
                Proceed to Review
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitApplication}
                className="w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FORM FIELD
// ============================================================

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  min,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}

        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type={type}
        min={min}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

// ============================================================
// QUESTION FIELD
// ============================================================

function QuestionField({ question, value, onChange }) {
  const { question: text, type, options = [], required } = question;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 p-5">
      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">
        {text}

        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === "text" && (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {type === "textarea" && (
        <textarea
          rows={4}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      )}

      {type === "number" && (
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {type === "yes_no" && (
        <div className="flex gap-3">
          {["Yes", "No"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-xl border px-5 py-3 font-medium transition ${
                value === option
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-900"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {type === "single_choice" && (
        <div className="space-y-3">
          {options.map((option, index) => (
            <label
              key={index}
              className="flex items-center gap-3 cursor-pointer text-gray-700 dark:text-gray-300"
            >
              <input
                type="radio"
                name={question._id}
                checked={value === option}
                onChange={() => onChange(option)}
              />

              <span>{option}</span>
            </label>
          ))}
        </div>
      )}

      {type === "multiple_choice" && (
        <div className="space-y-3">
          {options.map((option, index) => {
            const selected = Array.isArray(value) ? value : [];

            return (
              <label
                key={index}
                className="flex items-center gap-3 cursor-pointer text-gray-700 dark:text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...selected, option]);
                    } else {
                      onChange(selected.filter((item) => item !== option));
                    }
                  }}
                />

                <span>{option}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// REVIEW
// ============================================================

function ReviewSection({ title, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 p-5">
      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h4>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>

      <span className="text-sm font-semibold text-gray-900 dark:text-white sm:text-right">
        {value || "Not provided"}
      </span>
    </div>
  );
}

// ============================================================
// STEP INDICATOR
// ============================================================

function StepIndicator({ number, label, active, completed, hidden }) {
  if (hidden) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <div
        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
          active || completed
            ? "bg-blue-600 text-white"
            : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"
        }`}
      >
        {completed ? "✓" : number}
      </div>

      <span
        className={`hidden sm:block text-sm font-medium ${
          active
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
