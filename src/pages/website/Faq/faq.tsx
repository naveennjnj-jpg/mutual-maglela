import React from "react";

import HeroSection from "@/components/Common/HeroSection";
import FAQSection from "@/components/Faq/FAQSection";
import { useNavigate } from "react-router-dom";
import StillHaveQuestions from "@/components/Faq/StillHaveQuestions";
import bannerfaq from "@/assets/faq/faq.jpeg";

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
                image={bannerfaq}
            />

            <FAQSection />
            <StillHaveQuestions />
        </>
    );
};

export default Home;
