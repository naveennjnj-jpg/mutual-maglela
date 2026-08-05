// components/Common/HeroSection.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  badge?: string;
  title?: string;
  description?: string;
  primaryButton?: {
    text: string;
    link?: string;
    onClick?: () => void;
  };
  secondaryButton?: {
    text: string;
    link?: string;
    onClick?: () => void;
  };
  image?: string;
  height?: string;
  overlayOpacity?: string;
  imagePosition?: string;
}

const WorkshopHeroSection = ({
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
  const hasBadge = badge && badge.trim() !== "";
  const hasTitle = title && title.trim() !== "";
  const hasDescription = description && description.trim() !== "";
  const hasPrimaryButton = primaryButton?.text && primaryButton.text.trim() !== "";
  const hasSecondaryButton = secondaryButton?.text && secondaryButton.text.trim() !== "";

  if (!hasBadge && !hasTitle && !hasDescription && !hasPrimaryButton && !hasSecondaryButton) {
    return null;
  }

  // ✅ Debug: Log to check if onClick is being passed
  console.log("Primary Button:", primaryButton);

  const handlePrimaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Primary button clicked"); // ✅ Debug log
    if (primaryButton?.onClick) {
      console.log("Calling onClick..."); // ✅ Debug log
      primaryButton.onClick();
    } else if (primaryButton?.link) {
      console.log("Navigating to:", primaryButton.link);
      window.location.href = primaryButton.link;
    }
  };

  const handleSecondaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (secondaryButton?.onClick) {
      secondaryButton.onClick();
    } else if (secondaryButton?.link) {
      window.location.href = secondaryButton.link;
    }
  };

  return (
    <section className={`relative ${height} overflow-hidden -mt-20`}>
      <img
        src={image}
        alt={badge || "Hero"}
        className={`absolute inset-0 w-full h-full object-cover ${imagePosition}`}
      />
      <div className={`absolute inset-0 bg-gradient-to-r ${overlayOpacity}`}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/50 via-transparent to-transparent"></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(at 20% 65%, rgb(200, 90, 50) 0%, transparent 55%)",
        }}
      ></div>

      <div className="relative h-full max-w-[1500px] mx-auto px-6 lg:px-8 flex flex-col justify-end pb-16 pt-20">
        <div className="max-w-2xl">
          {hasBadge && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs px-4 py-1.5 rounded-full mb-5 font-semibold uppercase tracking-widest">
              {badge}
            </div>
          )}

          {hasTitle && (
            <h1 className="text-3xl md:text-[44px] font-['Roboto'] text-white mb-5 leading-[1.15]">
              {title}
            </h1>
          )}

          {hasDescription && (
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
              {description}
            </p>
          )}

          {(hasPrimaryButton || hasSecondaryButton) && (
            <div className="flex flex-wrap gap-3">
              {hasPrimaryButton && (
                <button
                  onClick={handlePrimaryClick}
                  className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white px-6 py-3 rounded-xl font-semibold transition-colors text-sm cursor-pointer"
                >
                  {primaryButton.text}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {hasSecondaryButton && (
                <button
                  onClick={handleSecondaryClick}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm backdrop-blur-sm cursor-pointer"
                >
                  {secondaryButton.text}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkshopHeroSection;