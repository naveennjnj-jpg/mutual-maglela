import React from "react";

interface StatsSectionProps {
  stats?: Array<{
    id: number;
    number: string;
    label: string;
  }>;
  bgColor?: string;
  textColor?: string;
  labelColor?: string;
  gridCols?: string;
  gap?: string;
  padding?: string;
}

const StatsSection = ({
  stats: propStats,
  bgColor = "bg-[#0F2D63]",
  textColor = "text-white",
  labelColor = "text-white/50",
  gridCols = "grid-cols-2 lg:grid-cols-4",
  gap = "gap-10",
  padding = "py-14",
}: StatsSectionProps) => {
  const defaultStats = [
    {
      id: 1,
      number: "3+",
      label: "Research Networks Served",
    },
    {
      id: 2,
      number: "80%",
      label: "Of Researchers Saw Increased Media Coverage",
    },
    {
      id: 3,
      number: "50+",
      label: "Academic Papers Translated to Public Engagement",
    },
    {
      id: 4,
      number: "12+",
      label: "Institutions Trust Our Expertise",
    },
  ];

  const stats = propStats || defaultStats;

  return (
    <section className={`${padding} ${bgColor}`}>
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className={`grid ${gridCols} ${gap}`}>
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <p className={`text-4xl md:text-5xl font-bold ${textColor} mb-2 tracking-tight`}>
                {stat.number}
              </p>
              <p className={`text-xs leading-snug ${labelColor}`}>
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