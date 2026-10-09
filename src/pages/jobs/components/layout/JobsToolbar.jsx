import { Search } from "lucide-react";

export default function JobsToolbar({
  keyword,
  setKeyword,
  sort,
  setSort,
//   total,
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          All Jobs
        </h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Explore opportunities from verified institutions.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search jobs, subjects..."
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 sm:w-72 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Sort */}

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="latest">
            Latest Posted
          </option>

          <option value="oldest">
            Oldest Posted
          </option>

          <option value="salary_high">
            Salary: High to Low
          </option>

          <option value="salary_low">
            Salary: Low to High
          </option>
        </select>
      </div>
    </div>
  );
}