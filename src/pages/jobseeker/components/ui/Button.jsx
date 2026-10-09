import React from "react";
import clsx from "clsx";

const variants = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg",

  secondary:
    "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg",

  outline:
    "border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-100",

  danger:
    "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg",

  ghost:
    "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}