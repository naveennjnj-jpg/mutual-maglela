// pages/user/Plans.tsx
import React, { useState, useEffect } from "react";
import {
  Zap,
  Check,
  Loader2,
  Coins,
  Star,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Plan {
  _id: string;
  name: string;
  description: string;
  credits: number;
  price: number;
  billingType: string;
  features: string[];
  accentColor: string;
  isPopular: boolean;
  isActive: boolean;
  displayOrder?: number;
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

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Plans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [userBillingInfo, setUserBillingInfo] = useState<UserBillingInfo | null>(null);
  const [fetchingUser, setFetchingUser] = useState(true);

  useEffect(() => {
    fetchPlans();
    fetchUserBillingInfo();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/credit-plans`);
      if (response.data.success) {
        const activePlans = response.data.data.filter((plan: Plan) => plan.isActive);
        setPlans(activePlans);
      } else {
        toast.error(response.data.message || "Failed to fetch plans");
      }
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      toast.error(error.response?.data?.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBillingInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setFetchingUser(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const userData = response.data.data;
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
      }
    } catch (err: any) {
      console.error("Error fetching user info:", err);
      if (user) {
        const userName = ((user as any).name || (user as any).displayName || "").trim();
        const nameParts = userName.split(/\s+/);
        const firstName = (user as any).firstName || nameParts[0] || "";
        const lastName = (user as any).lastName || (nameParts.length > 1 ? nameParts.slice(1).join(" ") : firstName);

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

  const getPriceForBilling = (plan: Plan) => {
    if (isAnnual) {
      // For yearly billing, 20% discount (10 months for the price of 12)
      return Math.round(plan.price * 10);
    }
    return plan.price;
  };

  const getPriceLabel = (plan: Plan) => {
    const price = getPriceForBilling(plan);
    if (price === 0) return "Free";
    if (isAnnual) {
      return `R${Math.round(price / 12).toLocaleString()}/month`;
    }
    return `R${Math.round(price).toLocaleString()}/month`;
  };

  const getCreditsLabel = (plan: Plan) => {
    if (plan.credits >= 1000) {
      return `${(plan.credits / 1000).toFixed(0)}k credits`;
    }
    return `${plan.credits} credits`;
  };

  const handlePurchase = async (plan: Plan) => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to purchase a plan");
      navigate("/login");
      return;
    }

    // Check if billing info is available
    if (!userBillingInfo || !userBillingInfo.email) {
      toast.error("Please update your profile with billing information");
      navigate("/user/profile");
      return;
    }

    setPurchasing(plan._id);

    try {
      const price = getPriceForBilling(plan);
      const credits = isAnnual ? plan.credits * 12 : plan.credits;
      const billingCycle = isAnnual ? "yearly" : "monthly";

      const payload = {
        userEmail: userBillingInfo.email,
        billingInfo: {
          firstName: userBillingInfo.firstName || "",
          lastName: userBillingInfo.lastName || "",
          email: userBillingInfo.email || "",
          phone: userBillingInfo.phone || "",
          company: userBillingInfo.company || "",
          address: userBillingInfo.address || "",
          city: userBillingInfo.city || "",
          postalCode: userBillingInfo.postalCode || "",
          country: userBillingInfo.country || "",
        },
        planId: plan.name,
        billingCycle: billingCycle,
        credits: credits,
        amount: price,
      };

      console.log("📤 Initiating payment with payload:", payload);

      const response = await axios.post(
        `${API_BASE_URL}/api/user/credit/create-order`,
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

        sessionStorage.setItem("pendingOrder", JSON.stringify({
          orderNumber,
          transactionId,
          planId: plan._id,
          planName: plan.name,
          billingCycle,
          credits: credits,
          amount: price,
        }));

        // Redirect to PayFast
        const form = document.createElement("form");
        form.method = "POST";
        form.action = paymentUrl;

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
        toast.error(response.data.message || "Payment initiation failed");
      }
    } catch (error: any) {
      console.error("❌ Payment initiation error:", error);
      toast.error(error.response?.data?.message || "Failed to initiate payment. Please try again.");
    } finally {
      setPurchasing(null);
    }
  };

  if (loading || fetchingUser) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0F2D63] animate-spin" />
          <p className="text-sm text-gray-500">Loading plans...</p>
        </div>
      </div>
    );
  }

  // Separate plans by billing type
  const monthlyPlans = plans.filter(p => p.billingType === "Monthly" || p.billingType === "One-time");
  const yearlyPlans = plans.filter(p => p.billingType === "Yearly");

  // Use all plans or filtered based on toggle
  const displayPlans = isAnnual ? yearlyPlans : monthlyPlans;

  return (
    <div className="min-h-screen bg-[#F9F7F4] p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-1">
            Subscription
          </p>
          <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63]">
            Choose Your Plan
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Select the perfect plan for your academic communication needs
          </p>
        </div>

        {/* User Info Warning */}
        {!userBillingInfo?.email && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-700 text-sm">
              ⚠️ Please update your profile with billing information before purchasing a plan.
            </p>
            <button
              onClick={() => navigate("/user/profile")}
              className="text-amber-700 text-sm font-medium hover:underline mt-1"
            >
              Update Profile →
            </button>
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span
            className={`text-sm font-medium ${
              !isAnnual ? "text-[#0F2D63]" : "text-gray-400"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              isAnnual ? "bg-[#C85A32]" : "bg-gray-200"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                isAnnual ? "left-7" : "left-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              isAnnual ? "text-[#0F2D63]" : "text-gray-400"
            }`}
          >
            Annual
          </span>
          <span className="bg-green-100 text-green-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            Save 20%
          </span>
        </div>

        {/* Plans Grid */}
        {displayPlans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No plans available</p>
            <p className="text-sm text-gray-400 mt-1">
              {isAnnual ? "No yearly plans available" : "No monthly plans available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {displayPlans.map((plan) => {
              const isPopular = plan.isPopular;
              const price = getPriceForBilling(plan);
              const credits = isAnnual ? plan.credits * 12 : plan.credits;
              const isPurchasing = purchasing === plan._id;

              return (
                <div
                  key={plan._id}
                  className={`rounded-2xl border shadow-sm p-6 flex flex-col relative ${
                    isPopular ? "border-[#C85A32] shadow-md" : "border-gray-100"
                  } bg-white hover:shadow-lg transition-all duration-200`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C85A32] text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Most Popular
                    </div>
                  )}
                  
                  <h3 className="font-bold text-[#0F2D63] mb-1">{plan.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{plan.description}</p>
                  
                  {/* Credits Display */}
                  <div className="flex items-center gap-1.5 bg-[#fff4f0] border border-[#f5c9b8] rounded-xl px-3 py-2 mb-4 w-fit">
                    <Coins className="w-3.5 h-3.5 text-[#C85A32]" />
                    <span className="text-sm font-bold text-[#C85A32]">
                      {credits.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#C85A32]/70 font-medium">
                      credits / {isAnnual ? "year" : "month"}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <span className="text-3xl font-bold text-[#0F2D63]">
                      {price === 0 ? "Free" : `R${Math.round(price).toLocaleString()}`}
                    </span>
                    {price > 0 && (
                      <span className="text-gray-400 text-xs ml-1">
                        {isAnnual ? "/year" : "/month"}
                      </span>
                    )}
                    {isAnnual && price > 0 && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        Save 20% compared to monthly
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features && plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-xs text-gray-700"
                      >
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <button
                    onClick={() => handlePurchase(plan)}
                    disabled={isPurchasing || !userBillingInfo?.email}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      isPopular
                        ? "bg-[#C85A32] text-white hover:bg-[#a8472a]"
                        : "border border-[#0F2D63] text-[#0F2D63] hover:bg-[#0F2D63] hover:text-white"
                    } ${(isPurchasing || !userBillingInfo?.email) ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {isPurchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Enterprise CTA */}
        <div className="bg-[#0F2D63] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold mb-1">Need a custom volume deal?</p>
            <p className="text-white/60 text-sm">
              Contact us for enterprise pricing with dedicated support and custom credit allocations.
            </p>
          </div>
          <button
            onClick={() => navigate("/contact")}
            className="flex-shrink-0 px-5 py-2.5 bg-[#C85A32] hover:bg-[#a8472a] text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
          >
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default Plans;