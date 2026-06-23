import React, { useEffect } from "react";

// Import your images (adjust paths as needed)
import rhodesUniversity from "@/assets/home/IMG_4391.jpeg";
import witsSeismic from "@/assets/home/IMG_4392.png";
import dataScienceLaw from "@/assets/home/IMG_4393.png";
import ukznFoundation from "@/assets/home/IMG_4394.jpeg";

const TrustedPartners = () => {
  // Partner data array
  const partners = [
    {
      id: 1,
      src: rhodesUniversity,
      alt: "Rhodes University",
      className: "max-h-[90px]",
    },
    {
      id: 2,
      src: witsSeismic,
      alt: "Wits Seismic Research Centre",
      className: "max-h-[90px]",
    },
    {
      id: 3,
      src: dataScienceLaw,
      alt: "Data Science Law Lab",
      className: "max-h-[80px]",
    },
    {
      id: 4,
      src: ukznFoundation,
      alt: "University of KwaZulu-Natal Foundation",
      className: "max-h-[80px]",
    },
  ];

  // Duplicate partners for seamless looping (create a continuous scroll)
  const duplicatedPartners = [...partners, ...partners];

  // Add keyframes animation
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes scroll-marquee {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      
      .marquee-track {
        animation: scroll-marquee 26s linear infinite;
      }
      
      .marquee-track:hover {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="py-8 bg-white border-y border-gray-100 overflow-hidden">
      {/* Title */}
      <p className="text-center text-[10px] font-['Roboto'] font-semibold tracking-[0.22em] uppercase text-[#1A2B4C]/40 mb-7">
        Trusted Institutional Partners
      </p>

      {/* Marquee Container */}
      <div className="relative overflow-hidden">
        {/* Left Gradient Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-24 lg:w-36 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        
        {/* Right Gradient Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-24 lg:w-36 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        {/* Marquee Track */}
        <div 
          className="flex items-center marquee-track"
          style={{ 
            width: "max-content",
            willChange: "transform"
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0 flex items-center justify-center mx-6"
              style={{ width: "260px", height: "120px", padding: "16px 24px" }}
            >
              <img
                src={partner.src}
                alt={partner.alt}
                className={`${partner.className} w-auto max-w-full object-contain`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedPartners;