import React from "react";

import HeroSection from "@/components/Home/HeroSection";
import TrustedPartners from "@/components/Home/TrustedPartners";
import WhyMagalelaWorks from "@/components/Home/WhyMagalelaWorks";
import StrategicSolutions from "@/components/Home/StrategicSolutions";
import ExpertWorkshops from "@/components/Home/ExpertWorkshops";
import TrainingPrograms from "@/components/Home/TrainingPrograms";
import HowWeWork from "@/components/Home/HowWeWork";
import WhyChooseMagalela from "@/components/Home/WhyChooseMagalela";
import Testimonials from "@/components/Home/Testimonials";
import CTASection from "@/components/Home/CTASection";


import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <HeroSection />
      <TrustedPartners />
      <WhyMagalelaWorks />
      <StrategicSolutions />
      <ExpertWorkshops />
      <TrainingPrograms />
      <HowWeWork />
      <WhyChooseMagalela />
      <Testimonials />
      <CTASection />
    </>
  );
};

export default Home;
