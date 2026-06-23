import React from "react";

// Import your image (adjust path as needed)
import tabletScreen from "@/assets/home/tablet-screen.png";

const ExpertWorkshops = () => {
  return (
    <section className="relative py-20 lg:py-28 bg-[rgba(26,43,172,0.04)]">
      <div className="max-w-[1520px] mx-auto px-[89px]">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-[660px]">
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
              <p className="font-['Roboto'] font-medium text-[14px] text-[#C85A32] uppercase tracking-[0.05em]">
                Expert-Led Workshops
              </p>
            </div>

            {/* Heading */}
            <h2 className="font-['Roboto'] font-normal text-[42px] leading-[52px] text-[#111] mb-[16px]">
              Expert-Led Communication Workshops: Upskill Your Team for Maximum
              Impact.
            </h2>

            {/* Description */}
            <p className="font-['Roboto'] font-normal text-base leading-[28px] text-[#666] max-w-[600px] mb-[24px]">
              In today's fast-paced landscape, clear communication is your
              ultimate competitive advantage. Our expert-led communication
              workshops are designed to upskill your team, transforming complex
              industry knowledge into compelling, audience-ready narratives.
              Whether you are stepping in front of the press or presenting
              highly technical data to stakeholders, our interactive sessions
              provide the practical tools you need to communicate with
              confidence and clarity.
            </p>
          </div>

          {/* Right Content - Tablet Mockup */}
          <div className="relative">
            <div className="w-full scale-125 origin-center aspect-[635/416]">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Tablet Frame */}
                <div className="relative w-full h-full bg-[#2D2D2D] rounded-[24px] shadow-2xl p-[16px] flex items-center justify-center">
                  {/* Tablet Screen */}
                  <div className="relative w-full h-full bg-white rounded-[12px] overflow-hidden shadow-inner">
                    <img
                      src={tabletScreen}
                      alt="Tablet screen content"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Camera Dot */}
                  <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] bg-[#1a1a1a] rounded-full border border-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertWorkshops;