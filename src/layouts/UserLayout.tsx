import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar/Sidebar";
import { userSidebar } from "@/constants/userSidebar";

const UserLayout = () => {
  return (
    <div className="flex">
      <Sidebar
        title="User Panel"
        menuItems={userSidebar}
      />

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;