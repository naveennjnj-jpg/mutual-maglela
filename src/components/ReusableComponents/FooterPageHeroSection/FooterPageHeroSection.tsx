import React from "react";
import InnerBg from "@/assets/inner-bg.jpg";

interface FooterPageHeroSectionProps {
  title: string;
  description: string;
}

const FooterPageHeroSection = ({ 
  title,
  description,
}: FooterPageHeroSectionProps) => {
  return (
    <section
      className="overflow-hidden py-10  md:py-14 lg:py-10 bg-cover bg-center lg:pt-[114px] min-h-56 md:min-h-72 flex items-center justify-center"
      style={{ backgroundImage: `url(${InnerBg})` }}
    >
      <div className="max-w-[1226px] w-full px-4 md:px-4 m-auto">
        <div className="grid grid-cols-1 items-center text-center">
          <div className="flex flex-col justify-center text-center">
            <h2 className="self-stretch text-white text-2xl md:text-3xl font-bold md:leading-[46px]">
              {title}
            </h2>
            <p className="text-white text-sm font-normal leading-[26px] w-full text-center"> 
              {description}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FooterPageHeroSection;
