import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative h-[780px] overflow-hidden -mt-20">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1577948000111-9c970dfe3743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80"
        alt="Johannesburg"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C]/92 via-[#1C1C1C]/75 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/50 via-transparent to-transparent"></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(at 20% 65%, rgb(200, 90, 50) 0%, transparent 55%)",
        }}
      ></div>

      {/* Content */}
      <div className="relative h-full max-w-[1500px] mx-auto px-6 flex flex-col justify-center pt-20">
        <div className="max-w-2xl">
          {/* Google Reviews Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-5">
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
            </svg>
            <span className="text-white font-bold text-sm leading-none">4.9</span>
            <span className="text-white/60 text-xs leading-none">
              from 176 Google Reviews
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-[40px] font-['Roboto'] text-white mb-4 leading-[1.2]">
            Magalela Media is a Strategic
            <br />
            Communication Agency
            <br />
            based in Johannesburg.
          </h1>

          {/* Description */}
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-7 max-w-xl">
            We transform complex communications into clear, compelling
            narratives that empower governments, institutions and organisations
            to achieve strategic objectives and build public trust.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white px-6 py-3 rounded-xl font-semibold transition-colors text-sm"
            >
              Get Free Access
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm backdrop-blur-sm"
            >
              Request Consultation
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-white font-bold text-base leading-none">130+</p>
              <p className="text-white/50 text-xs mt-0.5">Projects</p>
            </div>
            <div>
              <p className="text-white font-bold text-base leading-none">500+</p>
              <p className="text-white/50 text-xs mt-0.5">Clients</p>
            </div>
            <div>
              <p className="text-white font-bold text-base leading-none">98%</p>
              <p className="text-white/50 text-xs mt-0.5">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;