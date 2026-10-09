export default function EmptyJobs() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center dark:border-slate-700">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        No Jobs Found
      </h3>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Try changing your filters or search keywords.
      </p>
    </div>
  );
}