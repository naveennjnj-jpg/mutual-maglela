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
import Contact from "@/pages/website/Contact/Contact";
import Partnerships from "@/pages/website/Partnerships/Partnerships";
import Solutionsacedemics from "@/pages/website/solutions/academics-research";
import SolutionsHigherEducation from "@/pages/website/solutions/higher-education";
import Solutionsuniversity from "@/pages/website/solutions/university-communications";
import Globaldevelopment from "@/pages/website/solutions/global-development";
import Corporatesocial from "@/pages/website/solutions/corporate-social-impact";
import Executiveleaders from "@/pages/website/solutions/executive-leaders";
import Pricing from "@/pages/website/Pricing/Pricing";
import Faq from "@/pages/website/Faq/faq";
import Blog from "@/pages/website/blog/blog";
import Workshops from "@/pages/website/Workshops/workshops";
import Privacy from "@/pages/website/privacy/privacy";
import Terms from "@/pages/website/terms/terms";
import RefundPolicy from "@/pages/website/RefundPolicy/RefundPolicy";
import Careers from "@/pages/website/Careers/Careers";
// Auth Pages
import Login from "@/pages/auth/Login";
import CreateAccount from "@/pages/auth/CreateAccount";
import ForgotPassword from "@/pages/auth/ForgotPassword";

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
        <Route path="about" element={<AboutUs />} />
        <Route path="partnerships" element={<Partnerships />} />
        <Route path="contact" element={<Contact />} />
        <Route path="solutions/academics-research" element={<Solutionsacedemics />} />
        <Route path="solutions/higher-education" element={<SolutionsHigherEducation />} />
        <Route path="solutions/university-communications" element={<Solutionsuniversity />} />
        <Route path="solutions/global-development" element={<Globaldevelopment />} />
        <Route path="solutions/corporate-social-impact" element={<Corporatesocial />} />
        <Route path="solutions/executive-leaders" element={<Executiveleaders />} />
        <Route path="workshops" element={<Workshops />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="faqs" element={<Faq />} />
        <Route path="blog" element={<Blog />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="refund-policy" element={<RefundPolicy />} />
        <Route path="careers" element={<Careers />} />
      </Route>

      {/* AUTH */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
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