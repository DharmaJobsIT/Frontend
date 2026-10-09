import React from "react";
import clsx from "clsx";

const variants = {
  blue:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",

  green:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",

  amber:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",

  red:
    "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",

  gray:
    "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300",
};

export default function Badge({
  children,
  variant = "blue",
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}