import { useState, useEffect } from "react";
import API from "../../api/axios";

function RecruiterProfile() {
  const [recruiter, setRecruiter] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instituteName: "",
    district: "",
    contactPhone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      return alert("All fields are required");
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("Passwords do not match");
    }

    if (passwordData.newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    try {
      const res = await API.put("/recruiters/change-password", passwordData);

      alert(res.data.message);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error updating password");
    }
  };

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/recruiters/me");

        setRecruiter(res.data);

        setFormData({
          name: res.data.user?.name || "",
          email: res.data.user?.email || "",
          instituteName: res.data.instituteName || "",
          district: res.data.district || "",
          contactPhone: res.data.contactPhone || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await API.put("/recruiters/profile/update", formData);

      alert("Profile updated successfully");
      setRecruiter(res.data.recruiter);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!recruiter) {
    return <p className="text-center mt-10">Loading...</p>;
  }
  const isChanged =
    formData.name !== recruiter.user?.name ||
    formData.instituteName !== recruiter.instituteName ||
    formData.district !== recruiter.district;

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Profile Settings
      </h1>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md max-w-xl">
        {/* AVATAR */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-lg font-bold">
            {formData.name?.charAt(0)}
          </div>

          <div>
            <p className="font-semibold text-gray-800 dark:text-white">
              {formData.name}
            </p>
            <p className="text-sm text-gray-500">{formData.email}</p>
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <input
            disabled={!editMode}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
          />

          <input
            disabled
            value={formData.email}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
          />

          <input
            disabled={!editMode}
            value={formData.instituteName}
            onChange={(e) =>
              setFormData({ ...formData, instituteName: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
          />

          <input
            disabled={!editMode}
            value={formData.district}
            onChange={(e) =>
              setFormData({ ...formData, district: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex gap-3">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                disabled={!isChanged}
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </>
          )}
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Change Password
          </h3>

          {/* CURRENT PASSWORD */}
          <div className="relative mb-3">
            <input
              type={showPassword.current ? "text" : "password"}
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
            />

            <button
              onClick={() => toggleVisibility("current")}
              className="absolute right-3 top-2 text-sm text-gray-500"
            >
              {showPassword.current ? "Hide" : "Show"}
            </button>
          </div>

          {/* NEW PASSWORD */}
          <div className="relative mb-3">
            <input
              type={showPassword.new ? "text" : "password"}
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
            />

            <button
              onClick={() => toggleVisibility("new")}
              className="absolute right-3 top-2 text-sm text-gray-500"
            >
              {showPassword.new ? "Hide" : "Show"}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative mb-3">
            <input
              type={showPassword.confirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
            />

            <button
              onClick={() => toggleVisibility("confirm")}
              className="absolute right-3 top-2 text-sm text-gray-500"
            >
              {showPassword.confirm ? "Hide" : "Show"}
            </button>
          </div>

          {/* BUTTON */}
          <button
            onClick={handlePasswordChange}
            className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecruiterProfile;
