import insightsIcon from "../../assets/icons/insights.png";
import recruitersIcon from "../../assets/icons/recruiters.png";
import jobsIcon from "../../assets/icons/jobs.png";
import applicationsIcon from "../../assets/icons/applications.png";
import intelligenceIcon from "../../assets/icons/intelligence.png";
import { useNavigate } from "react-router-dom";
function Sidebar() {
  const navigate = useNavigate();
  const menu = [
    { label: "Insights", icon: insightsIcon },
    {
      label: "Recruiters",
      icon: recruitersIcon,
      onclick: () => navigate("/admin/recruiters"),
    },
    { label: "Jobs", icon: jobsIcon },
    { label: "Applications", icon: applicationsIcon },
    { label: "Intelligence", icon: intelligenceIcon },
  ];

  return (
    <div
      className="
      w-64 shrink-0 min-h-screen p-4

      bg-white border-r border-gray-200
      dark:bg-gray-900 dark:border-gray-800
    "
    >
      <h2 className="text-xl font-bold mb-6">DharmaJobs</h2>

      <nav className="space-y-2 text-sm">
        {menu.map((item) => (
          <div
            key={item.label}
            onClick={item.onclick}
            className="
              flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
              transition-all duration-200
              hover:bg-gray-100 dark:hover:bg-gray-800
            "
          >
            <img
              src={item.icon}
              alt={item.label}
              className="w-5 h-5 hover:shadow-md transition-transform group-hover:scale-110"
            />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
