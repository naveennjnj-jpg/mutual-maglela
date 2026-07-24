import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
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
  image?: string;
  height?: string;
  overlayOpacity?: string;
  imagePosition?: string;
}

const HeroSection = ({
  badge,
  title,
  description,
  primaryButton,
  secondaryButton,
  image = "https://images.unsplash.com/photo-1573164574511-73c773193279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80",
  height = "h-[700px]",
  overlayOpacity = "from-[#1C1C1C]/92 via-[#1C1C1C]/70 to-transparent",
  imagePosition = "object-center",
}: HeroSectionProps) => {
  // Check if there's any content to show
  const hasBadge = badge && badge.trim() !== "";
  const hasTitle = title && title.trim() !== "";
  const hasDescription = description && description.trim() !== "";
  const hasPrimaryButton = primaryButton?.text && primaryButton.text.trim() !== "";
  const hasSecondaryButton = secondaryButton?.text && secondaryButton.text.trim() !== "";

  // If no content, don't render anything
  if (!hasBadge && !hasTitle && !hasDescription && !hasPrimaryButton && !hasSecondaryButton) {
    return null;
  }

  return (
    <section className={`relative ${height} overflow-hidden -mt-20`}>
      {/* Background Image */}
      <img
        src={image}
        alt={badge || "Hero"}
        className={`absolute inset-0 w-full h-full object-cover ${imagePosition}`}
      />

      {/* Overlays */}
      <div className={`absolute inset-0 bg-gradient-to-r ${overlayOpacity}`}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/50 via-transparent to-transparent"></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(at 20% 65%, rgb(200, 90, 50) 0%, transparent 55%)",
        }}
      ></div>

      {/* Content */}
      <div className="relative h-full max-w-[1500px] mx-auto px-6 lg:px-8 flex flex-col justify-end pb-16 pt-20">
        <div className="max-w-2xl">
          {/* Badge */}
          {hasBadge && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs px-4 py-1.5 rounded-full mb-5 font-semibold uppercase tracking-widest">
              {badge}
            </div>
          )}

          {/* Heading */}
          {hasTitle && (
            <h1 className="text-3xl md:text-[44px] font-['Roboto'] text-white mb-5 leading-[1.15]">
              {title}
            </h1>
          )}

          {/* Description */}
          {hasDescription && (
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
              {description}
            </p>
          )}

          {/* Buttons */}
          {(hasPrimaryButton || hasSecondaryButton) && (
            <div className="flex flex-wrap gap-3">
              {hasPrimaryButton && (
                <Link
                  to={primaryButton.link}
                  className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white px-6 py-3 rounded-xl font-semibold transition-colors text-sm"
                >
                  {primaryButton.text}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {hasSecondaryButton && (
                <Link
                  to={secondaryButton.link}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm backdrop-blur-sm"
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

export default HeroSection;