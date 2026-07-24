// components/Header/DashboardHeader.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  Bell, 
  Search, 
  Settings, 
  HelpCircle,
  ChevronDown,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Users2,
  Settings2,
  LogOut as LogOutIcon,
  UserCog,
  Briefcase,
  Clock
} from "lucide-react";
import Logo from "@/assets/home/logo.png";
import { useAuth } from "@/context/AuthContext";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  role?: "user" | "admin";
  userName?: string;
  userEmail?: string;
  userInitials?: string;
  userAvatar?: string;
  isSidebarOpen?: boolean; // ✅ Add this prop
}

const DashboardHeader = ({ 
  onMenuClick, 
  role = "user",
  userName = "Ronald Sithole",
  userEmail = "ronald@gmail.com",
  userInitials = "RS",
  userAvatar,
  isSidebarOpen = true // ✅ Default to true
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "New project assigned",
      description: "You've been assigned to 'University Communications' project",
      time: "5 min ago",
      icon: FileText,
      color: "text-[#C85A32]",
      bgColor: "bg-[#C85A32]/10",
      read: false,
    },
    {
      id: 2,
      title: "Workshop reminder",
      description: "Media Training workshop starts in 2 hours",
      time: "1 hour ago",
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      read: false,
    },
    {
      id: 3,
      title: "New message",
      description: "Sarah sent you a message about the project",
      time: "3 hours ago",
      icon: MessageSquare,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      read: true,
    },
    {
      id: 4,
      title: "Team update",
      description: "3 new members joined your team",
      time: "Yesterday",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Role-based navigation items
  const userNavItems = [
    { title: "Dashboard", path: "/user", icon: LayoutDashboard },
    { title: "Profile", path: "/user/profile", icon: UserCog },
    { title: "Projects", path: "/user/projects", icon: Briefcase },
    { title: "Invoices", path: "/user/invoices", icon: CreditCard },
    { title: "Settings", path: "/user/settings", icon: Settings2 },
  ];

  const adminNavItems = [
    { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { title: "Users", path: "/admin/users", icon: Users2 },
    { title: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { title: "Settings", path: "/admin/settings", icon: Settings2 },
  ];

  const navItems = role === "admin" ? adminNavItems : userNavItems;

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => currentPath.includes(item.path));
    return currentItem?.title || "Dashboard";
  };

  return (
    <header 
      className={`bg-white border-b border-gray-100 h-16 fixed top-0 right-0 z-40 transition-all duration-300 ${
        isSidebarOpen ? 'left-[260px]' : 'left-[72px]'
      }`}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-[#0F2D63] hidden sm:block">
              {getPageTitle()}
            </h1>
            
            {/* Role Badge */}
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              role === "admin" 
                ? "bg-[#C85A32]/10 text-[#C85A32]" 
                : "bg-[#0F2D63]/10 text-[#0F2D63]"
            }`}>
              {role === "admin" ? "Admin" : "User"}
            </span>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-72 focus-within:border-[#C85A32] focus-within:ring-2 focus-within:ring-[#C85A32]/10 transition-all">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-400"
            />
            <kbd className="hidden sm:block text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Button */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#C85A32] rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-[#0F2D63]">Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="text-xs text-[#C85A32] hover:underline font-medium">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.read ? "bg-[#C85A32]/5" : ""
                        }`}
                      >
                        <div className={`${notification.bgColor} rounded-lg p-2 shrink-0`}>
                          <notification.icon className={`w-4 h-4 ${notification.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1C1C1C] truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {notification.description}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#C85A32] rounded-full shrink-0 mt-2"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No notifications</p>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-100 px-4 py-2 text-center">
                  <button className="text-xs text-[#C85A32] font-medium hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <Link
            to="/help"
            className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#C85A32] transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden lg:inline">Help</span>
          </Link>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#C85A32] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{userInitials}</span>
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-[#1C1C1C] leading-tight">
                  {userName}
                </p>
                <p className="text-[10px] text-gray-400">{role === "admin" ? "Administrator" : "User"}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-[#0F2D63] text-sm">{userName}</p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
                <div className="py-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#C85A32] transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.title}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobileSearchOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-3 shadow-lg">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-400"
              autoFocus
            />
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;