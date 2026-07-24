import React from "react";

const HowWeWork = () => {
  // Process steps data array
  const steps = [
    {
      id: 1,
      number: "01",
      title: "Strategic Discovery & Briefing",
      description:
        "We begin with deep listening — understanding your objectives, audiences, and institutional context to ensure aligned outcomes.",
    },
    {
      id: 2,
      number: "02",
      title: "Collaborative Drafting",
      description:
        "Our team develops initial drafts combining strategic insight with editorial expertise, maintaining open communication throughout.",
    },
    {
      id: 3,
      number: "03",
      title: "Expert Refinement & Delivery",
      description:
        "Multiple review cycles ensure precision, clarity, and impact — delivering publication-ready content that meets the highest standards.",
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-[40px] font-['Roboto'] text-[#0F2D63] leading-tight">
            Our Proven Content Creation Process
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="relative">
              <div className="flex flex-col items-center text-center">
                {/* Number Circle */}
                <div className="w-16 h-16 rounded-full bg-[#C85A32] flex items-center justify-center mb-5">
                  <span className="text-white font-bold text-xl">
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-[#1C1C1C] text-lg mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
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