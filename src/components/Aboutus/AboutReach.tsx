import React from "react";

const AboutReach = () => {
  const approaches = [
    {
      id: 1,
      title: "Culturally Contextual Storytelling",
      description: "Crafting narratives that respect and elevate regional heritage.",
    },
    {
      id: 2,
      title: "Strategic Global Communication",
      description: "Bridging local, community-driven insights with cross-continental audiences.",
    },
    {
      id: 3,
      title: "Accessible Narratives",
      description: "Transforming complex data and ideas into clear, resonant stories that drive impact.",
    },
  ];

  const stats = [
    {
      id: 1,
      number: "150+",
      label: "Institutions Served",
    },
    {
      id: 2,
      number: "500+",
      label: "Projects Delivered",
    },
  ];

  return (
    <section className="py-20 bg-[#0F2D63]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-14 items-center">
          {/* Left Column - Content */}
          <div className="lg:w-[45%]">
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-4">
              Our Reach
            </p>
            <h2 className="text-2xl md:text-[36px] font-['Roboto'] font-bold text-white leading-[1.2] mb-5">
              Global Reach, Local Authenticity
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Our strategic communication initiatives span continents, yet our
              methodology remains firmly grounded in the understanding that
              impactful ideas emerge from specific places and communities.
            </p>

            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-4">
              Our Core Approach
            </p>

            <div className="space-y-3">
              {approaches.map((approach) => (
                <div
                  key={approach.id}
                  className="flex items-start gap-4 bg-white/6 rounded-xl px-4 py-4"
                >
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#C85A32] shrink-0 mt-1"></div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">
                      {approach.title}
                    </p>
                    <p className="text-white/50 text-xs leading-relaxed">
                      {approach.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image & Stats */}
          <div className="lg:w-[55%]">
            <div className="relative rounded-2xl overflow-hidden mb-4">
              <img
                src="https://images.unsplash.com/photo-1649299313612-48cc3493f62e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80"
                alt="Africa map"
                className="w-full aspect-[16/9] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D63]/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-5">
                <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-1">
                  Spanning
                </p>
                <p className="text-white font-['Roboto'] font-bold text-xl">
                  12+ Countries Across Africa
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white/8 rounded-xl px-6 py-5"
                >
                  <p className="text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </p>
                  <p className="text-white/50 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutReach;