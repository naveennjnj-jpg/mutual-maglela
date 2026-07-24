import React from "react";

interface PartnershipOnboardingProps {
  badge?: string;
  title?: string;
  description?: string;
  steps?: Array<{
    id: number;
    number: string;
    title: string;
    description: string;
  }>;
}

const PartnershipOnboarding = ({
  badge = "How It Works",
  title = "Partnership Onboarding",
  description = "From first conversation to long-term collaboration — here's what you can expect when you partner with Magalela Media.",
  steps: propSteps,
}: PartnershipOnboardingProps) => {
  const defaultSteps = [
    {
      id: 1,
      number: "01",
      title: "Discovery Call",
      description:
        "We learn about your communication needs, strategic priorities, and the challenges your organisation faces.",
    },
    {
      id: 2,
      number: "02",
      title: "Pilot Project",
      description:
        "Start with a focused engagement to test our editorial fit, quality standards, and working relationship.",
    },
    {
      id: 3,
      number: "03",
      title: "Partnership Design",
      description:
        "Co-create a retainer model that aligns with your budget, timelines, and long-term strategic goals.",
    },
    {
      id: 4,
      number: "04",
      title: "Ongoing Support",
      description:
        "Regular check-ins, quarterly planning sessions, and continuous optimisation of your communications.",
    },
  ];

  const steps = propSteps || defaultSteps;

  return (
    <section className="py-20 bg-[#F5F0EA]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-4">
          {badge}
        </p>
        <h2 className="text-3xl md:text-[42px] font-['Roboto'] text-[#1C1C1C] leading-[1.15] mb-5 max-w-2xl">
          {title}
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mb-14">
          {description}
        </p>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <p className="text-[#C85A32] font-bold text-lg mb-4">
                {step.number}
              </p>
              <h3 className="font-semibold text-[#1C1C1C] mb-2">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnershipOnboarding;