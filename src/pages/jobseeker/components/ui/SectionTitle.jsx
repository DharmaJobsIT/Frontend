import React from "react";

export default function SectionTitle({
  title,
  subtitle,
  action,
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}