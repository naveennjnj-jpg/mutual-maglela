import React from "react";
import InnerBg from "@/assets/inner-bg.jpg";

interface NavHeroSectionProps {
  title: string;
  description: string;
  descriptionsecond: string;
  sideImage: string;
}

const NavHeroSection = ({ 
  title,
  description,
  descriptionsecond,
  sideImage,
}: NavHeroSectionProps) => {
  return (
    <section
      className="overflow-hidden py-10  md:py-14 lg:py-20 bg-cover bg-center lg:pt-[164px]"
      style={{ backgroundImage: `url(${InnerBg})` }}
    >
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-5 lg:gap-24 items-start">
          {/* Left Content */}
          <div className="flex flex-col gap-3">
            <h2 className="self-stretch text-white text-2xl md:text-3xl font-bold md:leading-[46px]">
              {title}
            </h2>

            <p className="text-white text-sm font-normal leading-[26px] max-w-[470px] w-full">
              {description}
            </p>
             <p className="text-white text-sm font-normal leading-[26px] max-w-[470px] w-full">
              {descriptionsecond}
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full">
            <img
              src={sideImage}
              alt="Banner"
              className="rounded-[20px] w-full object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default NavHeroSection;
