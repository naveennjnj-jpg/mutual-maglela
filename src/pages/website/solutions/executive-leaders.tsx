import React from "react";

import HeroSection from "@/components/Common/HeroSection";
import StatsSection from "@/components/Common/StatsSection";
import Challenge from "@/components/Common/Challenge";
import StrategicCommunication from "@/components/Common/StrategicCommunication";
import MeasurableOutcomes from "@/components/Common/MeasurableOutcomes";
import TestimonialQuote from "@/components/Common/TestimonialQuote";
import ResearchCTA from "@/components/Solutions/Academics/ResearchCTA";
import executivebanner from "@/assets/solutions/executivebanner.jpeg";
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
                badge="Executive Leaders & Founders"
                title="Lead With Clarity. Communicate With Authority."
                description="Today's executives and founders are expected to lead publicly — in the media, in front of investors, and inside their organisations. Magalela equips leaders with the communication skills, strategy, and confidence to shape narratives, not just respond to them."
                primaryButton={{
                    text: "Get In Touch",
                    link: "/contact"
                }}
                secondaryButton={{
                    text: "View Pricing",
                    link: "/pricing"
                }}
                image={executivebanner}
            />


            <StatsSection
                stats={[
                    { id: 1, number: "200+", label: "Executives coached" },
                    { id: 2, number: "94%", label: "Report measurable improvement" },
                    { id: 3, number: "3+", label: "Decades of media expertise" },
                    { id: 4, number: "15+", label: "Industries served" },
                ]}
            />
            <Challenge
                badge="The Real Issue"
                title="Executive Communication Is a Strategic Imperative"
                description="Research consistently shows that stakeholders — employees, investors, customers, and media — make judgements about organisations based on how their leaders communicate. Leaders who communicate poorly put their organisations at risk. Those who communicate well set the standard."
                challenges={[
                    {
                        id: 1,
                        title: "Media Scrutiny",
                        description: "Executives and founders face intense media attention — yet most have never received formal training in how to handle interviews, press conferences, or hostile questioning.",
                    },
                    {
                        id: 2,
                        title: "Communication Authenticity",
                        description: "Leaders who rely on corporate speak and scripted messaging lose credibility with employees, investors, and the public — authenticity is now the baseline expectation.",
                    },
                    {
                        id: 3,
                        title: "Internal Leadership Communication",
                        description: "The ability to inspire, align, and motivate large organisations depends on communication skills that most executives have never been taught or had the time to develop.",
                    },
                    {
                        id: 4,
                        title: "Founder Brand Building",
                        description: "Founders are increasingly expected to be the public face of their organisations — but building a credible personal brand requires strategy, not just visibility.",
                    },
                    {
                        id: 5,
                        title: "Boardroom Communication",
                        description: "Presenting to boards, investors, and regulators demands a fundamentally different communication style that balances authority, clarity, and stakeholder sensitivity.",
                    },
                    {
                        id: 6,
                        title: "Crisis Communication Under Pressure",
                        description: "When reputational crises hit, leaders who haven't prepared for high-pressure communication often make matters worse — reinforcing the need for crisis readiness training."
                    },

                ]}
            />
            <StrategicCommunication
                main="How We Help"
                title="Personal Communication Mastery for Leaders Who Set the Standard"
                description="We work one-on-one with executives, founders, and senior leaders to develop the communication skills, strategic messaging, and personal authority that distinguish the best leaders from the rest."
                services={[
                    {
                        id: 1,
                        icon: Megaphone,
                        title: "Executive Media Training",
                        description: "Intensive, tailored media training that prepares leaders to handle any interview — broadcast, print, or online — with clarity, confidence, and control.",
                    },
                    {
                        id: 2,
                        icon: Users,
                        title: "Thought Leadership Strategy",
                        description: "We build your personal brand as a sector authority — from op-ed positioning and speaking strategy to LinkedIn presence and media profile development.",
                    },
                    {
                        id: 3,
                        icon: Globe,
                        title: "Speechwriting & Messaging",
                        description: "Speeches, keynotes, and key messages crafted in your authentic voice — for AGMs, industry conferences, internal town halls, and public platforms.",
                    },
                    {
                        id: 4,
                        icon: BookOpen,
                        title: "Crisis Communication Preparedness",
                        description: "Scenario-based training and response frameworks that ensure you lead with confidence when reputational pressure is at its highest.",
                    },
                    {
                        id: 5,
                        icon: ChartColumn,
                        title: "Personal Brand Management",
                        description: "A cohesive strategy for how you show up across all platforms — aligning your public persona with your leadership philosophy and organisational values."
                    },
                    {
                        id: 6,
                        icon: ShieldCheck,
                        title: "Internal Communication Leadership",
                        description: "Coaching and strategy for executive communications that inspire alignment, build trust, and drive engagement across large and complex organisations.",
                    }

                ]}
            />
            <MeasurableOutcomes
                badge="What You Gain"
                title="Measurable outcomes, not just activity"
                description="Every engagement we undertake is anchored to clear outcomes your organisation can measure, communicate, and build upon."
                outcomes={[
                    { id: 1, text: "Confidence and clarity in every media engagement" },
                    { id: 2, text: "A distinct and credible personal leadership brand" },
                    { id: 3, text: "Speeches and keynotes that move audiences to action" },
                    { id: 4, text: "Crisis response capability built before it is needed" },
                    { id: 5, text: "Stronger alignment and trust within your organisation" },
                    { id: 6, text: "Increased visibility as a sector thought leader" },
                    { id: 7, text: "Board and investor communications that land with impact" },
                    { id: 8, text: "A communication framework that scales with your leadership" },
                ]}
                gridCols="grid sm:grid-cols-2"
            />


            <Testimonial
                quote="The media training I received from Magalela Media fundamentally changed how I show up in public. I went from dreading interviews to actively seeking them out as opportunities to build our brand."
                name="Group Director"
                title="JSE-Listed Retail Group"
                brandText="Magalela Media"
            />
            <ResearchCTA
                badge="Get Started"
                title="Invest in the Communication Skills That Define Great Leaders"
                description="Work is committed to supporting leaders who want to communicate with greater impact, influence their audiences, and shape the narratives that define their organisations and legacy."
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
