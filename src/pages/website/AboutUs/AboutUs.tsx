import React from "react";
import HeroBanner from "@/assets/about/about_banner.jpeg";
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
  image={HeroBanner}
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
