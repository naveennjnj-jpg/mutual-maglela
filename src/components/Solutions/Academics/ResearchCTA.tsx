import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CapacityCTAProps {
  badge?: string;
  title?: string;
  description?: string;
  primaryButton?: {
    text: string;
    link: string;
  };
  secondaryButton?: {
    text: string;
    link: string;
  };
  bgColor?: string;
  textColor?: string;
  badgeColor?: string;
  descriptionColor?: string;
  primaryButtonColor?: string;
  primaryButtonHoverColor?: string;
  secondaryButtonBgColor?: string;
  secondaryButtonHoverBgColor?: string;
  secondaryButtonTextColor?: string;
  maxWidth?: string;
  padding?: string;
  titleSize?: string;
  alignment?: "center" | "left" | "right";
  showArrow?: boolean;
  containerWidth?: string;
}

const ResearchCTA = ({
  badge = "Get Started",
  title = "Build the Sector's Communications Capacity",
  description = "Connect with our team to explore how Magalela Media can help strengthen your organisation's voice and drive meaningful change in the higher education landscape.",
  primaryButton = {
    text: "Book A Consultation",
    link: "/contact",
  },
  secondaryButton = {
    text: "View Case Studies",
    link: "/case-studies",
  },
  bgColor = "bg-[#F9F7F4]",
  textColor = "text-[#1C1C1C]",
  badgeColor = "text-[#C85A32]",
  descriptionColor = "text-gray-600",
  primaryButtonColor = "bg-[#C85A32]",
  primaryButtonHoverColor = "hover:bg-[#a8472a]",
  secondaryButtonBgColor = "bg-white",
  secondaryButtonHoverBgColor = "hover:bg-gray-50",
  secondaryButtonTextColor = "text-[#1C1C1C]",
  maxWidth = "max-w-[1500px]",
  padding = "py-20",
  titleSize = "text-2xl md:text-[34px]",
  alignment = "center",
  showArrow = true,
  containerWidth = "max-w-xl",
}: CapacityCTAProps) => {
  const getAlignmentClasses = () => {
    switch (alignment) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      default:
        return "text-center";
    }
  };

  const getButtonAlignment = () => {
    switch (alignment) {
      case "left":
        return "justify-start";
      case "right":
        return "justify-end";
      default:
        return "justify-center";
    }
  };

  const getContainerAlignment = () => {
    switch (alignment) {
      case "left":
        return "ml-0 mr-auto";
      case "right":
        return "ml-auto mr-0";
      default:
        return "mx-auto";
    }
  };

  // Check if buttons have content
  const hasPrimaryButton = primaryButton.text && primaryButton.text.trim() !== "";
  const hasSecondaryButton = secondaryButton.text && secondaryButton.text.trim() !== "";

  // If no content, don't render anything
  if (!badge && !title && !description && !hasPrimaryButton && !hasSecondaryButton) {
    return null;
  }

  return (
    <section className={`${padding} ${bgColor}`}>
      <div className={`${maxWidth} mx-auto px-6 lg:px-8 ${getAlignmentClasses()}`}>
        <div className={`${containerWidth} ${getContainerAlignment()}`}>
          {/* Badge */}
          {badge && (
            <div className="mb-3">
              <span className={`${badgeColor} text-xs font-semibold uppercase tracking-widest`}>
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          {title && (
            <h2 className={`${titleSize} font-['Roboto'] ${textColor} leading-[1.2] mb-4`}>
              {title}
            </h2>
          )}

          {/* Description */}
          {description && (
            <p className={`${descriptionColor} text-sm md:text-base leading-relaxed ${containerWidth} ${getContainerAlignment()} mb-10`}>
              {description}
            </p>
          )}

          {/* Buttons */}
          {(hasPrimaryButton || hasSecondaryButton) && (
            <div className={`flex flex-wrap ${getButtonAlignment()} gap-4`}>
              {hasPrimaryButton && (
                <Link
                  to={primaryButton.link}
                  className={`inline-flex items-center gap-2 ${primaryButtonColor} ${primaryButtonHoverColor} text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors`}
                >
                  {primaryButton.text}
                  {showArrow && <ArrowRight className="w-4 h-4" />}
                </Link>
              )}
              {hasSecondaryButton && (
                <Link
                  to={secondaryButton.link}
                  className={`inline-flex items-center gap-2 ${secondaryButtonBgColor} ${secondaryButtonHoverBgColor} border border-gray-200 ${secondaryButtonTextColor} px-8 py-3.5 rounded-xl font-medium text-sm transition-colors`}
                >
                  {secondaryButton.text}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResearchCTA;