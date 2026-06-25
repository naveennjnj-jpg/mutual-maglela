import React from "react";

const StatsSection = () => {
  const stats = [
    {
      id: 1,
      number: "50+",
      label: "Active partner organisations",
    },
    {
      id: 2,
      number: "95%",
      label: "Partner renewal rate",
    },
    {
      id: 3,
      number: "500+",
      label: "Projects delivered for partners",
    },
    {
      id: 4,
      number: "10+",
      label: "Years of partnership experience",
    },
  ];

  return (
    <section className="py-14 bg-[#0F2D63]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                {stat.number}
              </p>
              <p className="text-white/50 text-xs leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;