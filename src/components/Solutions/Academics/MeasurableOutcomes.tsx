import React from "react";
import { CircleCheckBig } from "lucide-react";

interface MeasurableOutcomesProps {
  badge?: string;
  title?: string;
  description?: string;
  outcomes?: Array<{
    id: number;
    text: string;
  }>;
}

const MeasurableOutcomes = ({
  badge = "What You Gain",
  title = "Measurable outcomes, not just activity",
  description = "Every engagement we undertake is anchored to clear outcomes your organisation can measure, communicate, and build upon.",
  outcomes: propOutcomes,
}: MeasurableOutcomesProps) => {
  const defaultOutcomes = [
    {
      id: 1,
      text: "Research findings published in mainstream media",
    },
    {
      id: 2,
      text: "Increased citations from policy documents",
    },
    {
      id: 3,
      text: "Stronger funder relationships through clear reporting",
    },
    {
      id: 4,
      text: "Improved researcher public profile and credibility",
    },
    {
      id: 5,
      text: "Invitations to high-profile speaking engagements",
    },
    {
      id: 6,
      text: "Community and stakeholder uptake of research recommendations",
    },
    {
      id: 7,
      text: "A replicable communications framework for future projects",
    },
    {
      id: 8,
      text: "Measurable growth in digital reach and engagement",
    },
  ];

  const outcomes = propOutcomes || defaultOutcomes;

  return (
    <section className="py-20 lg:py-24 bg-[#0F2D63]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[420px_1fr] gap-12 lg:gap-16 items-start">
          {/* Left Column - Content */}
          <div>
            <p className="text-white/70 text-xs font-semibold tracking-[0.15em] uppercase mb-4">
              {badge}
            </p>
            <h2 className="text-3xl lg:text-[40px] font-['Roboto'] text-white leading-tight mb-5">
              {title}
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              {description}
            </p>
          </div>

          {/* Right Column - Outcomes Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {outcomes.map((outcome) => (
              <div
                key={outcome.id}
                className="flex items-start gap-3 p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <CircleCheckBig className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <p className="text-white text-sm leading-relaxed">
                  {outcome.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeasurableOutcomes;