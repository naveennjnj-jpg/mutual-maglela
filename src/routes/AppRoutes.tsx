// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Layouts
import WebsiteLayout from "@/layouts/WebsiteLayout";
import AuthLayout from "@/layouts/AuthLayout";
import UserLayout from "@/layouts/user/UserLayout";
import AdminLayout from "@/layouts/admin/AdminLayout";

// Website Pages
import Home from "@/pages/website/Home";
import AboutUs from "@/pages/website/AboutUs/AboutUs";
import Contact from "@/pages/website/Contact/Contact";
import Partnerships from "@/pages/website/Partnerships/Partnerships";
import Solutionsacedemics from "@/pages/website/solutions/academics-research";
import SolutionsHigherEducation from "@/pages/website/solutions/higher-education";
import Solutionsuniversity from "@/pages/website/solutions/university-communications";
import Pricing from "@/pages/website/Pricing/Pricing";
import Faq from "@/pages/website/Faq/faq";
import Blog from "@/pages/website/blog/blog";
import Privacy from "@/pages/website/privacy/privacy";
import Terms from "@/pages/website/terms/terms";
import RefundPolicy from "@/pages/website/RefundPolicy/RefundPolicy";
import Careers from "@/pages/website/Careers/Careers";
import DigitalToolkitweb from "@/pages/website/DigitalToolkit/DigitalToolkit";


// Auth Pages
import Login from "@/pages/auth/Login";
import CreateAccount from "@/pages/auth/CreateAccount";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// User Pages
import UserDashboard from "@/pages/user/Dashboard";
import Settings from "@/pages/user/Settings";
import Projects from "@/pages/user/projects/projects";
import CreateProjects from "@/pages/user/projects/createProject";
import HireExperts from "@/pages/user/hireexperts";
import Orders from "@/pages/user/Orders";
import Workshop from "@/pages/user/Workshops/workshop";
import AIWriting from "@/pages/user/Ai-writing/AIWriting";
import CreateAIWritingModal from "@/pages/user/Ai-writing/CreateAIWriting";
import AIWritingResult from "@/pages/user/Ai-writing/Result";
import AISpeech from '@/pages/user/Ai-speech/AISpeech';
import CreateAISpeech from '@/pages/user/Ai-speech/CreateAISpeech';
import AISpeechResult from '@/pages/user/Ai-speech/Result';
import DigitalToolkit from '@/pages/user/DigitalToolkits';
import PaymentSuccess from '@/pages/website/PaymentSuccess';
import PaymentCancelled from '@/pages/website/PaymentCancelled';

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/admin/Users";
import ManageExperts from "@/pages/admin/Manageexperts/ManageExperts";
import CreateExpert from "@/pages/admin/Manageexperts/AddEditExpert";
import AdminWorkshopList from "@/pages/admin/Workshop/AdminWorkshopList";
import AdminWorkshopEdit from '@/pages/admin/Workshop/AdminWorkshopEdit';
import AdminSettings from "@/pages/admin/Settings";
import AdminProjects from "@/pages/admin/projects/projects";
import ProjectDetail from "@/pages/admin/projects/ProjectDetail";
import ProjectSubmit from "@/pages/admin/projects/ProjectSubmit";

const AppRoutes = () => {
  return (
    <Routes>
      {/* WEBSITE - Public */}
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="partnerships" element={<Partnerships />} />
        <Route path="contact" element={<Contact />} />
        <Route path="solutions/academics-research" element={<Solutionsacedemics />} />
        <Route path="solutions/higher-education" element={<SolutionsHigherEducation />} />
        <Route path="solutions/university-communications" element={<Solutionsuniversity />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="faqs" element={<Faq />} />
        <Route path="blog" element={<Blog />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="refund-policy" element={<RefundPolicy />} />
        <Route path="careers" element={<Careers />} />
        <Route path="digital-toolkit" element={<DigitalToolkitweb />} />
        <Route path="payment-success" element={<PaymentSuccess />} />
        <Route path="payment-cancelled" element={<PaymentCancelled />} />

      </Route>

      {/* AUTH - Public */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* USER - Protected */}
      <Route path="/user" element={
        <ProtectedRoute>
          <UserLayout />
        </ProtectedRoute>
      }>
        <Route index element={<UserDashboard />} />
        <Route path="settings" element={<Settings />} />
        <Route path="orders" element={<Orders />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/create" element={<CreateProjects />} />
        <Route path="hire-expert" element={<HireExperts />} />
        <Route path="workshops" element={<Workshop />} />
        <Route path="narrative-engine" element={<AIWriting />} />
        <Route path="narrative-engine/create" element={<CreateAIWritingModal />} />
        <Route path="narrative-engine/result" element={<AIWritingResult />} />
        <Route path="voice-calibrator" element={<AISpeech />} />
        <Route path="voice-calibrator/create" element={<CreateAISpeech />} />
        <Route path="voice-calibrator/result" element={<AISpeechResult />} />
        <Route path="store" element={<DigitalToolkit />} />
      </Route>

      {/* ADMIN - Protected (Admin Only) */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly={true}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="experts" element={<ManageExperts />} />
        <Route path="experts/create" element={<CreateExpert />} />
        <Route path="experts/edit" element={<CreateExpert />} />
        <Route path="workshop-requests" element={<AdminWorkshopList />} />
        <Route path="/admin/workshops/:id" element={<AdminWorkshopEdit />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/projects/:id" element={<ProjectDetail />} />
        <Route path="/admin/projects/:id/submit" element={<ProjectSubmit />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;