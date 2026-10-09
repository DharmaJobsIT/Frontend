import { Filter, RotateCcw } from "lucide-react";

export default function JobsFilterSidebar({
  filters,
  setFilters,
  jobs,
}) {
  const updateFilter = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      subject: "",
      qualification: "",
      district: "",
      institute: "",
      freshness: "",
    });
  };

  const subjects = [
    ...new Set(
      jobs
        .map((job) => job.subject)
        .filter(Boolean),
    ),
  ];

  const qualifications = [
    ...new Set(
      jobs
        .map((job) => job.qualification)
        .filter(Boolean),
    ),
  ];

  const districts = [
    ...new Set(
      jobs
        .map((job) => job.district)
        .filter(Boolean),
    ),
  ];

  const institutes = [
    ...new Set(
      jobs
        .map((job) => job.instituteName)
        .filter(Boolean),
    ),
  ];

  return (
    <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-blue-600" />

          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Filters
          </h2>
        </div>

        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <RotateCcw size={14} />

          Reset
        </button>
      </div>

      <div className="space-y-6">

        {/* Subject */}

        <FilterSelect
          label="Subject"
          value={filters.subject}
          onChange={(value) =>
            updateFilter("subject", value)
          }
          options={subjects}
        />

        {/* Qualification */}

        <FilterSelect
          label="Qualification"
          value={filters.qualification}
          onChange={(value) =>
            updateFilter("qualification", value)
          }
          options={qualifications}
        />

        {/* District */}

        <FilterSelect
          label="District"
          value={filters.district}
          onChange={(value) =>
            updateFilter("district", value)
          }
          options={districts}
        />

        {/* Institute */}

        <FilterSelect
          label="Institute"
          value={filters.institute}
          onChange={(value) =>
            updateFilter("institute", value)
          }
          options={institutes}
        />

        {/* Freshness */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Freshness
          </label>

          <select
            value={filters.freshness}
            onChange={(e) =>
              updateFilter("freshness", e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">
              Any Time
            </option>

            <option value="today">
              Posted Today
            </option>

            <option value="15days">
              Last 15 Days
            </option>

            <option value="30days">
              Last 30 Days
            </option>
          </select>
        </div>

      </div>
    </aside>
  );
}


function FilterSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      >
        <option value="">
          All {label}s
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}