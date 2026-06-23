import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const TrainingPrograms = () => {
  // Training programs data array
  const programs = [
    {
      id: 1,
      number: "01",
      title: "Professional Media Training",
      description:
        "Learn how to navigate interviews, handle difficult questions, and deliver your core message to the press with unwavering confidence.",
      iconBg: "rgb(26, 43, 76)",
    },
    {
      id: 2,
      number: "02",
      title: "Science & Technical Communication",
      description:
        "Bridge the gap between experts and lay audiences. We teach your specialists how to break down dense jargon into accessible, engaging stories without losing accuracy.",
      iconBg: "rgb(200, 90, 50)",
    },
    {
      id: 3,
      number: "03",
      title: "Impactful Narrative Building",
      description:
        "Craft compelling storylines that resonate with your target audience, drive engagement, and elevate your brand's authority.",
      iconBg: "rgb(26, 43, 76)",
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-white">
      <div className="max-w-[1520px] mx-auto px-[89px]">
        {/* Header Section */}
        <div className="mb-[48px]">
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
              Training Programs
            </p>
          </div>
          <h2 className="font-['Roboto'] font-normal text-[42px] leading-[52px] text-[#111] mb-[16px]">
            Our Core Training Programs
          </h2>
          <p className="font-['Roboto'] font-normal text-base leading-[28px] text-[#6B7280] max-w-[640px]">
            We equip individuals and corporate teams with the skills to
            translate complex ideas into clear, actionable insights. Our
            specialised workshops include:
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-[#F8F9FC] rounded-[4px] p-8 border border-[#E5E8EC] hover:border-[#1A2B4C]/25 hover:shadow-sm transition-all duration-200 flex flex-col"
            >
              {/* Number Circle */}
              <div
                className="w-[48px] h-[48px] rounded-full flex items-center justify-center mb-6 flex-shrink-0"
                style={{ backgroundColor: program.iconBg }}
              >
                <span className="font-['Roboto'] font-bold text-[15px] text-white">
                  {program.number}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-['Roboto'] font-semibold text-[17px] text-[#1C1C1C] mb-3 leading-snug">
                {program.title}
              </h3>

              {/* Description */}
              <p className="font-['Roboto'] font-normal text-[14px] leading-[22px] text-[#6B7280] flex-1">
                {program.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive has-[>svg]:px-4 bg-[#1A2B4C] hover:bg-[#1A2B4C]/90 text-white h-[52px] px-8 rounded-lg font-['Roboto'] font-medium text-[15px] transition-transform hover:scale-[1.02] shadow-md flex items-center gap-2"
          >
            Read more
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrainingPrograms;