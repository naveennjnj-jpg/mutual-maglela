import React from "react";
import { Star } from "lucide-react";

const Testimonials = () => {
  // Testimonials data array
  const testimonials = [
    {
      id: 1,
      quote:
        "Magalela Media transformed how our research centre communicates complex findings to policy audiences. Their editorial rigour and strategic instincts are unmatched.",
      name: "Prof. Sarah Mitchell",
      title: "Director of Research Communications",
      institution: "University of Cape Town",
      initials: "SM",
      quoteColor: "rgba(26, 43, 76, 0.145)",
      initialsBg: "rgba(26, 43, 76, 0.082)",
      initialsBorder: "rgba(26, 43, 76, 0.19)",
      initialsColor: "rgb(26, 43, 76)",
      institutionColor: "rgb(26, 43, 76)",
    },
    {
      id: 2,
      quote:
        "Working with Magalela gave our NGO a clear, compelling narrative that resonated with donors and community stakeholders across three continents.",
      name: "Dr. James Okoye",
      title: "Head of Advocacy & Communications",
      institution: "Pan-African Development Foundation",
      initials: "JO",
      quoteColor: "rgba(0, 106, 66, 0.145)",
      initialsBg: "rgba(0, 106, 66, 0.082)",
      initialsBorder: "rgba(0, 106, 66, 0.19)",
      initialsColor: "rgb(0, 106, 66)",
      institutionColor: "rgb(0, 106, 66)",
    },
    {
      id: 3,
      quote:
        "The AI-assisted drafting combined with expert human refinement saved our communications team weeks of work while significantly elevating output quality.",
      name: "Prof. Amara Diallo",
      title: "Vice-Chancellor for External Affairs",
      institution: "Wits School of Governance",
      initials: "AD",
      quoteColor: "rgba(200, 90, 50, 0.145)",
      initialsBg: "rgba(200, 90, 50, 0.082)",
      initialsBorder: "rgba(200, 90, 50, 0.19)",
      initialsColor: "rgb(200, 90, 50)",
      institutionColor: "rgb(200, 90, 50)",
    },
  ];

  // Star rating component
  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className="w-[14px] h-[14px] fill-[#F0B100] text-[#F0B100]"
        />
      ));
  };

  return (
    <section className="relative py-20 lg:py-28 bg-[#FAFAF8]">
      <div className="max-w-[1520px] mx-auto px-[89px]">
        {/* Header Section */}
        <div className="text-center mb-[48px]">
          <div className="flex items-center justify-center gap-[2px] mb-[11px]">
            <svg
              width="38"
              height="2"
              viewBox="0 0 38 2"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M1 1H37"
                stroke="#C85A32"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p className="font-['Roboto'] font-medium text-[14px] text-[#C85A32] uppercase tracking-[0.05em]">
              Client Testimonials
            </p>
          </div>
          <h2 className="font-['Roboto'] font-normal text-[42px] leading-[52px] text-[#111]">
            What Prestigious Organisations
            <br />
            Say About Us
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-[4px] p-8 border border-[#E5E8EC] flex flex-col"
            >
              {/* Quote Mark */}
              <div
                className="font-['Roboto'] text-[64px] leading-none mb-4 select-none"
                style={{ color: testimonial.quoteColor }}
              >
                "
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-5">{renderStars()}</div>

              {/* Quote */}
              <blockquote className="font-['Roboto'] font-normal text-[15px] leading-[26px] text-[#374151] flex-1 mb-6">
                {testimonial.quote}
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-5 border-t border-[#F3F4F6]">
                {/* Initials Circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: testimonial.initialsBg,
                    border: `1.5px solid ${testimonial.initialsBorder}`,
                  }}
                >
                  <span
                    className="font-['Roboto'] font-semibold text-[13px]"
                    style={{ color: testimonial.initialsColor }}
                  >
                    {testimonial.initials}
                  </span>
                </div>

                {/* Author Details */}
                <div>
                  <p className="font-['Roboto'] font-semibold text-[14px] text-[#1C1C1C] leading-snug">
                    {testimonial.name}
                  </p>
                  <p className="font-['Roboto'] font-normal text-[12px] text-[#6B7280] leading-snug">
                    {testimonial.title}
                  </p>
                  <p
                    className="font-['Roboto'] font-medium text-[12px] leading-snug"
                    style={{ color: testimonial.institutionColor }}
                  >
                    {testimonial.institution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;