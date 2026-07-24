import React from "react";

import HeroSection from "@/components/Common/HeroSection";
import StatsSection from "@/components/Aboutus/StatsSection";
import AboutContent from "@/components/Aboutus/AboutContent";
import AboutReach from "@/components/Aboutus/AboutReach";
import AboutValues from "@/components/Aboutus/AboutValues";
import AboutStandards from "@/components/Aboutus/AboutStandards";
import AboutTeam from "@/components/Aboutus/AboutTeam";
import AboutCTA from "@/components/Aboutus/AboutCTA";



import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
<HeroSection
  badge="Partnerships"
  title="Build Partnerships That Drive Real-World Change"
  description="We partner with universities, research networks, NGOs, foundations, and corporate teams to build communications infrastructure that amplifies mission, builds trust, and drives lasting impact across Africa and beyond."
  primaryButton={{
    text: "Start Your Partnership",
    link: "/#partnerships"
  }}
  secondaryButton={{
    text: "View Case Studies",
    link: "/case-studies"
  }}
  image="https://images.unsplash.com/photo-1573164574511-73c773193279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80"
/>
      <StatsSection />
      <AboutContent />
      <AboutReach />
      <AboutValues />
      <AboutStandards />
      <AboutTeam />
      <AboutCTA />
    </>
  );
};

export default Home;
