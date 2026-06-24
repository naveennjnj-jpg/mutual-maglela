import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const WhyChooseMagalela = () => {
  // Benefits data array
  const benefits = [
    {
      id: 1,
      title: "Expert Institutional Copywriters",
      description:
        "Seasoned writers with deep academic, science, and executive communication experience.",
    },
    {
      id: 2,
      title: "Guaranteed Confidentiality",
      description:
        "All research, IP, and briefing materials are protected under strict NDAs and data protocols.",
    },
    {
      id: 3,
      title: "Transparent Project Pricing",
      description:
        "Clear, itemised quotes with no hidden fees — agreed before work begins.",
    },
    {
      id: 4,
      title: "Rapid Content Turnaround",
      description:
        "Efficient AI-assisted workflows mean faster delivery without sacrificing quality.",
    },
    {
      id: 5,
      title: "Unlimited Client Revisions",
      description:
        "We iterate until the output is exactly right — your satisfaction is non-negotiable.",
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-[#0F2D63]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
              Our Commitment to You
            </p>

            {/* Heading */}
            <h2 className="text-3xl lg:text-[40px] font-['Roboto'] text-white leading-tight mb-5">
              Why Choose
              <br />
              Magalela Media
            </h2>

            {/* Description */}
            <p className="text-white/70 text-base leading-relaxed mb-8">
              We combine institutional knowledge, journalistic discipline, and
              advanced AI to deliver communication that commands attention,
              builds trust, and drives impact.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors"
              >
                Book a Call
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-xl font-medium text-sm transition-colors"
              >
                Create a Free Account
              </Link>
            </div>
          </div>

          {/* Right Content - Benefits List */}
          <div className="space-y-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                {/* Check Icon */}
                <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check-big w-4 h-4 text-white"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                </div>

                {/* Content */}
                <div>
                  <p className="text-white font-semibold text-[15px] mb-1">
                    {benefit.title}
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseMagalela;