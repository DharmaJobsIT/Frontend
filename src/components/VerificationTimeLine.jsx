import { Check } from "lucide-react";

function formatDate(date) {
  const d = new Date(date);

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function VerificationTimeline({ recruiter }) {
  const steps = [
    { key: "submitted", label: "Profile Submitted" },
    { key: "under_review", label: "Under Review" },
    { key: "verified", label: "Verified" },
    { key: "rejected", label: "Rejected" },
  ];

  const status = recruiter?.verificationStatus || "submitted";
  const createdAt = recruiter?.createdAt || new Date();

  const currentIndex = steps.findIndex((s) => s.key === status);
  const isRejectedFlow = status === "rejected";
  const lastSubmitted = recruiter?.verificationTimeline
    ?.filter((t) => t.status === "submitted")
    ?.slice(-1)[0];

  return (
    <div className="mb-6">
      <p className="text-sm text-gray-500 mb-4">
        {lastSubmitted
          ? "You last submitted your profile on "
          : "You submitted your profile on "}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {formatDate(lastSubmitted?.date || createdAt)}
        </span>
      </p>

      <div className="flex flex-col gap-8">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isRejected = step.key === "rejected" && isRejectedFlow;

          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2
                  ${
                    isRejectedFlow &&
                    (step.key === "verified" || step.key === "rejected")
                      ? "bg-red-500 border-red-500"
                      : isCompleted
                        ? "bg-green-500 border-green-500"
                        : isCurrent
                          ? "border-green-500 bg-white"
                          : "border-gray-300 bg-white"
                  }`}
                >
                  {isCompleted && !isRejectedFlow && (
                    <Check size={14} className="text-white" />
                  )}

                  {isRejectedFlow &&
                    (step.key === "verified" || step.key === "rejected") && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}

                  {isCurrent && !isRejected && !isRejectedFlow && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`w-[3px] h-14 mt-1
                    ${
                      isRejectedFlow && index >= currentIndex - 1
                        ? "bg-red-500"
                        : index < currentIndex
                          ? "bg-green-500"
                          : "bg-gray-300"
                    }`}
                  />
                )}
              </div>

              <div>
                <p
                  className={`font-semibold
                  ${
                    isRejectedFlow &&
                    (step.key === "verified" || step.key === "rejected")
                      ? "text-red-600"
                      : isCompleted
                        ? "text-green-600"
                        : isCurrent
                          ? "text-black dark:text-white"
                          : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VerificationTimeline;
