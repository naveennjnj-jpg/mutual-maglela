import React from "react";

const HowWeWork = () => {
  // Process steps data array
  const steps = [
    {
      id: 1,
      number: "01",
      title: "Strategic Discovery & Briefing",
      description:
        "We conduct a deep dive into your project context, target audience, and core objectives to ensure our strategy perfectly matches your vision.",
      iconBg: "rgb(26, 43, 76)",
    },
    {
      id: 2,
      number: "02",
      title: "Collaborative Drafting",
      description:
        "Our expert writers craft authentic, engaging copy, actively integrating your team's input to maintain and elevate your institutional voice.",
      iconBg: "rgb(200, 90, 50)",
    },
    {
      id: 3,
      number: "03",
      title: "Expert Refinement & Delivery",
      description:
        "We rigorously edit and polish your material, delivering flawless, publication-ready content optimised for your specific goals.",
      iconBg: "rgb(26, 43, 76)",
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-white">
      <div className="max-w-[1520px] mx-auto px-[89px]">
        {/* Header Section */}
        <div className="text-center mb-[56px]">
          <div className="flex items-center justify-center gap-[2px] mb-[11px]">
            <svg
              width="38"
              height="2"
              viewBox="0 0 38 2"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M1 1H37"
                stroke="#C85A32"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p className="font-['Roboto'] font-medium text-[14px] text-[#C85A32] uppercase tracking-[0.05em]">
              How We Work Together
            </p>
          </div>
          <h2 className="font-['Roboto'] font-normal text-[42px] leading-[52px] text-[#111]">
            Our Proven Content Creation Process:
            <br />
            How We Work Together
          </h2>
          <p className="font-['Roboto'] font-normal text-base leading-[28px] text-[#6B7280] max-w-[680px] mx-auto mt-4">
            At Magalela Media, our collaborative editorial process is designed
            to align seamlessly with your institution's unique voice and
            strategic objectives. From the initial discovery phase to final
            delivery, we partner transparently with your team to produce
            high-impact, confidential, and publication-ready content.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connecting Line - Desktop Only */}
          <div className="hidden lg:block absolute top-[40px] left-[calc(16.666%+24px)] right-[calc(16.666%+24px)] h-[1px] bg-gradient-to-r from-[#1A2B4C]/20 via-[#C85A32]/30 to-[#006A42]/20"></div>

          {steps.map((step) => (
            <div key={step.id}>
              {/* Number Circle */}
              <div
                className="w-[64px] h-[64px] rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg"
                style={{ backgroundColor: step.iconBg }}
              >
                <span className="font-['Roboto'] font-bold text-[18px] text-white tracking-tight">
                  {step.number}
                </span>
              </div>

              {/* Content Card */}
              <div className="bg-[#F8F9FC] rounded-[4px] p-6 border border-[#E5E8EC] hover:border-[#1A2B4C]/25 transition-colors">
                <h3 className="font-['Roboto'] font-semibold text-[18px] text-[#1C1C1C] mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="font-['Roboto'] font-normal text-[14px] leading-[22px] text-[#6B7280]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;