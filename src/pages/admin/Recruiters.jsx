import { useEffect, useState } from "react";
import API from "../../api/axios";

function Recruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchRecruiters = async () => {
    try {
      const res = await API.get("/admin/recruiters");
      setRecruiters(res.data);
    } catch (err) {
      console.error("Error fetching recruiters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleView = (rec) => {
    console.log("SELECTED RECRUITER:", rec);
    console.log("CONTACT PHONE:", rec.contactPhone);

    setSelectedRecruiter(rec);
    setShowModal(true);
  };
  // const handleView = async (rec) => {
  //   setSelectedRecruiter(rec);
  //   setShowModal(true);

  //   if (rec.verificationStatus === "submitted") {
  //     try {
  //       const res = await API.patch(`/admin/recruiters/${rec._id}/review`);

  //       // 👇 merge old user data with updated recruiter
  //       setSelectedRecruiter({
  //         ...res.data.recruiter,
  //         user: rec.user,
  //       });

  //       fetchRecruiters();
  //     } catch (err) {
  //       console.error("Review update failed:", err);
  //     }
  //   } else {
  //     setSelectedRecruiter(rec);
  //   }
  // };

  const handleVerify = async (id) => {
    try {
      await API.patch(`/admin/recruiters/${id}/verify`);
      fetchRecruiters();
      setShowModal(false);
      setRejectReason("");
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await API.patch(`/admin/recruiters/${id}/reject`, {
        reason: rejectReason,
      });
      fetchRecruiters();
      setShowModal(false);
      setRejectReason("");
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="p-5 rounded-xl shadow bg-white dark:bg-gray-900 animate-pulse"
          >
            <div className="h-5 bg-gray-300 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));

    const count = recruiters.filter(
      (rec) => new Date(rec.createdAt).toDateString() === date.toDateString(),
    ).length;

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      count,
    };
  });

  const filteredRecruiters = recruiters.filter((rec) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "verified" && rec.verificationStatus === "verified") ||
      (filter === "pending" &&
        ["submitted", "under_review"].includes(rec.verificationStatus)) ||
      (filter === "rejected" && rec.verificationStatus === "rejected");

    const matchesSearch =
      rec.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      rec.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      rec.instituteName?.toLowerCase().includes(search.toLowerCase()) ||
      rec.district?.toLowerCase().includes(search.toLowerCase()) ||
      rec.contactPhone?.includes(search);

    return matchesFilter && matchesSearch;
  });

  const totalRecruiters = recruiters.length;
  const verifiedRecruiters = recruiters.filter(
    (rec) => rec.verificationStatus === "verified",
  ).length;
  const pendingRecruiters = recruiters.filter((rec) =>
    ["submitted", "under_review"].includes(rec.verificationStatus),
  ).length;

  const today = new Date().toDateString();
  const newToday = recruiters.filter(
    (rec) => new Date(rec.createdAt).toDateString() === today,
  ).length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Recruiter Control Panel</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-500">Total Recruiters</p>
          <h3 className="text-2xl font-bold">{totalRecruiters}</h3>
        </div>

        <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-500">Verified</p>
          <h3 className="text-2xl font-bold text-green-500">
            {verifiedRecruiters}
          </h3>
        </div>

        <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-500">Pending</p>
          <h3 className="text-2xl font-bold text-yellow-500">
            {pendingRecruiters}
          </h3>
        </div>

        <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-500">New Today</p>
          <h3 className="text-2xl font-bold text-blue-500">{newToday}</h3>
        </div>
      </div>

      <div className="p-5 rounded-xl shadow bg-white dark:bg-gray-900 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Recruiter Growth (Last 7 Days)
        </h3>

        <div className="flex items-end gap-4 h-32">
          {last7Days.map((item) => (
            <div key={item.day} className="flex flex-col items-center flex-1">
              <div
                className="w-6 rounded-t-lg bg-blue-500 transition-all"
                style={{ height: `${Math.max(item.count * 20, 10)}px` }}
              ></div>
              <p className="text-xs mt-2 text-gray-500">{item.day}</p>
              <p className="text-xs font-medium">{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        {["all", "pending", "verified", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm capitalize ${
              filter === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mb-6 flex justify-start relative">
        <input
          type="text"
          placeholder="Search recruiters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <span className="absolute left-3 top-1.5 text-gray-400">🔍</span>
      </div>

      {filteredRecruiters.length === 0 ? (
        <div className="text-center mt-10 text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">No recruiters found</p>
          <p className="text-sm mt-1">
            Recruiters will appear here once they register.
          </p>
        </div>
      ) : (
        filteredRecruiters.map((rec) => (
          <div
            key={rec._id}
            className="p-5 rounded-xl shadow bg-white dark:bg-gray-900 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{rec.user?.name}</h3>
              <p className="text-sm text-gray-500">{rec.user?.email}</p>
              <p className="text-sm mt-1">
                {rec.instituteName || "Institute not provided"}
                {" • "}
                {rec.district || "District not provided"}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {rec.contactPhone || "Contact not provided"}
              </p>
              <p>
                <strong>Profile:</strong>{" "}
                {rec.profileCompleted ? "Completed" : "Incomplete"}
              </p>

              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                  rec.verificationStatus === "verified"
                    ? "bg-green-100 text-green-600"
                    : rec.verificationStatus === "rejected"
                      ? "bg-red-100 text-red-600"
                      : rec.verificationStatus === "under_review"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {rec.verificationStatus}
              </span>
            </div>

            {rec.verificationStatus !== "verified" && (
              <button
                onClick={() => handleView(rec)}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                View Data
              </button>
            )}
          </div>
        ))
      )}

      {showModal && selectedRecruiter && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Recruiter Details</h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {selectedRecruiter.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedRecruiter.user?.email}
              </p>
              <p>
                <strong>Institute:</strong> {selectedRecruiter.instituteName}
              </p>
              <p>
                <strong>District:</strong> {selectedRecruiter.district}
              </p>
              <p>
                <strong>Contact:</strong>{" "}
                {selectedRecruiter.contactPhone || "Not provided"}
              </p>
              <p>
                <strong>Profile:</strong>{" "}
                {selectedRecruiter.profileCompleted
                  ? "Completed"
                  : "Incomplete"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Status:{" "}
                <span className="font-medium">
                  {selectedRecruiter.verificationStatus}
                </span>
              </p>
            </div>

            <textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full mt-4 p-2 rounded bg-gray-100 dark:bg-gray-800 text-sm"
            />

            <div className="flex justify-end gap-3 mt-6">
              {selectedRecruiter.profileCompleted ? (
                <>
                  <button
                    onClick={() => handleReject(selectedRecruiter._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleVerify(selectedRecruiter._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  >
                    Verify
                  </button>
                </>
              ) : (
                <span className="text-sm text-yellow-500">
                  Profile details are required before verification.
                </span>
              )}
              <button
                onClick={() => {
                  setShowModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recruiters;
