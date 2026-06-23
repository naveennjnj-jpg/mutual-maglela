import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
} from "lucide-react";

export const adminSidebar = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
  },
];