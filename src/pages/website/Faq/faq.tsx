import React from "react";

import HeroSection from "@/components/Common/HeroSection";
import FAQSection from "@/components/Faq/FAQSection";
import { useNavigate } from "react-router-dom";
import StillHaveQuestions from "@/components/Faq/StillHaveQuestions";


const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <HeroSection
                badge="FAQs"
                title="Frequently Asked Questions"
                description="Everything you need to know about working with Magalela Media — from getting started to advanced features."
                primaryButton={{
                    text: "Contact Us",
                    link: "/contact"
                }}
                image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80"
            />

            <FAQSection />
            <StillHaveQuestions />
        </>
    );
};

export default Home;
