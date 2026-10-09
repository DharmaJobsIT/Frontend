import BaseDashboard from "./BaseDashboard";

function FreeTrialView({ recruiter, fetchRecruiter }) {
  return (
    <BaseDashboard recruiter={recruiter} fetchRecruiter={fetchRecruiter} showPlanCards={true} />
  );
}

export default FreeTrialView;
