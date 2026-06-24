import React from "react";

interface TestimonialProps {
  quote?: string;
  name?: string;
  title?: string;
  institution?: string;
  brandText?: string;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  nameColor?: string;
  titleColor?: string;
  institutionColor?: string;
  brandColor?: string;
  brandBorderColor?: string;
  maxWidth?: string;
  padding?: string;
  quoteSize?: string;
  alignment?: "center" | "left" | "right";
  showQuoteIcon?: boolean;
  showBrandLine?: boolean;
  showQuotationMarks?: boolean;
}

const Testimonial = ({
  quote = "",
  name = "",
  title = "",
  institution = "",
  brandText = "Magalela",
  icon,
  bgColor = "bg-white",
  textColor = "text-[#1C1C1C]",
  nameColor = "text-[#1C1C1C]",
  titleColor = "text-gray-500",
  institutionColor = "text-gray-500",
  brandColor = "text-[#0F2D63]",
  brandBorderColor = "border-[#0F2D63]",
  maxWidth = "max-w-[860px]",
  padding = "py-20",
  quoteSize = "text-lg md:text-xl",
  alignment = "center",
  showQuoteIcon = true,
  showBrandLine = true,
  showQuotationMarks = true,
}: TestimonialProps) => {
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

  const getIconAlignment = () => {
    switch (alignment) {
      case "left":
        return "justify-start";
      case "right":
        return "justify-end";
      default:
        return "justify-center";
    }
  };

  const getBrandAlignment = () => {
    switch (alignment) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      default:
        return "text-center";
    }
  };

  const defaultIcon = (
    <svg className="w-10 h-10 text-[#C85A32]/30 mx-auto mb-6" fill="currentColor" viewBox="0 0 32 32">
      <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8c4.4 0 8-3.6 8-8 0-1-.2-2-.5-2.9C16.9 15 15.5 16 14 16c-2.2 0-4-1.8-4-4s1.8-4 4-4c.7 0 1.4.2 2 .5C14.8 7.2 12.5 8 10 8zm12 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8c0-1-.2-2-.5-2.9C28.9 15 27.5 16 26 16c-2.2 0-4-1.8-4-4s1.8-4 4-4c.7 0 1.4.2 2 .5C26.8 7.2 24.5 8 22 8z"></path>
    </svg>
  );

  // Check if there's any content to show
  const hasQuote = quote && quote.trim() !== "";
  const hasName = name && name.trim() !== "";
  const hasTitle = title && title.trim() !== "";
  const hasInstitution = institution && institution.trim() !== "";
  const hasBrandText = brandText && brandText.trim() !== "";

  // If no content, don't render anything
  if (!hasQuote && !hasName && !hasTitle && !hasInstitution && !hasBrandText) {
    return null;
  }

  // Format quote with quotation marks
  const formatQuote = (text: string) => {
    if (!showQuotationMarks) return text;
    // Remove existing quotes if any and add new ones
    const cleanText = text.replace(/^["']|["']$/g, '').trim();
    return `"${cleanText}"`;
  };

  return (
    <section className={`${padding} ${bgColor}`}>
      <div className={`${maxWidth} mx-auto px-6 lg:px-8 ${getAlignmentClasses()}`}>
        {/* Quote Icon */}
        {showQuoteIcon && hasQuote && (
          <div className={getIconAlignment()}>
            {icon || defaultIcon}
          </div>
        )}

        {/* Quote */}
        {hasQuote && (
          <blockquote className={`${textColor} ${quoteSize} leading-relaxed mb-8 font-['Roboto']`}>
            {formatQuote(quote)}
          </blockquote>
        )}

        {/* Author Info - Only show if at least one field is present */}
        {(hasName || hasTitle || hasInstitution) && (
          <div>
            {hasName && (
              <p className={`text-sm font-semibold ${nameColor}`}>{name}</p>
            )}
            {hasTitle && (
              <p className={`text-xs ${titleColor} mt-0.5`}>{title}</p>
            )}
            {hasInstitution && (
              <p className={`text-xs ${institutionColor} mt-0.5`}>{institution}</p>
            )}
          </div>
        )}

        {/* Brand Line */}
        {showBrandLine && hasBrandText && (
          <div className={`mt-6 ${getBrandAlignment()}`}>
            <span className={`font-['Roboto'] font-bold text-sm ${brandColor} uppercase tracking-wide border-b-2 ${brandBorderColor} pb-0.5 inline-block`}>
              {brandText}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonial;