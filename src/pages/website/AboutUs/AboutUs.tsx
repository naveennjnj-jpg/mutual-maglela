import React from "react";
import FooterPageHeroSection from "@/components/ReusableComponents/FooterPageHeroSection/FooterPageHeroSection";
import TopFooterSection from "@/components/ReusableComponents/TopFooterSection/TopFooterSection";
import { CALENDLY_CONSULTATION_URL, getSubscriptionUrl } from "@/utils/links";

const expertiseAreas = [
  {
    title: "Project, Program & Portfolio Management",
    description:
      "Develop the capabilities required to successfully deliver projects, manage complex programs, and align portfolios with organizational strategy.",
  },
  {
    title: "PMO Leadership & Governance",
    description:
      "Build high-performing PMOs that drive strategic alignment, governance, value realization, and organizational excellence.",
  },
  {
    title: "Agile & Product Delivery",
    description:
      "Equip teams with modern agile practices, frameworks, and leadership techniques to improve adaptability and accelerate delivery outcomes.",
  },
  {
    title: "Risk Management",
    description:
      "Strengthen organizational resilience through structured risk identification, analysis, response planning, and governance practices.",
  },
  {
    title: "Business Analysis & Process Improvement",
    description:
      "Improve decision-making, requirements management, operational efficiency, and business performance through effective analysis and process optimization.",
  },
  {
    title: "Lean Six Sigma & Continuous Improvement",
    description:
      "Enable teams to eliminate waste, reduce variation, improve quality, enhance customer satisfaction, and drive measurable business improvements using Lean Six Sigma methodologies.",
  },
  {
    title: "Leadership & Professional Development",
    description:
      "Develop the leadership, communication, strategic thinking, and stakeholder engagement skills required to succeed in today's dynamic business environment.",
  },
  {
    title: "Corporate Learning & Workforce Development",
    description:
      "Design and deliver customized learning pathways, capability frameworks, certification programs, and enterprise-wide upskilling initiatives aligned with organizational goals.",
  },
];

const learningSolutions = [
  {
    title: "Live Online Training",
    description:
      "Interactive instructor-led programs delivered virtually to professionals worldwide.",
  },
  {
    title: "In-Person Workshops",
    description:
      "Engaging classroom experiences tailored for corporate teams, conferences, and professional associations.",
  },
  {
    title: "Self-Paced Learning",
    description:
      "Learn anytime, anywhere through our digital learning platform and on-demand course library.",
  },
  {
    title: "Personal Mentoring & Coaching",
    description:
      "Individual guidance from experienced practitioners to accelerate learning and certification success.",
  },
  {
    title: "Certification Preparation",
    description:
      "Comprehensive exam preparation programs, practice exams, flash cards, mentoring, and study resources.",
  },
  {
    title: "Corporate Training Solutions",
    description:
      "Customized learning programs designed around your organization's strategic objectives and workforce development needs.",
  },
];

const whyChooseUs = [
  {
    title: "Flexible and Empowering Learning Environment",
    description:
      "Enjoy a flexible learning experience that enables you to learn at your own pace, achieve your career goals, and stand out in today's competitive job market.",
  },
  {
    title: "Practical Learning Approach",
    description:
      "We focus on real-world application through case studies, simulations, workshops, practical exercises, and industry examples - not just theory.",
  },
  {
    title: "Flexible Delivery Models",
    description:
      "Choose from virtual, classroom, hybrid, self-paced, mentoring, and enterprise learning solutions.",
  },
  {
    title: "Global Reach",
    description:
      "We support learners and organizations across multiple countries and time zones through scalable learning solutions.",
  },
  {
    title: "Proven Learning Ecosystem",
    description:
      "Our digital learning platform provides access to courses, practice exams, flash cards, study resources, performance tracking, and ongoing learning support.",
  },
  {
    title: "Outstanding Learner Support",
    description:
      "Our team is committed to providing timely assistance, expert guidance, and a positive learning experience from enrollment through completion.",
  },
  {
    title: "Commitment to Excellence",
    description:
      "Every program is designed to deliver measurable learning outcomes, practical workplace application, and long-term professional growth.",
  },
];

const AboutUs = () => {
  return (
    <>
      <FooterPageHeroSection
        title="About vCare Project Management"
        description="Empowering Professionals. Transforming Organizations."
      />

      <section className="py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="flex flex-col justify-start items-center gap-2 text-center">
            <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
              Who We Are
            </h2>
            <div className="space-y-3 text-paragraph text-sm md:text-base font-normal leading-[26px] md:leading-[30px]">
              <p>
                Since 2011, vCare Project Management has been helping
                professionals, teams, and organizations develop the skills,
                knowledge, and confidence needed to succeed in today's rapidly
                evolving business environment.
              </p>
              <p>
                We provide industry-leading training, mentoring, certification
                preparation, exam simulators, and corporate learning solutions
                across project management, program management, portfolio
                management, PMO leadership, agile delivery, risk management,
                business analysis, leadership development, and Lean Six Sigma.
              </p>
              <p>
                Our mission is simple: deliver practical, high-quality learning
                experiences that create measurable career growth and business
                results.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light-blue py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="flex flex-col mb-5 md:mb-7 text-center">
            <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
              What We Do
            </h2>
            <p className="text-paragraph text-sm font-normal mt-1 w-full leading-[26px]">
              We help professionals and organizations develop practical skills,
              earn globally recognized credentials, and improve business
              performance through expert-led learning and development programs.
            </p>
            <p className="text-primary_heading text-sm md:text-base font-semibold mt-3 w-full leading-[26px]">
              Our areas of expertise include:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3 md:gap-y-5">
            {expertiseAreas.map((card, index) => (
              <div
                key={card.title}
                className="p-5 bg-white rounded-[20px] text-left transition"
              >
                <div className="w-[60px] h-[60px] text-xl font-bold text-primary_heading flex items-center justify-center relative bg-white rounded-[99px] outline outline-1 outline-offset-[-1px] outline-[#4c8dea]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h4 className="text-primary_heading text-base md:text-xl font-bold mb-2 mt-4">
                  {card.title}
                </h4>
                <p className="text-paragraph text-xs font-normal leading-6">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="flex flex-col mb-5 md:mb-7 text-center">
            <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
              Our Learning Solutions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3 md:gap-y-5">
            {learningSolutions.map((card, index) => (
              <div
                key={card.title}
                className="p-5 bg-light-blue rounded-[20px] text-left transition"
              >
                <div className="w-[60px] h-[60px] text-xl font-bold text-primary_heading flex items-center justify-center relative bg-white rounded-[99px] outline outline-1 outline-offset-[-1px] outline-[#4c8dea]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h4 className="text-primary_heading text-base md:text-xl font-bold mb-2 mt-4">
                  {card.title}
                </h4>
                <p className="text-paragraph text-xs font-normal leading-6">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light-blue py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="flex flex-col justify-start items-center gap-2 text-center">
            <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
              Our Mission
            </h2>
            <p className="text-paragraph text-sm md:text-base font-normal leading-[26px] md:leading-[30px]">
              Our mission is simple: deliver practical, high-quality learning
              experiences that create measurable career growth and business
              results.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="flex flex-col mb-5 md:mb-7 text-center">
            <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
              Why Organizations Choose vCare Project Management
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3 md:gap-y-5">
            {whyChooseUs.map((card, index) => (
              <div
                key={card.title}
                className="p-5 bg-light-blue rounded-[20px] text-left transition"
              >
                <div className="w-[60px] h-[60px] text-xl font-bold text-primary_heading flex items-center justify-center relative bg-white rounded-[99px] outline outline-1 outline-offset-[-1px] outline-[#4c8dea]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h4 className="text-primary_heading text-base md:text-xl font-bold mb-2 mt-4">
                  {card.title}
                </h4>
                <p className="text-paragraph text-xs font-normal leading-6">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light-blue py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="flex flex-col justify-start items-center gap-2 text-center">
            <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
              Trusted by Professionals Worldwide
            </h2>
            <p className="text-paragraph text-sm md:text-base font-normal leading-[26px] md:leading-[30px]">
              Thousands of professionals and organizations trust vCare Project
              Management for professional development, certification
              preparation, leadership training, and workforce capability
              building. Whether you are seeking career advancement,
              certification success, operational improvement, or organizational
              transformation, we are committed to helping you achieve your
              goals.
            </p>
          </div>
        </div>
      </section>

      <TopFooterSection
        content={{
          title: <>Start Your Exam Prep Journey Today!</>,
          description:
            "Join thousands of professionals working towards their certification and gain the knowledge, strategy, and support to pass. Don't wait - your next career move starts here.",
          points: [],
          buttonText: "Enroll Now",
          buttonLink: getSubscriptionUrl("PMP"),
          secondaryButtonText: "Book a Free Consultation",
          secondaryButtonLink: CALENDLY_CONSULTATION_URL,
        }}
      />
    </>
  );
};

export default AboutUs;
