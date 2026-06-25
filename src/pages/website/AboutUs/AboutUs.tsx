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
  title="Strategic Communication Rooted in Journalism and Scholarship"
  description="Magalela Media is Africa's leading academic and institutional communications agency — founded by journalists and scholars to bridge the gap between expertise and public impact."
  primaryButton={{
    text: "Start a Conversation",
    link: "/contact"
  }}
  secondaryButton={{
    text: "Our Partnerships",
    link: "/partnerships"
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
