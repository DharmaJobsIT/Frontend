import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Briefcase,
  Building2,
  Wrench,
  MapPin,
  Award,
} from "lucide-react";

import Card from "./ui/Card";
import Button from "./ui/Button";
import SectionTitle from "./ui/SectionTitle";

import { JOB_CATEGORIES } from "../../../utils/constants/categories";
import { SUBJECTS } from "../../../utils/constants/subjects";
import { DISTRICTS } from "../../../utils/constants/districts";
import { QUALIFICATIONS } from "../../../utils/constants/qualifications";
import { POSITION_LEVELS } from "../../../utils/constants/positionLevels";

const iconMap = {
  Teaching: GraduationCap,
  NonTeaching: Briefcase,
  Management: Building2,
  SupportStaff: Wrench,
};

export default function SearchSection() {
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    query: "",
    district: "",
    qualification: "",
    positionLevel: "",
    category: "",
  });

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const selectCategory = (category) => {
    setFilters((prev) => ({
      ...prev,
      category,
    }));
  };

  const handleSearch = () => {
    console.log(filters);

    // Later:
    // navigate(`/jobs?query=...`)
    // OR
    // fetchJobs(filters)
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 lg:py-12">
      <SectionTitle
        title="Find Your Perfect Opportunity"
        subtitle="Search teaching and education jobs across trusted institutions."
      />

      <Card className="p-8">

        {/* Search */}

        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            name="query"
            value={filters.query}
            onChange={handleChange}
            placeholder="Search by Subject, Position or Institution..."
            className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Toggle */}

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 mt-6 text-blue-600 font-medium hover:text-blue-700 transition"
        >
          Advanced Filters

          {showFilters ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        {/* Filters */}

        {showFilters && (
          <div className="grid md:grid-cols-3 gap-5 mt-6">

            {/* District */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                District
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  name="district"
                  value={filters.district}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 py-3"
                >
                  <option value="">All Districts</option>

                  {DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Qualification */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Qualification
              </label>

              <div className="relative">
                <Award
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  name="qualification"
                  value={filters.qualification}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 py-3"
                >
                  <option value="">Any Qualification</option>

                  {QUALIFICATIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Position */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Position Level
              </label>

              <div className="relative">
                <GraduationCap
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  name="positionLevel"
                  value={filters.positionLevel}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 py-3"
                >
                  <option value="">All Positions</option>

                  {POSITION_LEVELS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        )}

        {/* Categories */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {JOB_CATEGORIES.map((category) => {
            const Icon =
              iconMap[category.id] || Briefcase;

            const active =
              filters.category === category.id;

            return (
              <button
                key={category.id}
                onClick={() => selectCategory(category.id)}
                className={`rounded-2xl border p-5 transition-all text-left ${
                  active
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-slate-700 hover:border-blue-400"
                }`}
              >
                <Icon
                  className={`mb-3 ${
                    active
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                  size={28}
                />

                <h4 className="font-semibold">
                  {category.label}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Button */}

        <div className="mt-8">
          <Button
            onClick={handleSearch}
            className="w-full py-4 text-lg rounded-xl"
          >
            <Search size={20} />

            Search Opportunities
          </Button>
        </div>
      </Card>
    </section>
  );
}