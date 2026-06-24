import React from "react";

import rhodesUniversity from "@/assets/home/IMG_4391.jpeg";
import witsSeismic from "@/assets/home/IMG_4392.png";
import dataScienceLaw from "@/assets/home/IMG_4393.png";
import ukznFoundation from "@/assets/home/IMG_4394.jpeg";

const TrustedPartners = () => {
  const partners = [
    {
      id: 1,
      src: witsSeismic,
      alt: "Wits Seismic Research Centre",
    },
    {
      id: 2,
      src: rhodesUniversity,
      alt: "Rhodes University",
    },
    {
      id: 3,
      src: dataScienceLaw,
      alt: "Partner institution",
    },
    {
      id: 4,
      src: ukznFoundation,
      alt: "Partner institution",
    },
  ];

  // Triple the partners for seamless looping
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
      {/* Title */}
      <p className="text-center text-[10px] font-semibold tracking-[0.22em] uppercase text-gray-400 mb-8">
        Trusted By Leading Institutions
      </p>

      {/* Marquee Container */}
      <div className="relative">
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {/* First set */}
          <div className="flex items-center gap-16 px-8 shrink-0">
            {partners.map((partner) => (
              <img
                key={partner.id}
                src={partner.src}
                alt={partner.alt}
                className="h-20 object-contain"
              />
            ))}
          </div>
          {/* Second set */}
          <div className="flex items-center gap-16 px-8 shrink-0">
            {partners.map((partner) => (
              <img
                key={`${partner.id}-2`}
                src={partner.src}
                alt={partner.alt}
                className="h-20 object-contain"
              />
            ))}
          </div>
          {/* Third set */}
          <div className="flex items-center gap-16 px-8 shrink-0">
            {partners.map((partner) => (
              <img
                key={`${partner.id}-3`}
                src={partner.src}
                alt={partner.alt}
                className="h-20 object-contain"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        .animate-marquee {
          animation: marquee 26s linear infinite;
          width: max-content;
          will-change: transform;
        }
      `}</style>
    </section>
  );
};

export default TrustedPartners;