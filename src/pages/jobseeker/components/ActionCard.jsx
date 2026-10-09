import { Link } from "react-router-dom";
import Card from "./ui/Card";

export default function ActionCard({
  icon,
  title,
  description,
  color = "blue",
  to = "#",
  disabled = false,
}) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-100 dark:bg-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      hover: "group-hover:bg-blue-600 group-hover:text-white",
    },
    emerald: {
      bg: "bg-emerald-100 dark:bg-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      hover: "group-hover:bg-emerald-600 group-hover:text-white",
    },
    rose: {
      bg: "bg-rose-100 dark:bg-rose-500/20",
      text: "text-rose-600 dark:text-rose-400",
      hover: "group-hover:bg-rose-600 group-hover:text-white",
    },
    amber: {
      bg: "bg-amber-100 dark:bg-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      hover: "group-hover:bg-amber-600 group-hover:text-white",
    },
  };

  const current = colorClasses[color] || colorClasses.blue;

  const content = (
    <Card
      className={`group p-6 h-full ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer"
      }`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
          current.bg
        } ${current.text} ${
          disabled ? "" : current.hover
        }`}
      >
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-6">
        {description}
      </p>
    </Card>
  );

  if (disabled) {
    return <div aria-disabled="true">{content}</div>;
  }

  return <Link to={to}>{content}</Link>;
}