import React from "react";

import HeroSection from "@/components/Common/HeroSection";
import StatsSection from "@/components/Common/StatsSection";
import Challenge from "@/components/Common/Challenge";
import StrategicCommunication from "@/components/Common/StrategicCommunication";
import MeasurableOutcomes from "@/components/Common/MeasurableOutcomes";
import TestimonialQuote from "@/components/Common/TestimonialQuote";
import ResearchCTA from "@/components/Solutions/Academics/ResearchCTA";
import {
    Megaphone,
    MessageSquare,
    Users,
    Award,
    ChartColumn,
    Zap,
    type LucideIcon,
    Globe,
    BookOpen,
    ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Testimonial from "@/components/Common/TestimonialQuote";


const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <HeroSection
                badge="University Communications Solutions"
                title="Powering Institutional Communication Excellence"
                description="Magalela Media partners with university communications teams to deliver strategic support, crisis management, and capacity building that elevates institutional reputation and amplifies impact."
                primaryButton={{
                    text: "Book A Consultation",
                    link: "/contact"
                }}
                secondaryButton={{
                    text: "View Pricing",
                    link: "/pricing"
                }}
                image="https://images.unsplash.com/photo-1728206313441-281ef4ea5d62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwY29tbXVuaWNhdGlvbnMlMjB0ZWFtfGVufDF8fHx8MTc4MTM0MTk1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            />


            <StatsSection
                stats={[
                    { id: 1, number: "25+", label: "Years of Combined Comms Expertise" },
                    { id: 2, number: "44h", label: "Average Crisis Response Deployment Time" },
                    { id: 3, number: "60%", label: "Reduction in Reactive Communications" },
                    { id: 4, number: "100%", label: "Of Partner Institutions Report Enhanced Reputation" },
                ]}
            />
            <Challenge
                badge="The Challenge"
                title="University Comms Departments Face Unique Pressures"
                description="Between crisis management, reputation protection, stakeholder engagement, and day-to-day content production, university communications teams are stretched thin. The challenge is not commitment — it is capacity, expertise, and strategic bandwidth.

"
                challenges={[
                    {
                        id: 1,
                        title: "Resource Constraints",
                        description: "Small teams managing high-volume demands across multiple channels, often without specialised skills in crisis communications, media relations, or digital strategy.",
                    },
                    {
                        id: 2,
                        title: "Crisis Preparedness",
                        description: "Universities face reputational risks from student protests, research controversies, and public scrutiny—often with little time to prepare.",
                    },
                    {
                        id: 3,
                        title: "Brand/Reputation",
                        description: "Maintaining institutional credibility in a competitive higher education landscape requires proactive narrative control and consistent messaging.",
                    },
                    {
                        id: 4,
                        title: "Cross-Functional Campaigns",
                        description: "Communications teams must coordinate with faculties, researchers, alumni, and executive leadership—each with competing priorities.",
                    },
                    {
                        id: 5,
                        title: "Staff Expectations",
                        description: "Internal stakeholders often expect instant turnarounds on media requests, statements, and campaigns without understanding resource constraints.",
                    },
                    {
                        id: 6,
                        title: "Attracting Reputation",
                        description: "Differentiating your institution from competitors while staying authentic to institutional values and mission is increasingly difficult."
                    },

                ]}
            />
            <StrategicCommunication
                main=""
                title="A Strategic Partner for Your Communications Department"
                description="We integrate seamlessly with your team, providing on-demand expertise, capacity, and strategic counsel when you need it most. Think of us as an extension of your department—responsive, experienced, and results-driven."
                services={[
                    {
                        id: 1,
                        icon: Megaphone,
                        title: "Crisis Communications Support",
                        description: "Rapid-response expertise for protests, controversies, and reputational threats. We help you prepare messaging, engage media, and protect institutional credibility under pressure.",
                    },
                    {
                        id: 2,
                        icon: Users,
                        title: "Institutional Brand Strategy",
                        description: "Define and communicate what sets your university apart. We work with leadership and comms teams to articulate a clear, compelling institutional narrative..",
                    },
                    {
                        id: 3,
                        icon: Globe,
                        title: "Researcher & Faculty Profiling",
                        description: "Elevate the public profile of your academics and researchers through strategic media engagement, thought leadership content, and expert positioning.",
                    },
                    {
                        id: 4,
                        icon: BookOpen,
                        title: "Strategic Institutional Narrative",
                        description: "Craft cohesive messaging frameworks that align with institutional goals, resonate with stakeholders, and position your university as a leader in your sector.",
                    },
                    {
                        id: 5,
                        icon: ChartColumn,
                        title: "Reputation Cultivation",
                        description: "Proactive media relations and stakeholder engagement to build long-term trust, credibility, and positive perception among students, funders, and the public."
                    },
                    {
                        id: 6,
                        icon: ShieldCheck,
                        title: "Communications Audit & Strategy",
                        description: "Comprehensive assessment of your current communications function, identifying gaps, opportunities, and actionable recommendations for improvement.",
                    }

                ]}
            />
            <MeasurableOutcomes
                badge="What You Gain"
                title="Measurable outcomes, not just activity"
                description="Every project we deliver is designed to strengthen your communications function, enhance institutional reputation, and equip your team with sustainable frameworks."
                outcomes={[
                    { id: 1, text: "A unified sector narrative that members rally behind" },
                    { id: 2, text: "Stronger policy influence with government and parliament" },
                    { id: 3, text: "Increased media coverage of sector priorities" },
                    { id: 4, text: "Better member engagement and participation rates" },
                    { id: 5, text: "Improved public understanding of higher education's value" },
                    { id: 6, text: "Stronger relationships with strategic funders and donors" },
                    { id: 7, text: "Measurable campaign reach and stakeholder impact" },
                    { id: 8, text: "A replicable communications framework for the organisation" },
                ]}
                gridCols="grid sm:grid-cols-2"
            />


            <Testimonial
                quote="Magalela Media designed our public campaign on research funding in under three weeks. The result was front-page coverage and a meeting request from the Department of Higher Education within a month."
                name="Director of Communications"
                title="Higher Education South Africa Member Institution"
                brandText="Magalela Media"
            />
            <ResearchCTA
                badge="Get Started"
                title="Build the Sector's Communications Capacity"
                description="Connect with our team to explore how Magalela Media can help strengthen your organisation's voice and drive meaningful change in the higher education landscape."
                primaryButton={{
                    text: "Book A Consultation",
                    link: "/contact"
                }}
                secondaryButton={{
                    text: "View Case Studies",
                    link: "/case-studies"
                }}
            />
        </>
    );
};

export default Home;
