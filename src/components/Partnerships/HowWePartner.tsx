import React from "react";

interface HowWePartnerProps {
  title?: string;
  sections?: Array<{
    id: number;
    image: string;
    imageAlt: string;
    badge: string;
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
    reverse?: boolean;
  }>;
}

const HowWePartner = ({
  title = "How We Partner",
  sections: propSections,
}: HowWePartnerProps) => {
  const defaultSections = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1766297247924-6638d54e7c89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      imageAlt: "Scientists working in university laboratory",
      badge: "Academics & Researchers",
      title: "Partnering with Academics and Researchers",
      reverse: false,
      items: [
        {
          title: "Academic Translation & Editing Services for Researchers",
          description:
            "Transform complex research into clear, accessible, and publication-ready formats. We provide expert academic editing and translation services designed to help scientists, scholars, and researchers communicate their findings to broader audiences, peer-reviewed journals, and stakeholders with clarity and precision.",
        },
        {
          title: "Media & Writing Training for Researchers",
          description:
            "We empower your academic voice with specialised media and writing training. We provide the tools, templates, and expert guidance you need to translate complex data into compelling op-eds, effective policy briefs, and impactful thought leadership pieces.",
        },
        {
          title: "Expert Presentation Coaching for Your Career's Biggest Moments",
          description:
            "Whether facing a career-defining interview, sharing the stage with industry leaders, or delivering a keynote, we provide targeted, high-impact coaching that transforms nerves into natural confidence and helps you craft compelling narratives.",
        },
        {
          title: "Career and Milestone Support",
          description:
            "We provide narrative editing for applications and academic portfolios, as well as strategic communication for major milestones, book launches, and inaugural lectures.",
        },
      ],
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1773828755374-0ee802d9f44b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      imageAlt: "University conference with speaker",
      badge: "University Communications",
      title: "Partnering with University Communications Departments",
      reverse: true,
      items: [
        {
          title:
            "Overflow Capacity — High-Calibre External Writing Support for When It Matters Most",
          description:
            "During peak seasons, internal communications and content teams are often stretched to their limits. Between major research symposiums, end-of-year reporting, and graduation ceremonies, maintaining a high standard of communication can become a significant challenge. That is where we step in — providing high-calibre external writing support designed to seamlessly integrate with your team, offering consistent overflow capacity exactly when you need it most.",
        },
        {
          title:
            "Specialist Science Communication — Bridge the Gap Between Your Science and the Public",
          description:
            "Groundbreaking research deserves to be seen, but technical jargon often traps vital findings inside academic circles. We take your complex, data-driven discoveries and transform them into clear, captivating narratives tailored for mainstream media, stakeholders, and the public. We distil dense scientific findings into accessible language, craft compelling press releases and op-eds formatted exactly how journalists want them, and frame your science to highlight its real-world impact.",
        },
        {
          title: "Executive Ghost-writing",
          description:
            "We offer ghost-writing support for speeches, press releases, and executive communication.",
        },
        {
          title: "Content Creation",
          description:
            "We deliver human-centred social media content and feature writing for profiles and research highlights.",
        },
      ],
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1778876091264-1446d649156c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      imageAlt: "Higher education audience in auditorium",
      badge: "Higher Education Organisations",
      title: "Partnering with Higher Education Organisations and Networks",
      reverse: false,
      items: [
        {
          title: "Training and Facilitation",
          description:
            "We facilitate workshops on op-ed writing, science communication, and public engagement.",
        },
        {
          title: "In-Depth Reporting",
          description:
            "We write in-depth narrative articles for conferences, policy forums, and annual reports.",
        },
        {
          title: "Editorial Management",
          description:
            "We provide consistent editorial quality across multi-authored outputs and clearly communicate complex multi-stakeholder initiatives.",
        },
      ],
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1553775927-a071d5a6a39a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      imageAlt: "Global development community work",
      badge: "Global Development & Philanthropy",
      title: "Partnering with Global Development and Philanthropy Organisations",
      reverse: true,
      items: [
        {
          title: "Data-Driven Storytelling",
          description:
            "We develop narrative impact stories directly from datasets, field research, and reports.",
        },
        {
          title: "On-the-Ground Reporting",
          description:
            "We provide skilled external reporting for programmes in Africa that require nuance, accuracy, and local context.",
        },
        {
          title: "Humanising Data",
          description:
            "We help policy audiences and donors to understand and relate to technical work.",
        },
      ],
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1740065592719-052d3e5ec6fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      imageAlt: "Corporate team collaboration",
      badge: "Corporate Social Impact",
      title: "Partnering with Corporate Social Impact Teams",
      reverse: false,
      items: [
        {
          title: "Visibility Strategy",
          description:
            "We design visibility strategies that position companies as authorities in science, innovation, or social impact.",
        },
        {
          title: "Narrative Development",
          description:
            "We create narratives for annual reports, impact stories, case studies, and keynote speaking.",
        },
        {
          title: "Internal Training",
          description:
            "We build internal capacity for staff who need to communicate their research or social impact work.",
        },
      ],
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1758518731706-be5d5230e5a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      imageAlt: "Executive team in boardroom meeting",
      badge: "Executive Leaders & Founders",
      title: "Partnering with Executive Leaders and Founders",
      reverse: true,
      items: [
        {
          title: "Authoritative Speechwriting",
          description:
            "We deliver speechwriting that carries authority, clarity, and narrative depth.",
        },
        {
          title: "Brand Storytelling",
          description:
            "We craft personal brand storytelling that reflects the leader's values and institutional vision.",
        },
        {
          title: "Strategic Guidance",
          description:
            "We guide leaders in shaping a coherent leadership narrative over time and support public engagements and media interactions.",
        },
      ],
    },
  ];

  const sections = propSections || defaultSections;

  return (
    <section className="py-20 bg-[#F5F0EA]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <h2 className="text-3xl md:text-[42px] font-['Roboto'] text-[#1C1C1C] leading-[1.15] mb-16 text-center">
          {title}
        </h2>

        <div className="flex flex-col gap-20">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`flex flex-col ${
                section.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              } gap-12 items-stretch`}
            >
              {/* Image */}
              <div className="w-full lg:w-[45%] shrink-0 min-h-[360px]">
                <div className="rounded-2xl overflow-hidden h-full min-h-[360px]">
                  <img
                    src={section.image}
                    alt={section.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-[55%]">
                <span className="inline-flex items-center bg-[#F5F0EA] text-[#C85A32] text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest w-fit">
                  {section.badge}
                </span>
                <h3 className="text-xl md:text-2xl font-['Roboto'] font-bold text-[#1C1C1C] leading-[1.2] mb-3">
                  {section.title}
                </h3>

                <div className="space-y-3">
                  {section.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#F5F0EA] border border-[#C85A32]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C85A32]"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1C1C1C] mb-1">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWePartner;