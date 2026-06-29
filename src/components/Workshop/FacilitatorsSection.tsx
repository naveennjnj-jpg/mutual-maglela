import React from "react";
import { ArrowRight } from "lucide-react";
import Team1 from "@/assets/about/team1.jpeg";
import team2 from "@/assets/about/team2.jpeg";
import team3 from "@/assets/about/team3.jpeg";
import team4 from "@/assets/about/team4.jpeg";
import team5 from "@/assets/about/team5.jpeg";
import team6 from "@/assets/about/team6.jpeg";
const teamMembers = [
  Team1,
  team2,
  team3,
  team4,
  team5,
  team6
];

const FacilitatorsSection = () => {
  return (
    <section className="bg-[#F5F0EA] py-20">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          {/* Left Content */}
          <div className="shrink-0 lg:w-2/5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#C85A32]">
              Our Facilitators
            </p>

            <h2 className="mb-5 text-2xl font-['Roboto'] leading-[1.2] text-[#1C1C1C] md:text-[34px]">
              Ready to Elevate Your Institutional Communication?
            </h2>

            <p className="mb-8 text-sm leading-relaxed text-gray-600">
              Our facilitators are senior communications practitioners — not
              generic trainers. Every workshop is led by experts with deep
              sector experience and a track record of building lasting
              capability in organisations like yours.
            </p>

            <button className="inline-flex items-center gap-2 rounded-xl bg-[#C85A32] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a8472a]">
              Request a Workshop
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right Image Grid */}
          <div className="lg:w-3/5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {teamMembers.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-2xl"
                >
                  <img
                    src={image}
                    alt={`Team member ${index + 1}`}
                    className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacilitatorsSection;