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
  FileSpreadsheet,
  Activity,
    FolderKanban,
  CircleAlert,
  CircleCheck,
  Timer
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";

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

// Map icon strings to components
const iconMap: Record<string, any> = {
  Users: Users,
  FolderKanban: FolderKanban,
  UserCheck: UserCheck,
  CreditCard: CreditCard,
  Activity: Activity,
  Clock: Clock,
  CircleAlert: CircleAlert,
  CircleCheck: CircleCheck,
  Timer: Timer,
  FileText: FileText,
  Settings: Settings,
  MessageSquare: MessageSquare,
  Calendar: Calendar,
  User: User,
  Shield: Shield,
  Home: Home,
  BarChart3: BarChart3,
  Store: Store,
  FileSpreadsheet: FileSpreadsheet,
  UserCog: UserCog,
  Briefcase: Briefcase,
  LayoutDashboard: LayoutDashboard
};

// Color mapping for different activity types
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
    LayoutDashboard: "text-gray-700"
  };
  return colorMap[icon] || "text-gray-500";
};

// Get background color for icon
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
    LayoutDashboard: "bg-gray-500/10"
  };
  return colorMap[icon] || "bg-gray-500/10";
};

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

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

  // Fetch notifications from separate endpoint
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setNotificationsLoading(false);
          return;
        }

        // ✅ Use separate API endpoint for notifications
        const response = await axios.get(`${API_URL}/api/admin/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.data) {
          const activities = response.data.data;
          
          // Transform activities to notifications
          const transformedNotifications: Notification[] = activities.map((activity: any, index: number) => ({
            id: activity.id || `${index}-${activity.time}`,
            title: activity.title,
            description: activity.description,
            time: activity.time,
            icon: activity.icon || 'Activity',
            color: getColorForIcon(activity.icon || 'Activity'),
            bgColor: getBgColorForIcon(activity.icon || 'Activity'),
            read: activity.read || index >= 5, // Mark older notifications as read
            timestamp: activity.timestamp || new Date(Date.now() - (index + 1) * 60000)
          }));

          setNotifications(transformedNotifications.slice(0, 10)); // Limit to 10
        } else {
          // Fallback to empty state
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Fallback to empty state
        setNotifications([]);
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
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

  // Get notification icon component
  const getNotificationIcon = (iconName: string) => {
    return iconMap[iconName] || Activity;
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );

      // ✅ Call API to mark as read
      const token = localStorage.getItem('token');
      if (token) {
        await axios.patch(
          `${API_URL}/api/admin/notifications/${id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );

      // ✅ Call API to mark all as read
      const token = localStorage.getItem('token');
      if (token) {
        await axios.patch(
          `${API_URL}/api/admin/notifications/read-all`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

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
                    {/* {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-[#C85A32] hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )} */}
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
                            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                              !notification.read ? "bg-[#C85A32]/5 dark:bg-[#C85A32]/10" : ""
                            }`}
                          >
                            <div className={`${notification.bgColor} rounded-lg p-2 shrink-0`}>
                              <IconComponent className={`w-4 h-4 ${notification.color}`} />
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
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">All caught up!</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2 text-center">
                    {/* <button 
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigate('/admin/activity');
                      }}
                      className="text-xs text-[#C85A32] font-medium hover:underline"
                    >
                      View all activity
                    </button> */}
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