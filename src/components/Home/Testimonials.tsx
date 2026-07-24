import React from "react";
import { Star } from "lucide-react";

const Testimonials = () => {
  // Testimonials data array
  const testimonials = [
    {
      id: 1,
      quote:
        '"Magalela Media transformed how we communicate complex policy to stakeholders. Their strategic insight and editorial precision are unmatched."',
      name: "Dr. Nomvula Mthembu",
      title: "Director of Communications",
      institution: "Government Department",
      initials: "NM",
    },
    {
      id: 2,
      quote:
        '"The media training workshop changed how our executive team handles press. Within weeks we saw measurable improvement in message clarity and confidence."',
      name: "Prof. Thabo Ndlovu",
      title: "Vice-Chancellor",
      institution: "Major University",
      initials: "TN",
    },
    {
      id: 3,
      quote:
        '"Our flagship development programme is now cited in international reports as a model for impact communication — thanks to Magalela\'s expertise."',
      name: "Ayanda Khumalo",
      title: "Programme Director",
      institution: "Development Agency",
      initials: "AK",
    },
  ];

  // Star rating component
  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
        />
      ));
  };

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-3">
            Client Testimonials
          </p>
          <h2 className="text-3xl lg:text-[40px] font-['Roboto'] text-[#0F2D63] leading-tight">
            What Prestigious Organisations Say About Us
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#F9F7F4] rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">{renderStars()}</div>

              {/* Quote */}
              <blockquote className="text-gray-600 text-[15px] leading-relaxed flex-1 mb-6 italic">
                {testimonial.quote}
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                {/* Initials Circle */}
                <div className="w-10 h-10 rounded-xl bg-[#0F2D63]/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-sm text-[#0F2D63]">
                    {testimonial.initials}
                  </span>
                </div>

                {/* Author Details */}
                <div>
                  <p className="font-semibold text-[#1C1C1C] text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-400 text-xs">{testimonial.title}</p>
                  <p className="text-xs font-medium text-[#C85A32]">
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