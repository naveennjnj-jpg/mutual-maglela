import React from "react";
import { ArrowRight } from "lucide-react";

const WorkshopCTA = () => {
  return (
    <section className="bg-[#F5F0EA] py-6">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 rounded-2xl bg-[#0F2D63] px-10 py-12 md:flex-row">
          {/* Content */}
          <div className="max-w-xl">
            <h2 className="mb-3 text-2xl font-['Roboto'] leading-[1.2] text-white md:text-[28px]">
              Request a Workshop for Your Organisation
            </h2>

            <p className="text-sm leading-relaxed text-white/60">
              Every workshop is tailored to your sector, team size, and
              communication goals. Tell us what your organisation needs and
              we'll design a programme that delivers.
            </p>
          </div>

          {/* Button */}
          <div className="shrink-0">
            <button className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#C85A32] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#a8472a]">
              Request a Workshop
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkshopCTA;