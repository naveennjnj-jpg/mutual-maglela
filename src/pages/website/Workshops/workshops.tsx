import React from "react";
import HeroSection from "@/components/Common/HeroSection";
import StatsSection from "@/components/Common/StatsSection";
import Challenge from "@/components/Common/Challenge";
import StrategicCommunication from "@/components/Common/StrategicCommunication";
import MeasurableOutcomes from "@/components/Common/MeasurableOutcomes";
import TestimonialQuote from "@/components/Common/TestimonialQuote";
import WorkshopCTA from "@/components/Workshop/workshopcta";
import FacilitatorsSection from "@/components/Workshop/FacilitatorsSection";
import workbanner from "@/assets/workshop/work_banner.jpeg";
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
                badge="Workshops"
                title="Expert-Led Communication Workshops"
                description="Hands-on, expert-facilitated workshops that build real communication skills — from media training and speechwriting to digital strategy and stakeholder engagement. Designed for teams that want to communicate with greater confidence and impact."
                primaryButton={{
                    text: "Request a Workshop",
                    link: "/contact"
                }}
                secondaryButton={{
                    text: "View Pricing",
                    link: "/pricing"
                }}
                image={workbanner}
            />


            <StatsSection
                stats={[
                    { id: 1, number: "500+", label: "Professionals trained" },
                    { id: 2, number: "12+", label: "Workshop formats available" },
                    { id: 3, number: "95%", label: "Participant satisfaction rate" },
                    { id: 4, number: "8+", label: "Sectors served" },
                ]}
            />
            <Challenge
                badge="The Challenge"
                title="Why Communication Training Can't Wait"
                description="Talent alone isn't enough. Organisations lose credibility, funding, and public trust every day because their teams haven't been equipped with the practical communication skills that today's environment demands."
                challenges={[
                    {
                        id: 1,
                        title: "Communication Skills Gap",
                        description: "Most professionals never receive formal communications training, leaving teams ill-equipped to represent their organisations effectively in high-stakes situations.",
                    },
                    {
                        id: 2,
                        title: "Media Unpreparedness",
                        description: "Researchers, executives, and spokespeople routinely face journalists without the tools or techniques to control messaging and avoid misrepresentation.",
                    },
                    {
                        id: 3,
                        title: "Content Literacy Barrier",
                        description: "Rapid changes in digital media demand content skills that most organisations haven't invested in — leaving communications functions under-resourced and outpaced.",
                    },
                    {
                        id: 4,
                        title: "Boardroom Capacity",
                        description: "Senior leaders and board members frequently lack the presentation and facilitation skills needed to run high-impact meetings and command rooms with authority.",
                    },
                    {
                        id: 5,
                        title: "Organisational Messaging",
                        description: "Without shared messaging frameworks, teams communicate inconsistently — creating confusion among stakeholders and undermining organisational credibility.",
                    },
                    {
                        id: 6,
                        title: "Low Stakeholder Confidence",
                        description: "When communications fail, relationships with funders, governments, and communities erode — making training an investment in institutional resilience, not just skills."
                    },

                ]}
            />
            <StrategicCommunication
                main="Our Workshops"
                title="Workshops Built for Real-World Impact"
                description="All our workshops are expert-facilitated, practically focused, and tailored to your organisation's context, sector, and communication goals — not off-the-shelf training programmes."
                services={[
                    {
                        id: 1,
                        icon: Megaphone,
                        title: "Media Training",
                        description: "Intensive, scenario-based training that equips spokespeople, executives, and researchers to handle interviews, press conferences, and hostile media with confidence and precision.",
                    },
                    {
                        id: 2,
                        icon: Users,
                        title: "Team Communications Workshops",
                        description: "Tailored sessions that build shared messaging frameworks, presentation skills, and stakeholder engagement capabilities across entire communications teams.",
                    },
                    {
                        id: 3,
                        icon: Globe,
                        title: "Content Communications",
                        description: "Practical workshops on writing for impact — from policy briefs and op-eds to digital content and annual reports — designed for professionals who communicate complex ideas.",
                    },
                    {
                        id: 4,
                        icon: BookOpen,
                        title: "Digital & Social Media Training",
                        description: "Hands-on training in digital strategy, platform management, and content creation — equipping teams to build credible, consistent presences across digital channels.",
                    }

                ]}
            />
            <MeasurableOutcomes
                badge="What You Gain"
                title="Measurable outcomes, not just activity"
                description="Our workshops are designed to produce tangible, lasting improvements in how your team communicates — with tools and frameworks they can apply from day one."
                outcomes={[
                    { id: 1, text: "Spokespeople who handle media with confidence" },
                    { id: 2, text: "Consistent messaging across your entire organisation" },
                    { id: 3, text: "Teams equipped to write for any platform or audience" },
                    { id: 4, text: "Leaders who command rooms and inspire action" },
                    { id: 5, text: "A shared communications language across departments" },
                    { id: 6, text: "Measurable improvement in stakeholder engagement" },
                    { id: 7, text: "Crisis communication readiness built before it's needed" },
                    { id: 8, text: "Practical frameworks your team can use immediately" },
                ]}
                gridCols="grid sm:grid-cols-2"
            />


            <Testimonial
                quote="The Media Training workshop transformed how our research team communicates with journalists. Within weeks of the session, our lead scientists were appearing on national media with confidence and clarity."
                name="Communications Director"
                title="National Research Foundation"
                brandText="Magalela Media"
            />
            <WorkshopCTA />
            <FacilitatorsSection />
           
        </>
    );
};

export default Home;