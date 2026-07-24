import React from "react";
import { Shield, Award, Target, Users } from "lucide-react";

const AboutStandards = () => {
  const standards = [
    {
      id: 1,
      icon: Shield,
      title: "Strictly Confidential & Secure",
      description:
        "Every project is backed by a comprehensive NDA to guarantee the highest level of data security and institutional trust.",
    },
    {
      id: 2,
      icon: Award,
      title: "100% Intellectual Property Retention",
      description:
        "Your research and proprietary content are always yours. Your institution retains full IP ownership — no exceptions.",
    },
    {
      id: 3,
      icon: Target,
      title: "Transparent, Upfront Pricing",
      description:
        "Predictable budgeting with clear pricing models — no hidden fees, surprise costs, or scope creep.",
    },
    {
      id: 4,
      icon: Users,
      title: "Dedicated Professional Editors",
      description:
        "Expert editors specifically matched to your project, ensuring complete alignment with your institutional voice and brand guidelines.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-4">
            Our Standards
          </p>
          <h2 className="text-3xl md:text-[42px] font-['Roboto'] font-bold text-[#0F2D63] leading-[1.15] mb-4">
            Our Commitment to You
          </h2>
          <p className="text-gray-500 text-sm">
            Every engagement is built on four non-negotiable standards.
          </p>
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {standards.map((standard) => {
            const IconComponent = standard.icon;
            return (
              <div
                key={standard.id}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 bg-[#F5F0EA] rounded-xl flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-[#C85A32]" />
                  </div>
                  <h3 className="font-semibold text-[#1C1C1C]">
                    {standard.title}
                  </h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {standard.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutStandards;