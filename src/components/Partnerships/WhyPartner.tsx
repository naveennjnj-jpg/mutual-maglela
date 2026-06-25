import React, { useState } from "react";
import { Zap, Shield, Globe, BarChart, BookOpen } from "lucide-react";

const WhyPartner = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      icon: Zap,
      title: "We Turn Complex into Clarity",
      content: {
        points: [
          {
            title: "Media-Ready Formatting:",
            description:
              "We convert academic papers and technical reports into highly readable policy briefs, donor presentations, and public-facing articles.",
          },
          {
            title: "Targeted Audience Engagement:",
            description:
              "We adapt your tone and language specifically for policy audiences, investors, and the public.",
          },
          {
            title: "Nuance Preservation:",
            description:
              "We simplify the language, never the science. Your expertise remains accurate, credible, and authoritative.",
          },
        ],
      },
    },
    {
      id: 1,
      icon: Shield,
      title: "Expert University Reputation Management & IP Protection",
      content: {
        points: [
          {
            title: "Reputation Safeguarding:",
            description:
              "Proactive crisis communication and reputation management strategies to protect your institutional brand.",
          },
          {
            title: "IP Protection:",
            description:
              "Comprehensive intellectual property protection for your research and institutional assets.",
          },
          {
            title: "Brand Authority:",
            description:
              "Build and maintain a strong, credible institutional voice that sets you apart.",
          },
        ],
      },
    },
    {
      id: 2,
      icon: Globe,
      title: "Expert African Journalism & On-the-Ground Reporting",
      content: {
        points: [
          {
            title: "On-the-Ground Reporting:",
            description:
              "First-hand journalism and reporting from across the African continent.",
          },
          {
            title: "Contextual Storytelling:",
            description:
              "Narratives that deeply respect and reflect African cultural and policy contexts.",
          },
          {
            title: "Media Partnerships:",
            description:
              "Strategic media relationships to amplify your message across the continent.",
          },
        ],
      },
    },
    {
      id: 3,
      icon: BarChart,
      title: "A Premium, Multi-Disciplinary Content Approach",
      content: {
        points: [
          {
            title: "Multi-Format Content:",
            description:
              "From policy briefs to multimedia storytelling, we deliver content that works across platforms.",
          },
          {
            title: "Cross-Disciplinary Expertise:",
            description:
              "Our team brings together journalism, academia, and strategic communications.",
          },
          {
            title: "Strategic Integration:",
            description:
              "We ensure your messaging is consistent and impactful across all channels.",
          },
        ],
      },
    },
    {
      id: 4,
      icon: BookOpen,
      title: "Establish Your Scholarly Voice",
      content: {
        points: [
          {
            title: "Thought Leadership:",
            description:
              "Position your institution and experts as authorities in your field.",
          },
          {
            title: "Academic Publishing Support:",
            description:
              "Guidance and support for publishing in high-impact journals and platforms.",
          },
          {
            title: "Researcher Branding:",
            description:
              "Help your researchers build their personal academic brands and influence.",
          },
        ],
      },
    },
  ];

  return (
    <section className="py-20 bg-[#F5F0EA]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-4">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-[42px] font-['Roboto'] text-[#1C1C1C] leading-[1.15] mb-4">
            Why Partner with Magalela Media?
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Five core capabilities that make us the strategic communication
            partner institutions trust.
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Side - Tabs */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-1.5">
            {tabs.map((tab, index) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === index;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? "bg-[#C85A32] border-[#C85A32] text-white shadow-md shadow-[#C85A32]/20"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isActive ? "text-white" : "text-[#C85A32]"
                    }`}
                  />
                  <span className="text-sm font-semibold leading-snug">
                    {tab.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 bg-white rounded-2xl border-l-4 border-[#C85A32] shadow-sm overflow-hidden">
            <div className="px-8 pt-8 pb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#F5F0EA] rounded-xl flex items-center justify-center shrink-0">
                  {React.createElement(tabs[activeTab].icon, {
                    className: "w-5 h-5 text-[#C85A32]",
                  })}
                </div>
                <h3 className="text-lg md:text-xl font-['Roboto'] font-bold text-[#0F2D63]">
                  {tabs[activeTab].title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tabs[activeTab].content.points.map((point, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F5F0EA]/70 rounded-xl p-5 flex items-start gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#C85A32] shrink-0 mt-1.5"></div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-semibold text-[#1C1C1C]">
                        {point.title}
                      </span>{" "}
                      {point.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyPartner;