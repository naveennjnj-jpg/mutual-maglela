import React from "react";

import HeroSection from "@/components/Common/HeroSection";
import StatsSection from "@/components/Solutions/Academics/StatsSection";
import Challenge from "@/components/Solutions/Academics/Challenge";
import StrategicCommunication from "@/components/Solutions/Academics/StrategicCommunication";
import MeasurableOutcomes from "@/components/Solutions/Academics/MeasurableOutcomes";
import TestimonialQuote from "@/components/Solutions/Academics/TestimonialQuote";
import ResearchCTA from "@/components/Solutions/Academics/ResearchCTA";


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
                image="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbGVjdHVyZSUyMGhhbGwlMjBjbGFzc3Jvb218ZW58MXx8fHwxNzgxMzQxMjk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
