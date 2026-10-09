import FreeTrialView from "./FreeTrialView";
import BasicView from "./BasicView";
import ProView from "./ProView";

function PlanDashboard({ recruiter, fetchRecruiter }) {
  const plan = recruiter?.subscriptionPlan;

  switch (plan) {
    case "basic":
      return (
        <BasicView
          recruiter={recruiter}
          fetchRecruiter={fetchRecruiter}
        />
      );

    case "pro":
      return (
        <ProView
          recruiter={recruiter}
          fetchRecruiter={fetchRecruiter}
        />
      );

    case "free_trial":
    default:
      return (
        <FreeTrialView
          recruiter={recruiter}
          fetchRecruiter={fetchRecruiter}
        />
      );
  }
}

export default PlanDashboard;