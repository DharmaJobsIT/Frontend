import JobSection from "./JobSection";

export default function RecommendedJobs({
  jobs,
  total,
  loading,
}) {
  return (
    <JobSection
      title={`Recommended for You (${total})`}
      subtitle="Based on your profile, subjects and experience."
      jobs={jobs}
      loading={loading}
      viewAllLink="/jobs"
    />
  );
}