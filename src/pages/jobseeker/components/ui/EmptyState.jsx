import React from "react";

export default function EmptyState({
  icon,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 py-16 text-center">

      {icon}

      <h3 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}