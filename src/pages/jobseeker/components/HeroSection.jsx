// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaUniversity,
  FaSearch,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import logo from "../../../assets/logo.png";

import Button from "./ui/Button";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";

  return "Good Evening";
};

const getUserName = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    return user?.name?.split(" ")[0] || "Educator";
  } catch {
    return "Educator";
  }
};

export default function HeroSection() {
  const navigate = useNavigate();

  const greeting = getGreeting();
  const userName = getUserName();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <section className="relative overflow-hidden">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />

      {/* =====================================================
          DECORATIVE BLURS
      ====================================================== */}

      <div className="absolute -left-32 -top-40 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />

      {/* =====================================================
          HERO CONTAINER
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl px-6 py-8 sm:py-10 lg:py-12">
        {/* ===================================================
            TOP RIGHT ACTIONS
        ==================================================== */}

        <div className="mb-8 flex justify-end">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 p-1.5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
            {/* Profile */}

            <button
              type="button"
              onClick={() => navigate("/jobseeker/profile")}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-gray-200 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
            >
              <FaUser size={14} />

              <span className="hidden sm:inline">Profile</span>
            </button>

            {/* Divider */}

            <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <FaSignOutAlt size={14} />

              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* ===================================================
            MAIN HERO
        ==================================================== */}

        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* =================================================
              LEFT
          ================================================== */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Greeting */}

            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
              👋 {greeting}, {userName}
            </span>

            {/* Heading */}

            <h1 className="mt-6 text-5xl font-black leading-tight text-gray-900 dark:text-white lg:text-6xl">
              Find Your Next{" "}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Teaching Opportunity
              </span>
            </h1>

            {/* Description */}

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              Discover verified schools, colleges and universities looking for
              passionate educators across Karnataka.
            </p>

            {/* Actions */}

            <div className="mt-10 flex flex-wrap gap-4">
                <Button onClick={() => navigate("/jobs?focus=search")}>
                  <FaSearch />
                  Explore Jobs
                </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/jobseeker/profile")}
              >
                <FaUser />
                Profile
              </Button>
            </div>

            {/* =================================================
                STATS
            ================================================== */}

            <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-6">
              <Stat
                icon={<MdVerified />}
                title="Verified"
                subtitle="Institutions"
              />

              <Stat
                icon={<FaUniversity />}
                title="Trusted"
                subtitle="Recruiters"
              />

              <Stat
                icon={<FaChalkboardTeacher />}
                title="Teaching"
                subtitle="Careers"
              />
            </div>
          </motion.div>

          {/* =================================================
              RIGHT
          ================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Glow */}

              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 opacity-30 blur-3xl animate-pulse" />

              {/* Logo */}

              <div className="relative flex h-72 w-72 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:h-80 sm:w-80">
                <img
                  src={logo}
                  alt="DharmaJobs"
                  className="h-52 w-52 object-contain sm:h-60 sm:w-60"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================
   STAT
========================================================== */

function Stat({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow sm:h-12 sm:w-12 dark:bg-slate-800">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-gray-900 sm:text-base dark:text-white">
          {title}
        </p>

        <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
