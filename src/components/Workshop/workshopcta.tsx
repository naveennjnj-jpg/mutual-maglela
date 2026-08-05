// components/Common/WorkshopCTA.tsx
import React from "react";
import { ArrowRight } from "lucide-react";

interface WorkshopCTAProps {
  title?: string;
  description?: string;
  primaryButton?: {
    text: string;
    onClick?: () => void;
    link?: string;
  };
  className?: string;
}

const WorkshopCTA: React.FC<WorkshopCTAProps> = ({
  title = "Request a Workshop for Your Organisation",
  description = "Every workshop is tailored to your sector, team size, and communication goals. Tell us what your organisation needs and we'll design a programme that delivers.",
  primaryButton = {
    text: "Request a Workshop",
  },
  className = "",
}) => {
  const handleButtonClick = () => {
    console.log("🔵 WorkshopCTA Button Clicked"); // ✅ Debug log
    if (primaryButton.onClick) {
      console.log("🟢 Calling onClick...");
      primaryButton.onClick();
    } else if (primaryButton.link) {
      console.log("🟡 Navigating to:", primaryButton.link);
      window.location.href = primaryButton.link;
    }
  };

  return (
    <section className={`bg-[#F5F0EA] py-6 ${className}`}>
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 rounded-2xl bg-[#0F2D63] px-10 py-12 md:flex-row">
          {/* Content */}
          <div className="max-w-xl">
            <h2 className="mb-3 text-2xl font-['Roboto'] leading-[1.2] text-white md:text-[28px]">
              {title}
            </h2>

            <p className="text-sm leading-relaxed text-white/60">
              {description}
            </p>
          </div>

          {/* Button */}
          <div className="shrink-0">
            <button
              onClick={handleButtonClick}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#C85A32] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#a8472a]"
            >
              {primaryButton.text}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkshopCTA;