import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // add your logo

function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="
  min-h-screen flex flex-col items-center 

  bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black
  dark:bg-gradient-to-br dark:from-blue-900 dark:via-slate-900 dark:to-gray-900 dark:text-white
"
    >
      {" "}
      <img
        src={logo}
        alt="DharmaJobs"
        className="w-56 mb-8 object-contain py-4"
      />{" "}
      <h1 className="text-4xl font-bold mb-4 text-center">DharmaJobs</h1>
      <p className="text-gray-800 text-center max-w-md mb-6 dark:text-gray-400">
        Empower People, Strengthen the Nation. A dedicated platform for
        education sector hiring.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-3xl">
        {/* Job Seeker */}
        <div
          className="
      p-4 rounded-xl 
      bg-white/10 backdrop-blur-md border border-white/10

      transition-all duration-300 ease-in-out
      hover:p-6 hover:scale-[1.03] hover:shadow-xl
    "
        >
          <h3 className="text-lg font-semibold mb-2">Looking for Jobs?</h3>

          <button
            onClick={() => navigate("/auth?role=jobseeker")}
            className="
        w-full py-3 rounded-lg 
        bg-gradient-to-r from-blue-500 to-teal-400 
        hover:opacity-90 text-white
      "
          >
            Find Jobs
          </button>
        </div>

        {/* Recruiter */}
        <div
          className="
      p-4 rounded-xl 
      bg-white/10 backdrop-blur-md border border-white/10

      transition-all duration-300 ease-in-out
      hover:p-6 hover:scale-[1.03] hover:shadow-xl
    "
        >
          <h3 className="text-lg font-semibold mb-2">Hiring Talent?</h3>

          <button
            onClick={() => navigate("/auth?role=recruiter")}
            className="
        w-full py-3 rounded-lg 
        bg-gray-700 hover:bg-gray-600
        text-white
      "
          >
            Hire Talent
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
