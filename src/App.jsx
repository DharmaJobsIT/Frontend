import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Recruiters from "./pages/admin/Recruiters";
import RecruiterHome from "./pages/recruiter/RecruiterHome";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import JobSeekerHome from "./pages/jobseeker/JobSeekerHome";
import AllJobs from "./pages/jobs/AllJobs";
import JobDetails from "./pages/jobs/JobDetails";
import ApplicantsTable from "./pages/recruiter/components/jobs/ApplicantsTable";
import Applicant from "./pages/recruiter/components/jobs/Applicant";
import ApplicantProfile from "./pages/recruiter/components/jobs/ApplicantProfile";
import AppliedJobs from "./pages/jobseeker/components/jobs/AppliedJobs";
import SavedJobs from "./pages/jobseeker/components/jobs/SavedJobs";
import JobSeekerProfile from "./pages/jobseeker/JobSeekerProfile";
//import JobSeekerProfile from "./pages/jobseeker/JobSeekerProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Wrapper */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/recruiters" element={<Recruiters />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/recruiter/home" element={<RecruiterHome />} />
          <Route path="/recruiter/profile" element={<RecruiterProfile />} />
          <Route path="/jobseeker/home" element={<JobSeekerHome />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route
            path="/recruiter/jobs/:jobId/applicants"
            element={<ApplicantsTable />}
          />

          <Route
            path="/recruiter/applicants/:jobId/:applicationId"
            element={<Applicant />}
          />
          <Route
            path="/recruiter/applicants/:jobId/:applicationId/profile"
            element={<ApplicantProfile />}
          />
          <Route path="/jobseeker/applications" element={<AppliedJobs />} />
          <Route path="/jobseeker/saved" element={<SavedJobs />} />
          <Route path="/jobseeker/profile" element={<JobSeekerProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
