import {
  LayoutDashboard,
  User,
  ShoppingCart,
  Settings,
} from "lucide-react";

export const userSidebar = [
  {
    title: "Dashboard",
    path: "/user",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    path: "/user/profile",
    icon: User,
  },
  {
    title: "Orders",
    path: "/user/orders",
    icon: ShoppingCart,
  },
  {
    title: "Settings",
    path: "/user/settings",
    icon: Settings,
  },
];