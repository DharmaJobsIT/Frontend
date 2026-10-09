import { useState, useEffect } from "react";
import API from "../../api/axios";
import VerificationTimeline from "../../components/VerificationTimeLine";
import PlanDashboard from "./components/plans/PlanDashboard";

function RecruiterHome() {
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResubmit, setShowResubmit] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    instituteName: "",
    district: "",
    contactPhone: "",
  });

  const fetchRecruiter = async () => {
    try {
      const res = await API.get("/recruiters/me");
      setRecruiter(res.data);

      setFormData({
        instituteName: res.data?.instituteName || "",
        district: res.data?.district || "",
        contactPhone: res.data?.contactPhone || "",
      });
    } catch (err) {
      console.error(err);
      setRecruiter(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiter();
  }, []);

  const handleResubmit = async () => {
    if (
      !formData.instituteName.trim() ||
      !formData.district.trim() ||
      !formData.contactPhone.trim()
    ) {
      setMessage("Please enter institute name, district and contact number.");
      return;
    }

    try {
      const res = await API.post("/recruiters/profile", formData);

      setRecruiter(res.data.recruiter);

      setShowResubmit(false);

      setMessage("Profile submitted successfully. Awaiting verification.");
    } catch (err) {
      console.error("Profile submission failed:", err);

      setMessage(
        err.response?.data?.message || "Failed to submit recruiter profile.",
      );
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }
  if (!recruiter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {!showResubmit ? (
          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-3">
              Recruiter Profile Required
            </h2>

            <p className="text-gray-300 mb-4">
              Complete your recruiter profile to continue.
            </p>

            <button
              onClick={() => setShowResubmit(true)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Create Profile
            </button>
          </div>
        ) : (
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create Recruiter Profile
            </h2>

            <input
              type="text"
              placeholder="Institute Name"
              value={formData.instituteName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  instituteName: e.target.value,
                })
              }
              className="w-full mb-3 p-2 rounded bg-gray-800 text-white"
            />

            <input
              type="text"
              placeholder="District"
              value={formData.district}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  district: e.target.value,
                })
              }
              className="w-full mb-3 p-2 rounded bg-gray-800 text-white"
            />

            <div className="flex gap-3">
              <button
                onClick={handleResubmit}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Submit
              </button>

              <button
                onClick={() => setShowResubmit(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  const status = recruiter?.verificationStatus;
  const profileCompleted =
    recruiter?.profileCompleted &&
    recruiter?.instituteName &&
    recruiter?.district &&
    recruiter?.contactPhone;

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
      {/* MESSAGE */}
      {message && (
        <div className="bg-blue-900/40 p-4 rounded mb-6 text-blue-200">
          {message}
        </div>
      )}

      {recruiter && !profileCompleted && (
        <div className="bg-gray-900 p-6 rounded-xl mb-6 max-w-xl">
          <h2 className="text-xl font-semibold mb-2 text-white">
            Complete Recruiter Profile
          </h2>

          <p className="text-gray-300 text-sm mb-5">
            Please provide your institute details and contact information to
            help us verify your recruiter account.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Institute Name
              </label>

              <input
                type="text"
                placeholder="Enter institute name"
                value={formData.instituteName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    instituteName: e.target.value,
                  })
                }
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                District
              </label>

              <input
                type="text"
                placeholder="Enter district"
                value={formData.district}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    district: e.target.value,
                  })
                }
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Contact Number
              </label>

              <input
                type="tel"
                placeholder="Enter contact number"
                value={formData.contactPhone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactPhone: e.target.value,
                  })
                }
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
              />
            </div>

            <button
              onClick={handleResubmit}
              className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
            >
              Submit for Verification
            </button>
          </div>
        </div>
      )}

      {/* TIMELINE (ONLY BEFORE VERIFIED) */}
      {recruiter && status !== "verified" && (
        <VerificationTimeline recruiter={recruiter} />
      )}

      {/* UNDER REVIEW */}
      {status === "under_review" && (
        <div className="bg-yellow-900/40 p-6 rounded-xl mb-6">
          <h2 className="text-lg font-semibold text-yellow-300">
            Profile Under Verification
          </h2>
          <p className="text-sm mt-1">
            Please wait up to 24 hours for verification.
          </p>
          <p className="text-sm mt-2 text-yellow-400">
            Contact: help@dharmajobs.com
          </p>
        </div>
      )}

      {/* REJECTED */}
      {status === "rejected" && (
        <div className="bg-red-900/40 p-6 rounded-xl mb-6">
          <h2 className="text-lg font-semibold text-red-300">
            Profile Rejected
          </h2>

          <p className="text-sm mt-2">
            Reason:{" "}
            <span className="text-red-200 font-medium">
              {recruiter?.rejectionReason || "Not specified"}
            </span>
          </p>

          <p className="text-sm mt-3 text-red-400">
            Contact: support@dharmajobs.com
          </p>

          <button
            onClick={() => setShowResubmit(true)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Edit & Resubmit Profile
          </button>
        </div>
      )}

      {/* RESUBMIT FORM */}
      {showResubmit && (
        <div className="bg-gray-900 p-6 rounded-xl mb-6">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Update Profile
          </h2>

          <input
            type="text"
            placeholder="Institute Name"
            value={formData.instituteName}
            onChange={(e) =>
              setFormData({ ...formData, instituteName: e.target.value })
            }
            className="w-full mb-3 p-2 rounded bg-gray-800 text-white"
          />

          <input
            type="text"
            placeholder="District"
            value={formData.district}
            onChange={(e) =>
              setFormData({ ...formData, district: e.target.value })
            }
            className="w-full mb-3 p-2 rounded bg-gray-800 text-white"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleResubmit}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Submit
            </button>

            <button
              onClick={() => setShowResubmit(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 🔥 MAIN DASHBOARD */}
      {status === "verified" && recruiter && (
        <PlanDashboard recruiter={recruiter} fetchRecruiter={fetchRecruiter}/>
      )}
    </div>
  );
}

export default RecruiterHome;
