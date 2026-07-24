// layouts/admin/AdminLayout.tsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useAuth } from "@/context/AuthContext";

const AdminLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Apply admin theme if needed
  useEffect(() => {
    // Any admin-specific initialization
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
        adminName={user?.name || "Admin"}
        adminEmail={user?.email || "admin@email.com"}
        adminInitials={user?.name?.charAt(0) || "A"}
      />

      <AdminHeader
        onMenuClick={toggleSidebar}
        adminName={user?.name || "Admin"}
        adminEmail={user?.email || "admin@email.com"}
        adminInitials={user?.name?.charAt(0) || "A"}
        isSidebarOpen={isSidebarOpen}
      />

      <main className={`pt-16 transition-all duration-300 ${
        isSidebarOpen ? 'lg:pl-[260px]' : 'lg:pl-[72px]'
      }`}>
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;