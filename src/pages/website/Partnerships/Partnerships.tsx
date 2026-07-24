import React from "react";

import HeroSection from "@/components/Common/HeroSection";
import TrustedPartners from "@/components/Partnerships/TrustedPartners";
import WhyPartner from "@/components/Partnerships/WhyPartner";
import OurClients from "@/components/Partnerships/OurClients";
import HowWePartner from "@/components/Partnerships/HowWePartner";
import StatsSection from "@/components/Partnerships/StatsSection";
import PartnershipOnboarding from "@/components/Partnerships/PartnershipOnboarding";
import PartnershipForm from "@/components/Partnerships/PartnershipForm";
import AboutCTA from "@/components/Partnerships/AboutCTA";



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
                image="https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80"
            />

            <TrustedPartners />
            <WhyPartner />
            <OurClients />
            <HowWePartner />
            <StatsSection />
            <PartnershipOnboarding />
            <PartnershipForm />
            <AboutCTA />
        </>
    );
};

export default Home;
