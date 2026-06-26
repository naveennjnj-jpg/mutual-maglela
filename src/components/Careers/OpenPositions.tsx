import React from "react";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";

interface Position {
  id: number;
  title: string;
  type: string;
  typeColor?: string;
  description: string;
  location: string;
  department: string;
  applyLink: string;
}

interface OpenPositionsProps {
  badge?: string;
  title?: string;
  description?: string;
  positions?: Position[];
  bgColor?: string;
  textColor?: string;
  badgeColor?: string;
  descriptionColor?: string;
  cardBgColor?: string;
  cardBorderColor?: string;
  cardHoverBorderColor?: string;
  typeColor?: string;
  typeBgColor?: string;
  buttonBgColor?: string;
  buttonHoverColor?: string;
  buttonTextColor?: string;
  buttonHoverTextColor?: string;
  maxWidth?: string;
  padding?: string;
  titleSize?: string;
}

const OpenPositions = ({
  badge = "Open Positions",
  title = "Join Our Team",
  description = "4 open positions across editorial, client success, and our freelance network.",
  positions: propPositions,
  bgColor = "bg-white",
  textColor = "text-[#1C1C1C]",
  badgeColor = "text-[#C85A32]",
  descriptionColor = "text-gray-500",
  cardBgColor = "bg-[#F5F0EA]",
  cardBorderColor = "border-gray-100",
  cardHoverBorderColor = "hover:border-[#C85A32]/30",
  typeColor = "text-[#C85A32]",
  typeBgColor = "bg-[#C85A32]/10",
  buttonBgColor = "bg-white",
  buttonHoverColor = "hover:bg-[#C85A32]",
  buttonTextColor = "text-gray-700",
  buttonHoverTextColor = "hover:text-white",
  maxWidth = "max-w-[1500px]",
  padding = "py-20",
  titleSize = "text-3xl md:text-[42px]",
}: OpenPositionsProps) => {
  const defaultPositions: Position[] = [
    {
      id: 1,
      title: "Senior Editor — Higher Education",
      type: "Full-time",
      description:
        "Lead editorial strategy for university clients. 7+ years experience in higher education communications required.",
      location: "Johannesburg / Remote",
      department: "Editorial",
      applyLink: "/contact",
    },
    {
      id: 2,
      title: "Science Communication Specialist",
      type: "Full-time",
      description:
        "Translate complex research into accessible narratives. PhD or MSc in a scientific field required.",
      location: "Remote (Africa)",
      department: "Editorial",
      applyLink: "/contact",
    },
    {
      id: 3,
      title: "Account Manager — Institutional Clients",
      type: "Full-time",
      description:
        "Manage relationships with university and NGO partners. 5+ years client-facing experience.",
      location: "Johannesburg",
      department: "Client Success",
      applyLink: "/contact",
    },
    {
      id: 4,
      title: "Freelance Writers (Rolling Applications)",
      type: "Contract",
      typeColor: "text-[#0F2D63]",
      description:
        "We're always seeking talented writers with journalism or academic backgrounds. Apply to join our network.",
      location: "Remote",
      department: "Editorial Network",
      applyLink: "/contact",
    },
  ];

  const positions = propPositions || defaultPositions;

  return (
    <section id="open-positions" className={`${padding} ${bgColor}`}>
      <div className={`${maxWidth} mx-auto px-6 lg:px-8`}>
        {/* Header */}
        <div className="mb-12">
          {badge && (
            <p className={`${badgeColor} text-xs font-semibold uppercase tracking-widest mb-4`}>
              {badge}
            </p>
          )}
          {title && (
            <h2 className={`${titleSize} font-['Roboto'] ${textColor} leading-[1.15] mb-4`}>
              {title}
            </h2>
          )}
          {description && (
            <p className={`${descriptionColor} text-sm md:text-base leading-relaxed max-w-xl`}>
              {description}
            </p>
          )}
        </div>

        {/* Positions List */}
        <div className="space-y-4">
          {positions.map((position) => (
            <div
              key={position.id}
              className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${cardBgColor} rounded-2xl p-6 border ${cardBorderColor} ${cardHoverBorderColor} hover:shadow-sm transition-all group`}
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className={`font-semibold ${textColor}`}>
                    {position.title}
                  </h3>
                  <span
                    className={`text-xs font-bold px-3 py-0.5 rounded-full ${typeBgColor} ${
                      position.typeColor || typeColor
                    }`}
                  >
                    {position.type}
                  </span>
                </div>
                <p className={`${descriptionColor} text-sm leading-relaxed mb-3`}>
                  {position.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {position.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {position.department}
                  </span>
                </div>
              </div>
              <a
                href={position.applyLink}
                className={`inline-flex items-center justify-center gap-2 ${buttonBgColor} ${buttonHoverColor} border border-gray-200 ${buttonHoverTextColor} ${buttonTextColor} px-6 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 hover:border-[#C85A32]`}
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpenPositions;