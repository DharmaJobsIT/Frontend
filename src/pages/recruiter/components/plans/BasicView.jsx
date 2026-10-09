import BaseDashboard from "./BaseDashboard";

function BasicView({ recruiter, fetchRecruiter }) {
  return (
    <>
      <BaseDashboard
        recruiter={recruiter}
        fetchRecruiter={fetchRecruiter}
        showPlanCards={false}
        theme="basic"
      />

      <div className="mt-8 space-y-6">
        {/* MY PLAN */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-slate-300 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-5 text-white">
            <p className="text-sm text-white/70 uppercase tracking-wider">
              My Plan
            </p>

            <div className="flex items-center justify-between mt-1">
              <h2 className="text-3xl font-bold">
                Basic
              </h2>

              <span className="px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-sm">
                Active
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm text-slate-500">
                  Job Posts
                </p>
                <p className="text-2xl font-bold text-slate-700 mt-1">
                  10
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm text-slate-500">
                  Jobs Used
                </p>
                <p className="text-2xl font-bold text-slate-700 mt-1">
                  {recruiter?.jobsPosted || 0} / 10
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm text-slate-500">
                  Status
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BASIC FEATURES */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-wider text-slate-500">
              Included with Basic
            </p>

            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              Basic Plan Features
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
              <h4 className="font-semibold text-slate-800">
                Jobs
              </h4>

              <p className="text-sm text-slate-500 mt-2">
                Post up to 10 active job opportunities.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
              <h4 className="font-semibold text-slate-800">
                Applicants
              </h4>

              <p className="text-sm text-slate-500 mt-2">
                Access applicant details and manage applications.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
              <h4 className="font-semibold text-slate-800">
                Gmail Ecosystem
              </h4>

              <p className="text-sm text-slate-500 mt-2">
                Use the available Gmail-related recruitment tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BasicView;