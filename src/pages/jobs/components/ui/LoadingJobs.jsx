export default function LoadingJobs() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="h-5 w-24 rounded bg-gray-200 dark:bg-slate-700" />

          <div className="mt-5 h-7 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />

          <div className="mt-3 h-5 w-1/2 rounded bg-gray-200 dark:bg-slate-700" />

          <div className="mt-8 space-y-4">
            <div className="h-4 rounded bg-gray-200 dark:bg-slate-700" />

            <div className="h-4 rounded bg-gray-200 dark:bg-slate-700" />

            <div className="h-4 rounded bg-gray-200 dark:bg-slate-700" />
          </div>

          <div className="mt-8 h-12 rounded-xl bg-gray-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}