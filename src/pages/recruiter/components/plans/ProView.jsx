import BaseDashboard from "./BaseDashboard";

function ProView({ recruiter, fetchRecruiter }) {
  return (
    <>
      <BaseDashboard
        recruiter={recruiter}
        fetchRecruiter={fetchRecruiter}
        showPlanCards={false}
        theme="pro"
      />

      <div className="mt-8 space-y-6">
        {/* MY PLAN */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-amber-300 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-700 to-yellow-700 px-6 py-5 text-white">
            <p className="text-sm text-white/70 uppercase tracking-wider">
              My Plan
            </p>

            <div className="flex items-center justify-between mt-1">
              <h2 className="text-3xl font-bold">
                Pro
              </h2>

              <span className="px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-sm">
                Active
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm text-amber-700">
                  Job Posts
                </p>

                <p className="text-2xl font-bold text-amber-800 mt-1">
                  50
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm text-amber-700">
                  Jobs Used
                </p>

                <p className="text-2xl font-bold text-amber-800 mt-1">
                  {recruiter?.jobsPosted || 0} / 50
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm text-amber-700">
                  Status
                </p>

                <p className="text-2xl font-bold text-green-600 mt-1">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PRO FEATURES */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-amber-200">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-wider text-amber-600">
              Included with Pro
            </p>

            <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-300 mt-1">
              Pro Plan Features
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
              <h4 className="font-semibold text-amber-900">
                Analytics Dashboard
              </h4>

              <p className="text-sm text-amber-700 mt-2">
                Track recruitment activity and application performance.
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
              <h4 className="font-semibold text-amber-900">
                Campaigns
              </h4>

              <p className="text-sm text-amber-700 mt-2">
                Support advanced recruitment and institution campaigns.
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
              <h4 className="font-semibold text-amber-900">
                Institution Poster
              </h4>

              <p className="text-sm text-amber-700 mt-2">
                Create and manage institution promotional materials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProView;