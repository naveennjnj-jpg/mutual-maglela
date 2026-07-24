// layouts/admin/AdminHeader.tsx
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
  Settings2,
  LogOut as LogOutIcon,
  UserCog,
  Briefcase,
  Clock,
  User,
  Shield,
  Home,
  BarChart3,
  Store,
  UserCheck,
  FileSpreadsheet
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface AdminHeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  theme?: string;
  initials?: string;
}

const AdminHeader = ({ 
  onMenuClick, 
  isSidebarOpen = true
}: AdminHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // User state
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: 'Admin',
    email: 'admin@email.com',
    role: 'admin',
    initials: 'A'
  });
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.data) {
          const data = response.data.data;
          
          // Generate initials from name
          const nameParts = data.name?.split(' ') || ['A'];
          const initials = nameParts
            .map((part: string) => part.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);

          setUserData({
            id: data.id || data._id,
            name: data.name || 'Admin',
            email: data.email || 'admin@email.com',
            role: data.role || 'admin',
            avatar: data.avatar || data.profileImage,
            theme: data.theme || 'light',
            initials: initials || 'A'
          });

          // Apply theme if needed
          if (data.theme) {
            localStorage.setItem('theme', data.theme);
            // You can call a theme function here if you have one
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to localStorage or default values
        const savedName = localStorage.getItem('userName') || 'Admin';
        const savedEmail = localStorage.getItem('userEmail') || 'admin@email.com';
        const savedInitials = savedName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
        
        setUserData(prev => ({
          ...prev,
          name: savedName,
          email: savedEmail,
          initials: savedInitials
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Click outside handlers
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

  const notifications = [
    {
      id: 1,
      title: "New user registered",
      description: "John Doe just created a new account",
      time: "5 min ago",
      icon: Users,
      color: "text-[#C85A32]",
      bgColor: "bg-[#C85A32]/10",
      read: false,
    },
    {
      id: 2,
      title: "Project submission",
      description: "New project 'Q2 Research Output' submitted for review",
      time: "1 hour ago",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      read: false,
    },
    {
      id: 3,
      title: "Payment received",
      description: "Invoice #INV-2026-004 has been paid",
      time: "3 hours ago",
      icon: CreditCard,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      read: true,
    },
    {
      id: 4,
      title: "System update",
      description: "New version 2.4.0 is ready for deployment",
      time: "5 hours ago",
      icon: Settings,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const adminNavItems = [
    { title: "Settings", path: "/admin/settings", icon: Settings2 },
  ];

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const titles: Record<string, string> = {
      "/admin": "Dashboard",
      "/admin/users": "Users Management",
      "/admin/projects": "Projects",
      "/admin/workshops": "Workshops",
      "/admin/narrative-engine": "AI Writing",
      "/admin/voice-calibrator": "AI Speech",
      "/admin/invoices": "Invoices",
      "/admin/settings": "Settings",
      "/admin/analytics": "Analytics",
      "/admin/subscriptions": "Subscriptions",
    };
    return titles[currentPath] || "Dashboard";
  };

  return (
    <>
      <header 
        className={`bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 h-16 fixed top-0 right-0 z-40 transition-all duration-300 ${
          isSidebarOpen ? 'left-[260px]' : 'left-[72px]'
        }`}
      >
        <div className="flex items-center justify-between h-full px-4 lg:px-8">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-[#0F2D63] dark:text-white hidden sm:block">
                {getPageTitle()}
              </h1>
  
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#C85A32] rounded-full animate-pulse"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-[#0F2D63] dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="text-xs text-[#C85A32] hover:underline font-medium">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                          !notification.read ? "bg-[#C85A32]/5 dark:bg-[#C85A32]/10" : ""
                        }`}
                      >
                        <div className={`${notification.bgColor} rounded-lg p-2 shrink-0`}>
                          <notification.icon className={`w-4 h-4 ${notification.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1C1C1C] dark:text-white truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {notification.description}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#C85A32] rounded-full shrink-0 mt-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2 text-center">
                    <button className="text-xs text-[#C85A32] font-medium hover:underline">
                      View all
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#C85A32] px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Home className="w-4 h-4" />
            </Link>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 group"
                disabled={loading}
              >
                {userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt={userData.name} 
                    className="w-8 h-8 rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-7 h-7 bg-[#0F2D63] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {loading ? '...' : userData.initials}
                    </span>
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-[#1C1C1C] dark:text-white">
                    {loading ? 'Loading...' : userData.name}
                  </p>

                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-semibold text-[#0F2D63] dark:text-white text-sm">
                      {userData.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userData.email}
                    </p>
                  </div>
                  <div className="py-1">
                    {adminNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#C85A32]"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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

        {/* Mobile Search */}
        {isMobileSearchOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-3 shadow-lg">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 w-full"
                autoFocus
              />
              <button onClick={() => setIsMobileSearchOpen(false)} className="text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 w-full max-w-sm shadow-xl">
            <h3 className="font-semibold text-[#0F2D63] dark:text-white text-lg mb-2">
              Sign out?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              You'll need to sign in again to access your workspace.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowLogoutModal(false);
                  await handleLogout();
                }}
                className="flex-1 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;