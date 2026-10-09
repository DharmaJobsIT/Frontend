function CommandBar() {
  return (
    <div className="
      p-4 flex justify-between items-center

      bg-white border-b border-gray-200
      dark:bg-gray-900 dark:border-gray-800
    ">

      {/* Search */}
      <input
        type="text"
        placeholder="Search anything..."
        className="
          px-4 py-2 rounded-lg w-1/3

          bg-gray-100 text-black
          dark:bg-gray-800 dark:text-white
        "
      />

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <span>🔔</span>
        <span>Admin</span>
      </div>

    </div>
  );
}

export default CommandBar;