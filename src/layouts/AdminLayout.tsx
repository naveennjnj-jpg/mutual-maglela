import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar/Sidebar";
import { adminSidebar } from "@/constants/adminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar
        title="Admin Panel"
        menuItems={adminSidebar}
      />

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;