import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 lg:py-20 bg-white border-t border-gray-100">
      <div className="max-w-[760px] mx-auto px-6 text-center">
        {/* Badge */}
        <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-4">
          Get Started
        </p>

        {/* Heading */}
        <h2 className="text-3xl lg:text-[42px] font-['Roboto'] font-semibold text-[#0F2D63] mb-5 leading-[1.2]">
          Ready to Elevate Your
          <br />
          Institutional Communication?
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-xl mx-auto">
          Join leading governments, universities, and development organizations
          that trust Magalela Media for strategic communication excellence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-[#C85A32]/30"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-[#C85A32] text-gray-600 hover:text-[#C85A32] px-8 py-3.5 rounded-xl font-medium text-sm transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;