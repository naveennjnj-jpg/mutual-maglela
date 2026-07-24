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
                badge="Higher Education Solutions"
                title="Shaping the Narrative for Higher Education"
                description="Higher education bodies face mounting pressure from government, philanthropists, and the public alike. We help institutions and associations communicate their value, influence policy, and build the trust needed to secure their future."
                primaryButton={{
                    text: " Get in Touch",
                    link: "/contact"
                }}
                secondaryButton={{
                    text: "View Pricing",
                    link: "/pricing"
                }}
                image="https://images.unsplash.com/photo-1758270704602-9d4103704ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHx1bml2ZXJzaXR5JTIwbGVjdHVyZSUyMGhhbGwlMjBhdWRpdG9yaXVtfGVufDF8fHx8MTc4MTM1MzUwMHww&ixlib=rb-4.1.0&q=80&w=1400"
            />


            <StatsSection
                stats={[
                    { id: 1, number: "40+", label: "Clients Served" },
                    { id: 2, number: "15+", label: "Years of Experience" },
                    { id: 3, number: "2M+", label: "People Reached" },
                    { id: 4, number: "90%", label: "Client Retention Rate" },
                ]}
            />
            <Challenge
                badge="The Problem We Solve"
                title="The Higher Education Sector Has a Communication Problem"
                description="Higher education organisations and networks represent thousands of institutions and millions of stakeholders, yet they frequently struggle to communicate the sector's value to government, funders, and the public in ways that drive real policy and investment outcomes.

"
                challenges={[
                    {
                        id: 1,
                        title: "Policy Advocacy Gaps",
                        description: "Sector bodies struggle to translate complex policy positions into accessible advocacy narratives that resonate with decision-makers and the public.",
                    },
                    {
                        id: 2,
                        title: "Fragmented Member Voice",
                        description: "Diverse member institutions often have conflicting priorities, making it difficult to present a unified sector position on critical issues.",
                    },
                    {
                        id: 3,
                        title: "Sector Reputation Challenges",
                        description: "Negative headlines about higher education quality, fees, or transformation erode public trust and complicate funding conversations.",
                    },
                    {
                        id: 4,
                        title: "Government Relations",
                        description: "Engaging effectively with government departments and parliamentary committees requires both strategic messaging and relationship management.",
                    },
                    {
                        id: 5,
                        title: "Digital Visibility",
                        description: "Many sector organisations have outdated digital communications strategies that fail to reach younger stakeholders or media professionals.",
                    },
                    {
                        id: 6,
                        title: "Impact Measurement",
                        description: "Demonstrating ROI on communications investment to governing boards and funders requires rigorous measurement and reporting frameworks.",
                    },

                ]}
            />
            <StrategicCommunication
                main="How We Help"
                title="Strategic Communications for Sector-Level Impact"
                description="We partner with higher education networks and associations to build the communications infrastructure, campaigns, and stakeholder relationships that advance sector-wide goals."
                services={[
                    {
                        id: 1,
                        icon: Megaphone,
                        title: "Policy Advocacy Communications",
                        description: "Develop clear, compelling policy positions and advocacy campaigns that influence government, funders, and the public on key sector issues.",
                    },
                    {
                        id: 2,
                        icon: Users,
                        title: "Member Engagement Strategies",
                        description: "Communications frameworks that keep member institutions informed, aligned, and actively participating in sector initiatives.",
                    },
                    {
                        id: 3,
                        icon: Globe,
                        title: "Sector Reputation Management",
                        description: "Proactive campaigns and crisis response strategies that protect and strengthen the reputation of the higher education sector.",
                    },
                    {
                        id: 4,
                        icon: BookOpen,
                        title: "Thought Leadership Content",
                        description: "Op-eds, position papers, reports, and media commentary that establish your organisation as the credible voice of the sector.",
                    },
                    {
                        id: 5,
                        icon: ChartColumn,
                        title: "Campaign Strategy & Execution",
                        description: "End-to-end management of sector-wide campaigns — from strategy and creative development to media placement and impact reporting."
                    },
                    {
                        id: 6,
                        icon: ShieldCheck,
                        title: "Government & Parliamentary Communications",
                        description: "Tailored communications designed for engagement with executive and legislative branches, including submission drafting and briefing preparation.",
                    }

                ]}
            />
            <MeasurableOutcomes
                badge="What You Gain"
                title="Measurable outcomes, not just activity"
                description="Every engagement we undertake is anchored to clear outcomes your organisation can measure, communicate, and build upon."
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
