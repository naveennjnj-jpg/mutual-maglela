// components/PricingPlans.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface PricingPlan {
  id: number;
  _id?: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  isPopular?: boolean;
  isEnterprise?: boolean;
  priceSuffix?: string;
  credits?: number;
  creditsMonthly?: number;
  creditsYearly?: number;
  tier?: string;
  billingType?: string;
}

interface PricingPlansProps {
  badge?: string;
  title?: string;
  description?: string;
  plans?: PricingPlan[];
  bgColor?: string;
  textColor?: string;
  badgeColor?: string;
  descriptionColor?: string;
  cardBgColor?: string;
  popularBadgeColor?: string;
  popularBorderColor?: string;
  popularShadowColor?: string;
  buttonPrimaryColor?: string;
  buttonPrimaryHoverColor?: string;
  buttonSecondaryColor?: string;
  buttonSecondaryHoverColor?: string;
  maxWidth?: string;
  padding?: string;
  titleSize?: string;
  showToggle?: boolean;
  defaultBilling?: "monthly" | "yearly";
  toggleLabels?: {
    monthly: string;
    yearly: string;
  };
  apiEndpoint?: string;
  useApi?: boolean;
}

const PricingPlans = ({
  badge = "Retainer Plans",
  title = "AI-Powered Plans for Every Stage",
  description = "From individual scholars to institutional leaders — find the right plan to amplify your research and impact.",
  plans: propPlans,
  bgColor = "bg-[#F5F0EA]",
  textColor = "text-[#1C1C1C]",
  badgeColor = "text-[#C85A32]",
  descriptionColor = "text-gray-500",
  cardBgColor = "bg-white",
  popularBadgeColor = "bg-[#C85A32]",
  popularBorderColor = "border-[#C85A32]",
  popularShadowColor = "shadow-[#C85A32]/10",
  buttonPrimaryColor = "bg-[#C85A32]",
  buttonPrimaryHoverColor = "hover:bg-[#a8472a]",
  buttonSecondaryColor = "border-[#0F2D63] text-[#0F2D63]",
  buttonSecondaryHoverColor = "hover:bg-[#0F2D63] hover:text-white",
  maxWidth = "max-w-[1500px]",
  padding = "py-20",
  titleSize = "text-3xl md:text-[42px]",
  showToggle = true,
  defaultBilling = "monthly",
  toggleLabels = {
    monthly: "Monthly",
    yearly: "Yearly",
  },
  apiEndpoint = "/api/admin/subscription-plans",
  useApi = true,
}: PricingPlansProps) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(defaultBilling);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch plans from API
  useEffect(() => {
    if (useApi) {
      fetchPlans();
    } else if (propPlans) {
      setPlans(propPlans);
      setLoading(false);
    } else {
      setPlans([]);
      setLoading(false);
    }
  }, [useApi, propPlans]);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}${apiEndpoint}`);
      
      if (response.data.success) {
        const transformedPlans = transformApiPlans(response.data.data);
        setPlans(transformedPlans);
      } else {
        setError(response.data.message || "Failed to fetch plans");
        toast.error(response.data.message || "Failed to fetch plans");
      }
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      setError(error.response?.data?.message || "Failed to load plans");
      toast.error(error.response?.data?.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to component format
  const transformApiPlans = (apiPlans: any[]): PricingPlan[] => {
    // Group plans by name/tier
    const groupedPlans: Record<string, any> = {};

    apiPlans.forEach((plan) => {
      const key = plan.name || plan.tier;
      
      if (!groupedPlans[key]) {
        groupedPlans[key] = {
          id: Object.keys(groupedPlans).length + 1,
          _id: plan._id,
          name: plan.tier || "Basic",
          title: plan.name || plan.tier || "Plan",
          subtitle: plan.audience || "",
          description: plan.targetAudience || plan.description || "",
          features: plan.features || [],
          buttonText: plan.buttonLabel || "Get Started",
          buttonLink: plan.buttonLink || "/contact",
          isPopular: plan.isPopular || false,
          isEnterprise: plan.tier?.toLowerCase() === "enterprise",
          priceSuffix: plan.tier?.toLowerCase() === "enterprise" ? "+" : "",
          credits: plan.creditsMonthly || plan.credits || 0,
          creditsMonthly: plan.creditsMonthly || plan.credits || 0,
          creditsYearly: plan.creditsYearly || (plan.credits || 0) * 12 || 0,
          tier: plan.tier,
          billingType: plan.billingType,
          // Store the plan data directly
          monthlyPrice: plan.monthlyPrice || `R ${plan.price?.toLocaleString() || 0}`,
          yearlyPrice: plan.yearlyPrice || (plan.price ? `R ${(plan.price * 10).toLocaleString()}` : "R 0"),
        };
      } else {
        // Update existing grouped plan with data from this plan
        const existing = groupedPlans[key];
        
        // Update monthly data if this plan has it
        if (plan.monthlyPrice || plan.price) {
          existing.monthlyPrice = plan.monthlyPrice || `R ${plan.price?.toLocaleString() || 0}`;
          existing.creditsMonthly = plan.creditsMonthly || plan.credits || 0;
        }
        
        // Update yearly data if this plan has it
        if (plan.yearlyPrice || plan.price) {
          existing.yearlyPrice = plan.yearlyPrice || `R ${(plan.price * 10).toLocaleString()}`;
          existing.creditsYearly = plan.creditsYearly || (plan.credits || 0) * 12 || 0;
        }
        
        // Update features if this plan has more
        if (plan.features && plan.features.length > 0) {
          existing.features = plan.features;
        }
        
        // Update other fields
        if (plan.isPopular) existing.isPopular = plan.isPopular;
        if (plan.buttonLabel) existing.buttonText = plan.buttonLabel;
        if (plan.buttonLink) existing.buttonLink = plan.buttonLink;
        if (plan.audience) existing.subtitle = plan.audience;
        if (plan.targetAudience) existing.description = plan.targetAudience;
        if (plan.tier) existing.name = plan.tier;
      }
    });

    // Convert to array and sort
    return Object.values(groupedPlans).sort((a, b) => {
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return (a.id || 0) - (b.id || 0);
    });
  };

  const getPrice = (plan: PricingPlan) => {
    if (billingCycle === "monthly") {
      return plan.monthlyPrice || "R 0";
    }
    return plan.yearlyPrice || plan.monthlyPrice || "R 0";
  };

  const getPriceSuffix = (plan: PricingPlan) => {
    if (plan.isEnterprise) {
      return plan.priceSuffix || "+";
    }
    return "";
  };

  const getCredits = (plan: PricingPlan) => {
    if (billingCycle === "monthly") {
      return plan.creditsMonthly || plan.credits || 0;
    }
    return plan.creditsYearly || (plan.credits || 0) * 12;
  };

  const displayPlans = useApi ? plans : (propPlans || []);

  if (loading) {
    return (
      <section className={`${padding} ${bgColor}`}>
        <div className={`${maxWidth} mx-auto px-6 lg:px-8`}>
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-[#C85A32] animate-spin" />
            <p className="text-gray-500 mt-4 text-sm">Loading plans...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`${padding} ${bgColor}`}>
        <div className={`${maxWidth} mx-auto px-6 lg:px-8`}>
          <div className="text-center bg-red-50 border border-red-200 rounded-2xl p-8">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={fetchPlans}
              className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${padding} ${bgColor}`}>
      <div className={`${maxWidth} mx-auto px-6 lg:px-8`}>
        {/* Header */}
        <div className="text-center mb-14">
          {badge && (
            <p className={`${badgeColor} text-xs font-semibold uppercase tracking-widest mb-4`}>
              {badge}
            </p>
          )}
          {title && (
            <h2 className={`${titleSize} font-['Roboto'] ${textColor} leading-[1.15] mb-4`}>
              {title}
            </h2>
          )}
          {description && (
            <p className={`${descriptionColor} text-sm md:text-base leading-relaxed max-w-xl mx-auto`}>
              {description}
            </p>
          )}
        </div>

        {/* Billing Toggle */}
        {showToggle && displayPlans.length > 0 && (
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-white text-[#1C1C1C] shadow-sm"
                    : "text-gray-400"
                }`}
              >
                {toggleLabels.monthly}
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  billingCycle === "yearly"
                    ? "bg-white text-[#1C1C1C] shadow-sm"
                    : "text-gray-400"
                }`}
              >
                {toggleLabels.yearly}
              </button>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        {displayPlans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No plans available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {displayPlans.map((plan) => (
              <div
                key={plan._id || plan.id}
                className={`relative rounded-2xl p-7 flex flex-col ${cardBgColor} border ${
                  plan.isPopular
                    ? `border-2 ${popularBorderColor} shadow-xl ${popularShadowColor}`
                    : "border-gray-200 shadow-sm"
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 right-5">
                    <span
                      className={`${popularBadgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap`}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  {plan.name}
                </p>

                {/* Plan Title */}
                <h3 className="text-xl font-['Roboto'] font-bold text-[#1C1C1C] mb-1">
                  {plan.title}
                </h3>

                {/* Plan Subtitle */}
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {plan.subtitle}
                </p>

                {/* Plan Description */}
                <p className="text-xs text-gray-400 leading-relaxed mb-5">
                  {plan.description}
                </p>

                {/* Credits */}
                {getCredits(plan) > 0 && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-[#C85A32] bg-[#fff4f0] px-3 py-1 rounded-full">
                      {getCredits(plan).toLocaleString()} credits / {billingCycle}
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  <p className="text-2xl md:text-3xl font-bold text-[#1C1C1C] leading-tight">
                    {getPrice(plan)}
                    {getPriceSuffix(plan)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">per {billingCycle === "monthly" ? "month" : "year"}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Link
                  to={plan.buttonLink}
                  className={`w-full py-3 rounded-xl font-semibold text-sm text-center transition-all ${
                    plan.isPopular
                      ? `${buttonPrimaryColor} ${buttonPrimaryHoverColor} text-white`
                      : `border ${buttonSecondaryColor} ${buttonSecondaryHoverColor}`
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingPlans;