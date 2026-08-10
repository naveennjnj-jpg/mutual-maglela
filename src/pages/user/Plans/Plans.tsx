// pages/user/Plans.tsx
import React, { useState } from "react";
import {
  Zap,
  CreditCard,
  Download,
  Check,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  isCurrent?: boolean;
  isPopular?: boolean;
  features: {
    included: string[];
    excluded: string[];
  };
  action: {
    label: string;
    type: "current" | "upgrade" | "downgrade";
  };
}

interface BillingHistory {
  id: string;
  invoice: string;
  plan: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
}

const Plans = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      description: "For individuals exploring institutional communication",
      price: 0,
      priceLabel: "Free",
      features: {
        included: [
          "3 AI Writing generations/month",
          "1 active project",
          "Basic templates (5)",
          "Community support",
        ],
        excluded: [
          "AI Speech calibration",
          "Expert consultations",
          "Advanced workshops",
          "Priority support",
        ],
      },
      action: {
        label: "Downgrade",
        type: "downgrade",
      },
    },
    {
      id: "professional",
      name: "Professional",
      description: "For communications professionals and small teams",
      price: isAnnual ? 1499 * 0.8 : 1499,
      priceLabel: isAnnual ? "R1,199/month" : "R1,499/month",
      isCurrent: true,
      isPopular: true,
      features: {
        included: [
          "Unlimited AI Writing",
          "AI Speech calibration",
          "20 active projects",
          "Full template library",
          "2 expert consultations/month",
          "Workshop access",
          "Email support",
        ],
        excluded: [
          "Dedicated account manager",
          "Custom branding",
          "API access",
        ],
      },
      action: {
        label: "Current Plan",
        type: "current",
      },
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For institutions and large communications teams",
      price: isAnnual ? 4999 * 0.8 : 4999,
      priceLabel: isAnnual ? "R3,999/month" : "R4,999/month",
      features: {
        included: [
          "Everything in Professional",
          "Unlimited projects & users",
          "Dedicated account manager",
          "Custom branding",
          "API access",
          "Unlimited expert consultations",
          "On-site workshops",
          "24/7 priority support",
        ],
        excluded: [],
      },
      action: {
        label: "Upgrade",
        type: "upgrade",
      },
    },
  ];

  const billingHistory: BillingHistory[] = [
    {
      id: "1",
      invoice: "INV-2026-005",
      plan: "Professional",
      date: "2026-06-01",
      amount: 1499,
      status: "Paid",
    },
    {
      id: "2",
      invoice: "INV-2026-004",
      plan: "Professional",
      date: "2026-05-01",
      amount: 1499,
      status: "Paid",
    },
    {
      id: "3",
      invoice: "INV-2026-003",
      plan: "Professional",
      date: "2026-04-01",
      amount: 1499,
      status: "Paid",
    },
    {
      id: "4",
      invoice: "INV-2026-002",
      plan: "Professional",
      date: "2026-03-01",
      amount: 1499,
      status: "Paid",
    },
  ];

  const handleBillingAction = (action: string) => {
    // Implement billing actions
    console.log(`Billing action: ${action}`);
  };

  const handlePlanAction = (planId: string, actionType: string) => {
    // Implement plan actions
    console.log(`Plan ${planId}: ${actionType}`);
  };

  const getStatusBadge = (status: BillingHistory["status"]) => {
    const config = {
      Paid: "bg-green-50 text-green-600",
      Pending: "bg-amber-50 text-amber-600",
      Overdue: "bg-red-50 text-red-600",
    };
    return config[status] || config.Paid;
  };

  // Get the current plan (the one with isCurrent: true)
  const currentPlan = plans.find(p => p.isCurrent) || plans[1];

  return (
    <div className="min-h-screen bg-[#F9F7F4] p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-1">
            Account
          </p>
          <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63]">
            Plans & Billing
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your subscription and view billing history
          </p>
        </div>

        {/* Current Plan Banner */}
        <div className="bg-[#0F2D63] rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 bg-[#C85A32] rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white/70 text-xs mb-0.5">Current Plan</p>
            <h2 className="text-white font-bold text-lg capitalize">
              {currentPlan.name} Plan
            </h2>
            <p className="text-white/60 text-xs mt-0.5">
              Renews on 1 July 2026 · R{Math.round(currentPlan.price).toLocaleString()}/month
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleBillingAction("manage-payment")}
              className="border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              Manage Payment
            </button>
            <button
              onClick={() => handleBillingAction("upgrade")}
              className="bg-[#C85A32] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#a8472a] transition-colors"
            >
              Upgrade
            </button>
          </div>
        </div>

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {plans.map((plan) => {
            const isCurrent = plan.isCurrent;
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border shadow-sm p-6 flex flex-col relative ${
                  isPopular ? "border-[#C85A32]" : "border-gray-100"
                } bg-white`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C85A32] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="font-bold text-[#0F2D63] mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.description}</p>
                <div className="mb-5">
                  <span className="text-3xl font-bold text-[#0F2D63]">
                    {plan.price === 0 ? "Free" : `R${Math.round(plan.price).toLocaleString()}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-400 text-xs ml-1">/month</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.included.map((feature, index) => (
                    <li
                      key={`included-${index}`}
                      className="flex items-start gap-2 text-xs text-gray-700"
                    >
                      <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                  {plan.features.excluded.map((feature, index) => (
                    <li
                      key={`excluded-${index}`}
                      className="flex items-start gap-2 text-xs text-gray-400"
                    >
                      <span className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-center leading-none">
                        —
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-gray-100 text-gray-500">
                    {plan.action.label}
                  </div>
                ) : (
                  <button
                    onClick={() => handlePlanAction(plan.id, plan.action.type)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      plan.action.type === "upgrade"
                        ? "border border-[#0F2D63] text-[#0F2D63] hover:bg-[#0F2D63] hover:text-white"
                        : "border border-[#0F2D63] text-[#0F2D63] hover:bg-[#0F2D63] hover:text-white"
                    }`}
                  >
                    {plan.action.label}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-[#0F2D63] mb-4">
            Billing History
          </h2>
          <div className="space-y-2">
            {billingHistory.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-[#0F2D63]">
                      {bill.invoice}
                    </p>
                    <p className="text-xs text-gray-400">
                      {bill.plan} · {bill.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#0F2D63]">
                    R{bill.amount.toLocaleString()}
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${getStatusBadge(
                      bill.status
                    )} px-2 py-0.5 rounded-full`}
                  >
                    {bill.status}
                  </span>
                  <button
                    onClick={() => handleBillingAction(`download-${bill.id}`)}
                    className="text-gray-400 hover:text-[#C85A32] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;