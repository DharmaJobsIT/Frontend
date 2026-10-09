import { Outlet } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import logo from "../assets/logo.png";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      {/* Header */}

      <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <img
          src={logo}
          alt="DharmaJobs"
          className="w-auto h-10 object-contain"
        />
        <p className="text-gray-800 text-center max-w-md mb-6 dark:text-gray-400">
          Empower People, Strengthen the Nation.
        </p>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Page Content */}
      <main className="">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="
  mt-auto p-4 text-center text-sm
  bg-gray-100 text-gray-600
  dark:bg-gray-800 dark:text-gray-400
"
      >
        <div className="flex justify-center gap-6 flex-wrap">
          <a href="#" className="hover:underline">
            About Us
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400">
          &copy; 2026 DharmaJobs. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default MainLayout;
