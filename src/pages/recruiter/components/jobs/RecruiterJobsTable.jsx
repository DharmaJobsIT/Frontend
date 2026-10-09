import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../api/axios";
import { PauseCircle, PlayCircle } from "lucide-react";
import { X } from "lucide-react";
import JobDetailsForm from "./JobDetailsForm";
import { toast } from "react-toastify";

function RecruiterJobsTable() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const defaultJobDetails = {
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
    additionalInformation: "",
  };
  const [jobDetails, setJobDetails] = useState(defaultJobDetails);

  useEffect(() => {
    fetchJobs();
  }, []);
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSelectedJob(null);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/recruiters/my-jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="mt-10 text-center">Loading jobs...</div>;
  }
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  const handleUpdateJob = async () => {
    return await API.put(`/jobs/${selectedJob._id}`, editData);
  };

  const handleDeactivateJob = async () => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate this job? It will no longer be visible to applicants.",
    );
    if (!confirmDeactivate) return;

    try {
      await API.patch(`/jobs/${selectedJob._id}/deactivate`);

      alert("Job deactivated");

      setSelectedJob(null);

      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to deactivate job");
    }
  };
  const handleActivateJob = async () => {
    const confirmActivate = window.confirm(
      "This will republish the job for another 30 days.\n\nDo you want to continue?",
    );

    if (!confirmActivate) return;

    try {
      const res = await API.patch(`/jobs/${selectedJob._id}/activate`);

      alert(res.data.message || "Job activated successfully.");

      setSelectedJob(res.data.job);

      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to activate job.");
    }
  };
  const handleDeleteJob = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this job?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/jobs/${selectedJob._id}`);

      alert("Job deleted successfully.");

      setSelectedJob(null);

      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job.");
    }
  };
  const statusStyles = {
    active:
      "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
    inactive:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
    expired: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  };
  const saveJobDetails = async () => {
    return await API.put(`/jobs/${selectedJob._id}/details`, jobDetails);
  };
  const handleSaveAll = async () => {
    try {
      await Promise.all([handleUpdateJob(), saveJobDetails()]);

      // setSelectedJob(jobRes.data.job);
      // setEditData(jobRes.data.job);

      await fetchJobs();
      await fetchJobDetails(selectedJob._id);
      setSelectedJob(null);
      setEditMode(false);

      toast.success("Changes saved successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save changes.");
    }
  };

  const fetchJobDetails = async (jobId) => {
    try {
      const res = await API.get(`/jobs/${jobId}/details`);

      // Support different response structures
      const data = res.data?.details || {};

      setJobDetails({
        ...defaultJobDetails,
        ...data,
        education: {
          ...defaultJobDetails.education,
          ...(data.education || {}),
        },
      });
    } catch (err) {
      setJobDetails(defaultJobDetails);

      // Don't show a toast if the job simply doesn't have details yet
      if (err.response?.status !== 404) {
        toast.error(
          err.response?.data?.message || "Failed to fetch job details.",
        );
      }
    }
  };
  const openJob = async (job) => {
    try {
      await fetchJobDetails(job._id);

      setSelectedJob(job);
      setEditData({ ...job });
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        My Jobs
      </h2>
      <div className="bg-white dark:bg-[#08152d] rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-slate-900">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-800 dark:text-gray-100">
                Title
              </th>
              <th className="p-4 text-left font-semibold text-gray-800 dark:text-gray-100">
                Subject
              </th>
              <th className="p-4 text-left font-semibold text-gray-800 dark:text-gray-100">
                District
              </th>
              <th className="p-4 text-left font-semibold text-gray-800 dark:text-gray-100">
                Status
              </th>
              <th className="p-4 text-left font-semibold text-gray-800 dark:text-gray-100">
                Expiry
              </th>
              <th className="p-4 text-center font-semibold text-gray-800 dark:text-gray-100">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-950">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  No jobs posted yet
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="p-4 text-gray-700 dark:text-gray-200">
                    {job.title}
                  </td>

                  <td className="p-4 text-gray-700 dark:text-gray-200">
                    {job.subject}
                  </td>

                  <td className="p-4 text-gray-700 dark:text-gray-200">
                    {job.district}
                  </td>

                  <td className="p-4 text-gray-700 dark:text-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-sm
                      ${
                        statusStyles[job.status] ||
                        "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
                      }`}
                    >
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </td>

                  <td className="p-4 text-gray-700 dark:text-gray-200">
                    {formatDate(job.expiryDate)}
                  </td>

                  <td className="p-4 text-gray-700 dark:text-gray-200 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          openJob(job);
                        }}
                        className="px-3 py-1 bg-blue-500 rounded text-white"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/recruiter/jobs/${job._id}/applicants`)
                        }
                        className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                      >
                        Applicants
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {selectedJob && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedJob(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#08152d] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 text-gray-500 hover:bg-red-100 bg-red-500
hover:text-red-600
dark:hover:bg-red-500/20
dark:hover:text-red-400
transition-all
duration-200"
              >
                <X size={24} />
              </button>{" "}
              {/* HEADER */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {selectedJob.title}
                    </h2>

                    <p className="text-gray-500 mt-1">{selectedJob.subject}</p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium
            ${
              selectedJob.status === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
            }`}
                  >
                    {selectedJob.status.charAt(0).toUpperCase() +
                      selectedJob.status.slice(1)}
                  </span>
                </div>
              </div>
              {/* DETAILS */}
              <div className="p-6" onClick={(e) => e.stopPropagation()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4">
                    <h3 className="font-semibold mb-4 text-gray-800 dark:text-white">
                      Job Information
                    </h3>

                    <div className="space-y-3 text-sm">
                      <p>
                        <strong>Position:</strong>{" "}
                        {editMode ? (
                          <input
                            value={editData.positionLevel || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                positionLevel: e.target.value,
                              })
                            }
                            className="border rounded px-2 py-1 w-full dark:bg-slate-800"
                          />
                        ) : (
                          selectedJob.positionLevel
                        )}
                      </p>

                      <p>
                        <strong>Title:</strong>{" "}
                        {editMode ? (
                          <input
                            value={editData.title || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                title: e.target.value,
                              })
                            }
                            className="border rounded px-2 py-1 w-full dark:bg-slate-800"
                          />
                        ) : (
                          selectedJob.title
                        )}
                      </p>

                      <p>
                        <strong>Subject:</strong>{" "}
                        {editMode ? (
                          <input
                            value={editData.subject || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                subject: e.target.value,
                              })
                            }
                            className="border rounded px-2 py-1 w-full dark:bg-slate-800"
                          />
                        ) : (
                          selectedJob.subject
                        )}
                      </p>
                      <p>
                        <strong>Category:</strong>{" "}
                        {editMode ? (
                          <input
                            value={editData.category || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                category: e.target.value,
                              })
                            }
                            className="border rounded px-2 py-1 w-full dark:bg-slate-800"
                          />
                        ) : (
                          selectedJob.category
                        )}
                      </p>
                      <p>
                        <strong>District:</strong>{" "}
                        {editMode ? (
                          <input
                            value={editData.district || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                district: e.target.value,
                              })
                            }
                            className="border rounded px-2 py-1 w-full dark:bg-slate-800"
                          />
                        ) : (
                          selectedJob.district
                        )}
                      </p>
                      <p>
                        <strong>Qualification:</strong>{" "}
                        {editMode ? (
                          <input
                            value={editData.qualification || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                qualification: e.target.value,
                              })
                            }
                            className="border rounded px-2 py-1 w-full dark:bg-slate-800"
                          />
                        ) : (
                          selectedJob.qualification
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4">
                    <h3 className="font-semibold mb-4 text-gray-800 dark:text-white">
                      Employment Details
                    </h3>

                    <div className="space-y-3 text-sm">
                      <p>
                        <strong>Experience:</strong>{" "}
                        {editMode ? (
                          <input
                            type="number"
                            value={editData.experienceRequired || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                experienceRequired: e.target.value,
                              })
                            }
                            className="border rounded px-2 py-1 w-full dark:bg-slate-800"
                          />
                        ) : (
                          `${selectedJob.experienceRequired} Years`
                        )}
                      </p>
                      <p>
                        <strong>Salary:</strong>{" "}
                        {editMode ? (
                          <input
                            value={editData.salaryRange || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                salaryRange: e.target.value,
                              })
                            }
                            className="border rounded px-2 py-1 w-full dark:bg-slate-800"
                          />
                        ) : (
                          selectedJob.salaryRange
                        )}
                      </p>

                      <p>
                        <strong>Posted:</strong>{" "}
                        {formatDate(selectedJob.createdAt)}
                      </p>

                      <p>
                        <strong>Expiry:</strong>{" "}
                        {formatDate(selectedJob.expiryDate)}
                      </p>
                    </div>
                  </div>
                </div>
                <JobDetailsForm
                  job={selectedJob}
                  details={jobDetails}
                  setDetails={setJobDetails}
                  editMode={editMode}
                />
                {/* FUTURE ANALYTICS */}

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Applicants</p>
                    <p className="text-2xl font-bold text-blue-500">0</p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Shortlisted</p>
                    <p className="text-2xl font-bold text-green-500">0</p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Rejected</p>
                    <p className="text-2xl font-bold text-red-500">0</p>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="flex flex-wrap gap-3 mt-8">
                  {editMode ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSaveAll}
                        className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                      >
                        Save Changes
                      </button>

                      <button
                        onClick={async () => {
                          setEditMode(false);

                          setEditData({ ...selectedJob });

                          await fetchJobDetails(selectedJob._id);
                        }}
                        className="px-5 py-2 rounded-lg bg-gray-500 text-white"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-5 py-2 rounded-lg bg-blue-500 text-white"
                      >
                        Edit Job
                      </button>

                      {selectedJob.status === "active" ? (
                        <button
                          onClick={handleDeactivateJob}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          <PauseCircle size={18} />
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={handleActivateJob}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                        >
                          <PlayCircle size={18} />
                          Activate
                        </button>
                      )}

                      <button
                        onClick={handleDeleteJob}
                        className="px-5 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800"
                      >
                        Delete Job
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterJobsTable;
