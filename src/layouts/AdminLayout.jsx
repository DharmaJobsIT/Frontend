import Sidebar from "../components/admin/Sidebar";
import CommandBar from "../components/admin/CommandBar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="
      min-h-screen flex

      bg-gray-100 text-black
      dark:bg-gray-950 dark:text-white
    ">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">

        <CommandBar />

        <div className="p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;