import React from "react";

import HeroSection from "@/components/Common/HeroSection";
import StatsSection from "@/components/Common/StatsSection";
import AboutCTA from "@/components/Partnerships/AboutCTA";
import { useNavigate } from "react-router-dom";
import ContactForm from "@/components/Contact/ContactForm";
import GeneralFAQ from "@/components/Contact/GeneralFAQ";



const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <HeroSection
                badge="Contact"
                title="Let's Start a Conversation"
                description="Whether you need immediate support or want to explore a long-term partnership, we respond to every enquiry within 24 hours — and we never use templates."
                primaryButton={{
                    text: "Get In Touch",
                    link: "/contact"
                }}
                secondaryButton={{
                    text: "View FAQs",
                    link: "/#faq"
                }}
                image="https://images.unsplash.com/photo-1638262052640-82e94d64664a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80"
            />


            <StatsSection
                stats={[
                    { id: 1, number: "24h", label: "Response Time" },
                    { id: 2, number: "150+", label: "Institutional Partners" },
                    { id: 3, number: "15+", label: "Countries Served" },
                    { id: 4, number: "98%", label: "Client Satisfaction" },
                ]}
            />
            <ContactForm />
            <GeneralFAQ />
            <AboutCTA />
        </>
    );
};

export default Home;
