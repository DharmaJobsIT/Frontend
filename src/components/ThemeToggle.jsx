import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/useTheme";

function ThemeToggle() {
  const { dark, setDark } = useTheme();

  return (
    <button
      onClick={() => setDark(!dark)}
      className="
        relative flex items-center w-16 h-8 px-1 rounded-full
       bg-gray-300 dark:bg-gray-700 shadow-inner
        transition-all duration-300
      "
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* Sliding Circle */}
      <div
        className={`
          absolute top-1 left-1 w-6 h-6 rounded-full
          bg-white shadow-md
          flex items-center justify-center
          transition-all duration-300
          ${dark ? "translate-x-8" : ""}
        `}
      >
        {dark ? (
          <Moon size={14} className="text-gray-800" />
        ) : (
          <Sun size={14} className="text-yellow-500" />
        )}
      </div>
    </button>
  );
}

export default ThemeToggle;
