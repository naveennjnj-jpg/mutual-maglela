// src/routes/AppRoutes.tsx

import { Routes, Route } from "react-router-dom";

// Layouts
import WebsiteLayout from "@/layouts/WebsiteLayout";
import AuthLayout from "@/layouts/AuthLayout";
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Website Pages
import Home from "@/pages/website/Home";
import AboutUs from "@/pages/website/AboutUs/AboutUs";
import ContactUs from "@/pages/website/ContactUs/ContactUs";

// Auth Pages
import Login from "@/pages/auth/Login";
import CreateAccount from "@/pages/auth/CreateAccount";

// User Pages
import UserDashboard from "@/pages/user/Dashboard";
import Profile from "@/pages/user/Profile";
import Orders from "@/pages/user/Orders";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/admin/Users";
import Products from "@/pages/admin/Products";

const AppRoutes = () => {
  return (
    <Routes>

      {/* WEBSITE */}
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<Home />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="contact-us" element={<ContactUs />} />
      </Route>

      {/* AUTH */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Route>

      {/* USER */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="orders" element={<Orders />} />
      </Route>

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;