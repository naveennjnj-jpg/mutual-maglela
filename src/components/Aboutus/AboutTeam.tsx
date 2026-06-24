import React from "react";
import Experience from "@/assets/about/experienced.jpeg";
import { Users } from "lucide-react";

const AboutTeam = () => {
  const stats = [
    {
      id: 1,
      number: "150+",
      label: "Institutions",
      color: "text-[#0F2D63]",
    },
    {
      id: 2,
      number: "500+",
      label: "Projects",
      color: "text-[#C85A32]",
    },
    {
      id: 3,
      number: "12",
      label: "Countries",
      color: "text-[#0F2D63]",
    },
  ];

  return (
    <section className="py-20 bg-[#F5F0EA]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-14 items-center">
          {/* Left Column - Image */}
          <div className="lg:w-[45%] shrink-0 relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src={Experience}
                alt="Experienced communicators team"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute bottom-4 right-4 bg-[#0F2D63] rounded-xl px-5 py-4 min-w-[130px]">
              <p className="text-white font-bold text-2xl">15+</p>
              <p className="text-white/60 text-xs leading-snug mt-0.5">
                Years of Institutional
                <br />
                Expertise
              </p>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:w-[55%]">
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-4">
              Our Team
            </p>
            <h2 className="text-2xl md:text-[36px] font-['Roboto'] font-bold text-[#0F2D63] leading-[1.2] mb-5">
              Experienced Communicators
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              We bring together the investigative rigour of top-tier
              journalists, the analytical depth of academics, and the strategic
              vision of communication specialists — crafting authoritative
              messages that drive impact and build lasting trust.
            </p>

            <div className="flex items-start gap-4 bg-white rounded-xl px-5 py-4 border border-gray-100 mb-8">
              <div className="w-9 h-9 rounded-full bg-[#FFF4F0] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-[#C85A32]" />
              </div>
              <p className="text-sm font-semibold text-[#1C1C1C] leading-relaxed">
                We work closely with your team at every stage of the
                communication journey.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-0 divide-x divide-gray-200 bg-white rounded-xl border border-gray-100 overflow-hidden">
              {stats.map((stat) => (
                <div key={stat.id} className="flex-1 py-5 text-center">
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.number}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;