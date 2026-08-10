// pages/admin/CreditPlans.tsx
import React, { useState } from "react";
import {
  Plus,
  Package,
  Pencil,
  Trash2,
  Coins,
  Zap,
  Star,
  Crown,
  X,
} from "lucide-react";

interface CreditPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  billingType: "once" | "monthly" | "annual";
  description: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  accentColor: string;
  icon: React.ReactNode;
}

interface NewPlanFormData {
  name: string;
  billingType: "once" | "monthly" | "annual";
  credits: number;
  price: number;
  description: string;
  features: string[];
  accentColor: string;
  isPopular: boolean;
  isActive: boolean;
}

const CreditPlans = () => {
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [formData, setFormData] = useState<NewPlanFormData>({
    name: "",
    billingType: "once",
    credits: 0,
    price: 0,
    description: "",
    features: [],
    accentColor: "#4f6ef7",
    isPopular: false,
    isActive: true,
  });
  const [featuresText, setFeaturesText] = useState("");

  // Mock data - in real app this would come from an API
  const [plans, setPlans] = useState<CreditPlan[]>([
    {
      id: "1",
      name: "Starter",
      credits: 100,
      price: 299,
      billingType: "once",
      description: "Perfect for individuals getting started with academic writing.",
      features: ["100 credits", "AI Writing access", "Basic templates", "Email support"],
      isPopular: false,
      isActive: true,
      accentColor: "#6b7280",
      icon: <Package className="w-[18px] h-[18px]" />,
    },
    {
      id: "2",
      name: "Essential",
      credits: 300,
      price: 749,
      billingType: "monthly",
      description: "Great for active students and freelance writers.",
      features: [
        "300 credits/month",
        "AI Writing & Speech",
        "Expert consultation (1hr)",
        "Priority support",
        "All templates",
      ],
      isPopular: false,
      isActive: true,
      accentColor: "#4f6ef7",
      icon: <Zap className="w-[18px] h-[18px]" />,
    },
    {
      id: "3",
      name: "Premium",
      credits: 700,
      price: 1499,
      billingType: "monthly",
      description: "Ideal for researchers and academics with regular writing needs.",
      features: [
        "700 credits/month",
        "All AI tools",
        "Expert consultations (3hr)",
        "Dedicated support",
        "Advanced analytics",
        "Custom templates",
      ],
      isPopular: true,
      isActive: true,
      accentColor: "#C85A32",
      icon: <Star className="w-[18px] h-[18px]" />,
    },
    {
      id: "4",
      name: "Enterprise",
      credits: 2000,
      price: 3999,
      billingType: "annual",
      description: "Designed for institutions and organisations with high volume needs.",
      features: [
        "2000 credits/month",
        "All AI tools",
        "Unlimited expert consultations",
        "Account manager",
        "Custom integrations",
        "Team management",
        "SLA guarantee",
      ],
      isPopular: false,
      isActive: true,
      accentColor: "#0F2D63",
      icon: <Crown className="w-[18px] h-[18px]" />,
    },
    {
      id: "5",
      name: "Pay-As-You-Go",
      credits: 50,
      price: 179,
      billingType: "once",
      description: "Flexible top-up credits for occasional use.",
      features: ["50 credits", "No expiry", "AI Writing access", "Standard support"],
      isPopular: false,
      isActive: false,
      accentColor: "#22c9a5",
      icon: <Package className="w-[18px] h-[18px]" />,
    },
  ]);

  const getBillingLabel = (type: string) => {
    const config = {
      once: "One-time",
      monthly: "/ month",
      annual: "/ year",
    };
    return config[type as keyof typeof config] || "";
  };

  const getBillingDisplay = (plan: CreditPlan) => {
    if (plan.billingType === "once") {
      return "One-time";
    }
    return `/ ${plan.billingType}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      accentColor: e.target.value,
    }));
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setFeaturesText(text);
    const features = text.split("\n").filter((line) => line.trim() !== "");
    setFormData((prev) => ({
      ...prev,
      features,
    }));
  };

  const handleCreatePlan = () => {
    // Validate form
    if (!formData.name || formData.credits <= 0 || formData.price <= 0) {
      alert("Please fill in all required fields");
      return;
    }

    const newPlan: CreditPlan = {
      id: String(Date.now()),
      name: formData.name,
      credits: formData.credits,
      price: formData.price,
      billingType: formData.billingType,
      description: formData.description,
      features: formData.features.length > 0 ? formData.features : ["No features specified"],
      isPopular: formData.isPopular,
      isActive: formData.isActive,
      accentColor: formData.accentColor,
      icon: <Package className="w-[18px] h-[18px]" />,
    };

    setPlans([...plans, newPlan]);
    setShowNewPlanModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      billingType: "once",
      credits: 0,
      price: 0,
      description: "",
      features: [],
      accentColor: "#4f6ef7",
      isPopular: false,
      isActive: true,
    });
    setFeaturesText("");
  };

  const togglePlanStatus = (planId: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
      )
    );
  };

  const deletePlan = (planId: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      setPlans((prev) => prev.filter((plan) => plan.id !== planId));
    }
  };

  const editPlan = (planId: string) => {
    // Implement edit functionality
    console.log("Edit plan:", planId);
  };

  const activePlans = plans.filter((p) => p.isActive).length;
  const popularPlan = plans.find((p) => p.isPopular);

  return (
    <div className="min-h-screen bg-[#F4F6FB] p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1">
            Credit Management
          </p>
          <h1 className="text-2xl font-bold text-[#0F2D63]">Credit Plans</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Create and manage the credit plans available to users
          </p>
        </div>
        <button
          onClick={() => setShowNewPlanModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-[#0F2D63]">{plans.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Plans</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-[#0F2D63]">{activePlans}</p>
          <p className="text-xs text-gray-500 mt-0.5">Active Plans</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-[#0F2D63]">
            {popularPlan?.name || "N/A"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Popular Plan</p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isActive = plan.isActive;
          const isPopular = plan.isPopular;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                isActive ? "border-gray-100" : "border-gray-100 opacity-60"
              }`}
            >
              {isPopular && (
                <div className="h-1" style={{ background: plan.accentColor }} />
              )}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${plan.accentColor}18`,
                        color: plan.accentColor,
                      }}
                    >
                      {plan.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-[#0F2D63] text-sm">
                          {plan.name}
                        </p>
                        {isPopular && (
                          <span
                            className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                            style={{
                              background: `${plan.accentColor}18`,
                              color: plan.accentColor,
                            }}
                          >
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => editPlan(plan.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deletePlan(plan.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 bg-[#fff4f0] border border-[#f5c9b8] rounded-xl px-3 py-2 w-fit">
                    <Coins className="w-3.5 h-3.5 text-[#C85A32]" />
                    <span className="text-sm font-bold text-[#C85A32]">
                      {plan.credits}
                    </span>
                    <span className="text-xs text-[#C85A32]/70 font-medium">
                      credits {plan.billingType === "once" ? "One-time" : `/ ${plan.billingType}`}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[#0F2D63]">
                    R {plan.price.toLocaleString()}
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      {getBillingDisplay(plan)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-1.5">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check flex-shrink-0"
                        style={{ color: plan.accentColor }}
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span
                    className={`text-xs font-medium ${
                      isActive ? "text-emerald-600" : "text-gray-400"
                    }`}
                  >
                    {isActive ? "● Active" : "○ Inactive"}
                  </span>
                  <button
                    onClick={() => togglePlanStatus(plan.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "text-red-500 hover:bg-red-50"
                        : "text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Plan Modal */}
      {showNewPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0F2D63] text-lg">New Credit Plan</h3>
              <button
                onClick={() => {
                  setShowNewPlanModal(false);
                  resetForm();
                }}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F2D63]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Billing Type
                  </label>
                  <select
                    name="billingType"
                    value={formData.billingType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F2D63] bg-white"
                  >
                    <option value="once">One-time</option>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Credits *
                  </label>
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F2D63]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Price (R) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F2D63]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F2D63]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Features (one per line)
                </label>
                <textarea
                  rows={5}
                  value={featuresText}
                  onChange={handleFeaturesChange}
                  placeholder="100 credits&#10;AI Writing access&#10;Email support"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F2D63] resize-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={handleColorChange}
                    className="w-10 h-9 border border-gray-200 rounded-xl cursor-pointer"
                  />
                  <span className="text-sm text-gray-500 font-mono">
                    {formData.accentColor}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 rounded accent-[#0F2D63]"
                  />
                  <span className="text-sm text-gray-600">Mark as Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 rounded accent-[#0F2D63]"
                  />
                  <span className="text-sm text-gray-600">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setShowNewPlanModal(false);
                  resetForm();
                }}
                className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlan}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-[#0F2D63] text-white hover:bg-[#0a2050]"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditPlans;