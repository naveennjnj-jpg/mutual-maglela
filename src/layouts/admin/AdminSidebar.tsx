// layouts/admin/AdminSidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FileText,
  Mic,
  CreditCard,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Bell,
  User,
  Shield,
  HelpCircle,
  Sparkles,
  Layers,
  BookOpen,
  BarChart3,
  Store,
  UserCheck,
  FileSpreadsheet,
  Home,
  Award,
  Gift,
  TrendingUp
} from "lucide-react";
import Logo from "@/assets/home/logo.png";

interface AdminSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  adminName?: string;
  adminEmail?: string;
  adminInitials?: string;
}

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ComponentType<any> | null;
  badge?: string | number;
}

const AdminSidebar = ({ 
  isOpen = true,
  onToggle,
  onClose,
  adminName = "Admin",
  adminEmail = "admin@email.com",
  adminInitials = "A"
}: AdminSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Admin menu items
const sidebarItems: SidebarItem[] = [
  { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
  // { title: "Users", path: "/admin/users", icon: Users, badge: "1,284" },
  { title: "Manage Projects", path: "/admin/projects", icon: Briefcase },
  { title: "Manage Experts", path: "/admin/experts", icon: UserCheck },
  { title: "My Schedule", path: "/admin/schedule", icon: Calendar },
  { title: "Workshop Requests", path: "/admin/workshop-requests", icon: BookOpen },
  { title: "Credit Plans", path: "/admin/credit-plans", icon: CreditCard },
  { title: "Subscription Management", path: "/admin/subscriptions", icon: TrendingUp,},
  { title: "Invoicing", path: "/admin/invoices", icon: FileSpreadsheet },
  { title: "Settings", path: "/admin/settings", icon: Settings },
];

const groupedItems = {
  overview: sidebarItems.filter(item =>
    ["/admin"].includes(item.path)
  ),

  // users: sidebarItems.filter(item =>
  //   ["/admin/users"].includes(item.path)
  // ),

  operations: sidebarItems.filter(item =>
    ["/admin/projects", "/admin/experts", "/admin/schedule", "/admin/workshop-requests",].includes(item.path)
  ),

  creditmanagement: sidebarItems.filter(item =>
    ["/admin/credit-plans", "/admin/subscriptions", "/admin/invoices",].includes(item.path)
  ),

  settings: sidebarItems.filter(item =>
    ["/admin/settings"].includes(item.path)
  ),
};

  const categoryLabels: Record<string, string> = {
    overview: "Overview",
    users: "Users",
    operations: "Operations",
    creditmanagement: "Credit Management",
    settings: "Settings",
  };

  const categoryIcons: Record<string, any> = {
    overview: LayoutDashboard,
    users: Users,
    operations: Sparkles,
    creditmanagement: CreditCard,
    settings: Settings,
  };

const iconMap: Record<string, any> = {
  "/admin": LayoutDashboard,
  "/admin/users": Users,
  "/admin/projects": Briefcase,
  "/admin/experts": UserCheck,
  "/admin/schedule": Calendar,
  "/admin/workshop-requests": BookOpen,
  "/admin/credit-plans": CreditCard,
  "/admin/subscriptions": TrendingUp,
  "/admin/invoices": FileSpreadsheet,
  "/admin/settings": Settings,
};

  return (
    <>
      <aside className={`hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 z-30 bg-[#0F2D63] dark:bg-[#0F2D63] transition-all duration-300 ${
        isOpen ? 'w-[260px]' : 'w-[72px]'
      }`}>
        {/* Logo */}
        <div className={`flex items-center ${isOpen ? 'justify-center' : 'justify-center'} h-20 flex-shrink-0 px-4 border-b border-white/10`}>
          <Link to="/admin">
            {isOpen ? (
              <img 
                src={Logo} 
                alt="Magalela Media" 
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <div className="w-8 h-8 bg-[#C85A32] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] ${!isOpen && 'px-2'}`}>
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
                    const Icon = iconMap[item.path] || item.icon;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`relative flex items-center ${isOpen ? 'gap-3 px-3' : 'gap-0 justify-center px-0'} h-11 rounded-xl transition-all group ${
                          active ? 'bg-white/10' : 'hover:bg-white/[0.06]'
                        }`}
                      >
                        {active && isOpen && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-[#C85A32] rounded-r-full"></div>
                        )}
                        
                        {Icon && (
                          <Icon 
                            className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                              active 
                                ? 'text-[#C85A32]' 
                                : 'text-white/65 group-hover:text-white/90'
                            }`}
                          />
                        )}
                        
                        {isOpen && (
                          <span className={`flex-1 text-[14px] font-medium transition-colors ${
                            active 
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
                <Link to="/admin/help">
                  <button className="w-full bg-[#C85A32] hover:bg-[#a8472a] text-white text-xs font-medium rounded-xl h-9 transition-colors">
                    Explore Help Center
                  </button>
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Admin Profile */}
        <div className={`border-t border-white/10 p-4 flex items-center ${isOpen ? 'gap-3' : 'justify-center gap-0'}`}>
          {isOpen ? (
            <>
              <div className="w-9 h-9 bg-[#C85A32] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{adminInitials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{adminName}</p>
                <p className="text-white/50 text-xs truncate">{adminEmail}</p>
              </div>
              <button className="text-white/50 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-9 h-9 bg-[#C85A32] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{adminInitials}</span>
            </div>
          )}
        </div>

        {/* Toggle Button - Fixed position relative to sidebar */}
        <button 
          onClick={onToggle}
          className="hidden lg:flex absolute -right-4 top-[130px] items-center justify-center w-8 h-8 bg-[#C85A32] rounded-full shadow-lg hover:bg-[#a8472a] transition-all z-40"
          style={{ 
            transform: isOpen ? 'translateX(0)' : 'translateX(0)',
            right: isOpen ? '-16px' : '-16px'
          }}
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
          className="lg:hidden fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default AdminSidebar;