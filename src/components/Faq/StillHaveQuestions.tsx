import React from "react";
import { Link } from "react-router-dom";
import { CircleHelp, ArrowRight } from "lucide-react";

interface StillHaveQuestionsProps {
  icon?: React.ReactNode;
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
  titleColor?: string;
  descriptionColor?: string;
  iconBgColor?: string;
  iconColor?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  buttonShadowColor?: string;
  secondaryButtonColor?: string;
  secondaryButtonHoverColor?: string;
  maxWidth?: string;
  padding?: string;
  titleSize?: string;
  showArrow?: boolean;
}

const StillHaveQuestions = ({
  icon,
  title = "Still Have Questions?",
  description = "Can't find the answer you're looking for? Our team is here to help.",
  primaryButton = {
    text: "Contact Support",
    link: "/contact",
  },
  secondaryButton = {
    text: "View Pricing",
    link: "/pricing",
  },
  bgColor = "bg-white",
  textColor = "text-[#0F2D63]",
  titleColor = "text-[#0F2D63]",
  descriptionColor = "text-gray-500",
  iconBgColor = "bg-[#F3EDE6]",
  iconColor = "text-[#C85A32]",
  buttonColor = "bg-[#C85A32]",
  buttonHoverColor = "hover:bg-[#a8472a]",
  buttonShadowColor = "shadow-[#C85A32]/30",
  secondaryButtonColor = "text-gray-600",
  secondaryButtonHoverColor = "hover:text-[#C85A32]",
  maxWidth = "max-w-[760px]",
  padding = "py-20",
  titleSize = "text-3xl lg:text-[42px]",
  showArrow = true,
}: StillHaveQuestionsProps) => {
  const defaultIcon = (
    <CircleHelp className="w-8 h-8 text-[#C85A32]" />
  );

  const hasTitle = title && title.trim() !== "";
  const hasDescription = description && description.trim() !== "";
  const hasPrimaryButton = primaryButton.text && primaryButton.text.trim() !== "";
  const hasSecondaryButton = secondaryButton.text && secondaryButton.text.trim() !== "";

  // If no content, don't render anything
  if (!hasTitle && !hasDescription && !hasPrimaryButton && !hasSecondaryButton) {
    return null;
  }

  return (
    <section className={`${padding} ${bgColor} border-t border-gray-100`}>
      <div className={`${maxWidth} mx-auto px-6 text-center`}>
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl ${iconBgColor} flex items-center justify-center mx-auto mb-6`}>
          {icon || defaultIcon}
        </div>

        {/* Title */}
        {hasTitle && (
          <h2 className={`${titleSize} font-['Roboto'] font-semibold ${titleColor} mb-5 leading-[1.2]`}>
            {title}
          </h2>
        )}

        {/* Description */}
        {hasDescription && (
          <p className={`${descriptionColor} text-base leading-relaxed mb-10 max-w-xl mx-auto`}>
            {description}
          </p>
        )}

        {/* Buttons */}
        {(hasPrimaryButton || hasSecondaryButton) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {hasPrimaryButton && (
              <Link
                to={primaryButton.link}
                className={`inline-flex items-center gap-2 ${buttonColor} ${buttonHoverColor} text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-lg ${buttonShadowColor}`}
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

export default StillHaveQuestions;