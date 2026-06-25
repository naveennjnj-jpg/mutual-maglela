import React from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  Heart,
  Briefcase,
  Shield,
} from "lucide-react";

const OurClients = () => {
  const clients = [
    {
      id: 1,
      icon: GraduationCap,
      title: "Academics and Researchers",
      description:
        "This includes senior academics and early-career researchers who need help securing media visibility and translating complex research into accessible formats.",
    },
    {
      id: 2,
      icon: Users,
      title: "University Communications Departments",
      description:
        "This covers communications directors and faculty-level teams needing high-calibre writing support, specialist science communication, and overflow capacity that aligns with institutional governance.",
    },
    {
      id: 3,
      icon: BookOpen,
      title: "Higher Education Organisations and Networks",
      description:
        "This includes consortia and research centres needing in-depth narrative articles, multi-stakeholder communication, and workshops.",
    },
    {
      id: 4,
      icon: Heart,
      title: "Global Development and Philanthropy Organisations",
      description:
        "This involves foundations, think tanks, and NGOs requiring narrative impact stories and nuanced external reporting for programmes in Africa.",
    },
    {
      id: 5,
      icon: Briefcase,
      title: "Corporate Social Impact Teams",
      description:
        "These are companies seeking strategies to bring attention to their research, innovation, or social impact.",
    },
    {
      id: 6,
      icon: Shield,
      title: "Executive Leaders and Founders",
      description:
        "This includes vice-chancellors, CEOs, and directors seeking authoritative speechwriting and coherent personal brand storytelling.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-4">
            Our Clients
          </p>
          <h2 className="text-3xl md:text-[42px] font-['Roboto'] text-[#1C1C1C] leading-[1.15]">
            Who We Partner With
          </h2>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client) => {
            const IconComponent = client.icon;
            return (
              <div
                key={client.id}
                className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-[#F5F0EA] rounded-xl flex items-center justify-center shrink-0">
                  <IconComponent className="w-5 h-5 text-[#C85A32]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1C1C1C] mb-2 text-sm leading-snug">
                    {client.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {client.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurClients;