import React from "react";

interface TestimonialQuoteProps {
  quote?: string;
  name?: string;
  title?: string;
  initials?: string;
  bgColor?: string;
  textColor?: string;
}

const TestimonialQuote = ({
  quote = "\"Magalela Media helped us take the years of research on urban water access and turn it into a campaign that reached both funders and the public. The impact was immediate and measurable.\"",
  name = "Dr. Rebecca Nkosi",
  title = "Lead Researcher, Development Studies",
  initials = "DR",
  bgColor = "bg-[#0F2D63]/10",
  textColor = "text-[#0F2D63]",
}: TestimonialQuoteProps) => {
  return (
    <section className="py-16 lg:py-20 bg-[#F9F7F4]">
      <div className="max-w-[900px] mx-auto px-6 text-center">
        {/* Quote */}
        <blockquote className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6 italic">
          {quote}
        </blockquote>

        {/* Author */}
        <div className="flex items-center justify-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
            <span className={`font-bold ${textColor}`}>{initials}</span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-[#1C1C1C] text-sm">{name}</p>
            <p className="text-gray-500 text-xs">{title}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialQuote;