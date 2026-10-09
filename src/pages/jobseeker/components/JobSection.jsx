import JobCard from "./JobCard";
import SectionTitle from "./ui/SectionTitle";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function JobSection({
  title,
  subtitle,
  jobs = [],
  viewAllLink,
}) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">

      <SectionTitle
        title={title}
        subtitle={subtitle}
      />
      <Link
        to={viewAllLink}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
    >
        View All

        <ArrowRight size={18}/>
    </Link>
    

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center text-gray-500">
          No jobs found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
            />
          ))}
        </div>
      )}

    </section>
  );
}