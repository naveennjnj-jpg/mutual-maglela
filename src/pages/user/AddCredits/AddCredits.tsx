// pages/user/AddCredits.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Coins,
  Check,
  Zap,
  Star,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

// ============================================
// INTERFACES / TYPES
// ============================================

interface PlanFeature {
  id: string;
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  targetAudience: string;
  monthly: {
    credits: number;
    price: string;
    priceLabel: string;
    amount: number;
  };
  yearly: {
    credits: number;
    price: string;
    priceLabel: string;
    savings?: string;
    amount: number;
  };
  features: PlanFeature[];
  isPopular?: boolean;
  type: "basic" | "pro" | "enterprise";
  buttonText: string;
  buttonVariant: "primary" | "outline";
}

interface UserBillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
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

// ============================================
// MAIN COMPONENT
// ============================================

const AddCredits = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [currentBalance, setCurrentBalance] = useState(320);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userBillingInfo, setUserBillingInfo] = useState<UserBillingInfo | null>(null);
  const [fetchingUser, setFetchingUser] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // ============================================
  // FETCH USER BILLING INFO
  // ============================================

  useEffect(() => {
    const fetchUserBillingInfo = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setFetchingUser(false);
          return;
        }

        // Fetch user profile from API
        const response = await axios.get(`${API_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const userData = response.data.data;

          // Map the user data to billing info
          setUserBillingInfo({
            firstName: userData.firstName || userData.name?.split(' ')[0] || "",
            lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || "",
            email: userData.email || "",
            phone: userData.phone || userData.mobile || "",
            company: userData.company || userData.organization || "",
            address: userData.address || userData.streetAddress || "",
            city: userData.city || "",
            postalCode: userData.postalCode || userData.zipCode || "",
            country: userData.country || "",
          });

          // Also update current balance if available
          if (userData.credits !== undefined) {
            setCurrentBalance(userData.credits);
          }
        }
      } catch (err: any) {
        console.error("Error fetching user info:", err);
        // If user info fetch fails, use auth context as fallback
        if (user) {
          // Try to get name from user object
          const userName = ((user as any).name || (user as any).displayName || "").trim();
          const nameParts = userName.split(/\s+/);

          const firstName = (user as any).firstName || nameParts[0] || "";
          const lastName =
            (user as any).lastName ||
            (nameParts.length > 1
              ? nameParts.slice(1).join(" ")
              : firstName);

          setUserBillingInfo({
            firstName,
            lastName,
            email: (user as any).email || "",
            phone: (user as any).phone || (user as any).mobile || "",
            company: (user as any).company || (user as any).organization || "",
          });
        }
      } finally {
        setFetchingUser(false);
      }
    };

    fetchUserBillingInfo();
  }, [user, API_URL]);

  // User state
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: 'User',
    email: 'user@email.com',
    role: 'user',
    credits: 0,
    initials: 'U'
  });

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
          const nameParts = data.name?.split(' ') || ['U'];
          const initials = nameParts
            .map((part: string) => part.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);

          setUserData({
            id: data.id || data._id,
            name: data.name || 'User',
            email: data.email || 'user@email.com',
            role: data.role || 'user',
            avatar: data.avatar || data.profileImage,
            theme: data.theme || 'light',
            credits: data.credits || data.creditsBalance || 0,
            initials: initials || 'U'
          });

          // Apply theme if needed
          if (data.theme) {
            localStorage.setItem('theme', data.theme);
            // You can call a theme function here if you have one
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to localStorage or default values
        const savedName = localStorage.getItem('userName') || 'User';
        const savedEmail = localStorage.getItem('userEmail') || 'user@email.com';
        const savedCredits = parseInt(localStorage.getItem('userCredits') || '0');
        const savedInitials = savedName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

        setUserData(prev => ({
          ...prev,
          name: savedName,
          email: savedEmail,
          credits: savedCredits,
          initials: savedInitials
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);



  // ============================================
  // DATA
  // ============================================

  const plans: PricingPlan[] = [
    {
      id: "basic",
      name: "Individual Scholar",
      subtitle: "Basic",
      description: "Individual Academics & Early-Career Researchers",
      targetAudience: "Postdocs, lecturers, and doctoral candidates building their personal brands",
      monthly: {
        credits: 100,
        price: "R 450",
        priceLabel: "per month",
        amount: 450,
      },
      yearly: {
        credits: 1200,
        price: "R 4,500",
        priceLabel: "per year",
        savings: "Save 17%",
        amount: 4500,
      },
      type: "basic",
      buttonText: "Get Started",
      buttonVariant: "outline",
      features: [
        { id: "f1", text: "10 Document translations/month with AI Story Engine" },
        { id: "f2", text: "1 Standard Academic Profile with Voice & Tone Calibrator" },
        { id: "f3", text: "Step-by-step tools for op-eds, policy briefs & thought leadership" },
        { id: "f4", text: "Access to foundational AI tools to articulate research identity" },
        { id: "f5", text: "Request 'Magalela Polish' at standard hourly/project rate" },
        { id: "f6", text: "Community support via email" },
      ],
    },
    {
      id: "pro",
      name: "Department",
      subtitle: "Pro",
      description: "Faculty-Level Comms Teams & Corporate Social Impact Teams",
      targetAudience: "Faculty marketing units and research centres needing overflow capacity",
      monthly: {
        credits: 200,
        price: "R 2,500",
        priceLabel: "per month",
        amount: 2500,
      },
      yearly: {
        credits: 2400,
        price: "R 25,000",
        priceLabel: "per year",
        savings: "Save 20%",
        amount: 25000,
      },
      type: "pro",
      isPopular: true,
      buttonText: "Get Started",
      buttonVariant: "primary",
      features: [
        { id: "f7", text: "20 Document translations/month with AI Story Engine" },
        { id: "f8", text: "Up to 3 Custom Voice Profiles for team members" },
        { id: "f9", text: "Consistent overflow capacity for high-volume periods" },
        { id: "f10", text: "1 hour of human-led specialist science communication editing/month" },
        { id: "f11", text: "Social media content aligned with institutional tone" },
        { id: "f12", text: "Introduction to premium journalism, strategy & storytelling services" },
        { id: "f13", text: "Priority email support" },
      ],
    },
    {
      id: "enterprise",
      name: "Organisation",
      subtitle: "Enterprise",
      description: "Comms Directors, Exec Leaders, & Global Dev Orgs",
      targetAudience: "Vice-chancellors, university advancement directors, and international NGOs",
      monthly: {
        credits: 1000,
        price: "R 12,500",
        priceLabel: "per month",
        amount: 12500,
      },
      yearly: {
        credits: 12000,
        price: "R 125,000",
        priceLabel: "per year",
        savings: "Save 25%",
        amount: 125000,
      },
      type: "enterprise",
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      features: [
        { id: "f14", text: "100+ Document translations/month with AI Story Engine" },
        { id: "f15", text: "Unlimited Institutional Voice Profiles" },
        { id: "f16", text: "IP protection through precise sourcing and rigorous editorial standards" },
        { id: "f17", text: "Dedicated account manager with integrated narrative impact strategy" },
        { id: "f18", text: "Custom AI models trained on institutional archives" },
        { id: "f19", text: "Complex multi-user collaboration with top-tier security" },
        { id: "f20", text: "Premium service combining journalism, strategy, editing & storytelling" },
        { id: "f21", text: "24/7 priority support with dedicated success team" },
      ],
    },
  ];

  // ============================================
  // HANDLERS
  // ============================================

  const handleBack = () => {
    navigate("/user");
  };

  const handleBillingToggle = (cycle: "monthly" | "yearly") => {
    setBillingCycle(cycle);
  };

  const handleGetStarted = async (planId: string) => {
    // Enterprise plan redirects to contact
    if (planId === "enterprise") {
      navigate("/contact");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to continue");
        return;
      }

      // ✅ Use userBillingInfo from API or fallback to user context
      const billingData = userBillingInfo;

      if (!billingData || !billingData.email) {
        setError("User billing information not available. Please update your profile.");
        return;
      }

      // Find the plan
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        setError("Plan not found");
        return;
      }

      // ✅ Prepare request payload with complete billing info
      const payload = {
        userEmail: billingData.email,
        billingInfo: {
          firstName: billingData.firstName || "",
          lastName: billingData.lastName || "",
          email: billingData.email || "",
          phone: billingData.phone || "",
          company: billingData.company || "",
          address: billingData.address || "",
          city: billingData.city || "",
          postalCode: billingData.postalCode || "",
          country: billingData.country || "",
        },
        planId: planId,
        billingCycle: billingCycle,
      };

      console.log("📤 Initiating payment with payload:", payload);

      // ✅ Call API to initiate payment
      const response = await axios.post(
        `${API_URL}/api/user/credit/create-order`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📥 Payment response:", response.data);

      if (response.data.success) {
        const { paymentData, paymentUrl, orderNumber, transactionId } = response.data.data;

        // ✅ Store order info for reference
        sessionStorage.setItem("pendingOrder", JSON.stringify({
          orderNumber,
          transactionId,
          planId,
          billingCycle,
          credits: billingCycle === "monthly" ? plan.monthly.credits : plan.yearly.credits,
        }));

        // ✅ Redirect to PayFast
        const form = document.createElement("form");
        form.method = "POST";
        form.action = paymentUrl;

        // Add all payment data as hidden fields
        Object.keys(paymentData).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = paymentData[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        setError(response.data.message || "Payment initiation failed");
      }
    } catch (err: any) {
      console.error("❌ Payment initiation error:", err);
      setError(err.response?.data?.message || "Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSales = () => {
    navigate("/contact");
  };

  // ============================================
  // RENDER
  // ============================================

  // Get current billing data
  const getCurrentBilling = (plan: PricingPlan) => {
    return billingCycle === "monthly" ? plan.monthly : plan.yearly;
  };

  // Show loading state while fetching user info
  if (fetchingUser) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#C85A32] mx-auto" />
          <p className="text-gray-500 mt-3 text-sm">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] p-6">
      <div className="max-w-[1200px] mx-auto space-y-8">
        {/* ==========================================
            HEADER
            ========================================== */}
        <div className="flex items-start gap-4">
          <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors flex-shrink-0 mt-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1">
              Credits
            </p>
            <h1 className="text-2xl font-bold text-[#0F2D63]">Add Credits</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Choose a plan to top up your credits and unlock more features.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* ==========================================
            USER BILLING INFO SUMMARY
            ========================================== */}
        {userBillingInfo && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-[#EEF2FA] rounded-xl flex items-center justify-center">
              <Coins className="w-5 h-5 text-[#0F2D63]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-medium">Billing Information</p>
              <p className="text-sm text-[#0F2D63] font-medium">
                {userBillingInfo.firstName} {userBillingInfo.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {userBillingInfo.email} {userBillingInfo.phone && `· ${userBillingInfo.phone}`}
                {userBillingInfo.company && ` · ${userBillingInfo.company}`}
              </p>
            </div>
            {/* <button
              onClick={() => navigate("/user/profile")}
              className="text-xs text-[#C85A32] font-medium hover:underline"
            >
              Update Profile
            </button> */}
          </div>
        )}

        {/* ==========================================
            CURRENT BALANCE
            ========================================== */}
        <div className="inline-flex items-center gap-2.5 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
          <div className="w-8 h-8 bg-[#fff4f0] rounded-xl flex items-center justify-center">
            <Coins className="w-4 h-4 text-[#C85A32]" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Current Balance</p>
            <p className="text-base font-bold text-[#0F2D63]"> {loading ? '...' : userData.credits} credits</p>
          </div>
        </div>

        {/* ==========================================
            BILLING CYCLE TOGGLE
            ========================================== */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => handleBillingToggle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${billingCycle === "monthly"
                  ? "bg-[#0F2D63] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleBillingToggle("yearly")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${billingCycle === "yearly"
                  ? "bg-[#0F2D63] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Yearly
            </button>
          </div>
          {billingCycle === "yearly" && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
              Save up to 25%
            </span>
          )}
        </div>

        {/* ==========================================
            PRICING PLANS
            ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const isPro = plan.type === "pro";
            const currentBilling = getCurrentBilling(plan);
            const isYearly = billingCycle === "yearly";

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg
                  ${isPro
                    ? "border-2 border-[#C85A32] shadow-xl shadow-[#C85A32]/10"
                    : "border border-gray-200 shadow-sm hover:border-gray-300"
                  }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <>
                    <div className="h-1 bg-[#C85A32]"></div>
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1 bg-[#C85A32] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                        <Star className="w-2.5 h-2.5 fill-white" />
                        Most Popular
                      </span>
                    </div>
                  </>
                )}

                {/* Savings Badge for Yearly */}
                {isYearly && plan.yearly.savings && (
                  <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {plan.yearly.savings}
                    </span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Plan Type */}
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    {plan.subtitle}
                  </p>

                  {/* Plan Name */}
                  <h3 className="text-xl font-bold text-[#1C1C1C] mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-1">
                    {plan.description}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed mb-5">
                    {plan.targetAudience}
                  </p>

                  {/* Credits Display */}
                  <div className="flex items-center gap-1.5 bg-[#fff4f0] border border-[#f5c9b8] rounded-xl px-3 py-2 mb-4 w-fit">
                    <Coins className="w-3.5 h-3.5 text-[#C85A32]" />
                    <span className="text-sm font-bold text-[#C85A32]">
                      {currentBilling.credits.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#C85A32]/70 font-medium">
                      credits / {billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <p className="text-2xl font-bold text-[#1C1C1C] leading-tight">
                      {currentBilling.price}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {currentBilling.priceLabel}
                    </p>
                    {isYearly && plan.yearly.savings && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        {plan.yearly.savings} compared to monthly
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature.id} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#C85A32] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 leading-relaxed">
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleGetStarted(plan.id)}
                    disabled={loading || !userBillingInfo}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${plan.buttonVariant === "primary"
                        ? "bg-[#C85A32] hover:bg-[#a8472a] text-white"
                        : "border border-[#0F2D63] text-[#0F2D63] hover:bg-[#0F2D63] hover:text-white"
                      } ${loading || !userBillingInfo ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        {plan.buttonText}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==========================================
            ENTERPRISE CTA
            ========================================== */}
        <div className="bg-[#0F2D63] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold mb-1">Need a custom volume deal?</p>
            <p className="text-white/60 text-sm">
              Contact us for enterprise pricing with dedicated support and custom credit allocations.
            </p>
          </div>
          <button
            onClick={handleContactSales}
            className="flex-shrink-0 px-5 py-2.5 bg-[#C85A32] hover:bg-[#a8472a] text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
          >
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCredits;