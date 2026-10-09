import { useState } from "react";
import API from "../../../../api/axios";
import { useNavigate } from "react-router-dom";
import RecruiterJobsTable from "../jobs/RecruiterJobsTable";

const Feature = ({ children, locked = false }) => (
  <li
    className={`flex items-start gap-2 ${
      locked
        ? "text-gray-400 dark:text-gray-500"
        : "text-gray-700 dark:text-gray-300"
    }`}
  >
    <span className="mt-0.5 shrink-0">{locked ? "🔒" : "✓"}</span>

    <span>{children}</span>
  </li>
);

const SectionTitle = ({ children }) => (
  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
    {children}
  </p>
);

function PlanCards({ recruiter, onSubscribe }) {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const status = recruiter?.verificationStatus;

  const currentPlan = recruiter?.subscriptionPlan || "free_trial";

  const isFreeTrial = currentPlan === "free_trial";
  const isBasic = currentPlan === "basic";
  const isPro = currentPlan === "pro";

  const planPrices = {
    basic: {
      monthly: "₹699 / month",
      quarterly: "₹1,999 / 3 months",
    },
    pro: {
      monthly: "₹1,099 / month",
      quarterly: "₹2,999 / 3 months",
    },
  };

  const selectedBasicPrice = planPrices.basic[billingCycle];
  const selectedProPrice = planPrices.pro[billingCycle];

  return (
    <div className="w-full">
      {/* BILLING CYCLE TOGGLE */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center rounded-xl bg-gray-100 dark:bg-gray-800 p-1 shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
              billingCycle === "monthly"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            Monthly
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle("quarterly")}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
              billingCycle === "quarterly"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            3 Months
          </button>
        </div>
      </div>

      {/* PLAN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {/* =========================================================
            FREE TRIAL
        ========================================================== */}
        <div
          id="plans"
          className={`relative h-full rounded-2xl border shadow-sm p-6 flex flex-col bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 ${
            status === "rejected" ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Free Trial
              </h3>

              {isFreeTrial && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Current
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Explore DharmaJobs before upgrading.
            </p>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Free
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              7-day trial
            </p>
          </div>

          {/* Core Access */}
          <div className="mb-5">
            <SectionTitle>Core Access</SectionTitle>

            <ul className="space-y-2.5 text-sm">
              <Feature>1 job can be posted</Feature>
              <Feature>Unlimited applicants per job</Feature>
              <Feature>Applicant list</Feature>
              <Feature>Newest / oldest sorting</Feature>
              <Feature>District filter</Feature>
            </ul>
          </div>

          {/* Applicant Access */}
          <div className="mb-5">
            <SectionTitle>Applicant Access</SectionTitle>

            <ul className="space-y-2.5 text-sm">
              <Feature>Applicant name</Feature>
              <Feature>Address</Feature>
              <Feature>Mobile number</Feature>
              <Feature>Limited applicant preview</Feature>
            </ul>
          </div>

          {/* Locked Features */}
          <div className="mb-6">
            <SectionTitle>Locked Features</SectionTitle>

            <ul className="space-y-2.5 text-sm">
              <Feature locked>Email</Feature>
              <Feature locked>Experience & qualification</Feature>
              <Feature locked>Salary information</Feature>
              <Feature locked>Resume access</Feature>
              <Feature locked>Match ranking</Feature>
              <Feature locked>Proceed & recruitment actions</Feature>
              <Feature locked>Contact applicant</Feature>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              disabled
              className="w-full py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold cursor-not-allowed"
            >
              {isFreeTrial ? "Current Plan" : "Free Trial"}
            </button>
          </div>
        </div>

        {/* =========================================================
            BASIC
        ========================================================== */}
        <div className="relative h-full rounded-2xl border-2 border-slate-400 dark:border-slate-400 shadow-md p-6 flex flex-col bg-white dark:bg-gray-900">
          {/* Recommended Badge */}
          <div className="absolute -top-3 right-5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white shadow">
              Recommended
            </span>
          </div>
          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Basic
              </h3>

              {isBasic && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  Current
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              For institutions actively recruiting candidates.
            </p>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedBasicPrice}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Online payment fee calculated at checkout
            </p>
          </div>

          {/* Core Access */}
          <div className="mb-5">
            <SectionTitle>Core Access</SectionTitle>

            <ul className="space-y-2.5 text-sm">
              <Feature>10 jobs can be posted</Feature>
              <Feature>Unlimited applicants per job</Feature>
              <Feature>Applicant list</Feature>
              <Feature>Newest / oldest sorting</Feature>
              <Feature>District filter</Feature>
            </ul>
          </div>

          {/* Recruitment Access */}
          <div className="mb-5">
            <SectionTitle>Recruitment Access</SectionTitle>

            <ul className="space-y-2.5 text-sm">
              <Feature>Full applicant details</Feature>
              <Feature>Email & mobile number</Feature>
              <Feature>Experience & qualification</Feature>
              <Feature>Salary information</Feature>
              <Feature>Resume preview & download</Feature>
              <Feature>Applicant message / cover letter</Feature>
              <Feature>Match percentage</Feature>
              <Feature>Highest Match sorting</Feature>
            </ul>
          </div>

          {/* Recruitment Actions */}
          <div className="mb-6">
            <SectionTitle>Recruitment Actions</SectionTitle>

            <ul className="space-y-2.5 text-sm">
              <Feature>Proceed with applicant</Feature>
              <Feature>Shortlist candidates</Feature>
              <Feature>Contact applicant</Feature>
              <Feature>Recruitment status tracking</Feature>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            {isBasic ? (
              <button
                type="button"
                disabled
                className="w-full py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSubscribe("basic", billingCycle)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Continue with Basic
              </button>
            )}
          </div>
        </div>

        {/* =========================================================
            PRO
        ========================================================== */}
        <div className="relative h-full rounded-2xl border-2 border-yellow-400 dark:border-yellow-500 shadow-md p-6 flex flex-col bg-white dark:bg-gray-900">
          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Pro
              </h3>

              {isPro && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  Current
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Advanced recruitment intelligence for growing institutions.
            </p>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedProPrice}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Online payment fee calculated at checkout
            </p>
          </div>

          {/* Everything Basic */}
          <div className="mb-5">
            <SectionTitle>Everything in Basic</SectionTitle>

            <ul className="space-y-2.5 text-sm">
              <Feature>50 jobs can be posted</Feature>
              <Feature>Full applicant details</Feature>
              <Feature>Resume preview & download</Feature>
              <Feature>Highest Match ranking</Feature>
              <Feature>Recruitment actions</Feature>
              <Feature>Contact applicant</Feature>
            </ul>
          </div>

          {/* Recruiter Intelligence */}
          <div className="mb-5">
            <SectionTitle>Recruiter Intelligence</SectionTitle>

            <ul className="space-y-2.5 text-sm">
              <Feature>AI Recruiter</Feature>
              <Feature>Advanced candidate matching</Feature>
              <Feature>Candidate ranking</Feature>
              <Feature>Candidate comparison</Feature>
              <Feature>Job-specific applicant analysis</Feature>
            </ul>
          </div>

          {/* Analytics */}
          <div className="mb-6">
            <SectionTitle>Analytics</SectionTitle>

            <ul className="space-y-2.5 text-sm">
              <Feature>Application analytics</Feature>
              <Feature>District analysis</Feature>
              <Feature>Experience analysis</Feature>
              <Feature>Salary analysis</Feature>
              <Feature>Match distribution</Feature>
              <Feature>Recruitment funnel</Feature>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            {isPro ? (
              <button
                type="button"
                disabled
                className="w-full py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSubscribe("pro", billingCycle)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Continue with Pro
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BaseDashboard({
  recruiter,
  fetchRecruiter,
  showPlanCards = true,
  theme = "free",
}) {
  const [showJobModal, setShowJobModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showPlansDashboard, setShowPlansDashboard] = useState(false);
  const navigate = useNavigate();
  const themeStyles = {
    free: {
      profile:
        "bg-white dark:bg-[#08152d] text-gray-900 dark:text-white border-gray-200",
      avatar: "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white",
      stat: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
      accent: "text-gray-900 dark:text-white",
      action: "bg-green-500 hover:bg-green-600",
      secondaryAction: "bg-purple-500 hover:bg-purple-600",
    },

    basic: {
      profile:
        "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-white border-slate-500",
      avatar: "bg-slate-300 text-slate-800",
      stat: "bg-white/10 border border-white/15 text-white",
      accent: "text-slate-700 dark:text-slate-200",
      action: "bg-slate-700 hover:bg-slate-800",
      secondaryAction: "bg-slate-500 hover:bg-slate-600",
    },

    pro: {
      profile:
        "bg-gradient-to-br from-amber-700 via-yellow-700 to-amber-800 text-white border-amber-600",
      avatar: "bg-amber-200 text-amber-900",
      stat: "bg-white/10 border border-white/15 text-white",
      accent: "text-amber-700 dark:text-amber-300",
      action: "bg-amber-700 hover:bg-amber-800",
      secondaryAction: "bg-amber-600 hover:bg-amber-700",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.free;
  const currentPlan = recruiter?.subscriptionPlan || "free_trial";

  const formattedPlanName = currentPlan.replaceAll("_", " ").toUpperCase();

  const [jobData, setJobData] = useState({
    title: "",
    subject: "",
    positionLevel: "",
    category: "",
    district: "",

    salaryRange: "",
    salaryType: "range",

    experienceRequired: "",
    experienceType: "range",

    qualification: "",
  });
  const [jobDetails, setJobDetails] = useState({
    jobPurpose: "",
    duties: [],
    keyDecisions: [],
    majorChallenges: [],
    skills: [],
    employmentType: "Full Time",
    department: "",
    roleCategory: "",
    industryType: "",
    education: {
      ug: [],
      pg: [],
      professional: [],
    },
    applicationQuestions: [],
    additionalInformation: "",
  });
  const updateField = (field, value) => {
    setJobData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const addApplicationQuestion = () => {
    setJobDetails((prev) => ({
      ...prev,
      applicationQuestions: [
        ...prev.applicationQuestions,
        {
          question: "",
          type: "text",
          options: [],
          required: true,
        },
      ],
    }));
  };

  const updateApplicationQuestion = (index, field, value) => {
    setJobDetails((prev) => ({
      ...prev,
      applicationQuestions: prev.applicationQuestions.map((question, i) =>
        i === index
          ? {
              ...question,
              [field]: value,
            }
          : question,
      ),
    }));
  };

  const removeApplicationQuestion = (index) => {
    setJobDetails((prev) => ({
      ...prev,
      applicationQuestions: prev.applicationQuestions.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const addQuestionOption = (questionIndex) => {
    setJobDetails((prev) => ({
      ...prev,
      applicationQuestions: prev.applicationQuestions.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: [...question.options, ""],
            }
          : question,
      ),
    }));
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    setJobDetails((prev) => ({
      ...prev,
      applicationQuestions: prev.applicationQuestions.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: question.options.map((option, j) =>
                j === optionIndex ? value : option,
              ),
            }
          : question,
      ),
    }));
  };

  const removeQuestionOption = (questionIndex, optionIndex) => {
    setJobDetails((prev) => ({
      ...prev,
      applicationQuestions: prev.applicationQuestions.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: question.options.filter((_, j) => j !== optionIndex),
            }
          : question,
      ),
    }));
  };

  const isLimitReached = recruiter?.jobsPosted >= recruiter?.jobPostLimit;

  const handleSubscription = async (plan, billingCycle) => {
    try {
      // 1. Create subscription order first
      const { data } = await API.post("/subscriptions/create-order", {
        plan,
        billingCycle,
      });

      // 2. Show payment confirmation after backend gives us
      // the actual calculated amounts
      const confirmed = window.confirm(
        `Plan: ${plan.toUpperCase()}\n` +
          `Billing: ${
            billingCycle === "monthly" ? "1 Month" : "3 Months"
          }\n\n` +
          `Plan price: ₹${(data.baseAmount / 100).toFixed(2)}\n` +
          `Payment gateway fee: ₹${(data.gatewayFeeAmount / 100).toFixed(2)}\n` +
          `Total: ₹${(data.amount / 100).toFixed(2)}\n\n` +
          `Continue to payment?`,
      );

      if (!confirmed) {
        return;
      }

      // 3. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,

        name: "DharmaJobs",

        description: `${plan.toUpperCase()} Plan - ${billingCycle}`,

        order_id: data.orderId,

        prefill: {
          name: recruiter?.user?.name || "",
          email: recruiter?.user?.email || "",
        },

        theme: {
          color: "#7c3aed",
        },

        // 4. Verify payment on backend
        handler: async function (response) {
          try {
            const verifyResponse = await API.post(
              "/subscriptions/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            );

            alert(
              verifyResponse.data?.message || "Payment verified successfully",
            );

            // Refresh recruiter data
            await fetchRecruiter();

            // Reload dashboard so the updated subscription
            // is immediately reflected everywhere
            window.location.reload();
          } catch (error) {
            console.error("Payment verification error:", error);

            alert(
              error?.response?.data?.message || "Payment verification failed",
            );
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Razorpay checkout closed");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);

        alert(
          response.error?.description || "Payment failed. Please try again.",
        );
      });

      razorpay.open();
    } catch (error) {
      console.error("Create subscription order error:", error);

      alert(error?.response?.data?.message || "Unable to start payment");
    }
  };

  const handleCreateJob = async () => {
    try {
      const SALARY_RANGE_REGEX =
        /^\s*₹?\s*\d[\d,]*(?:\.\d+)?\s*-\s*₹?\s*\d[\d,]*(?:\.\d+)?\s*$/;

      const EXPERIENCE_RANGE_REGEX =
        /^\s*\d+(?:\.\d+)?\s*-\s*\d+(?:\.\d+)?\s*$/;

      // ---------------------------------------
      // SALARY RANGE VALIDATION
      // ---------------------------------------

      if (!SALARY_RANGE_REGEX.test(jobData.salaryRange)) {
        alert(
          "Please enter salary as a range.\n\nExample:\n₹35,000 - ₹40,000\nor\n3,50,000 - 4,00,000",
        );
        return;
      }

      // ---------------------------------------
      // EXPERIENCE RANGE VALIDATION
      // ---------------------------------------

      if (!EXPERIENCE_RANGE_REGEX.test(jobData.experienceRequired)) {
        alert(
          "Please enter experience as a range.\n\nExample:\n1 - 2\nor\n2 - 5",
        );
        return;
      }

      await API.post("/jobs", {
        ...jobData,
        salaryType: "range",
        experienceType: "range",
        jobDetails,
      });

      alert("Job posted successfully");
      setShowJobModal(false);
      fetchRecruiter();
    } catch (err) {
      alert(err?.response?.data?.message || "Error posting job");
    }
  };

  const POSITION_LEVELS = [
    "Assistant Teacher",
    "Senior Teacher",
    "Lecturer",
    "Senior Lecturer",
    "Head of Department",
    "Principal",
    "Technician",
    "Helper",
  ];

  const CATEGORIES = [
    "Teaching",
    "Non Teaching",
    "Management",
    "Support Staff",
  ];

  return (
    <>
      {/* JOB USAGE + BUTTON */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Jobs Used: {recruiter?.jobsPosted} / {recruiter?.jobPostLimit}
          </p>

          {isLimitReached && (
            <p className="text-red-500 text-sm mt-1">
              Limit reached. Upgrade plan.
            </p>
          )}
        </div>

        <button
          onClick={() => {
            if (isLimitReached) {
              document.getElementById("plans")?.scrollIntoView({
                behavior: "smooth",
              });
            } else {
              setShowJobModal(true);
            }
          }}
          className={`px-6 py-2 rounded-lg text-white ${
            isLimitReached
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isLimitReached ? "Upgrade Plan" : "Post Job"}
        </button>
      </div>

      {/* HEADER */}
      {/* RECRUITER OVERVIEW */}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* PROFILE CARD */}

        <div
          className={`rounded-2xl shadow-lg border p-6 transition-all duration-300 ${currentTheme.profile}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                onClick={() => setShowMenu(!showMenu)}
                className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer text-2xl font-bold ${currentTheme.avatar}`}
              >
                {recruiter?.user?.name?.charAt(0) || "R"}
              </div>

              <div>
                <h2
                  className={
                    theme === "free" ? "text-gray-500" : "text-white/75"
                  }
                >
                  {recruiter?.user?.name}
                </h2>

                <p
                  className={
                    theme === "free" ? "text-gray-500" : "text-white/75"
                  }
                >
                  {recruiter?.instituteName}
                </p>

                <p
                  className={
                    theme === "free" ? "text-gray-500" : "text-white/75"
                  }
                >
                  {recruiter?.district}
                </p>
              </div>
            </div>

            <div className="relative">
              {showMenu && (
                <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 text-gray-900 shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/recruiter/profile");
                      setShowMenu(false);
                    }}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Profile Settings
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById("plans")?.scrollIntoView({
                        behavior: "smooth",
                      });

                      setShowMenu(false);
                    }}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    My Subscription
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSupport(true);
                      setShowMenu(false);
                    }}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Contact Support
                  </button>

                  <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/";
                    }}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className={`rounded-xl p-3 ${currentTheme.stat}`}>
              <p
                className={
                  theme === "free"
                    ? "text-sm text-gray-500"
                    : "text-sm text-white/70"
                }
              >
                Plan
              </p>

              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="font-semibold">{formattedPlanName}</p>

                {currentPlan !== "pro" && (
                  <button
                    type="button"
                    onClick={() => setShowPlansDashboard(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold text-white transition ${currentTheme.secondaryAction}`}
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>

            <div className={`rounded-xl p-3 ${currentTheme.stat}`}>
              <p
                className={
                  theme === "free"
                    ? "text-sm text-gray-500"
                    : "text-sm text-white/70"
                }
              >
                Jobs Used
              </p>
              <p className="font-semibold">
                {recruiter?.jobsPosted} / {recruiter?.jobPostLimit}
              </p>
            </div>

            <div className={`rounded-xl p-3 ${currentTheme.stat}`}>
              <p
                className={
                  theme === "free"
                    ? "text-sm text-gray-500"
                    : "text-sm text-white/70"
                }
              >
                Status
              </p>
              <p className="font-semibold text-green-500">Verified</p>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="bg-white dark:bg-[#08152d] rounded-2xl shadow-lg p-6">
          <h3
            className={`text-xl font-semibold mb-5 ${
              theme === "free"
                ? "text-gray-900 dark:text-white"
                : currentTheme.accent
            }`}
          >
            Quick Actions
          </h3>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                if (isLimitReached) {
                  if (showPlanCards) {
                    document.getElementById("plans")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  } else {
                    alert(
                      `You have reached your ${recruiter?.subscriptionPlan} plan job limit.`,
                    );
                  }
                } else {
                  setShowJobModal(true);
                }
              }}
              className={`px-5 py-3 rounded-xl text-white ${
                isLimitReached
                  ? "bg-gray-500 hover:bg-gray-600"
                  : currentTheme.action
              }`}
            >
              {isLimitReached ? "Upgrade Plan" : "Post Job"}
            </button>

            {showPlanCards && (
              <button
                onClick={() => {
                  if (isLimitReached) {
                    if (showPlanCards) {
                      document.getElementById("plans")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    } else {
                      alert(
                        `You have reached your ${recruiter?.subscriptionPlan} plan job limit.`,
                      );
                    }
                  } else {
                    setShowJobModal(true);
                  }
                }}
                className={`px-5 py-3 rounded-xl text-white ${currentTheme.secondaryAction}`}
              >
                View Plans
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUPPORT MODAL */}
      {showSupport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[350px] shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Contact Support
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              Email: support@dharmajobs.com
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Phone: +91 98765 43210
            </p>

            <button
              onClick={() => setShowSupport(false)}
              className="mt-6 px-4 py-2 bg-gray-500 text-white rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* PLANS DASHBOARD MODAL */}
      {showPlansDashboard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gray-50 dark:bg-[#08152d] shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-[#08152d] px-6 py-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Plans Dashboard
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Choose a plan that works best for your institution.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPlansDashboard(false)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xl transition"
                aria-label="Close plans dashboard"
              >
                ×
              </button>
            </div>

            {/* Existing Plan Cards */}
            <div className="p-6">
              <PlanCards
                recruiter={recruiter}
                onSubscribe={handleSubscription}
              />
            </div>
          </div>
        </div>
      )}

      {/* JOB MODAL */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#08152d] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 border-b border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Post New Job
              </h2>

              <p className="text-gray-500 mt-1">
                Publish a vacancy for your institution.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Form */}
              <div className="p-6 grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium">Job Title</label>

                  <input
                    value={jobData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3"
                    placeholder="Mathematics Teacher"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Subject</label>

                  <input
                    value={jobData.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3"
                    placeholder="Mathematics"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Position</label>

                  <select
                    value={jobData.positionLevel}
                    onChange={(e) =>
                      updateField("positionLevel", e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3"
                  >
                    <option value="" disabled>
                      Select Position
                    </option>

                    {POSITION_LEVELS.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    Category
                  </label>

                  <div className="relative mt-2">
                    <select
                      value={jobData.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className={`w-full appearance-none rounded-xl border p-3 pr-10 transition
        ${
          jobData.category
            ? "border-gray-300 bg-white text-gray-900"
            : "border-gray-300 bg-white text-gray-500"
        }
        dark:border-slate-700
        dark:bg-slate-900
        dark:text-white
        focus:border-blue-500
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500/20
      `}
                    >
                      <option value="" disabled>
                        Select Category
                      </option>

                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    {/* Custom dropdown arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-500 dark:text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">District</label>

                  <input
                    value={jobData.district}
                    onChange={(e) => updateField("district", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Qualification</label>

                  <input
                    value={jobData.qualification}
                    onChange={(e) =>
                      updateField("qualification", e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3"
                    placeholder="M.Sc, B.Ed"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Salary Range</label>

                  <div className="relative mt-2">
                    <input
                      type="text"
                      value={jobData.salaryRange}
                      onChange={(e) =>
                        updateField("salaryRange", e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3"
                      placeholder="₹35,000 - ₹40,000"
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Enter a salary range, for example ₹35,000 - ₹40,000 or
                    3,50,000 - 4,00,000
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Experience Required
                  </label>

                  <div className="relative mt-2">
                    <input
                      type="text"
                      value={jobData.experienceRequired}
                      onChange={(e) =>
                        updateField("experienceRequired", e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 pr-20"
                      placeholder="1 - 2"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      years
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Enter experience as a range, for example 1 - 2 years
                  </p>
                </div>
              </div>
              {/* Application Questions */}
              <div className="px-6 pb-6">
                <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Application Questions
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Add questions that applicants must answer when applying
                        for this job.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addApplicationQuestion}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      + Add Question
                    </button>
                  </div>

                  {jobDetails.applicationQuestions.length === 0 ? (
                    <div className="border border-dashed border-gray-300 rounded-lg p-5 text-center text-gray-500">
                      No application questions added.
                      <div className="text-sm mt-1">
                        Applicants will only need to provide their standard
                        application details.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {jobDetails.applicationQuestions.map(
                        (question, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-xl p-5 bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-gray-800">
                                Question {index + 1}
                              </h4>

                              <button
                                type="button"
                                onClick={() => removeApplicationQuestion(index)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>

                            {/* Question */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Question
                              </label>

                              <textarea
                                value={question.question}
                                onChange={(e) =>
                                  updateApplicationQuestion(
                                    index,
                                    "question",
                                    e.target.value,
                                  )
                                }
                                placeholder="e.g. How many years of teaching experience do you have?"
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            {/* Type + Required */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Answer Type
                                </label>

                                <select
                                  value={question.type}
                                  onChange={(e) =>
                                    updateApplicationQuestion(
                                      index,
                                      "type",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="text">Short Answer</option>
                                  <option value="textarea">Long Answer</option>
                                  <option value="number">Number</option>
                                  <option value="single_choice">
                                    Single Choice
                                  </option>
                                  <option value="multiple_choice">
                                    Multiple Choice
                                  </option>
                                  <option value="yes_no">Yes / No</option>
                                </select>
                              </div>

                              <div className="flex items-center">
                                <label className="flex items-center gap-2 cursor-pointer mt-5">
                                  <input
                                    type="checkbox"
                                    checked={question.required}
                                    onChange={(e) =>
                                      updateApplicationQuestion(
                                        index,
                                        "required",
                                        e.target.checked,
                                      )
                                    }
                                    className="w-4 h-4"
                                  />

                                  <span className="text-sm font-medium text-gray-700">
                                    Required question
                                  </span>
                                </label>
                              </div>
                            </div>

                            {/* Options */}
                            {["single_choice", "multiple_choice"].includes(
                              question.type,
                            ) && (
                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Options
                                  </label>

                                  <button
                                    type="button"
                                    onClick={() => addQuestionOption(index)}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    + Add Option
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  {question.options.map(
                                    (option, optionIndex) => (
                                      <div
                                        key={optionIndex}
                                        className="flex items-center gap-2"
                                      >
                                        <input
                                          type="text"
                                          value={option}
                                          onChange={(e) =>
                                            updateQuestionOption(
                                              index,
                                              optionIndex,
                                              e.target.value,
                                            )
                                          }
                                          placeholder={`Option ${optionIndex + 1}`}
                                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeQuestionOption(
                                              index,
                                              optionIndex,
                                            )
                                          }
                                          className="px-3 py-2 text-red-600 hover:text-red-700"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ),
                                  )}
                                </div>

                                {question.options.length === 0 && (
                                  <p className="text-sm text-gray-500 mt-2">
                                    Add at least one option for this question.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Footer */}
              <div className="flex-shrink-0 flex justify-end gap-3 border-t border-gray-200 dark:border-slate-700 p-6 bg-white dark:bg-[#08152d]">
                <button
                  onClick={() => setShowJobModal(false)}
                  className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateJob}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Publish Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <RecruiterJobsTable />

      {/* PLAN CARDS */}
      {showPlanCards && (
        <div className="grid md:grid-cols-3 gap-6 mt-3">
          <PlanCards recruiter={recruiter} onSubscribe={handleSubscription} />
        </div>
      )}
    </>
  );
}

export default BaseDashboard;
