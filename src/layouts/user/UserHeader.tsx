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
  Coins,
  Plus,
  Activity,
  CircleAlert,
  CircleCheck,
  Timer,
  Home,
  BarChart3,
  Store,
  FileSpreadsheet,
  FolderKanban,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";

interface UserHeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
  userName?: string;
  userEmail?: string;
  userInitials?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  theme?: string;
  credits?: number;
  initials?: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
  bgColor: string;
  read: boolean;
  timestamp: Date;
}

const iconMap: Record<string, any> = {
  Users,
  FolderKanban,
  UserCheck,
  CreditCard,
  Activity,
  Clock,
  CircleAlert,
  CircleCheck,
  Timer,
  FileText,
  Settings,
  MessageSquare,
  Calendar,
  User,
  Shield,
  Home,
  BarChart3,
  Store,
  FileSpreadsheet,
  UserCog,
  Briefcase,
  LayoutDashboard,
};

const getColorForIcon = (icon: string): string => {
  const colorMap: Record<string, string> = {
    Users: "text-[#4F6EF7]",
    FolderKanban: "text-[#22C9A5]",
    UserCheck: "text-[#F59E0B]",
    CreditCard: "text-[#E05C97]",
    Activity: "text-[#C85A32]",
    Clock: "text-gray-500",
    CircleAlert: "text-amber-500",
    CircleCheck: "text-emerald-600",
    Timer: "text-blue-500",
    FileText: "text-blue-500",
    Settings: "text-purple-500",
    MessageSquare: "text-indigo-500",
    Calendar: "text-rose-500",
    User: "text-cyan-500",
    Shield: "text-violet-500",
    Home: "text-gray-500",
    BarChart3: "text-teal-500",
    Store: "text-orange-500",
    FileSpreadsheet: "text-green-500",
    UserCog: "text-slate-500",
    Briefcase: "text-amber-600",
    LayoutDashboard: "text-gray-700",
  };
  return colorMap[icon] || "text-gray-500";
};

const getBgColorForIcon = (icon: string): string => {
  const colorMap: Record<string, string> = {
    Users: "bg-[#4F6EF7]/10",
    FolderKanban: "bg-[#22C9A5]/10",
    UserCheck: "bg-[#F59E0B]/10",
    CreditCard: "bg-[#E05C97]/10",
    Activity: "bg-[#C85A32]/10",
    Clock: "bg-gray-500/10",
    CircleAlert: "bg-amber-500/10",
    CircleCheck: "bg-emerald-500/10",
    Timer: "bg-blue-500/10",
    FileText: "bg-blue-500/10",
    Settings: "bg-purple-500/10",
    MessageSquare: "bg-indigo-500/10",
    Calendar: "bg-rose-500/10",
    User: "bg-cyan-500/10",
    Shield: "bg-violet-500/10",
    Home: "bg-gray-500/10",
    BarChart3: "bg-teal-500/10",
    Store: "bg-orange-500/10",
    FileSpreadsheet: "bg-green-500/10",
    UserCog: "bg-slate-500/10",
    Briefcase: "bg-amber-500/10",
    LayoutDashboard: "bg-gray-500/10",
  };
  return colorMap[icon] || "bg-gray-500/10";
};

const UserHeader = ({
  onMenuClick,
  isSidebarOpen = true,
  userName = "User",
  userEmail = "user@email.com",
  userInitials = "U",
}: UserHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    id: "",
    name: "User",
    email: "user@email.com",
    role: "user",
    credits: 0,
    initials: "U",
  });
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.data) {
        const data = response.data.data;

        const nameParts = data.name?.split(" ") || ["U"];
        const initials = nameParts
          .map((part: string) => part.charAt(0).toUpperCase())
          .join("")
          .slice(0, 2);

        const credits = data.credits || data.creditsBalance || 0;

        setUserData({
          id: data.id || data._id,
          name: data.name || "User",
          email: data.email || "user@email.com",
          role: data.role || "user",
          avatar: data.avatar || data.profileImage,
          theme: data.theme || "light",
          credits: credits,
          initials: initials || "U",
        });

        localStorage.setItem("userCredits", credits.toString());
        localStorage.setItem("userName", data.name || "User");
        localStorage.setItem("userEmail", data.email || "");

        if (data.theme) localStorage.setItem("theme", data.theme);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      const savedName = localStorage.getItem("userName") || "User";
      const savedEmail = localStorage.getItem("userEmail") || "user@email.com";
      const savedCredits = parseInt(localStorage.getItem("userCredits") || "0");
      const savedInitials = savedName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      setUserData((prev) => ({
        ...prev,
        name: savedName,
        email: savedEmail,
        credits: savedCredits,
        initials: savedInitials,
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userCredits") {
        const newCredits = parseInt(e.newValue || "0");
        setUserData((prev) => ({ ...prev, credits: newCredits }));
      }
      if (e.key === "userName") {
        setUserData((prev) => ({ ...prev, name: e.newValue || "User" }));
      }
      if (e.key === "userEmail") {
        setUserData((prev) => ({ ...prev, email: e.newValue || "" }));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleCreditsUpdate = (e: CustomEvent) => {
      if (e.detail?.credits !== undefined) {
        setUserData((prev) => ({ ...prev, credits: e.detail.credits }));
        localStorage.setItem("userCredits", e.detail.credits.toString());
      }
      if (e.detail?.userData) {
        const data = e.detail.userData;
        setUserData((prev) => ({
          ...prev,
          name: data.name || prev.name,
          email: data.email || prev.email,
          credits: data.credits !== undefined ? data.credits : prev.credits,
          avatar: data.avatar || prev.avatar,
          role: data.role || prev.role,
        }));
        if (data.name) localStorage.setItem("userName", data.name);
        if (data.email) localStorage.setItem("userEmail", data.email);
        if (data.credits !== undefined)
          localStorage.setItem("userCredits", data.credits.toString());
      }
    };

    window.addEventListener("creditsUpdated", handleCreditsUpdate as EventListener);
    return () =>
      window.removeEventListener("creditsUpdated", handleCreditsUpdate as EventListener);
  }, []);


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setNotificationsLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/api/user/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success && response.data.data) {
          const activities = response.data.data;

    
          const unreadOnly = activities.filter((a: any) => !a.read);

          const transformed: Notification[] = unreadOnly.map(
            (activity: any, index: number) => ({
              id: activity.id || `${index}-${activity.time}`,
              title: activity.title,
              description: activity.description,
              time: activity.time,
              icon: activity.icon || "Activity",
              color: getColorForIcon(activity.icon || "Activity"),
              bgColor: getBgColorForIcon(activity.icon || "Activity"),
              read: false,
              timestamp:
                activity.timestamp || new Date(Date.now() - (index + 1) * 60000),
            })
          );

          setNotifications(transformed.slice(0, 10));
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
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


  const getNotificationIcon = (iconName: string) =>
    iconMap[iconName] || Activity;


  const markAsRead = async (id: string) => {
    const snapshot = notifications;


    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.patch(
          `${API_URL}/api/user/notifications/${id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);

      setNotifications(snapshot);
      toast.error("Failed to mark notification as read");
    }
  };


  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.patch(
          `${API_URL}/api/user/notifications/read-all`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setNotifications([]);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };

  const unreadCount = notifications.length;

  const userNavItems = [
    { title: "Settings", path: "/user/settings", icon: Settings2 },
  ];

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const titles: Record<string, string> = {
      "/user": "Dashboard",
      "/user/profile": "Profile",
      "/user/projects": "Projects",
      "/user/workshops": "Workshops",
      "/user/narrative-engine": "AI Writing",
      "/user/voice-calibrator": "AI Speech",
      "/user/invoices": "Invoices",
      "/user/settings": "Settings",
    };
    return titles[currentPath] || "Dashboard";
  };

  return (
    <>
      <header
        className={`bg-white border-b border-gray-100 h-16 fixed top-0 right-0 z-40 transition-all duration-300 ${
          isSidebarOpen ? "left-0 md:left-[260px]" : "left-0 md:left-[72px]"
        }`}
      >
        <div className="flex items-center justify-between h-full px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-[#0F2D63] hidden sm:block">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
          
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#F9F7F4] border border-gray-200 rounded-xl px-3 py-1.5">
                <Coins className="w-3.5 h-3.5 text-[#C85A32]" />
                <span className="text-xs font-bold text-[#0F2D63]">
                  {loading ? "..." : userData.credits}
                </span>
                <span className="text-xs text-gray-400 hidden sm:block">credits</span>
              </div>
              <Link
                to="/user/add-credits"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C85A32] hover:bg-[#a8472a] text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <Plus className="w-3 h-3" />
                Upgrade
              </Link>
            </div>

            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#C85A32] rounded-full animate-pulse"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-[#0F2D63]">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#C85A32] hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notificationsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin w-6 h-6 border-2 border-[#C85A32] border-t-transparent rounded-full"></div>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification) => {
                        const IconComponent = getNotificationIcon(notification.icon);
                        return (
                          <div
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer bg-[#C85A32]/5"
                          >
                            <div
                              className={`${notification.bgColor} rounded-lg p-2 shrink-0`}
                            >
                              <IconComponent
                                className={`w-4 h-4 ${notification.color}`}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#1C1C1C] truncate">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {notification.description}
                              </p>
                              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notification.time}
                              </p>
                            </div>
                            <div className="w-2 h-2 bg-[#C85A32] rounded-full shrink-0 mt-2"></div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Bell className="w-8 h-8 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">No notifications</p>
                        <p className="text-xs text-gray-400">All caught up!</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 px-4 py-2 text-center">
                    <button className="text-xs text-[#C85A32] font-medium hover:underline">
                      View all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 group"
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
                      {loading ? "..." : userData.initials}
                    </span>
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-[#1C1C1C]">
                    {loading ? "Loading..." : userData.name}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-[#0F2D63] text-sm">
                      {userData.name}
                    </p>
                    <p className="text-xs text-gray-500">{userData.email}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Coins className="w-3 h-3 text-[#C85A32]" />
                      <span className="text-xs font-medium text-[#0F2D63]">
                        {userData.credits} credits
                      </span>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/user/add-credits"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#C85A32] hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Plus className="w-4 h-4" />
                      Upgrade
                    </Link>
                    {userNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#C85A32]"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
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

        {isMobileSearchOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-3 shadow-lg">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-gray-700 w-full"
                autoFocus
              />
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-xl">
            <h3 className="font-semibold text-[#0F2D63] text-lg mb-2">
              Sign out?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              You'll need to sign in again to access your workspace.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
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

export default UserHeader;