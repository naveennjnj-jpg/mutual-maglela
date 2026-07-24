import React from "react";

import HeroSection from "@/components/Common/HeroSection";
import StatsSection from "@/components/Common/StatsSection";
import PricingPlans from "@/components/Pricing/PricingPlans";
import ProjectPricing from "@/components/Pricing/ProjectPricing";
import AddOns from "@/components//Pricing/AddOns";
import PricingFAQ from "@/components/Pricing/PricingFAQ";
import AboutCTA from "@/components/Partnerships/AboutCTA";


import { useNavigate } from "react-router-dom";



const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <HeroSection
                badge="Pricing"
                title="Clear, Honest Pricing for Every Organisation"
                description="From individual academics to large institutions — straightforward plans with no hidden fees, no surprises. Pay for exactly what you need."
                primaryButton={{
                    text: "Get a Custom Quote",
                    link: "/contact"
                }}
                secondaryButton={{
                    text: "Talk to Us",
                    link: "/contact"
                }}
                image="https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80"
            />


            <StatsSection
                stats={[
                    { id: 1, number: "3", label: "Flexible plan tiers" },
                    { id: 2, number: "R 450", label: "Starting price" },
                    { id: 3, number: "14-day", label: "Free trial on retainers" },
                    { id: 4, number: "NET 30", label: "Payment terms" },
                ]}
            />
            <PricingPlans />
            <ProjectPricing />
            <AddOns />
            <PricingFAQ />
            <AboutCTA />
        </>
    );
};

export default Home;
