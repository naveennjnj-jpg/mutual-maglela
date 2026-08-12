// pages/admin/SubscriptionManagement.tsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  GripVertical,
  Coins,
  Star,
  Eye,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

interface SubscriptionPlan {
  id: string;
  _id?: string;
  tier: string;
  name: string;
  audience: string;
  targetAudience: string;
  monthlyPrice: string;
  yearlyPrice: string;
  creditsMonthly: number;
  creditsYearly: number;
  periodLabel: string;
  buttonLabel: string;
  buttonLink: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  displayOrder?: number;
}

interface NewPlanFormData {
  tier: string;
  name: string;
  audience: string;
  targetAudience: string;
  monthlyPrice: string;
  yearlyPrice: string;
  creditsMonthly: number;
  creditsYearly: number;
  periodLabel: string;
  buttonLabel: string;
  buttonLink: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SubscriptionManagement = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [featuresText, setFeaturesText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewPlanFormData>({
    tier: "",
    name: "",
    audience: "",
    targetAudience: "",
    monthlyPrice: "",
    yearlyPrice: "",
    creditsMonthly: 0,
    creditsYearly: 0,
    periodLabel: "per month",
    buttonLabel: "Get Started",
    buttonLink: "/contact",
    features: [],
    isPopular: false,
    isActive: true,
  });

  // Fetch plans on mount
  useEffect(() => {
    fetchPlans();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // ============================================
  // API CALLS
  // ============================================

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/admin/subscription-plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const transformedPlans = response.data.data.map((plan: any) => ({
          id: plan._id,
          _id: plan._id,
          tier: plan.tier || getTierFromName(plan.name),
          name: plan.name,
          audience: plan.audience || plan.description || "",
          targetAudience: plan.targetAudience || plan.description || "",
          monthlyPrice: plan.monthlyPrice || `R ${plan.price?.toLocaleString() || 0}`,
          yearlyPrice: plan.yearlyPrice || (plan.price ? `R ${(plan.price * 10).toLocaleString()}` : ""),
          creditsMonthly: plan.creditsMonthly || plan.credits || 0,
          creditsYearly: plan.creditsYearly || (plan.credits ? plan.credits * 12 : 0),
          periodLabel: plan.periodLabel || "per month",
          buttonLabel: plan.buttonLabel || "Get Started",
          buttonLink: plan.buttonLink || "/contact",
          features: plan.features || [],
          isPopular: plan.isPopular || false,
          isActive: plan.isActive !== undefined ? plan.isActive : true,
          displayOrder: plan.displayOrder || 0,
        }));
        setPlans(transformedPlans);
        setSuccess(response.data.message || "Plans loaded successfully");
      } else {
        setError(response.data.message || "Failed to fetch plans");
      }
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      setError(error.response?.data?.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const getTierFromName = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('pro')) return 'Pro';
    if (nameLower.includes('enterprise') || nameLower.includes('organisation')) return 'Enterprise';
    if (nameLower.includes('individual') || nameLower.includes('scholar')) return 'Basic';
    return 'Basic';
  };

  const createPlan = async (data: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/subscription-plans`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

  const updatePlan = async (id: string, data: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/subscription-plans/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/api/admin/subscription-plans/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

  // ============================================
  // HANDLERS
  // ============================================

  const getFeatureDisplay = (features: string[]) => {
    const displayCount = 3;
    const shownFeatures = features.slice(0, displayCount);
    const remaining = features.length - displayCount;
    return { shownFeatures, remaining };
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setFeaturesText(text);
    const features = text.split("\n").filter((line) => line.trim() !== "");
    setFormData((prev) => ({
      ...prev,
      features,
    }));
  };

  const resetForm = () => {
    setFormData({
      tier: "",
      name: "",
      audience: "",
      targetAudience: "",
      monthlyPrice: "",
      yearlyPrice: "",
      creditsMonthly: 0,
      creditsYearly: 0,
      periodLabel: "per month",
      buttonLabel: "Get Started",
      buttonLink: "/contact",
      features: [],
      isPopular: false,
      isActive: true,
    });
    setFeaturesText("");
    setEditingPlan(null);
    setIsSubmitting(false);
    setSuccess(null);
    setError(null);
  };

  const handleCreatePlan = async () => {
    if (!formData.tier || !formData.name || !formData.monthlyPrice) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        tier: formData.tier,
        name: formData.name,
        audience: formData.audience,
        targetAudience: formData.targetAudience,
        monthlyPrice: formData.monthlyPrice,
        yearlyPrice: formData.yearlyPrice,
        creditsMonthly: formData.creditsMonthly,
        creditsYearly: formData.creditsYearly,
        periodLabel: formData.periodLabel,
        buttonLabel: formData.buttonLabel,
        buttonLink: formData.buttonLink,
        features: formData.features,
        isPopular: formData.isPopular,
        isActive: formData.isActive,
        price: parseFloat(formData.monthlyPrice.replace(/[^0-9.]/g, '')) || 0,
        credits: formData.creditsMonthly,
        description: formData.audience,
      };

      const response = await createPlan(payload);
      
      if (response.success) {
        setSuccess(response.message || "Plan created successfully");
        await fetchPlans();
        setTimeout(() => {
          setShowNewPlanModal(false);
          resetForm();
        }, 1500);
      } else {
        setError(response.message || "Failed to create plan");
      }
    } catch (error: any) {
      console.error("Error creating plan:", error);
      setError(error.message || "Failed to create plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      tier: plan.tier,
      name: plan.name,
      audience: plan.audience,
      targetAudience: plan.targetAudience,
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      creditsMonthly: plan.creditsMonthly,
      creditsYearly: plan.creditsYearly,
      periodLabel: plan.periodLabel,
      buttonLabel: plan.buttonLabel,
      buttonLink: plan.buttonLink,
      features: plan.features || [],
      isPopular: plan.isPopular,
      isActive: plan.isActive,
    });
    setFeaturesText((plan.features || []).join("\n"));
    setShowNewPlanModal(true);
    setError(null);
    setSuccess(null);
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan) return;
    
    if (!formData.tier || !formData.name || !formData.monthlyPrice) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        tier: formData.tier,
        name: formData.name,
        audience: formData.audience,
        targetAudience: formData.targetAudience,
        monthlyPrice: formData.monthlyPrice,
        yearlyPrice: formData.yearlyPrice,
        creditsMonthly: formData.creditsMonthly,
        creditsYearly: formData.creditsYearly,
        periodLabel: formData.periodLabel,
        buttonLabel: formData.buttonLabel,
        buttonLink: formData.buttonLink,
        features: formData.features,
        isPopular: formData.isPopular,
        isActive: formData.isActive,
        price: parseFloat(formData.monthlyPrice.replace(/[^0-9.]/g, '')) || 0,
        credits: formData.creditsMonthly,
        description: formData.audience,
      };

      const response = await updatePlan(editingPlan._id || editingPlan.id, payload);
      
      if (response.success) {
        setSuccess(response.message || "Plan updated successfully");
        await fetchPlans();
        setTimeout(() => {
          setShowNewPlanModal(false);
          resetForm();
        }, 1500);
      } else {
        setError(response.message || "Failed to update plan");
      }
    } catch (error: any) {
      console.error("Error updating plan:", error);
      setError(error.message || "Failed to update plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = async (planId: string, planName: string) => {
    if (!window.confirm(`Are you sure you want to delete the "${planName}" plan?`)) {
      return;
    }

    try {
      const response = await deletePlan(planId);
      
      if (response.success) {
        setSuccess(response.message || `Plan "${planName}" deleted successfully`);
        await fetchPlans();
      } else {
        setError(response.message || "Failed to delete plan");
      }
    } catch (error: any) {
      console.error("Error deleting plan:", error);
      setError(error.message || "Failed to delete plan");
    }
  };

  const handleTogglePopular = async (planId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/subscription-plans/${planId}`,
        { isPopular: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || `Plan ${!currentStatus ? 'marked as' : 'unmarked from'} popular`);
        await fetchPlans();
      } else {
        setError(response.data.message || "Failed to update plan");
      }
    } catch (error: any) {
      console.error("Error toggling popular:", error);
      setError(error.response?.data?.message || "Failed to update plan");
    }
  };

  const handleToggleActive = async (planId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/subscription-plans/${planId}`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || `Plan ${!currentStatus ? 'activated' : 'deactivated'}`);
        await fetchPlans();
      } else {
        setError(response.data.message || "Failed to update plan");
      }
    } catch (error: any) {
      console.error("Error toggling active:", error);
      setError(error.response?.data?.message || "Failed to update plan");
    }
  };

  const activePlans = plans.filter((p) => p.isActive).length;
  const featuredPlan = plans.find((p) => p.isPopular);

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
    <div className="min-h-screen bg-[#F4F6FB] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1">
            Credit Management
          </p>
          <h1 className="text-2xl font-bold text-[#0F2D63]">
            Subscription Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage the pricing plans shown on the public pricing page. Changes
            are live immediately.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowNewPlanModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New Plan
        </button>
      </div>

      {/* Success/Error Messages - Shows API response message */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-[#0F2D63]">{plans.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Plans</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-[#0F2D63]">{activePlans}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Active (visible to users)
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-[#0F2D63]">
            {featuredPlan?.tier || "None"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Featured Plan</p>
        </div>
      </div>

      {/* Plans List */}
      {plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Coins className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No subscription plans found</p>
          <p className="text-sm text-gray-400 mt-1">Create your first subscription plan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => {
            const isActive = plan.isActive;
            const isPopular = plan.isPopular;
            const { shownFeatures, remaining } = getFeatureDisplay(plan.features || []);

            return (
              <div
                key={plan._id || plan.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-opacity ${
                  isActive ? "border-gray-100" : "border-gray-100 opacity-60"
                }`}
              >
                {isPopular && <div className="h-1 bg-[#C85A32]" />}
                <div className="p-5 flex gap-5 items-start">
                  {/* Drag Handle */}
                  <div className="mt-1 text-gray-200 cursor-grab flex-shrink-0">
                    <GripVertical className="w-[18px] h-[18px]" />
                  </div>

                  {/* Plan Content */}
                  <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Left Column - Plan Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {plan.tier}
                        </span>
                        {isPopular && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C85A32] bg-[#fff4f0] px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-[#C85A32] text-[#C85A32]" />
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-[#0F2D63] text-base">
                        {plan.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {plan.audience}
                      </p>
                    </div>

                    {/* Middle Column - Pricing */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        Pricing & Credits
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-[#fff4f0] border border-[#f5c9b8] rounded-lg px-2.5 py-1">
                          <Coins className="w-3 h-3 text-[#C85A32]" />
                          <span className="text-xs font-bold text-[#C85A32]">
                            {plan.creditsMonthly} cr {plan.periodLabel}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1 w-fit">
                        <Coins className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700">
                          {plan.creditsYearly} cr / yr
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#0F2D63]">
                        {plan.monthlyPrice}{" "}
                        <span className="text-gray-400 font-normal">
                          {plan.periodLabel}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {plan.yearlyPrice}{" "}
                        <span className="text-gray-400 font-normal">/ yr</span>
                      </p>
                      <p className="text-xs text-gray-400 italic">
                        "{plan.buttonLabel}"
                      </p>
                    </div>

                    {/* Right Column - Features */}
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                        {(plan.features || []).length} Features
                      </p>
                      <ul className="space-y-1">
                        {shownFeatures.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-1.5 text-xs text-gray-600"
                          >
                            <Check className="w-2.5 h-2.5 text-[#C85A32] flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                        {remaining > 0 && (
                          <li className="text-xs text-gray-400 pl-4">
                            +{remaining} more
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleTogglePopular(plan._id || plan.id, isPopular)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                        isPopular
                          ? "bg-[#fff4f0] text-[#C85A32]"
                          : "hover:bg-gray-100 text-gray-300"
                      }`}
                      title={isPopular ? "Unset as popular" : "Mark as popular"}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${isPopular ? "fill-[#C85A32]" : ""}`}
                      />
                    </button>
                    <button
                      onClick={() => handleToggleActive(plan._id || plan.id, isActive)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? "hover:bg-gray-100 text-gray-400"
                          : "hover:bg-gray-100 text-gray-300"
                      }`}
                      title={isActive ? "Hide from users" : "Show to users"}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit plan"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan._id || plan.id, plan.name)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="font-bold text-[#0F2D63] text-lg">
                {editingPlan ? "Edit Plan" : "Add New Plan"}
              </h3>
              <button
                onClick={() => {
                  setShowNewPlanModal(false);
                  resetForm();
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Success/Error Messages in Modal - Shows API response */}
              {success && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Plan Identity */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Plan Identity
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Tier Label *
                    </label>
                    <input
                      type="text"
                      name="tier"
                      value={formData.tier}
                      onChange={handleInputChange}
                      placeholder="e.g. Basic, Pro, Enterprise"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F2D63] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Individual Scholar"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F2D63] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Rest of the modal stays the same... */}
              {/* Target Audience */}
              <div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    name="audience"
                    value={formData.audience}
                    onChange={handleInputChange}
                    placeholder="e.g. Individual Academics & Early-Career Researchers"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F2D63] bg-white"
                  />
                </div>
              </div>

              {/* Who It's For */}
              <div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Who It's For
                  </label>
                  <input
                    type="text"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    placeholder="e.g. Postdocs, lecturers, and doctoral candidates..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F2D63] bg-white"
                  />
                </div>
              </div>

              {/* Pricing & Credits */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Pricing & Credits
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Monthly Price *
                    </label>
                    <input
                      type="text"
                      name="monthlyPrice"
                      value={formData.monthlyPrice}
                      onChange={handleInputChange}
                      placeholder="e.g. R 450 – R 850"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F2D63] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Yearly Price
                    </label>
                    <input
                      type="text"
                      name="yearlyPrice"
                      value={formData.yearlyPrice}
                      onChange={handleInputChange}
                      placeholder="e.g. R 380 – R 720"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F2D63] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Credits / Month *
                    </label>
                    <input
                      type="number"
                      name="creditsMonthly"
                      value={formData.creditsMonthly || ""}
                      onChange={handleInputChange}
                      placeholder="e.g. 100"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F2D63] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Credits / Year
                    </label>
                    <input
                      type="number"
                      name="creditsYearly"
                      value={formData.creditsYearly || ""}
                      onChange={handleInputChange}
                      placeholder="e.g. 1200"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F2D63] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Period Label
                    </label>
                    <input
                      type="text"
                      name="periodLabel"
                      value={formData.periodLabel}
                      onChange={handleInputChange}
                      placeholder="e.g. per month"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F2D63] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Call to Action
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Button Label
                    </label>
                    <input
                      type="text"
                      name="buttonLabel"
                      value={formData.buttonLabel}
                      onChange={handleInputChange}
                      placeholder="e.g. Start Free Trial"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F2D63] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Button Link
                    </label>
                    <input
                      type="text"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={handleInputChange}
                      placeholder="/contact"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F2D63] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Features <span className="text-gray-300 font-normal normal-case tracking-normal">
                    (one per line)
                  </span>
                </p>
                <textarea
                  rows={6}
                  value={featuresText}
                  onChange={handleFeaturesChange}
                  placeholder="10 Document translations/month&#10;1 Academic Profile&#10;Access to AI tools"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#0F2D63] resize-none leading-relaxed"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 rounded accent-[#C85A32]"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    Mark as Most Popular
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 rounded accent-[#0F2D63]"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    Active (visible on pricing page)
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowNewPlanModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingPlan ? handleUpdatePlan : handleCreatePlan}
                  disabled={isSubmitting}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold bg-[#0F2D63] text-white hover:bg-[#0a2050] transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editingPlan ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editingPlan ? "Update Plan" : "Add Plan"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;