import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const StrategicSolutions = () => {
  // Solutions data array
  const solutions = [
    {
      id: 1,
      title: "Higher Education & University Communications",
      description:
        "Unify your institution's voice and protect your academic reputation. We deliver strategic, high-quality messaging across all departments, campus events, and university milestones. From impactful press releases to executive university communications, we ensure your narrative is clear, credible, and unmistakably yours.",
      benefits: [
        "Protect Institutional Trust: Deliver consistent, unified messaging across all campus departments and stakeholders.",
        "Amplify Media Presence: Craft high-quality press releases and media content that secure top-tier coverage.",
        "Elevate Executive Comms: Support chancellors and deans with authoritative leadership messaging.",
        "Strengthen Brand Identity: Maintain a clear, recognisable voice that attracts prospective students and faculty.",
      ],
    },
    {
      id: 2,
      title: "Science Communication & Research Networks",
      description:
        "Turn complex, multi-disciplinary research into compelling narratives that engage funders, policymakers, and the public. We bridge the gap between academic rigour and public understanding, ensuring your breakthroughs achieve maximum visibility and drive real-world impact.",
      benefits: [
        "Simplify Complex Data: Translate dense, academic research into accessible, engaging stories for wider audiences.",
        "Maximise Global Visibility: Expand the reach of your research to industry stakeholders and media outlets.",
        "Foster Cross-Discipline Collaboration: Create unified, cohesive narratives for multi-disciplinary research teams.",
        "Drive Real-World Impact: Position your insights to secure vital funding and influence public policy.",
      ],
    },
    {
      id: 3,
      title: "NGO & Global Development Communications",
      description:
        "Showcase your global impact with authenticity and precision. We transform dense field data, impact reports, and program outcomes into powerful stories that resonate with donors, stakeholders, and policymakers, driving continued support and funding for your mission.",
      benefits: [
        "Highlight Measurable Impact: Communicate program outcomes and ROIs with absolute clarity.",
        "Humanise Your Data: Turn field insights and statistics into emotionally compelling stories that inspire action.",
        "Boost Donor Engagement: Deepen relationships and secure ongoing funding from key stakeholders.",
        "Influence Policymakers: Strengthen your advocacy with authoritative, policy-level communications.",
      ],
    },
    {
      id: 4,
      title: "Executive Thought Leadership & C-Suite Communications",
      description:
        "Establish a commanding, credible public presence through strategic storytelling. Whether you need executive speechwriting or ongoing thought leadership content, we help C-suite leaders and visionaries communicate their ideas with authority, clarity, and narrative depth.",
      benefits: [
        "Build Industry Authority: Develop a strong, recognisable personal brand as an industry thought leader.",
        "Deliver Impactful Speeches: Command the room with professionally crafted executive content and keynotes.",
        "Align Vision and Messaging: Ensure your public communications perfectly reflect your strategic corporate goals.",
        "Communicate with Confidence: Share your expertise and insights with absolute clarity and authority.",
      ],
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-[#FAFAF8]">
      <div className="max-w-[1520px] mx-auto px-[89px]">
        {/* Header Section */}
        <div className="text-center mb-[40px]">
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
              Tailored for every communication need
            </p>
          </div>
          <h2 className="font-['Roboto'] font-normal text-[42px] leading-[52px] text-[#111]">
            Strategic Communication Solutions
            <br />
            Tailored to Your Sector
          </h2>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
          {solutions.map((solution) => (
            <div
              key={solution.id}
              className="bg-white rounded-[4px] overflow-hidden flex flex-col"
            >
              {/* Title */}
              <h3 className="font-['Roboto'] font-semibold text-base tracking-[0.164px] text-[#1C1C1C] px-[17px] pt-[29px] leading-normal">
                {solution.title}
              </h3>

              {/* Description */}
              <p className="font-['Roboto'] font-normal text-[14px] leading-[22px] text-[#6B7280] px-[17px] pt-[9px] pr-[33px]">
                {solution.description}
              </p>

              {/* Benefits List */}
              <ul className="space-y-[12px] px-[17px] pt-[16px]">
                {solution.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-[4px]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="shrink-0"
                    >
                      <path
                        d="M0.75 8.2502C0.75 8.2502 2.25 8.2502 4.25 11.7502C4.25 11.7502 9.809 2.5832 14.75 0.750204"
                        stroke="#006A42"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-['Roboto'] font-normal text-[14px] text-[#6B7280] leading-normal pt-[2.4px]">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Read More Link */}
              <div className="px-[17px] pt-[20px] pb-[24px] mt-auto">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 font-['Roboto'] font-semibold text-[14px] text-[#1A2B4C] hover:text-[#C85A32] transition-colors group"
                >
                  Read more
                  <ArrowRight className="w-[14px] h-[14px] transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StrategicSolutions;