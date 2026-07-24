import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Award, FileText } from "lucide-react";

const TrainingPrograms = () => {
  // Training programs data array
  const programs = [
    {
      id: 1,
      icon: MessageSquare,
      title: "Professional Media Training",
      description:
        "Equip executives and spokespeople with confidence and clarity for press interviews, live broadcasts, and public appearances.",
    },
    {
      id: 2,
      icon: Award,
      title: "State as a Trusted Communication Leader",
      description:
        "Position your institution as an authoritative voice through strategic thought leadership and consistent messaging frameworks.",
    },
    {
      id: 3,
      icon: FileText,
      title: "Impactful Narrative Building",
      description:
        "Master the art of storytelling — from research translation to stakeholder engagement narratives that drive action.",
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-[#F9F7F4]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-[40px] font-['Roboto'] text-[#0F2D63] leading-tight">
            Our Core Training Programs
          </h2>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {programs.map((program) => {
            const IconComponent = program.icon;
            return (
              <div
                key={program.id}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-[#F3EDE6] flex items-center justify-center mb-5">
                  <IconComponent className="w-6 h-6 text-[#C85A32]" />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-[#1C1C1C] text-base mb-3">
                  {program.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed">
                  {program.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors"
          >
            Read More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrainingPrograms;