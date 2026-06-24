import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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
      link: "/solutions/higher-education",
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
      link: "/solutions/academics-research",
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
      link: "/solutions/global-development",
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
      link: "/solutions/executive-leaders",
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-3">
            Tailored for Every Communication Need
          </p>
          <h2 className="text-3xl lg:text-[40px] font-['Roboto'] text-[#0F2D63] leading-tight">
            Strategic Communication Solutions
            <br />
            Tailored to Your Sector
          </h2>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {solutions.map((solution) => (
            <div
              key={solution.id}
              className="bg-[#F9F7F4] rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              {/* Title */}
              <h3 className="font-semibold text-[#1C1C1C] text-lg mb-3">
                {solution.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {solution.description}
              </p>

              {/* Benefits List */}
              <ul className="space-y-2 mb-5">
                {solution.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check-big w-4 h-4 text-[#C85A32] shrink-0 mt-0.5"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Read More Link */}
              <Link
                to={solution.link}
                className="inline-flex items-center gap-1 text-[#C85A32] font-semibold text-sm hover:gap-2 transition-all"
              >
                Read more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StrategicSolutions;