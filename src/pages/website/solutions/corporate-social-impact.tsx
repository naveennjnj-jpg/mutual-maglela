import React from "react";

import HeroSection from "@/components/Common/HeroSection";
import StatsSection from "@/components/Common/StatsSection";
import Challenge from "@/components/Common/Challenge";
import StrategicCommunication from "@/components/Common/StrategicCommunication";
import MeasurableOutcomes from "@/components/Common/MeasurableOutcomes";
import TestimonialQuote from "@/components/Common/TestimonialQuote";
import ResearchCTA from "@/components/Solutions/Academics/ResearchCTA";
import solutionsbanner from "@/assets/solutions/solutionsbanner.jpeg";
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
                badge="Corporate Social Impact"
                title="Transform Social Investment Into Strategic Communication"
                description="Corporate social investment teams do meaningful work — but too often that work goes unrecognised. Magalela helps organisations communicate their social impact credibly, compellingly, and in ways that move stakeholders from scepticism to genuine belief."
                primaryButton={{
                    text: "Get In Touch",
                    link: "/contact"
                }}
                secondaryButton={{
                    text: "View Pricing",
                    link: "/pricing"
                }}
                image={solutionsbanner}
            />


            <StatsSection
                stats={[
                    { id: 1, number: "45+", label: "Corporate clients served" },
                    { id: 2, number: "3+", label: "Sectors covered" },
                    { id: 3, number: "R4.2B+", label: "In social investment communicated" },
                    { id: 4, number: "78%", label: "Of clients report stronger ESG positioning" },
                ]}
            />
            <Challenge
                badge="The Real Issue"
                title="Good CSI Work Is Not Enough on Its Own"
                description="Organisations invest significantly in social programmes but fail to communicate their impact in ways that resonate with employees, communities, investors, or the public. The risk of greenwashing accusations and reputational damage grows when communications are an afterthought."
                challenges={[
                    {
                        id: 1,
                        title: "Greenwashing Scrutiny",
                        description: "Heightened public and media scrutiny means CSI claims are challenged more than ever — requiring communications that are evidence-based, transparent, and credible.",
                    },
                    {
                        id: 2,
                        title: "Internal Alignment",
                        description: "CSI teams often struggle to secure buy-in from business units and leadership, leaving social impact work siloed from core brand and reputation strategy.",
                    },
                    {
                        id: 3,
                        title: "Community Voice",
                        description: "The risk of greenwashing increases when organisations speak about communities rather than with them — yet few have frameworks for authentic beneficiary representation.",
                    },
                    {
                        id: 4,
                        title: "CSI Reporting Complexity",
                        description: "Integrated reporting standards and ESG disclosure requirements demand rigorous impact measurement and communication that most CSI teams aren't resourced to deliver.",
                    },
                    {
                        id: 5,
                        title: "Media Scepticism",
                        description: "Journalists and commentators routinely dismiss corporate social investment as PR-driven — making it harder to earn the coverage and credibility your programmes deserve.",
                    },
                    {
                        id: 6,
                        title: "Programme Visibility",
                        description: "Significant investment in community programmes often goes unnoticed internally and externally because organisations lack the communications infrastructure to tell the story."
                    },

                ]}
            />
            <StrategicCommunication
                main="How We Help"
                title="CSI Communications That Build Trust and Drive Impact"
                description="We work with corporate social investment and ESG teams to design communications strategies that tell authentic stories, strengthen stakeholder relationships, and demonstrate the true value of social investment."
                services={[
                    {
                        id: 1,
                        icon: Megaphone,
                        title: "Impact Story Development",
                        description: "Ethical, evidence-based storytelling that brings your CSI programmes to life for employees, investors, communities, and the media.",
                    },
                    {
                        id: 2,
                        icon: Users,
                        title: "CSI to Integrated Reporting",
                        description: "We translate your social investment data into compelling integrated report narratives that satisfy disclosure requirements and resonate with stakeholders.",
                    },
                    {
                        id: 3,
                        icon: Globe,
                        title: "CSI Campaign Strategy",
                        description: "End-to-end campaign planning and execution that builds public awareness of your social investment and positions your organisation as a genuine corporate citizen.",
                    },
                    {
                        id: 4,
                        icon: BookOpen,
                        title: "Community Engagement Communications",
                        description: "Participatory communications strategies that centre community voices and demonstrate authentic partnership — not just philanthropy.",
                    },
                    {
                        id: 5,
                        icon: ChartColumn,
                        title: "Stakeholder Communication Planning",
                        description: "Tailored messaging frameworks for employees, boards, investors, regulators, and communities — ensuring your CSI story lands consistently across every audience."
                    },
                    {
                        id: 6,
                        icon: ShieldCheck,
                        title: "Reputation & Crisis Advisory",
                        description: "Proactive reputation strategies and rapid response frameworks that protect your organisation when CSI commitments are questioned or scrutinised.",
                    }

                ]}
            />
            <MeasurableOutcomes
                badge="What You Gain"
                title="Measurable outcomes, not just activity"
                description="Every engagement we undertake is anchored to clear outcomes your organisation can measure, communicate, and build upon."
                outcomes={[
                    { id: 1, text: "Authentic CSI narratives that build genuine trust" },
                    { id: 2, text: "Stronger ESG positioning with institutional investors" },
                    { id: 3, text: "Integrated reports that satisfy disclosure requirements" },
                    { id: 4, text: "Increased employee pride and internal engagement" },
                    { id: 5, text: "Credible media coverage of social investment work" },
                    { id: 6, text: "Community partnerships built on authentic dialogue" },
                    { id: 7, text: "Consistent messaging across all stakeholder audiences" },
                    { id: 8, text: "A replicable communications framework for your CSI team" },
                ]}
                gridCols="grid sm:grid-cols-2"
            />


            <Testimonial
                quote="Magalela Media helped us move from checkbox CSI reporting to a genuine impact narrative. Our flagship education programme is now cited in investor conversations as a key reason they trust our ESG commitments."
                name="Group Director"
                title="JSE-Listed Financial Services Group"
                brandText="Magalela Media"
            />
            <ResearchCTA
                badge="Get Started"
                title="Make Your Social Investment Work Harder"
                description="Connect with our team to explore how Magalela Media can help your organisation communicate social impact, strengthen ESG positioning, and influence the stakeholders that matter most."
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
