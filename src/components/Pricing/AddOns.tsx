import React from "react";
import { Mic, Globe, BookOpen, ChartColumn, type LucideIcon } from "lucide-react";

interface AddOn {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  price: string;
}

interface AddOnsProps {
  badge?: string;
  title?: string;
  description?: string;
  addOns?: AddOn[];
  bgColor?: string;
  textColor?: string;
  badgeColor?: string;
  descriptionColor?: string;
  cardBgColor?: string;
  cardBorderColor?: string;
  iconBgColor?: string;
  iconColor?: string;
  priceColor?: string;
  titleColor?: string;
  maxWidth?: string;
  padding?: string;
  titleSize?: string;
  gridCols?: string;
  gap?: string;
}

const AddOns = ({
  badge = "Add-Ons",
  title = "Enhance Any Project",
  description = "Bolt these on to any plan or project to extend your reach, strengthen your team's skills, or accelerate your content output.",
  addOns: propAddOns,
  bgColor = "bg-[#F5F0EA]",
  textColor = "text-[#1C1C1C]",
  badgeColor = "text-[#C85A32]",
  descriptionColor = "text-gray-500",
  cardBgColor = "bg-white",
  cardBorderColor = "border-gray-100",
  iconBgColor = "bg-[#F5F0EA]",
  iconColor = "text-[#C85A32]",
  priceColor = "text-[#0F2D63]",
  titleColor = "text-[#1C1C1C]",
  maxWidth = "max-w-[1500px]",
  padding = "py-20",
  titleSize = "text-3xl md:text-[42px]",
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  gap = "gap-5",
}: AddOnsProps) => {
  const defaultAddOns: AddOn[] = [
    {
      id: 1,
      icon: Mic,
      title: "Media Training Session",
      description: "Half-day intensive for up to 3 staff",
      price: "R 1,560",
    },
    {
      id: 2,
      icon: Globe,
      title: "Digital Content Package",
      description: "8 social posts + 2 feature articles",
      price: "R 2,200",
    },
    {
      id: 3,
      icon: BookOpen,
      title: "Thought Leadership Sprint",
      description: "3 op-eds placed across targeted media",
      price: "R 2,500",
    },
    {
      id: 4,
      icon: ChartColumn,
      title: "Content Strategy Audit",
      description: "Full audit with 90-day roadmap",
      price: "R 1,860",
    },
  ];

  const addOns = propAddOns || defaultAddOns;

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

        {/* Add-Ons Grid */}
        <div className={`grid ${gridCols} ${gap}`}>
          {addOns.map((addOn) => {
            const IconComponent = addOn.icon;
            return (
              <div
                key={addOn.id}
                className={`${cardBgColor} rounded-2xl p-6 border ${cardBorderColor} hover:shadow-md transition-shadow`}
              >
                <div className={`w-10 h-10 ${iconBgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h3 className={`font-semibold ${titleColor} mb-1 text-sm`}>
                  {addOn.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  {addOn.description}
                </p>
                <p className={`text-2xl font-bold ${priceColor}`}>
                  {addOn.price}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AddOns;