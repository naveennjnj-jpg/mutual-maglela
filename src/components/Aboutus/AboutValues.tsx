import React from "react";
import { Zap, BookOpen, Users, Globe } from "lucide-react";

const AboutValues = () => {
  const values = [
    {
      id: 1,
      icon: Zap,
      title: "Journalism First",
      description:
        "Every piece of content we produce is grounded in the editorial standards of investigative journalism — accuracy, clarity, and public accountability.",
    },
    {
      id: 2,
      icon: BookOpen,
      title: "Scholarly Integrity",
      description:
        "We never sacrifice academic rigour for accessibility. Your expertise remains accurate, credible, and authoritative in every format we produce.",
    },
    {
      id: 3,
      icon: Users,
      title: "Institutional Partnership",
      description:
        "We embed ourselves in your organisation's culture and goals — becoming a long-term communications partner, not a once-off contractor.",
    },
    {
      id: 4,
      icon: Globe,
      title: "Africa-Centred",
      description:
        "Our work is rooted in the African continent — its languages, contexts, policy environments, and media landscapes. We don't import frameworks; we build from the ground up.",
    },
  ];

  return (
    <section className="py-20 bg-[#F5F0EA]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-4">
            Our Values
          </p>
          <h2 className="text-3xl md:text-[42px] font-['Roboto'] text-[#1C1C1C] leading-[1.15]">
            What Guides Our Work
          </h2>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((value) => {
            const IconComponent = value.icon;
            return (
              <div
                key={value.id}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-[#F5F0EA] rounded-xl flex items-center justify-center mb-5">
                  <IconComponent className="w-5 h-5 text-[#C85A32]" />
                </div>
                <h3 className="font-semibold text-[#1C1C1C] mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutValues;