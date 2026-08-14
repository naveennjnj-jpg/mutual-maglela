// layouts/user/UserSidebar.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Presentation,
  UserCheck,
  FileText,
  Mic,
  ShoppingBag,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Briefcase,
  X,
  FileSpreadsheet,
  Wallet,
  Crown
} from "lucide-react";
import Logo from "@/assets/home/logo.png";
import Logomobile from "@/assets/home/LO a-01.jpg-Photoroom (2).png";
import { userSidebar } from "@/constants/userSidebar";
import { useAuth } from "@/context/AuthContext";

interface UserSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  userName?: string;
  userEmail?: string;
  userInitials?: string;
}

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ComponentType<any> | null;
  badge?: string | number;
}

const UserSidebar = ({
  isOpen = true,
  onToggle,
  onClose,
  userName = "User",
  userEmail = "user@email.com",
  userInitials = "U"
}: UserSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024 && isOpen && onClose) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleCloseOnMobile = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/user") {
      return location.pathname === "/user";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const sidebarItems = userSidebar as SidebarItem[];

  // Group items exactly as shown in your HTML
  const groupedItems = {
    overview: sidebarItems.filter(item => ["/user"].includes(item.path)),
    projects: sidebarItems.filter(item => 
      ["/user/projects", "/user/workshops", "/user/hire-expert"].includes(item.path)
    ),
    tools: sidebarItems.filter(item => 
      ["/user/narrative-engine", "/user/voice-calibrator"].includes(item.path)
    ),
    resources: sidebarItems.filter(item => 
      ["/user/store"].includes(item.path)
    ),
    billing: sidebarItems.filter(item => 
      ["/user/invoices", "/user/quotes", "/user/plans"].includes(item.path)
    ),
    settings: sidebarItems.filter(item => 
      ["/user/settings"].includes(item.path)
    ),
  };

  const categoryLabels: Record<string, string> = {
    overview: "Overview",
    projects: "Services",
    tools: "AI Tools",
    resources: "Resources",
    billing: "Billing",
    settings: "Settings",
  };

  const categoryIcons: Record<string, any> = {
    overview: LayoutDashboard,
    projects: Briefcase,
    tools: Sparkles,
    resources: Layers,
    billing: Wallet,
    settings: Settings,
  };

  const getIcon = (path: string) => {
    const iconMap: Record<string, any> = {
      "/user": LayoutDashboard,
      "/user/projects": FolderOpen,
      "/user/workshops": Presentation,
      "/user/hire-expert": UserCheck,
      "/user/narrative-engine": FileText,
      "/user/voice-calibrator": Mic,
      "/user/store": ShoppingBag,
      "/user/invoices": FileSpreadsheet,
      "/user/quotes": FileText,
      "/user/plans": Crown,
      "/user/settings": Settings,
    };
    return iconMap[path] || null;
  };

  return (
    <>
      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-30 
          bg-[#0F2D63] transition-all duration-300
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${isOpen ? 'w-[260px]' : 'w-[72px] lg:w-[72px]'}
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={handleCloseOnMobile}
          className="lg:hidden absolute right-3 top-3 p-2 text-white/60 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className={`flex items-center ${isOpen ? 'justify-center' : 'justify-center'} h-20 flex-shrink-0 px-4 border-b border-white/10`}>
          <Link to="/user" onClick={handleCloseOnMobile}>
            {isOpen ? (
              <img
                src={Logo}
                alt="Magalela Media"
                className="h-10 w-auto object-contain brightness-0 invert customheight"
              />
            ) : (
              <div className="w-8 h-8 bg-[#C85A32] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm"><img
                src={Logomobile}
                alt="Magalela Media"
                className="object-contain brightness-0 invert mobilelogo"
              /></span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none]">
          {Object.entries(groupedItems).map(([key, items]) => {
            if (items.length === 0) return null;
            const CategoryIcon = categoryIcons[key];

            return (
              <div key={key} className="mt-4 first:mt-0">
                {isOpen && (
                  <div className="flex items-center gap-2 px-3 mb-2">
                    {CategoryIcon && (
                      <CategoryIcon className="w-3.5 h-3.5 text-white/30" />
                    )}
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-white/40">
                      {categoryLabels[key] || key}
                    </p>
                  </div>
                )}
                <div className={`flex flex-col gap-[2px] ${!isOpen && 'items-center'}`}>
                  {items.map((item) => {
                    const active = isActive(item.path);
                    const Icon = getIcon(item.path) || item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={handleCloseOnMobile}
                        className={`${!isOpen ? 'mobileonly' : ''} relative flex items-center ${
                          isOpen ? 'gap-3 px-3' : 'gap-0 justify-center px-0'
                        } h-11 rounded-xl transition-all group ${
                          active ? 'bg-white/10' : 'hover:bg-white/[0.06]'
                        }`}
                      >
                        {active && isOpen && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-[#C85A32] rounded-r-full"></div>
                        )}

                        {Icon && (
                          <Icon
                            className={`w-[18px] h-[18px] shrink-0 transition-colors ${active
                                ? 'text-[#C85A32]'
                                : 'text-white/65 group-hover:text-white/90'
                              }`}
                          />
                        )}

                        {isOpen && (
                          <span className={`flex-1 text-[14px] font-medium transition-colors ${active
                              ? 'text-white'
                              : 'text-white/80 group-hover:text-white/95'
                            }`}>
                            {item.title}
                          </span>
                        )}

                        {isOpen && item.badge && (
                          <span className="bg-[#C85A32] text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Help Center */}
          {isOpen && (
            <div className="mt-6 px-1">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="w-9 h-9 bg-[#C85A32]/20 rounded-xl flex items-center justify-center mb-3">
                  <LifeBuoy className="w-4 h-4 text-[#C85A32]" />
                </div>
                <p className="text-white font-semibold text-sm mb-3">Need Help?</p>
                <Link to="/user/help-center" onClick={handleCloseOnMobile}>
                  <button className="w-full bg-[#C85A32] hover:bg-[#a8472a] text-white text-xs font-medium rounded-xl h-9 transition-colors">
                    Explore Help Center
                  </button>
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* User Profile */}
        <div className={`border-t border-white/10 p-4 flex items-center ${isOpen ? 'gap-3' : 'justify-center gap-0'}`}>
          {isOpen ? (
            <>
              <div className="w-9 h-9 bg-[#C85A32] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{userInitials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{userName}</p>
                <p className="text-white/50 text-xs truncate">{userEmail}</p>
              </div>
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="w-9 h-9 bg-[#C85A32] rounded-full flex items-center justify-center shrink-0 hover:bg-[#a8472a] transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Toggle Button - Desktop only */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-4 top-[130px] items-center justify-center w-8 h-8 bg-[#C85A32] rounded-full shadow-lg hover:bg-[#a8472a] transition-all z-40"
        >
          {isOpen ? (
            <ChevronLeft className="w-3.5 h-3.5 text-white" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          )}
        </button>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleCloseOnMobile}
        ></div>
      )}

      {/* Logout Modal */}
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

export default UserSidebar;
