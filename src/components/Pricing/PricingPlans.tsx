import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

interface PricingPlan {
  id: number;
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
}: PricingPlansProps) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(defaultBilling);

  const defaultPlans: PricingPlan[] = [
    {
      id: 1,
      name: "Basic",
      title: "Individual Scholar",
      subtitle: "Individual Academics & Early-Career Researchers",
      description: "Postdocs, lecturers, and doctoral candidates building their personal brands",
      monthlyPrice: "R 450",
      yearlyPrice: "R 850",
      features: [
        "10 Document translations/month with AI Story Engine",
        "1 Standard Academic Profile with Voice & Tone Calibrator",
        "Step-by-step tools for op-eds, policy briefs & thought leadership",
        "Access to foundational AI tools to articulate research identity",
        "Request 'Magalela Polish' at standard hourly/project rate",
      ],
      buttonText: "Get Started",
      buttonLink: "/contact",
    },
    {
      id: 2,
      name: "Pro",
      title: "Department",
      subtitle: "Faculty-Level Comms Teams & Corporate Social Impact Teams",
      description: "Faculty marketing units and research centres needing overflow capacity",
      monthlyPrice: "R 4,500",
      yearlyPrice: "R 8,500",
      features: [
        "50 Document translations/month with AI Story Engine",
        "Up to 5 Custom Voice Profiles for team members",
        "Consistent overflow capacity for high-volume periods",
        "2 hours of human-led specialist science communication editing/month",
        "Social media content aligned with institutional tone",
        "Introduction to premium journalism, strategy & storytelling services",
      ],
      buttonText: "Get Started",
      buttonLink: "/contact",
      isPopular: true,
    },
    {
      id: 3,
      name: "Enterprise",
      title: "Organisation",
      subtitle: "Comms Directors, Exec Leaders, & Global Dev Orgs",
      description: "Vice-chancellors, university advancement directors, and international NGOs",
      monthlyPrice: "R 25,000",
      yearlyPrice: "R 25,000",
      features: [
        "Unlimited document processing with AI Story Engine",
        "Unlimited Institutional Voice Profiles",
        "IP protection through precise sourcing and rigorous editorial standards",
        "Dedicated account manager with integrated narrative impact strategy",
        "Custom AI models trained on institutional archives",
        "Complex multi-user collaboration with top-tier security",
        "Premium service combining journalism, strategy, editing & storytelling",
      ],
      buttonText: "Contact Sales",
      buttonLink: "/contact",
      isEnterprise: true,
      priceSuffix: "+",
    },
  ];

  const plans = propPlans || defaultPlans;

  const getPrice = (plan: PricingPlan) => {
    if (billingCycle === "monthly") {
      return plan.monthlyPrice;
    }
    return plan.yearlyPrice;
  };

  const getPriceSuffix = (plan: PricingPlan) => {
    if (plan.isEnterprise) {
      return plan.priceSuffix || "+";
    }
    return "";
  };

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
        {showToggle && (
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-7 flex flex-col ${cardBgColor} border ${
                plan.isPopular ? `border-2 ${popularBorderColor} shadow-xl ${popularShadowColor}` : "border-gray-200 shadow-sm"
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 right-5">
                  <span className={`${popularBadgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap`}>
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

              {/* Price */}
              <div className="mb-6">
                <p className="text-2xl md:text-3xl font-bold text-[#1C1C1C] leading-tight">
                  {getPrice(plan)}
                  {getPriceSuffix(plan)}
                </p>
                <p className="text-xs text-gray-400 mt-1">per month</p>
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
      </div>
    </section>
  );
};

export default PricingPlans;