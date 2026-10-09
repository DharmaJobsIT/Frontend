export default function JobsPagination({
  page,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
      >
        Previous
      </button>

      <span className="text-sm text-gray-600 dark:text-gray-300">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-xl border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
      >
        Next
      </button>
    </div>
  );
}