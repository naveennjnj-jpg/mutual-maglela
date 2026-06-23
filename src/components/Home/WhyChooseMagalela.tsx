import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

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
    <section
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgb(26, 43, 76) 0%, rgb(26, 43, 76) 100%)",
      }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255, 255, 255, 0.03) 20px, rgba(255, 255, 255, 0.03) 40px)",
        }}
      ></div>

      <div className="max-w-[1520px] mx-auto px-[89px] relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="flex items-center gap-[2px] mb-[11px]">
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
              <p className="font-['Roboto'] font-medium text-[14px] text-white uppercase tracking-[0.05em]">
                Our Commitment to You
              </p>
            </div>

            {/* Heading */}
            <h2 className="font-['Roboto'] font-normal text-[42px] leading-[52px] text-white mb-[20px]">
              Why Choose
              <br />
              Magalela Media
            </h2>

            {/* Description */}
            <p className="font-['Roboto'] font-normal text-base leading-[28px] text-white/75 max-w-[480px]">
              We combine institutional knowledge, journalistic discipline, and
              advanced AI to deliver communication that commands attention,
              builds trust, and drives impact.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive has-[>svg]:px-4 bg-[#C85A32] hover:bg-[#C85A32]/90 text-white h-[52px] px-8 rounded-lg font-['Roboto'] font-medium text-[15px] transition-transform hover:scale-[1.02] shadow-md flex items-center gap-2"
              >
                Book a Call
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 has-[>svg]:px-4 border-[1.6px] border-white hover:bg-white/10 text-white h-[52px] px-8 rounded-lg font-['Roboto'] font-medium text-[15px] bg-transparent"
              >
                Create a Free Account
              </Link>
            </div>
          </div>

          {/* Right Content - Benefits List */}
          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="flex items-start gap-4 p-5 bg-white/[0.07] rounded-[4px] border border-white/10 hover:bg-white/[0.11] hover:border-white/20 transition-all duration-200"
              >
                {/* Check Icon */}
                <div className="flex-shrink-0 w-[32px] h-[32px] rounded-full bg-white/10 border border-white/30 flex items-center justify-center mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="white"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div>
                  <p className="font-['Roboto'] font-semibold text-[15px] text-white leading-snug mb-1">
                    {benefit.title}
                  </p>
                  <p className="font-['Roboto'] font-normal text-[13px] text-white/60 leading-[20px]">
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