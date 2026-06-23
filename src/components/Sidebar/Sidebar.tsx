import { LucideIcon } from "lucide-react";
import SidebarItem from "./SidebarItem";

interface MenuItem {
  title: string;
  path: string;
  icon?: LucideIcon;
}

interface SidebarProps {
  title: string;
  menuItems: MenuItem[];
}

const Sidebar = ({ title, menuItems }: SidebarProps) => {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">{title}</h1>

      <ul className="space-y-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            title={item.title}
            path={item.path}
            icon={item.icon}
          />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;