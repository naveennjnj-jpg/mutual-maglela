import React from "react";
import { CircleCheckBig, type LucideIcon } from "lucide-react";

interface MeasurableOutcomesProps {
  badge?: string;
  title?: string;
  description?: string;
  outcomes?: Array<{
    id: number;
    text: string;
    icon?: LucideIcon;
  }>;
  bgColor?: string;
  textColor?: string;
  badgeColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  cardBgColor?: string;
  cardBorderColor?: string;
  cardHoverColor?: string;
  iconColor?: string;
  gridCols?: string;
  gap?: string;
  padding?: string;
  titleSize?: string;
  layout?: "two-column" | "centered";
  leftWidth?: string;
  rightWidth?: string;
}

const MeasurableOutcomes = ({
  badge = "What You Gain",
  title = "Measurable outcomes, not just activity",
  description = "Every engagement we undertake is anchored to clear outcomes your organisation can measure, communicate, and build upon.",
  outcomes: propOutcomes,
  bgColor = "bg-[#0F2D63]",
  textColor = "text-white",
  badgeColor = "text-white/70",
  titleColor = "text-white",
  descriptionColor = "text-white/70",
  cardBgColor = "bg-white/5",
  cardBorderColor = "border-white/10",
  cardHoverColor = "hover:bg-white/10",
  iconColor = "text-white",
  gridCols = "grid sm:grid-cols-2",
  gap = "gap-4",
  padding = "py-20 lg:py-24",
  titleSize = "text-3xl lg:text-[40px]",
  layout = "two-column",
  leftWidth = "lg:grid-cols-[420px_1fr]",
  rightWidth = "",
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
  const IconComponent = CircleCheckBig;

  if (layout === "centered") {
    return (
      <section className={`${padding} ${bgColor}`}>
        <div className="max-w-[900px] mx-auto px-6 lg:px-8 text-center">
          {/* Badge */}
          <p className={`${badgeColor} text-xs font-semibold tracking-[0.15em] uppercase mb-4`}>
            {badge}
          </p>

          {/* Title */}
          <h2 className={`${titleSize} font-['Roboto'] ${titleColor} leading-tight mb-5`}>
            {title}
          </h2>

          {/* Description */}
          <p className={`${descriptionColor} text-base leading-relaxed max-w-2xl mx-auto mb-12`}>
            {description}
          </p>

          {/* Outcomes Grid - Centered */}
          <div className={`grid ${gridCols} ${gap}`}>
            {outcomes.map((outcome) => (
              <div
                key={outcome.id}
                className={`flex items-start gap-3 p-5 ${cardBgColor} rounded-xl border ${cardBorderColor} ${cardHoverColor} transition-colors text-left`}
              >
                <IconComponent className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
                <p className={`${textColor} text-sm leading-relaxed`}>
                  {outcome.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${padding} ${bgColor}`}>
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className={`grid ${leftWidth} gap-12 lg:gap-16 items-start`}>
          {/* Left Column - Content */}
          <div>
            <p className={`${badgeColor} text-xs font-semibold tracking-[0.15em] uppercase mb-4`}>
              {badge}
            </p>
            <h2 className={`${titleSize} font-['Roboto'] ${titleColor} leading-tight mb-5`}>
              {title}
            </h2>
            <p className={`${descriptionColor} text-base leading-relaxed`}>
              {description}
            </p>
          </div>

          {/* Right Column - Outcomes Grid */}
          <div className={`grid ${gridCols} ${gap}`}>
            {outcomes.map((outcome) => (
              <div
                key={outcome.id}
                className={`flex items-start gap-3 p-5 ${cardBgColor} rounded-xl border ${cardBorderColor} ${cardHoverColor} transition-colors`}
              >
                <IconComponent className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
                <p className={`${textColor} text-sm leading-relaxed`}>
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