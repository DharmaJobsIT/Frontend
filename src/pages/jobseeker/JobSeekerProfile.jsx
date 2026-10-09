import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ExternalLink,
  Edit3,
  FileText,
  GraduationCap,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  Upload,
  User,
  SlidersHorizontal,
  CalendarDays,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import API from "../../api/axios";

const EMPTY_PROFILE = {
  fullName: "",
  email: "",
  phone: "",
  district: "",

  highestQualification: "",
  experienceYears: 0,
  experience: [],

  dateOfBirth: "",
  gender: "",

  subjects: [],
  preferredCategories: [],
  preferredDistricts: [],

  currentSalary: "",
  expectedSalary: "",

  about: "",
  skills: [],

  resumeUrl: "",
  resumeFileName: "",
  resumeUpdatedAt: "",

  profilePhoto: "",

  jobStatus: "Actively Looking",
};

const EMPTY_EXPERIENCE = {
  organization: "",
  designation: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
};

const SUBJECT_OPTIONS = [
  "English",
  "Kannada",
  "Hindi",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Social Science",
  "Accountancy",
  "Business Studies",
  "Economics",
  "History",
  "Geography",
  "Political Science",
];

const CATEGORY_OPTIONS = [
  "Teaching",
  "Non Teaching",
  "Management",
  "Support Staff",
];

const DISTRICT_OPTIONS = [
  "Bagalkot",
  "Ballari",
  "Belagavi",
  "Bengaluru Rural",
  "Bengaluru Urban",
  "Bidar",
  "Chamarajanagar",
  "Chikkaballapur",
  "Chikkamagaluru",
  "Chitradurga",
  "Dakshina Kannada",
  "Davanagere",
  "Dharwad",
  "Gadag",
  "Hassan",
  "Haveri",
  "Kalaburagi",
  "Kodagu",
  "Kolar",
  "Koppal",
  "Mandya",
  "Mysuru",
  "Raichur",
  "Ramanagara",
  "Shivamogga",
  "Tumakuru",
  "Udupi",
  "Uttara Kannada",
  "Vijayapura",
  "Yadgir",
];

export default function JobSeekerProfile() {
  const navigate = useNavigate();

  const imageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [profile, setProfile] = useState(EMPTY_PROFILE);

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [imagePreview, setImagePreview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedResume, setSelectedResume] = useState(null);

  const [showExperienceForm, setShowExperienceForm] = useState(false);

  const [experienceForm, setExperienceForm] = useState(EMPTY_EXPERIENCE);

  const [draggingImage, setDraggingImage] = useState(false);
  const [draggingResume, setDraggingResume] = useState(false);
  const originalProfileRef = useRef(EMPTY_PROFILE);

  /*
   * ---------------------------------------------------------
   * FETCH PROFILE
   * ---------------------------------------------------------
   *
   * The exact JobSeeker profile endpoint will be wired once
   * we confirm the current backend route.
   */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * Current expected profile endpoint.
         *
         * If your existing jobseeker route uses another path,
         * we'll change only this API call.
         */
        const { data } = await API.get("/jobseekers/me");

        const jobSeeker = data?.jobSeeker || data;

        setProfile({
          ...EMPTY_PROFILE,
          ...jobSeeker,

          email: jobSeeker?.email || jobSeeker?.user?.email || "",

          fullName: jobSeeker?.fullName || jobSeeker?.user?.name || "",

          experience: jobSeeker?.experience || [],

          skills: jobSeeker?.skills || [],

          subjects: jobSeeker?.subjects || [],

          preferredCategories: jobSeeker?.preferredCategories || [],

          preferredDistricts: jobSeeker?.preferredDistricts || [],

          dateOfBirth: jobSeeker?.dateOfBirth
            ? String(jobSeeker.dateOfBirth).slice(0, 10)
            : "",

          gender: jobSeeker?.gender || "",

          resumeUpdatedAt: jobSeeker?.resumeUpdatedAt || "",
        });

        setImagePreview(jobSeeker?.profilePhoto || "");
        const normalizedProfile = {
          ...EMPTY_PROFILE,
          ...jobSeeker,

          email: jobSeeker?.email || jobSeeker?.user?.email || "",

          fullName: jobSeeker?.fullName || jobSeeker?.user?.name || "",

          experience: jobSeeker?.experience || [],

          skills: jobSeeker?.skills || [],

          subjects: jobSeeker?.subjects || [],

          preferredCategories: jobSeeker?.preferredCategories || [],

          preferredDistricts: jobSeeker?.preferredDistricts || [],

          dateOfBirth: jobSeeker?.dateOfBirth
            ? String(jobSeeker.dateOfBirth).slice(0, 10)
            : "",

          gender: jobSeeker?.gender || "",

          resumeUpdatedAt: jobSeeker?.resumeUpdatedAt || "",
        };

        setProfile(normalizedProfile);
        originalProfileRef.current = normalizedProfile;
      } catch (err) {
        console.error("Failed to fetch job seeker profile:", err);

        setError(err.response?.data?.message || "Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /*
   * ---------------------------------------------------------
   * PROFILE COMPLETION
   * ---------------------------------------------------------
   */

  const profileCompletion = useMemo(() => {
    const checks = [
      {
        label: "Full name",
        completed: Boolean(profile.fullName?.trim()),
      },
      {
        label: "Phone number",
        completed: Boolean(profile.phone?.trim()),
      },
      {
        label: "Date of birth",
        completed: Boolean(profile.dateOfBirth),
      },
      {
        label: "Gender",
        completed: Boolean(profile.gender),
      },
      {
        label: "Subjects",
        completed: profile.subjects?.length > 0,
      },
      {
        label: "Job preferences",
        completed:
          profile.preferredCategories?.length > 0 &&
          profile.preferredDistricts?.length > 0,
      },
      {
        label: "District",
        completed: Boolean(profile.district?.trim()),
      },
      {
        label: "Highest qualification",
        completed: Boolean(profile.highestQualification?.trim()),
      },
      {
        label: "Experience",
        completed:
          Number(profile.experienceYears) > 0 || profile.experience?.length > 0,
      },
      {
        label: "About",
        completed: Boolean(profile.about?.trim()),
      },
      {
        label: "Skills",
        completed: profile.skills?.length > 0,
      },
      {
        label: "Resume",
        completed: Boolean(profile.resumeUrl || selectedResume),
      },
      {
        label: "Profile photo",
        completed: Boolean(profile.profilePhoto || imagePreview),
      },
    ];

    const completed = checks.filter((item) => item.completed).length;

    return {
      percentage: Math.round((completed / checks.length) * 100),
      checks,
    };
  }, [profile, imagePreview, selectedResume]);

  /*
   * ---------------------------------------------------------
   * FIELD HANDLING
   * ---------------------------------------------------------
   */

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /*
   * ---------------------------------------------------------
   * IMAGE HANDLING
   * ---------------------------------------------------------
   */

  const handleImageSelect = (file) => {
    if (!file) return;

    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedImageTypes.includes(file.type)) {
      setError("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5 MB.");
      return;
    }

    setError("");

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleImageInput = (event) => {
    const file = event.target.files?.[0];

    handleImageSelect(file);
  };

  const handleImageDrop = (event) => {
    event.preventDefault();

    setDraggingImage(false);

    const file = event.dataTransfer.files?.[0];

    handleImageSelect(file);
  };

  /*
   * ---------------------------------------------------------
   * RESUME HANDLING
   * ---------------------------------------------------------
   */

  const handleResumeSelect = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !/\.(pdf|doc|docx)$/i.test(file.name)
    ) {
      setError("Please upload a PDF, DOC, or DOCX resume.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      return;
    }

    setError("");

    setSelectedResume(file);
  };

  const handleResumeInput = (event) => {
    const file = event.target.files?.[0];

    handleResumeSelect(file);
  };

  const handleResumeDrop = (event) => {
    event.preventDefault();

    setDraggingResume(false);

    const file = event.dataTransfer.files?.[0];

    handleResumeSelect(file);
  };

  /*
   * ---------------------------------------------------------
   * EXPERIENCE
   * ---------------------------------------------------------
   */

  const handleExperienceChange = (field, value) => {
    setExperienceForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddExperience = () => {
    if (
      !experienceForm.organization.trim() ||
      !experienceForm.designation.trim() ||
      !experienceForm.startDate
    ) {
      setError("Please enter organization, designation and start date.");

      return;
    }

    setError("");

    setProfile((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          ...experienceForm,
          endDate: experienceForm.currentlyWorking
            ? null
            : experienceForm.endDate,
        },
      ],
    }));

    setExperienceForm(EMPTY_EXPERIENCE);
    setShowExperienceForm(false);
  };

  const handleRemoveExperience = (index) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const uploadProfilePhoto = async () => {
    if (!selectedImage) {
      return;
    }

    const formData = new FormData();
    formData.append("profilePhoto", selectedImage);

    const { data } = await API.post(
      "/jobseekers/upload-profile-photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  };

  const uploadResume = async () => {
    if (!selectedResume) {
      return;
    }

    const formData = new FormData();

    formData.append("resume", selectedResume);

    const { data } = await API.post("/jobseekers/upload-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  };

  /*
   * ---------------------------------------------------------
   * SAVE PROFILE
   * ---------------------------------------------------------
   *
   * UI is ready.
   * We'll connect this to the exact backend profile API
   * after confirming the existing JobSeeker route.
   */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const toNullableNumber = (value) => {
        if (value === "" || value === null || value === undefined) {
          return null;
        }

        const normalizedValue = String(value).replace(/,/g, "").trim();

        if (!normalizedValue) {
          return null;
        }

        const numberValue = Number(normalizedValue);

        return Number.isNaN(numberValue) ? null : numberValue;
      };

      // ---------------------------------------------------------
      // 1. Prepare profile payload
      // ---------------------------------------------------------

      const payload = {
        fullName: profile.fullName?.trim() || "",

        phone: profile.phone?.trim() || "",

        district: profile.district?.trim() || "",

        highestQualification: profile.highestQualification?.trim() || "",

        experienceYears: Number(profile.experienceYears) || 0,

        experience: profile.experience || [],

        dateOfBirth: profile.dateOfBirth || null,

        gender: profile.gender || "",

        subjects: profile.subjects || [],

        preferredCategories: profile.preferredCategories || [],

        preferredDistricts: profile.preferredDistricts || [],

        currentSalary: toNullableNumber(profile.currentSalary),

        expectedSalary: toNullableNumber(profile.expectedSalary),

        about: profile.about?.trim() || "",

        skills: profile.skills || [],

        jobStatus: profile.jobStatus || "Actively Looking",
      };

      // ---------------------------------------------------------
      // 2. Save normal profile information
      // ---------------------------------------------------------

      const { data } = await API.patch("/jobseekers/me", payload);

      const updatedProfile = data?.jobSeeker || data;

      // ---------------------------------------------------------
      // 3. Upload new profile photo
      // ---------------------------------------------------------

      if (selectedImage) {
        await uploadProfilePhoto();
      }

      // ---------------------------------------------------------
      // 4. Upload new resume
      // ---------------------------------------------------------

      if (selectedResume) {
        await uploadResume();
      }

      // ---------------------------------------------------------
      // 5. Fetch fresh profile
      //    This gives us fresh signed S3 URLs
      // ---------------------------------------------------------

      const { data: refreshedData } = await API.get("/jobseekers/me");

      const refreshedProfile = refreshedData?.jobSeeker || refreshedData;

      // ---------------------------------------------------------
      // 6. Normalize the refreshed profile
      // ---------------------------------------------------------

      const normalizedProfile = {
        ...EMPTY_PROFILE,
        ...refreshedProfile,

        email:
          refreshedProfile?.email ||
          refreshedProfile?.user?.email ||
          updatedProfile?.email ||
          updatedProfile?.user?.email ||
          profile.email ||
          "",

        fullName:
          refreshedProfile?.fullName ||
          refreshedProfile?.user?.name ||
          updatedProfile?.fullName ||
          updatedProfile?.user?.name ||
          profile.fullName ||
          "",

        experience: refreshedProfile?.experience || [],

        skills: refreshedProfile?.skills || [],

        subjects: refreshedProfile?.subjects || [],

        preferredCategories: refreshedProfile?.preferredCategories || [],

        preferredDistricts: refreshedProfile?.preferredDistricts || [],

        dateOfBirth: refreshedProfile?.dateOfBirth
          ? String(refreshedProfile.dateOfBirth).slice(0, 10)
          : "",

        gender: refreshedProfile?.gender || "",

        resumeUpdatedAt: refreshedProfile?.resumeUpdatedAt || "",
      };

      // ---------------------------------------------------------
      // 7. Update local profile state
      // ---------------------------------------------------------

      setProfile(normalizedProfile);

      // ---------------------------------------------------------
      // 8. Save this as the original profile
      //    so Cancel can restore the latest saved version
      // ---------------------------------------------------------

      originalProfileRef.current = normalizedProfile;

      // ---------------------------------------------------------
      // 9. Keep profile image preview synchronized
      //    with the fresh signed S3 URL
      // ---------------------------------------------------------

      setImagePreview(normalizedProfile?.profilePhoto || "");

      // ---------------------------------------------------------
      // 10. Finish save state
      // ---------------------------------------------------------

      setSuccess("Profile updated successfully.");

      setEditMode(false);

      setSelectedImage(null);
      setSelectedResume(null);

      setExperienceForm(EMPTY_EXPERIENCE);

      setShowExperienceForm(false);
    } catch (err) {
      console.error("Failed to save profile:", err);

      setError(err?.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * PAGE
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-gray-50 pb-16 dark:bg-slate-950">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/jobseeker/home")}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <ArrowLeft size={18} />

            <span className="hidden sm:inline">Back to Dashboard</span>

            <span className="sm:hidden">Back</span>
          </button>

          {!editMode ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setEditMode(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setProfile(originalProfileRef.current);
                  setEditMode(false);
                  setError("");
                  setSuccess("");
                  setSelectedImage(null);
                  setSelectedResume(null);
                  setExperienceForm(EMPTY_EXPERIENCE);
                  setShowExperienceForm(false);
                  setImagePreview(
                    originalProfileRef.current?.profilePhoto || "",
                  );
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-6 lg:px-8">
        {/* Alerts */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <X size={18} className="mt-0.5 shrink-0" />

            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
            <Check size={18} className="mt-0.5 shrink-0" />

            <p>{success}</p>
          </div>
        )}

        {/* ===================================================
            PROFILE HERO
        ==================================================== */}

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Banner */}

          <div className="h-32 bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-500 sm:h-40" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-16 flex flex-col gap-6 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
              {/* Profile image */}

              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={profile.fullName || "Profile"}
                    className="h-32 w-32 rounded-2xl border-4 border-white bg-white object-cover shadow-lg dark:border-slate-900"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 shadow-lg dark:border-slate-900 dark:from-slate-700 dark:to-slate-800 dark:text-blue-300">
                    <User size={52} />
                  </div>
                )}

                {editMode && (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
                    title="Change profile photo"
                  >
                    <ImagePlus size={16} />
                  </button>
                )}
              </div>

              {/* Name */}

              <div className="flex-1 sm:pb-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-700 dark:text-white sm:text-3xl">
                    {profile.fullName || "Your Name"}
                  </h1>

                  {profile.jobStatus && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      {profile.jobStatus}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                  {profile.district && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={15} />
                      {profile.district}
                    </span>
                  )}

                  {profile.email && (
                    <span className="inline-flex items-center gap-1.5">
                      <Mail size={15} />
                      {profile.email}
                    </span>
                  )}

                  {profile.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={15} />
                      {profile.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden image input */}

            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageInput}
            />

            {/* Edit-mode image uploader */}

            {editMode && (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDraggingImage(true);
                }}
                onDragLeave={() => setDraggingImage(false)}
                onDrop={handleImageDrop}
                onClick={() => imageInputRef.current?.click()}
                className={`mt-6 cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition ${
                  draggingImage
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-950/50"
                }`}
              >
                <ImagePlus size={26} className="mx-auto text-blue-600" />

                <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Drag & drop your profile photo here
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  or click to browse • Maximum 5 MB
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            PROFILE COMPLETION
        ==================================================== */}

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Check size={18} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white">
                    Profile Completion
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Complete your profile to improve your visibility to
                    recruiters.
                  </p>
                </div>
              </div>
            </div>

            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {profileCompletion.percentage}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
              style={{
                width: `${profileCompletion.percentage}%`,
              }}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {profileCompletion.checks.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    item.completed
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-gray-100 text-gray-400 dark:bg-slate-800"
                  }`}
                >
                  <Check size={12} />
                </div>

                <span
                  className={
                    item.completed
                      ? "text-gray-700 dark:text-gray-300"
                      : "text-gray-400 dark:text-gray-500"
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================
            MAIN GRID
        ==================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* =================================================
              LEFT / MAIN
          ================================================== */}

          <div className="space-y-6 lg:col-span-2">
            {/* ===============================================
                PERSONAL INFORMATION
            ================================================ */}

            <ProfileCard
              icon={<User size={19} />}
              title="Personal Information"
              description="Your basic contact and identification details."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  value={profile.fullName}
                  editing={editMode}
                  required
                  onChange={(value) => handleChange("fullName", value)}
                />

                <Field
                  label="Email"
                  value={profile.email}
                  editing={false}
                  icon={<Mail size={15} />}
                />

                <Field
                  label="Phone"
                  value={profile.phone}
                  editing={editMode}
                  required
                  icon={<Phone size={15} />}
                  onChange={(value) => handleChange("phone", value)}
                />

                <Field
                  label="Date of Birth"
                  value={profile.dateOfBirth}
                  editing={editMode}
                  type="date"
                  icon={<CalendarDays size={15} />}
                  onChange={(value) => handleChange("dateOfBirth", value)}
                />

                <Field
                  label="Gender"
                  value={profile.gender}
                  editing={editMode}
                  type="select"
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" },
                  ]}
                  onChange={(value) => handleChange("gender", value)}
                />

                <Field
                  label="District"
                  value={profile.district}
                  editing={editMode}
                  type="select"
                  required
                  icon={<MapPin size={15} />}
                  options={DISTRICT_OPTIONS.map((district) => ({
                    label: district,
                    value: district,
                  }))}
                  onChange={(value) => handleChange("district", value)}
                />

                <Field
                  label="Highest Qualification"
                  value={profile.highestQualification}
                  editing={editMode}
                  required
                  icon={<GraduationCap size={15} />}
                  onChange={(value) =>
                    handleChange("highestQualification", value)
                  }
                />

                <Field
                  label="Experience"
                  value={profile.experienceYears}
                  displayValue={`${profile.experienceYears || 0} ${
                    Number(profile.experienceYears) === 1 ? "year" : "years"
                  }`}
                  editing={editMode}
                  type="number"
                  onChange={(value) => handleChange("experienceYears", value)}
                />
              </div>
            </ProfileCard>

            {/* ===============================================
                PROFESSIONAL INFORMATION
            ================================================ */}

            <ProfileCard
              icon={<BriefcaseBusiness size={19} />}
              title="Professional Information"
              description="Show recruiters what you bring to the table."
            >
              {/* Job status */}

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Job Status
                </label>

                {editMode ? (
                  <div className="relative">
                    <select
                      value={profile.jobStatus}
                      onChange={(event) =>
                        handleChange("jobStatus", event.target.value)
                      }
                      className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option>Actively Looking</option>

                      <option>Open to Opportunities</option>

                      <option>Not Looking</option>
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                ) : (
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {profile.jobStatus || "Not specified"}
                  </span>
                )}
              </div>

              {/* Salary */}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Current Salary / month"
                  value={
                    profile.currentSalary
                      ? `₹${Number(profile.currentSalary).toLocaleString(
                          "en-IN",
                        )}`
                      : ""
                  }
                  editing={editMode}
                  prefix="₹"
                  type="number"
                  onChange={(value) => handleChange("currentSalary", value)}
                />

                <Field
                  label="Expected Salary / month"
                  value={
                    profile.expectedSalary
                      ? `₹${Number(profile.expectedSalary).toLocaleString(
                          "en-IN",
                        )}`
                      : ""
                  }
                  editing={editMode}
                  prefix="₹"
                  type="number"
                  onChange={(value) => handleChange("expectedSalary", value)}
                />
              </div>

              {/* About */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  About Me
                </label>

                {editMode ? (
                  <textarea
                    rows={5}
                    value={profile.about || ""}
                    onChange={(event) =>
                      handleChange("about", event.target.value)
                    }
                    placeholder="Tell recruiters about yourself, your teaching experience and professional strengths..."
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                ) : (
                  <p className="rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-600 dark:bg-slate-950 dark:text-gray-300">
                    {profile.about || "No profile summary has been added yet."}
                  </p>
                )}
              </div>

              {/* Skills */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Skills
                </label>

                <SkillsEditor
                  skills={profile.skills || []}
                  editing={editMode}
                  onChange={(skills) => handleChange("skills", skills)}
                />
              </div>
            </ProfileCard>

            <ProfileCard
              icon={<SlidersHorizontal size={19} />}
              title="Job Preferences"
              description="Tell recruiters what kind of opportunities you are looking for."
            >
              <div className="space-y-5">
                <MultiSelectField
                  label="Subjects"
                  value={profile.subjects || []}
                  editing={editMode}
                  options={SUBJECT_OPTIONS}
                  onChange={(value) => handleChange("subjects", value)}
                />

                <MultiSelectField
                  label="Preferred Categories"
                  value={profile.preferredCategories || []}
                  editing={editMode}
                  options={CATEGORY_OPTIONS}
                  onChange={(value) =>
                    handleChange("preferredCategories", value)
                  }
                />

                <MultiSelectField
                  label="Preferred Districts"
                  value={profile.preferredDistricts || []}
                  editing={editMode}
                  options={DISTRICT_OPTIONS}
                  onChange={(value) =>
                    handleChange("preferredDistricts", value)
                  }
                />
              </div>
            </ProfileCard>

            {/* ===============================================
                EXPERIENCE
            ================================================ */}

            <ProfileCard
              icon={<BriefcaseBusiness size={19} />}
              title="Work Experience"
              description="Your professional experience and career history."
              action={
                editMode ? (
                  <button
                    type="button"
                    onClick={() => {
                      setExperienceForm(EMPTY_EXPERIENCE);
                      setShowExperienceForm(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                  >
                    <Plus size={15} />
                    Add Experience
                  </button>
                ) : null
              }
            >
              {profile.experience?.length > 0 ? (
                <div className="space-y-6">
                  {profile.experience.map((item, index) => (
                    <div
                      key={`${item.organization}-${index}`}
                      className="relative pl-8"
                    >
                      {/* Timeline */}

                      <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <div className="h-2 w-2 rounded-full bg-current" />
                      </div>

                      {index !== profile.experience.length - 1 && (
                        <div className="absolute bottom-[-24px] left-[9px] top-7 w-px bg-gray-200 dark:bg-slate-700" />
                      )}

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {item.designation || "Designation"}
                          </h3>

                          <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                            {item.organization || "Organization"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(item.startDate)} -{" "}
                            {item.currentlyWorking
                              ? "Present"
                              : formatDate(item.endDate)}
                          </p>
                        </div>

                        {editMode && (
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(index)}
                            className="self-start rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                            title="Remove experience"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptySection
                  icon={<BriefcaseBusiness size={22} />}
                  title="No experience added"
                  description={
                    editMode
                      ? "Add your professional experience to strengthen your profile."
                      : "Your professional experience will appear here."
                  }
                />
              )}

              {/* Add experience form */}

              {editMode && showExperienceForm && (
                <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/50 dark:bg-blue-500/5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Add Experience
                    </h3>

                    <button
                      type="button"
                      onClick={() => setShowExperienceForm(false)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-gray-700 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Organization"
                      required
                      value={experienceForm.organization}
                      onChange={(value) =>
                        handleExperienceChange("organization", value)
                      }
                    />

                    <Input
                      label="Designation"
                      required
                      value={experienceForm.designation}
                      onChange={(value) =>
                        handleExperienceChange("designation", value)
                      }
                    />

                    <Input
                      label="Start Date"
                      type="date"
                      required
                      value={experienceForm.startDate}
                      onChange={(value) =>
                        handleExperienceChange("startDate", value)
                      }
                    />

                    {!experienceForm.currentlyWorking && (
                      <Input
                        label="End Date"
                        type="date"
                        value={experienceForm.endDate}
                        onChange={(value) =>
                          handleExperienceChange("endDate", value)
                        }
                      />
                    )}
                  </div>

                  <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={experienceForm.currentlyWorking}
                      onChange={(event) =>
                        handleExperienceChange(
                          "currentlyWorking",
                          event.target.checked,
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    I currently work here
                  </label>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      Add Experience
                    </button>
                  </div>
                </div>
              )}
            </ProfileCard>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================== */}

          <div className="space-y-6">
            {/* ===============================================
                RESUME
            ================================================ */}

            <ProfileCard
              icon={<FileText size={19} />}
              title="Resume"
              description="Keep your latest resume available to recruiters."
            >
              {editMode ? (
                <>
                  {/* Current uploaded resume */}
                  {profile.resumeUrl && (
                    <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-950/50">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                          <FileText size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {profile.resumeFileName || "Current Resume"}
                          </p>

                          {profile.resumeUpdatedAt && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Updated{" "}
                              {new Date(
                                profile.resumeUpdatedAt,
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
                      >
                        <ExternalLink size={15} />
                        View
                      </a>
                    </div>
                  )}

                  {/* Upload input */}
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleResumeInput}
                  />

                  {/* Upload dropzone */}
                  <div
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDraggingResume(true);
                    }}
                    onDragLeave={() => setDraggingResume(false)}
                    onDrop={handleResumeDrop}
                    onClick={() => resumeInputRef.current?.click()}
                    className={`cursor-pointer rounded-xl border-2 border-dashed p-7 text-center transition ${
                      draggingResume
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                        : "border-gray-300 bg-gray-50 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-950/50"
                    }`}
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Upload size={22} />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Upload a new resume
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Drag & drop or click to browse
                    </p>

                    <p className="mt-3 text-[11px] text-gray-400">
                      PDF, DOC or DOCX • Maximum 5 MB
                    </p>
                  </div>

                  {/* Newly selected resume */}
                  {selectedResume && (
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/50 dark:bg-blue-500/10">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText
                          size={20}
                          className="shrink-0 text-blue-600"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {selectedResume.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {formatFileSize(selectedResume.size)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedResume(null)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-red-600 dark:hover:bg-slate-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </>
              ) : profile.resumeUrl ? (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-950/50">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <FileText size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {profile.resumeFileName || "Current Resume"}
                      </p>

                      {profile.resumeUpdatedAt && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Updated{" "}
                          {new Date(
                            profile.resumeUpdatedAt,
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
                  >
                    <ExternalLink size={15} />
                    View
                  </a>
                </div>
              ) : (
                <EmptyState text="No resume uploaded yet." />
              )}
            </ProfileCard>

            {/* ===============================================
                PROFILE CHECKLIST
            ================================================ */}

            <ProfileCard
              icon={<Check size={19} />}
              title="Profile Strength"
              description="A complete profile gets more attention from recruiters."
            >
              <div className="flex items-center gap-5">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-gray-100 dark:text-slate-800"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${
                        profileCompletion.percentage * 2.64
                      } 264`}
                      className="text-blue-600 transition-all duration-500"
                    />
                  </svg>

                  <span className="absolute text-lg font-black text-gray-900 dark:text-white">
                    {profileCompletion.percentage}%
                  </span>
                </div>

                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {profileCompletion.percentage >= 80
                      ? "Excellent"
                      : profileCompletion.percentage >= 50
                        ? "Good progress"
                        : "Getting started"}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Complete the remaining sections to make your profile
                    stronger.
                  </p>
                </div>
              </div>
            </ProfileCard>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   PROFILE CARD
============================================================ */

function ProfileCard({ icon, title, description, action, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-gray-200 px-5 py-5 dark:border-slate-800 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              {icon}
            </div>

            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                {title}
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                {description}
              </p>
            </div>
          </div>

          {action}
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

/* ============================================================
   FIELD
============================================================ */
function Field({
  label,
  value,
  editing,
  onChange,
  type = "text",
  required = false,
  icon,
  prefix,
  options = [],
  displayValue,
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {icon}

        {label}

        {required && <span className="text-red-500">*</span>}
      </label>

      {editing ? (
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              {prefix}
            </span>
          )}

          {type === "select" ? (
            <select
              value={value || ""}
              onChange={(event) => onChange?.(event.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Select {label}</option>

              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={
                type === "number"
                  ? String(value || "").replace(/[₹,]/g, "")
                  : value || ""
              }
              onChange={(event) => onChange?.(event.target.value)}
              className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white ${
                prefix ? "pl-9" : ""
              }`}
            />
          )}
        </div>
      ) : (
        <div className="min-h-[44px] rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 dark:bg-slate-950 dark:text-gray-200">
          {displayValue ?? value ?? "Not provided"}{" "}
        </div>
      )}
    </div>
  );
}

function MultiSelectField({
  label,
  value = [],
  editing,
  options = [],
  onChange,
}) {
  const selectedValues = Array.isArray(value) ? value : [];

  const toggleOption = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((item) => item !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </label>

      {editing ? (
        <div className="rounded-xl border border-gray-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
          <div className="flex flex-wrap gap-2">
            {options.map((option) => {
              const selected = selectedValues.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleOption(option)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    selected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedValues.length > 0 && (
            <div className="mt-3 border-t border-gray-100 pt-3 dark:border-slate-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Selected: {selectedValues.length}
              </p>
            </div>
          )}
        </div>
      ) : selectedValues.length > 0 ? (
        <div className="flex min-h-[44px] flex-wrap items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 dark:bg-slate-950">
          {selectedValues.map((item) => (
            <span
              key={item}
              className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <div className="min-h-[44px] rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-400 dark:bg-slate-950 dark:text-gray-500">
          Not provided
        </div>
      )}
    </div>
  );
}
/* ============================================================
   INPUT
============================================================ */

function Input({ label, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </div>
  );
}

/* ============================================================
   SKILLS EDITOR
============================================================ */

function SkillsEditor({ skills, editing, onChange }) {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    if (skills.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
      setSkillInput("");
      return;
    }

    onChange([...skills, value]);

    setSkillInput("");
  };

  const removeSkill = (index) => {
    onChange(skills.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
            >
              {skill}

              {editing && (
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="rounded-full hover:text-red-500"
                >
                  <X size={13} />
                </button>
              )}
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">
            No skills added yet.
          </p>
        )}
      </div>

      {editing && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(event) => setSkillInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add a skill"
            className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          <button
            type="button"
            onClick={addSkill}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   EMPTY SECTION
============================================================ */

function EmptySection({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center dark:border-slate-700 dark:bg-slate-950/50">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-500">
        {icon}
      </div>

      <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-500 dark:text-gray-500">
        {description}
      </p>
    </div>
  );
}
function EmptyState({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center dark:border-slate-700 dark:bg-slate-950/50">
      <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function formatDate(date) {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
