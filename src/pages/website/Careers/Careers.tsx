import React from "react";

import HeroSection from "@/components/Common/HeroSection";
import StatsSection from "@/components/Common/StatsSection";
import LifeAtMagalela from "@/components/Careers/LifeAtMagalela";
import OpenPositions from "@/components/Careers/OpenPositions";
import AboutCTA from "@/components/Partnerships/AboutCTA";


import { useNavigate } from "react-router-dom";



const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <HeroSection
                badge="Careers"
                title="Shape the Future of Strategic Communication"
                description="Join a team dedicated to amplifying African scholarship and institutional excellence through world-class communication. We're building something ambitious — and we want brilliant people beside us."
                primaryButton={{
                    text: "View Open Positions ",
                    link: "/#open-positions"
                }}
                secondaryButton={{
                    text: "About Us",
                    link: "/about"
                }}
                image="https://images.unsplash.com/photo-1730382624709-81e52dd294d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80"
            />


            <StatsSection
                stats={[
                    { id: 1, number: "15+", label: "Team Members" },
                    { id: 2, number: "8", label: "Countries Represented" },
                    { id: 3, number: "95%", label: "Employee Retention" },
                    { id: 4, number: "20+", label: "Professional Development Days" },
                ]}
            />
            <LifeAtMagalela />
            <OpenPositions />
            <AboutCTA />
        </>
    );
};

export default Home;
