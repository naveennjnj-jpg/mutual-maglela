import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const WhyMagalelaWorks = () => {
  // Features data array
  const features = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#C85A32]">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: "Streamlined Insights for Time-Strapped Experts",
      description:
        "You already have the industry knowledge; you just don't have the hours. We do the heavy lifting to turn complex data into clear, actionable summaries.",
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#C85A32]">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: "Built for Real-World Communication",
      description:
        "We specialize in research and science communication, translating dense academic data into engaging narratives. We help bridge the gap between academia and public engagement so your ideas can make a real-world impact.",
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#C85A32]">
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </svg>
      ),
      title: "AI Speed Meets Human Expertise, Results You Can Trust",
      description:
        "Scale your workflow without sacrificing quality. By combining the lightning-fast efficiency of artificial intelligence with the nuanced depth of human review, we deliver outputs that are 100% accurate, highly credible, and truly meaningful to your audience.",
    },
    {
      id: 4,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#C85A32]">
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
          <path d="M10 6h4" />
          <path d="M10 10h4" />
          <path d="M10 14h4" />
          <path d="M10 18h4" />
        </svg>
      ),
      title: "Enterprise Communication Platform for Institutions & Leaders",
      description:
        "Built for scale and security. From top-tier universities to global enterprises, our tailored communication software empowers leaders to flawlessly manage high-stakes, strategic messaging.",
    },
    {
      id: 5,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#C85A32]">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
      title: "Scalable Platform for Institutions & Academics",
      description:
        "Future-proof your workflows with a platform designed to scale. Whether you are an independent researcher, a growing lab, or an enterprise-level institution, our AI Writing Tools expand alongside your needs.",
    },
    {
      id: 6,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#C85A32]">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
      ),
      title: "Ironclad Security You Can Trust",
      description:
        "We safeguard your data, research, and institutional IP with rigorous security protocols and uncompromising editorial standards.",
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-[#F9F7F4]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <h2 className="text-3xl lg:text-[40px] font-['Roboto'] text-[#0F2D63] mb-4 leading-tight">
            Why Magalela Media Works for You
          </h2>
          <p className="text-gray-500 text-base leading-relaxed max-w-xl">
            Deep Expertise. Delivered Fast. We Turn Complex Topics into Clear
            Insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              {/* Icon Container */}
              <div className="w-11 h-11 rounded-xl bg-[#F3EDE6] flex items-center justify-center mb-5">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-[#1C1C1C] text-[15px] mb-2 leading-snug">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyMagalelaWorks;