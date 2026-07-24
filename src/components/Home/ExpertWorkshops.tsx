import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Briefcase, BookOpen } from "lucide-react";

const ExpertWorkshops = () => {
  // Workshop items data
  const workshops = [
    {
      id: 1,
      icon: MessageSquare,
      title: "Media Training Workshop",
      description: "Executive media readiness program",
    },
    {
      id: 2,
      icon: Briefcase,
      title: "Strategic Communication Planning",
      description: "Institutional communication frameworks",
    },
    {
      id: 3,
      icon: BookOpen,
      title: "Crisis Communication",
      description: "Rapid response protocols and messaging",
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-[#0F2D63]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div>
            {/* Heading */}
            <h2 className="text-3xl lg:text-[40px] font-['Roboto'] text-white leading-tight mb-5">
              Expert-Led Communication Workshops:
              <br />
              Upskill Your Team for Maximum Impact
            </h2>

            {/* Description */}
            <p className="text-white/70 text-base leading-relaxed mb-8">
              Build institutional capacity through specialized training programs
              — from media relations to executive messaging. Our workshops
              combine practical frameworks with hands-on coaching to transform
              how your team communicates.
            </p>

            {/* CTA Button */}
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-[#C85A32]/30"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Content - Workshop Cards */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="space-y-4">
                {workshops.map((workshop) => {
                  const IconComponent = workshop.icon;
                  return (
                    <div
                      key={workshop.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#C85A32] flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold text-sm">
                          {workshop.title}
                        </span>
                      </div>
                      <p className="text-white/60 text-xs">
                        {workshop.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertWorkshops;