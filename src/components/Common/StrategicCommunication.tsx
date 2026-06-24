import React from "react";
import {
  Megaphone,
  MessageSquare,
  Users,
  Award,
  ChartColumn,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface StrategicCommunicationProps {

main?: string;
  title?: string;
  description?: string;
  services?: Array<{
    id: number;
    icon: LucideIcon;
    title: string;
    description: string;
  }>;
  bgColor?: string;
  textColor?: string;
  cardBgColor?: string;
  iconBgColor?: string;
  accentColor?: string;
  gridCols?: string;
  gap?: string;
  padding?: string;
  titleSize?: string;
  showIconBackground?: boolean;
}

const StrategicCommunication = ({
    main = "Strategic Communication Built for the Higher Education Sector",
  title = "Strategic Communication Built for the Academic World",
  description = "We bring journalistic discipline, academic fluency, and strategic insight to every project—ensuring your research achieves the recognition and influence it deserves.",
  services: propServices,
  bgColor = "bg-white",
  textColor = "text-[#0F2D63]",
  cardBgColor = "bg-[#F9F7F4]",
  iconBgColor = "bg-white",
  accentColor = "text-[#C85A32]",
  gridCols = "grid md:grid-cols-2",
  gap = "gap-6",
  padding = "py-20 lg:py-24",
  titleSize = "text-3xl lg:text-[40px]",
  showIconBackground = true,
}: StrategicCommunicationProps) => {
  const defaultServices = [
    {
      id: 1,
      icon: Megaphone,
      title: "Research-to-Media Translation",
      description:
        "We convert academic papers, findings, and datasets into newsworthy stories that journalists can't ignore. From press releases to media pitches, we ensure your work gets the attention it deserves.",
    },
    {
      id: 2,
      icon: MessageSquare,
      title: "Media Training for Researchers",
      description:
        "Prepare for interviews, panels, and public speaking with confidence. Our hands-on training equips you to communicate complex ideas clearly and compellingly to any audience.",
    },
    {
      id: 3,
      icon: Users,
      title: "Public Engagement Strategy",
      description:
        "Design and execute outreach campaigns that connect with communities, schools, and stakeholders. We help you build trust, spark dialogue, and demonstrate societal value.",
    },
    {
      id: 4,
      icon: Award,
      title: "Academic Brand Reinforcement",
      description:
        "Position yourself or your institution as a thought leader. We craft authoritative content—from expert commentary to op-eds—that reinforces your credibility and elevates your profile.",
    },
    {
      id: 5,
      icon: ChartColumn,
      title: "Research Impact Reporting",
      description:
        "Document and communicate the tangible outcomes of your work. We produce compelling impact reports that satisfy funders, impress stakeholders, and support future grant applications.",
    },
    {
      id: 6,
      icon: Zap,
      title: "Sustainable Outreach Engagement",
      description:
        "Build long-term communication capacity within your team. We provide ongoing support, training, and strategic counsel to ensure sustained public engagement success.",
    },
  ];

  const services = propServices || defaultServices;

  return (
    <section className={`${padding} ${bgColor}`}>
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-4">{main}</p>
          <h2 className={`${titleSize} font-['Roboto'] ${textColor} mb-4 leading-tight`}>
            {title}
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>

        {/* Services Grid */}
        <div className={`grid ${gridCols} ${gap}`}>
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className={`${cardBgColor} rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}
              >
                <div className="flex items-start gap-4 mb-4">
                  {showIconBackground ? (
                    <div className={`w-10 h-10 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0`}>
                      <IconComponent className={`w-5 h-5 ${accentColor}`} />
                    </div>
                  ) : (
                    <IconComponent className={`w-5 h-5 ${accentColor} shrink-0 mt-1`} />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-semibold ${textColor} text-base mb-2`}>
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StrategicCommunication;