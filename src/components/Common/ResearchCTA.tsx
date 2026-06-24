import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ResearchCTAProps {
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
  descriptionColor?: string;
  primaryButtonColor?: string;
  primaryButtonHoverColor?: string;
  primaryButtonShadowColor?: string;
  secondaryButtonColor?: string;
  secondaryButtonHoverColor?: string;
  maxWidth?: string;
  padding?: string;
  titleSize?: string;
  alignment?: "center" | "left" | "right";
  showArrow?: boolean;
}

const ResearchCTA = ({
  title = "Ready to Take Your Research Beyond the Journal?",
  description = "Book a consultation with our team to discuss how we can help amplify your research, secure funding, and achieve the public impact your work deserves.",
  primaryButton = {
    text: "Book a Consultation",
    link: "/contact",
  },
  secondaryButton = {
    text: "View Pricing",
    link: "/pricing",
  },
  bgColor = "bg-white",
  textColor = "text-[#0F2D63]",
  descriptionColor = "text-gray-600",
  primaryButtonColor = "bg-[#C85A32]",
  primaryButtonHoverColor = "hover:bg-[#a8472a]",
  primaryButtonShadowColor = "shadow-[#C85A32]/30",
  secondaryButtonColor = "text-gray-600",
  secondaryButtonHoverColor = "hover:text-[#C85A32]",
  maxWidth = "max-w-[760px]",
  padding = "py-20 lg:py-24",
  titleSize = "text-3xl lg:text-[42px]",
  alignment = "center",
  showArrow = true,
}: ResearchCTAProps) => {
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

  // Check if buttons have content
  const hasPrimaryButton = primaryButton.text && primaryButton.text.trim() !== "";
  const hasSecondaryButton = secondaryButton.text && secondaryButton.text.trim() !== "";

  // If no content, don't render anything
  if (!title && !description && !hasPrimaryButton && !hasSecondaryButton) {
    return null;
  }

  return (
    <section className={`${padding} ${bgColor}`}>
      <div className={`${maxWidth} mx-auto px-6 ${getAlignmentClasses()}`}>
        {/* Heading */}
        {title && (
          <h2 className={`${titleSize} font-['Roboto'] font-semibold ${textColor} mb-5 leading-[1.2]`}>
            {title}
          </h2>
        )}

        {/* Description */}
        {description && (
          <p className={`${descriptionColor} text-base leading-relaxed mb-10 max-w-xl mx-auto ${alignment === "center" ? "mx-auto" : ""}`}>
            {description}
          </p>
        )}

        {/* Buttons */}
        {(hasPrimaryButton || hasSecondaryButton) && (
          <div className={`flex flex-col sm:flex-row items-center ${getButtonAlignment()} gap-3`}>
            {hasPrimaryButton && (
              <Link
                to={primaryButton.link}
                className={`inline-flex items-center gap-2 ${primaryButtonColor} ${primaryButtonHoverColor} text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-lg ${primaryButtonShadowColor}`}
              >
                {primaryButton.text}
                {showArrow && <ArrowRight className="w-4 h-4" />}
              </Link>
            )}
            {hasSecondaryButton && (
              <Link
                to={secondaryButton.link}
                className={`inline-flex items-center gap-2 border border-gray-200 ${secondaryButtonHoverColor} ${secondaryButtonColor} px-8 py-3.5 rounded-xl font-medium text-sm transition-colors hover:border-[#C85A32]`}
              >
                {secondaryButton.text}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ResearchCTA;