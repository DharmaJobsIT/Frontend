import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API, { API_BASE_URL } from "../api/axios";
function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "jobseeker";
  const [role, setRole] = useState(defaultRole);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOTP, setShowOTP] = useState(false);
  // const [devOTP, setDevOTP] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    const googleRole = role === "recruiter" ? "recruiter" : "jobseeker";

    window.location.href = `${API_BASE_URL}/auth/google/${googleRole}`;
  };

  useEffect(() => {
    const googleCode = searchParams.get("google_code");

    if (!googleCode) return;

    const exchangeGoogleCode = async () => {
      try {
        const res = await API.post("/auth/google/exchange", {
          code: googleCode,
        });

        localStorage.setItem("token", res.data.token);

        localStorage.setItem("user", JSON.stringify(res.data.user));

        const userRole = res.data.user.role;

        if (userRole === "admin") {
          navigate("/admin", { replace: true });
        } else if (userRole === "recruiter") {
          navigate("/recruiter/home", {
            replace: true,
          });
        } else {
          navigate("/jobseeker/home", {
            replace: true,
          });
        }
      } catch (err) {
        console.error("Google authentication failed:", err);

        alert(err.response?.data?.message || "Google authentication failed");

        navigate("/auth", { replace: true });
      }
    };

    exchangeGoogleCode();
  }, [searchParams, navigate]);

  const handleSendOTP = async () => {
    try {
      const res = await API.post("/auth/send-otp", {
        email,
      });

      setShowOTP(true);

      alert(res.data.message || "OTP sent successfully to your email");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleOTPChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOTP = [...otp];
    updatedOTP[index] = value;
    setOtp(updatedOTP);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async () => {
    try {
      let res;

      if (mode === "login") {
        res = await API.post("/auth/login", {
          email,
          password,
        });
      } else {
        res = await API.post("/auth/verify-otp", {
          name,
          email,
          password,
          role,
          otp: otp.join(""),
        });
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const userRole = res.data.user.role;

      if (userRole === "admin") navigate("/admin");
      else if (userRole === "recruiter") navigate("/recruiter/home");
      else navigate("/jobseeker/home");
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div
      className="
    min-h-screen flex items-center justify-center

    bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black
    dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800 dark:text-white
  "
    >
      <div
        className="
      w-full max-w-md p-8 rounded-2xl shadow-lg

      bg-white text-black border border-gray-200
      dark:bg-gray-900 dark:text-white dark:border-gray-700
    "
      >
        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="
    w-full mb-4 py-2 rounded-lg font-semibold
    bg-gray-200 text-black
    dark:bg-white dark:text-black
  "
        >
          Continue with Google
        </button>

        {/* Tabs */}
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setMode("login")}
            className={`
            w-1/2 py-2 rounded-l-lg
            ${
              mode === "login"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
            }
          `}
          >
            Login
          </button>

          <button
            onClick={() => setMode("register")}
            className={`
            w-1/2 py-2 rounded-r-lg
            ${
              mode === "register"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
            }
          `}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-3">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
      p-2 rounded
      bg-gray-100 text-black border border-gray-300
      dark:bg-gray-800 dark:text-white dark:border-gray-600
    "
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
            p-2 rounded

            bg-gray-100 text-black border border-gray-300
            dark:bg-gray-800 dark:text-white dark:border-gray-600
          "
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
      w-full p-2 rounded
      bg-gray-100 text-black border border-gray-300
      dark:bg-gray-800 dark:text-white dark:border-gray-600
      pr-10
    "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {mode === "register" && showOTP && (
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOTPChange(e.target.value, index)}
                  className="
          w-12 h-12 text-center text-lg rounded-lg
          bg-gray-100 border border-gray-300
          dark:bg-gray-800 dark:text-white dark:border-gray-600
        "
                />
              ))}
            </div>
          )}

          {mode === "register" && !showOTP ? (
            <button
              type="button"
              onClick={handleSendOTP}
              className="mt-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 rounded text-white"
            >
              Send OTP
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 rounded text-white"
            >
              {mode === "login" ? "Login" : "Verify & Register"}
            </button>
          )}
        </form>

        {/* Role Switch */}
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {role === "jobseeker" ? (
            <p>
              Are you a recruiter?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setRole("recruiter")}
              >
                Login/Register here
              </span>
            </p>
          ) : (
            <p>
              Are you a job seeker?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setRole("jobseeker")}
              >
                Go back
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
