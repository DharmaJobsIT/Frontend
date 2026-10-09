import Sidebar from "../components/admin/Sidebar";
import CommandBar from "../components/admin/CommandBar";
import IntelligenceFeed from "../components/admin/IntelligenceFeed";
import ActionCenter from "../components/admin/ActionCenter";

function Admin() {
  return (
    <div className="
      min-h-screen flex

      bg-gray-100 text-black
      dark:bg-gray-950 dark:text-white
    ">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Top Command Bar */}
        <CommandBar />

        {/* Content */}
        <div className="p-6 space-y-6">

          <IntelligenceFeed />
          <ActionCenter />

        </div>

      </div>
    </div>
  );
}

export default Admin;