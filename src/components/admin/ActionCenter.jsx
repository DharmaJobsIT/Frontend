function ActionCenter() {
  return (
    <div className="
      p-5 rounded-xl

      bg-white shadow
      dark:bg-gray-900
    ">
      <h3 className="font-semibold mb-3">⚡ Action Center</h3>

      <div className="space-y-3 text-sm">

        <div className="flex justify-between">
          <span>🔴 5 Recruiters need verification</span>
          <button className="text-blue-500">Review</button>
        </div>

        <div className="flex justify-between">
          <span>🟡 12 Jobs expiring today</span>
          <button className="text-blue-500">Extend</button>
        </div>

        <div className="flex justify-between">
          <span>🟢 3 high-performing recruiters</span>
          <button className="text-blue-500">View</button>
        </div>

      </div>
    </div>
  );
}

export default ActionCenter;