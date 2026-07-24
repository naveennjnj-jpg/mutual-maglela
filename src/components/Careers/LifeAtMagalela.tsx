import React from "react";
import { Globe, BookOpen, Zap, Heart, Briefcase, Users } from "lucide-react";

interface Benefit {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
}

interface LifeAtMagalelaProps {
  badge?: string;
  title?: string;
  description?: string;
  benefits?: Benefit[];
  bgColor?: string;
  textColor?: string;
  badgeColor?: string;
  descriptionColor?: string;
  cardBgColor?: string;
  cardBorderColor?: string;
  iconBgColor?: string;
  iconColor?: string;
  maxWidth?: string;
  padding?: string;
  titleSize?: string;
  gridCols?: string;
  gap?: string;
}

const LifeAtMagalela = ({
  badge = "Life at Magalela",
  title = "Why Work With Us",
  description = "We're building Africa's leading strategic communication agency — and we need brilliant people to make it happen.",
  benefits: propBenefits,
  bgColor = "bg-[#F5F0EA]",
  textColor = "text-[#1C1C1C]",
  badgeColor = "text-[#C85A32]",
  descriptionColor = "text-gray-500",
  cardBgColor = "bg-white",
  cardBorderColor = "border-gray-100",
  iconBgColor = "bg-[#F5F0EA]",
  iconColor = "text-[#C85A32]",
  maxWidth = "max-w-[1500px]",
  padding = "py-20",
  titleSize = "text-3xl md:text-[42px]",
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  gap = "gap-5",
}: LifeAtMagalelaProps) => {
  const defaultBenefits: Benefit[] = [
    {
      id: 1,
      icon: Globe,
      title: "Remote-First Culture",
      description:
        "Work from anywhere with flexible hours and a focus on output, not office time.",
    },
    {
      id: 2,
      icon: BookOpen,
      title: "Professional Growth",
      description:
        "Access to workshops, coaching, and continuous learning opportunities in strategic communication.",
    },
    {
      id: 3,
      icon: Zap,
      title: "Impact-Driven Work",
      description:
        "Contribute to projects that advance knowledge, development, and institutional excellence.",
    },
    {
      id: 4,
      icon: Heart,
      title: "Work-Life Balance",
      description:
        "Generous leave policy, mental health support, and a culture that values your wellbeing.",
    },
    {
      id: 5,
      icon: Briefcase,
      title: "Creative Freedom",
      description:
        "Autonomy to experiment, innovate, and bring your unique perspective to every project.",
    },
    {
      id: 6,
      icon: Users,
      title: "Competitive Compensation",
      description:
        "Market-aligned salaries, performance bonuses, and benefits that support your lifestyle.",
    },
  ];

  const benefits = propBenefits || defaultBenefits;

  return (
    <section className={`${padding} ${bgColor}`}>
      <div className={`${maxWidth} mx-auto px-6 lg:px-8`}>
        {/* Header */}
        <div className="text-center mb-14">
          {badge && (
            <p className={`${badgeColor} text-xs font-semibold uppercase tracking-widest mb-4`}>
              {badge}
            </p>
          )}
          {title && (
            <h2 className={`${titleSize} font-['Roboto'] ${textColor} leading-[1.15] mb-4`}>
              {title}
            </h2>
          )}
          {description && (
            <p className={`${descriptionColor} text-sm md:text-base leading-relaxed max-w-xl mx-auto`}>
              {description}
            </p>
          )}
        </div>

        {/* Benefits Grid */}
        <div className={`grid ${gridCols} ${gap}`}>
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={benefit.id}
                className={`${cardBgColor} rounded-2xl p-7 border ${cardBorderColor} hover:shadow-md transition-shadow`}
              >
                <div className={`w-10 h-10 ${iconBgColor} rounded-xl flex items-center justify-center mb-5`}>
                  <IconComponent className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h3 className={`font-semibold ${textColor} mb-2`}>
                  {benefit.title}
                </h3>
                <p className={`${descriptionColor} text-sm leading-relaxed`}>
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LifeAtMagalela;