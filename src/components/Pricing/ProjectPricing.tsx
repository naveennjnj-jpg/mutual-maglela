import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Link as LinkIcon } from "lucide-react";

interface PricingItem {
  id: number;
  title: string;
  startingPrice: string;
  tags: string[];
  description?: string;
}

interface ProjectPricingProps {
  badge?: string;
  title?: string;
  description?: string;
  items?: PricingItem[];
  ctaButton?: {
    text: string;
    link: string;
  };
  bgColor?: string;
  textColor?: string;
  badgeColor?: string;
  descriptionColor?: string;
  cardBgColor?: string;
  cardBorderColor?: string;
  cardHoverBorderColor?: string;
  priceColor?: string;
  tagBgColor?: string;
  tagTextColor?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  maxWidth?: string;
  padding?: string;
  titleSize?: string;
  leftWidth?: string;
  rightWidth?: string;
  showArrow?: boolean;
}

const ProjectPricing = ({
  badge = "Project-Based Pricing",
  title = "Custom Quotes for One-Off Engagements",
  description = "Every project is unique. Our pricing reflects the specific complexity, timeline, and deliverables your institution needs. We provide detailed quotes within 24 hours with transparent breakdowns.",
  items: propItems,
  ctaButton = {
    text: "Request Custom Quote",
    link: "/contact",
  },
  bgColor = "bg-white",
  textColor = "text-[#0F2D63]",
  badgeColor = "text-[#C85A32]",
  descriptionColor = "text-gray-500",
  cardBgColor = "bg-white",
  cardBorderColor = "border-gray-200",
  cardHoverBorderColor = "hover:border-gray-300",
  priceColor = "text-[#C85A32]",
  tagBgColor = "bg-gray-100",
  tagTextColor = "text-gray-500",
  buttonColor = "bg-[#C85A32]",
  buttonHoverColor = "hover:bg-[#a8472a]",
  maxWidth = "max-w-[1500px]",
  padding = "py-20",
  titleSize = "text-2xl md:text-[36px]",
  leftWidth = "lg:w-[42%]",
  rightWidth = "lg:w-[58%]",
  showArrow = true,
}: ProjectPricingProps) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const defaultItems: PricingItem[] = [
    {
      id: 1,
      title: "Executive Speechwriting",
      startingPrice: "R 3,500",
      tags: ["Word count", "Research depth", "Turnaround time", "Revisions included"],
    },
    {
      id: 2,
      title: "Science Communication",
      startingPrice: "R 2,800",
      tags: ["Technical complexity", "Audience type", "Format", "Supporting materials"],
    },
    {
      id: 3,
      title: "Narrative Impact Development",
      startingPrice: "R 4,200",
      tags: ["Stakeholder interviews", "Document length", "Data visualization", "Distribution formats"],
    },
    {
      id: 4,
      title: "Institutional Overflow",
      startingPrice: "R 1,200",
      tags: ["Project scope", "Urgency", "Subject expertise", "Client review cycles"],
    },
  ];

  const items = propItems || defaultItems;

  // Split items into two columns (left and right) for the old design
  const leftItems = items.slice(0, Math.ceil(items.length / 2));
  const rightItems = items.slice(Math.ceil(items.length / 2));

  return (
    <section className={`${padding} ${bgColor}`}>
      <div className={`${maxWidth} mx-auto px-6 lg:px-8`}>
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Column - Content */}
          <div className={`${leftWidth} shrink-0`}>
            {badge && (
              <p className={`${badgeColor} text-xs font-semibold uppercase tracking-widest mb-4`}>
                {badge}
              </p>
            )}
            {title && (
              <h2 className={`${titleSize} font-['Roboto'] font-bold ${textColor} leading-[1.2] mb-5`}>
                {title}
              </h2>
            )}
            {description && (
              <p className={`${descriptionColor} text-sm leading-relaxed mb-8`}>
                {description}
              </p>
            )}

            {/* Quick Links */}
            <div className="space-y-3">
              {items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div>
                    <p className="font-semibold text-sm text-[#1C1C1C]">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Starting from {item.startingPrice}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#FFF4F0] flex items-center justify-center shrink-0 group-hover:bg-[#C85A32]/10 transition-colors">
                    <LinkIcon className={`w-4 h-4 text-[#C85A32] transition-transform ${hoveredItem === item.id ? 'rotate-45' : ''}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Detailed Pricing */}
          <div className={`${rightWidth}`}>
            <div 
              className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden"
              style={{ borderTop: `4px solid ${priceColor.replace('text-', '') || '#C85A32'}` }}
            >
              <div className="px-8 pt-7 pb-8">
                <h3 className="text-xl font-['Roboto'] font-bold text-[#1C1C1C] mb-6">
                  All Project Pricing
                </h3>

                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="py-5">
                      <div className="flex items-start justify-between mb-3">
                        <p className="font-semibold text-[#1C1C1C]">
                          {item.title}
                        </p>
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                            From
                          </p>
                          <p className={`text-lg font-bold ${priceColor}`}>
                            {item.startingPrice}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`text-xs ${tagTextColor} ${tagBgColor} rounded-full px-3 py-1`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  to={ctaButton.link}
                  className={`mt-2 w-full ${buttonColor} ${buttonHoverColor} text-white py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2`}
                >
                  {ctaButton.text}
                  {showArrow && <ArrowRight className="w-4 h-4" />}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectPricing;