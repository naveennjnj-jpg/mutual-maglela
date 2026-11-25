import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import HeroSection from "@/components/Common/HeroSection";
import StatsSection from "@/components/Common/StatsSection";
import AboutCTA from "@/components/Partnerships/AboutCTA";
import ContactForm from "@/components/Contact/ContactForm";
import GeneralFAQ from "@/components/Contact/GeneralFAQ";

const Home = () => {
    const location = useLocation();

    // Scroll to hash section when URL changes (e.g. /#faq)
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace("#", "");
            // Small delay to ensure the section is mounted
            const timer = setTimeout(() => {
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [location]);

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
                    link: "#faq"
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