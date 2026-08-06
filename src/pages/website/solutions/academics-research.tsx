import React from "react";

import HeroSection from "@/components/Common/HeroSection";
import StatsSection from "@/components/Solutions/Academics/StatsSection";
import Challenge from "@/components/Solutions/Academics/Challenge";
import StrategicCommunication from "@/components/Solutions/Academics/StrategicCommunication";
import MeasurableOutcomes from "@/components/Solutions/Academics/MeasurableOutcomes";
import TestimonialQuote from "@/components/Solutions/Academics/TestimonialQuote";
import ResearchCTA from "@/components/Solutions/Academics/ResearchCTA";
import acedemic from "@/assets/solutions/acedemic.png";


import { useNavigate } from "react-router-dom";


const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <HeroSection
                badge="Academic & Research Solutions"
                title="Amplify the Impact of Your Research"
                description="Magalela Media bridges the gap between academic rigour and public understanding. We transform complex, multidisciplinary research into compelling narratives that engage funders, policymakers, and the public."
                primaryButton={{
                    text: "Book a Consultation",
                    link: "/contact"
                }}
                secondaryButton={{
                    text: "View Pricing",
                    link: "/pricing"
                }}
                image={acedemic}
            />


<StatsSection />
            <Challenge />
            <StrategicCommunication />
            <MeasurableOutcomes />
            <TestimonialQuote />
            <ResearchCTA />
        </>
    );
};

export default Home;
