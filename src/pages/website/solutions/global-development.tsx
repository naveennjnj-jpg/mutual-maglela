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
                badge="Global Development & Philanthropy"
                title="Communicating Impact That Changes the World"
                description="Global development and philanthropy organisations do complex, high-stakes work to eliminate poverty and advance human dignity. Magalela helps them communicate that work — to donors, governments, and the public — so it gets the recognition and resources it deserves."
                primaryButton={{
                    text: "Get In Touch",
                    link: "/contact"
                }}
                secondaryButton={{
                    text: "View Pricing",
                    link: "/pricing"
                }}
                image="https://images.unsplash.com/photo-1553775927-a071d5a6a39a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbml0YXJpYW4lMjBhaWQlMjBpbnRlcm5hdGlvbmFsJTIwZGV2ZWxvcG1lbnQlMjBjb21tdW5pdHklMjBBZnJpY2F8ZW58MXx8fHwxNzgxMzU0MjY4fDA&ixlib=rb-4.1.0&q=80&w=1400"
            />


            <StatsSection
                stats={[
                    { id: 1, number: "30+", label: "Development organisations served" },
                    { id: 2, number: "$28", label: "Billion in funding influenced" },
                    { id: 3, number: "20+", label: "Countries reached" },
                    { id: 4, number: "85%", label: "Of clients report stronger donor retention" },
                ]}
            />
            <Challenge
                badge="The Real Issue"
                title="Development Work Demands Better Communication"
                description="Global development and philanthropy organisations operate in complex, high-stakes environments and are frequently misunderstood by the media, policymakers, and the public alike. That gap costs them funding, policy influence, and — ultimately — impact."
                challenges={[
                    {
                        id: 1,
                        title: "Donor Fatigue",
                        description: "Organisations competing for a shrinking pool of donor attention struggle to differentiate their work and maintain long-term funding relationships.",
                    },
                    {
                        id: 2,
                        title: "Complex Narratives",
                        description: "Development work operates across layers of policy, culture, and geography — making it difficult to distil impact into stories that resonate with diverse audiences.",
                    },
                    {
                        id: 3,
                        title: "Cultural Sensitivity",
                        description: "Communications that fail to reflect the dignity and agency of beneficiary communities risk reputational damage and erode trust with both funders and partners.",
                    },
                    {
                        id: 4,
                        title: "Policy Influence",
                        description: "Development organisations rarely have the strategic communications infrastructure needed to translate field evidence into policy change at national or international level.",
                    },
                    {
                        id: 5,
                        title: "Beneficiary Representation",
                        description: "Balancing authentic storytelling with ethical representation of vulnerable populations requires specialist expertise that most organisations lack in-house.",
                    },
                    {
                        id: 6,
                        title: "Accountability Reporting",
                        description: "Donors and boards increasingly demand rigorous impact reporting — yet many organisations struggle to communicate results in ways that are credible and compelling."
                    },

                ]}
            />
            <StrategicCommunication
                main="How We Help"
                title="Communications That Connect Development Work to Change"
                description="We work with development organisations, philanthropic foundations, and NGOs to build the communications strategies, campaigns, and stakeholder relationships that amplify their mission and secure their future."
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
