import React from "react";
import clsx from "clsx";

export default function Card({
  children,
  className = "",
  hover = true,
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
}