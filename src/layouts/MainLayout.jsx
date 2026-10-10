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

        {/* Sliding Notification */}
        <div className="flex-1 mx-6 overflow-hidden">
          <div className="relative overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee text-sm font-medium text-amber-600 dark:text-amber-400">
              🚧 Draft Website — Still under Construction. Expect Updates Often.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Page Content */}
      <main className="">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto px-4 py-5 text-sm bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a href="#" className="hover:text-gray-900 dark:hover:text-white">
            About Us
          </a>

          <a href="#" className="hover:text-gray-900 dark:hover:text-white">
            Contact Us
          </a>

          <a href="#" className="hover:text-gray-900 dark:hover:text-white">
            Privacy Policy
          </a>

          <a href="#" className="hover:text-gray-900 dark:hover:text-white">
            Terms
          </a>

          <span className="hidden sm:inline text-gray-400 dark:text-gray-600">
            |
          </span>

          <span>
            © 2026 DharmaJobs, Powered by{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              BrandElite
            </span>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;