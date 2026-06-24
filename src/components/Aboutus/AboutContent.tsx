import React from "react";
import Team from "@/assets/about/team.jpeg";

const AboutContent = () => {
  const points = [
    {
      id: 1,
      title: "Communication Cannot Be an Afterthought",
      description:
        "Too often, university marketing and research communication are disconnected from overarching institutional strategies. We integrate messaging into your broader goals — not as an add-on, but as a core function.",
    },
    {
      id: 2,
      title: "Journalistic Precision Meets Academic Integrity",
      description:
        "Translating complex research for broader audiences requires a delicate balance. We craft narratives that expand your reach without compromising the depth or accuracy of your work.",
    },
    {
      id: 3,
      title: "The Magalela Advantage: Culturally Grounded",
      description:
        "Our name is a tribute to African linguistic heritage — a foundational promise of authentic storytelling that deeply respects and reflects cultural context.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-14 items-stretch">
          {/* Left Column - Image & Mission */}
          <div className="lg:w-[42%] shrink-0 flex flex-col gap-5">
            <div className="rounded-2xl overflow-hidden flex-1 min-h-[340px]">
              <img
                src={Team}
                alt="Team collaboration"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="bg-[#0F2D63] rounded-2xl p-6 shrink-0">
              <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-3">
                Our Mission
              </p>
              <p className="text-white text-sm leading-relaxed">
                Elevating institutional voices through rigorous, context-aware
                communication — transforming expertise into compelling
                narratives that build lasting brand authority.
              </p>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:w-[58%] flex flex-col justify-center">
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-4">
              Our Philosophy
            </p>
            <h2 className="text-2xl md:text-[36px] font-['Roboto'] font-bold text-[#0F2D63] leading-[1.2] mb-5">
              Institutional communication should reflect your expertise — not
              dilute it.
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">
              Universities, research institutions, and global development
              organisations need more than a PR vendor. They need a strategic
              partner who understands the weight of their work.
            </p>

            <div className="space-y-8">
              {points.map((point) => (
                <div key={point.id} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C85A32] shrink-0 mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-[#1C1C1C] mb-2">
                      {point.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;