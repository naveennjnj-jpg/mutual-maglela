// pages/admin/CreditPlans.tsx
import React, { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface CreditPlan {
  _id: string;
  planId: string;
  name: string;
  credits: number;
  price: number;
  billingType: "once" | "monthly" | "annual" | "One-time" | "Recurring" | "Monthly" | "Yearly";
  description: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  accentColor: string;
  createdAt?: string;
  updatedAt?: string;
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

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const planService = {
  getPlans: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/admin/plans`);
    return response.data;
  },
  createPlan: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/api/admin/plans`, data);
    return response.data;
  },
  updatePlan: async (id: string, data: any) => {
    const response = await axios.patch(`${API_BASE_URL}/api/admin/plans/${id}`, data);
    return response.data;
  },
  deletePlan: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/api/admin/plans/${id}`);
    return response.data;
  },
  togglePlanStatus: async (id: string, isActive: boolean) => {
    const response = await axios.patch(`${API_BASE_URL}/api/admin/plans/${id}`, { isActive });
    return response.data;
  },
};

const CreditPlans = () => {
  const [plans, setPlans] = useState<CreditPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CreditPlan | null>(null);
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

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await planService.getPlans();
      if (response.success) {
        setPlans(response.data);
      } else {
        toast.error(response.message || "Failed to fetch plans");
      }
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      toast.error(error.response?.data?.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const getBillingDisplay = (plan: CreditPlan) => {
    const billingType = plan.billingType;
    if (billingType === "once" || billingType === "One-time") {
      return "One-time";
    }
    return `/ ${billingType}`;
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

  const handleCreatePlan = async () => {
    // Validate form
    if (!formData.name || formData.name.trim() === "") {
      toast.error("Plan name is required");
      return;
    }
    if (formData.credits <= 0) {
      toast.error("Credits must be greater than 0");
      return;
    }
    if (formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    try {
      // Map billing type to match backend enum
      const billingTypeMap: Record<string, string> = {
        once: "One-time",
        monthly: "Monthly",
        annual: "Yearly",
      };

      const payload = {
        name: formData.name.trim(),
        billingType: billingTypeMap[formData.billingType] || "One-time",
        credits: Number(formData.credits),
        price: Number(formData.price),
        description: formData.description?.trim() || "",
        features: formData.features.filter(f => f.trim() !== ""),
        accentColor: formData.accentColor || "#4f6ef7",
        isPopular: Boolean(formData.isPopular),
        isActive: Boolean(formData.isActive),
      };

      console.log("Sending payload:", payload); // Debug log

      const response = await planService.createPlan(payload);
      
      if (response.success) {
        toast.success("Plan created successfully");
        await fetchPlans();
        setShowNewPlanModal(false);
        resetForm();
      } else {
        toast.error(response.message || "Failed to create plan");
      }
    } catch (error: any) {
      console.error("Error creating plan:", error);
      toast.error(error.response?.data?.message || "Failed to create plan");
    }
  };

  const handleEditPlan = async (planId: string) => {
    const plan = plans.find((p) => p._id === planId);
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        billingType: plan.billingType === "One-time" ? "once" : 
                     plan.billingType === "Monthly" ? "monthly" : "annual",
        credits: plan.credits,
        price: plan.price,
        description: plan.description || "",
        features: plan.features || [],
        accentColor: plan.accentColor || "#4f6ef7",
        isPopular: plan.isPopular || false,
        isActive: plan.isActive !== undefined ? plan.isActive : true,
      });
      setFeaturesText((plan.features || []).join("\n"));
      setShowNewPlanModal(true);
    }
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan) return;

    if (!formData.name || formData.name.trim() === "") {
      toast.error("Plan name is required");
      return;
    }
    if (formData.credits <= 0) {
      toast.error("Credits must be greater than 0");
      return;
    }
    if (formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    try {
      const billingTypeMap: Record<string, string> = {
        once: "One-time",
        monthly: "Monthly",
        annual: "Yearly",
      };

      const payload = {
        name: formData.name.trim(),
        billingType: billingTypeMap[formData.billingType] || "One-time",
        credits: Number(formData.credits),
        price: Number(formData.price),
        description: formData.description?.trim() || "",
        features: formData.features.filter(f => f.trim() !== ""),
        accentColor: formData.accentColor || "#4f6ef7",
        isPopular: Boolean(formData.isPopular),
        isActive: Boolean(formData.isActive),
      };

      const response = await planService.updatePlan(editingPlan._id, payload);
      
      if (response.success) {
        toast.success("Plan updated successfully");
        await fetchPlans();
        setShowNewPlanModal(false);
        resetForm();
        setEditingPlan(null);
      } else {
        toast.error(response.message || "Failed to update plan");
      }
    } catch (error: any) {
      console.error("Error updating plan:", error);
      toast.error(error.response?.data?.message || "Failed to update plan");
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      const response = await planService.deletePlan(planId);
      
      if (response.success) {
        toast.success("Plan deleted successfully");
        await fetchPlans();
      } else {
        toast.error(response.message || "Failed to delete plan");
      }
    } catch (error: any) {
      console.error("Error deleting plan:", error);
      toast.error(error.response?.data?.message || "Failed to delete plan");
    }
  };

  const handleToggleStatus = async (planId: string, currentStatus: boolean) => {
    try {
      const response = await planService.togglePlanStatus(planId, !currentStatus);
      
      if (response.success) {
        toast.success(`Plan ${!currentStatus ? "activated" : "deactivated"} successfully`);
        await fetchPlans();
      } else {
        toast.error(response.message || "Failed to update plan status");
      }
    } catch (error: any) {
      console.error("Error updating plan status:", error);
      toast.error(error.response?.data?.message || "Failed to update plan status");
    }
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
    setEditingPlan(null);
  };

  const getIconForPlan = (plan: CreditPlan) => {
    const icons: Record<string, React.ReactNode> = {
      Starter: <Package className="w-[18px] h-[18px]" />,
      Essential: <Zap className="w-[18px] h-[18px]" />,
      Premium: <Star className="w-[18px] h-[18px]" />,
      Enterprise: <Crown className="w-[18px] h-[18px]" />,
    };
    return icons[plan.name] || <Package className="w-[18px] h-[18px]" />;
  };

  const activePlans = plans.filter((p) => p.isActive).length;
  const popularPlan = plans.find((p) => p.isPopular);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0F2D63] animate-spin" />
          <p className="text-sm text-gray-500">Loading plans...</p>
        </div>
      </div>
    );
  }

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
          onClick={() => {
            resetForm();
            setShowNewPlanModal(true);
          }}
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
      {plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No credit plans found</p>
          <p className="text-sm text-gray-400 mt-1">Create your first credit plan to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isActive = plan.isActive;
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan._id}
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
                        {getIconForPlan(plan)}
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
                        onClick={() => handleEditPlan(plan._id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan._id)}
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
                        credits {plan.billingType === "One-time" || plan.billingType === "once" ? "One-time" : `/ ${plan.billingType}`}
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
                    {plan.features && plan.features.map((feature, index) => (
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
                      onClick={() => handleToggleStatus(plan._id, isActive)}
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
      )}

      {/* New/Edit Plan Modal */}
      {showNewPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0F2D63] text-lg">
                {editingPlan ? "Edit Credit Plan" : "New Credit Plan"}
              </h3>
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
                    placeholder="Enter plan name"
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
                    placeholder="0"
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
                    placeholder="0"
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
                  placeholder="Brief description of the plan"
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
                onClick={editingPlan ? handleUpdatePlan : handleCreatePlan}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-[#0F2D63] text-white hover:bg-[#0a2050]"
              >
                {editingPlan ? "Update Plan" : "Create Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditPlans;