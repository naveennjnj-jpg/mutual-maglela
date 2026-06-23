import FooterPageHeroSection from "@/components/ReusableComponents/FooterPageHeroSection/FooterPageHeroSection";
import React from "react";
import CorporateImage from "@/assets/tab-image.jpg";
import { Button } from "@/components/ui/button";
import Faq from "@/components/ReusableComponents/FAQSection/FaqSection";
import EnquiryForm from "@/components/ReusableComponents/EnquiryForm/EnquiryForm";
import TopFooterSection from "@/components/ReusableComponents/TopFooterSection/TopFooterSection";

const learningData = [
  {
    id: 1,
    title: "Customizable Learning",
    description:
      "Choose from private virtual classes, onsite workshops, or comprehensive self-paced learning packages tailored to your organization's goals and workforce development needs.",
  },
  {
    id: 2,
    title: "Customized Live Sessions",
    description:
      "Design instructor-led training programs aligned with your team's objectives, schedules, certification pathways, and business priorities.",
  },
  {
    id: 3,
    title: "Volume Discounts",
    description:
      "Benefit from discounted pricing for group enrollments, enterprise learning initiatives, and bulk purchases across certification courses and exam preparation programs.",
  },
  {
    id: 4,
    title: "Flexible Payment Options",
    description:
      "Select flexible billing and enrollment options, including annual subscriptions, phased learning plans, and scalable access for growing teams.",
  },
];

const portalFeatures = [
  "Access to practice exams and exam simulators",
  "Expert-led on-demand certification training programs",
  "Flexible pay-as-you-use courseware model",
  "Administrative dashboards to monitor learner engagement, performance, and certification readiness",
  "Continuously updated content aligned with the latest PMI exam changes and Exam Content Outlines (ECOs)",
  "Includes premium exam simulator features with detailed analytics and reporting",
  "Accessible anytime from any web browser, tablet, or mobile device",
  "Scalable solution designed for teams, departments, and enterprise-wide learning initiatives",
];

const corporateTrainingFaqs = [
  {
    question:
      "Why do organizations choose vCare Project Management for corporate training?",
    answer:
      "vCare Project Management delivers practical, results-focused learning solutions designed to build capability, improve performance, and support business objectives. Our programs combine expert-led instruction, real-world case studies, hands-on exercises, and flexible delivery options to ensure knowledge is immediately applicable in the workplace.",
  },
  {
    question: "How does corporate training benefit my organization?",
    answer:
      "Effective training helps organizations strengthen workforce capabilities, improve productivity, enhance project and operational outcomes, support digital transformation initiatives, and develop future leaders. It also helps organizations close skill gaps and remain competitive in rapidly changing business environments.",
  },
  {
    question: "Who delivers the training programs?",
    answer:
      "Our programs are facilitated by highly experienced practitioners, consultants, and PMI authorized instructors with extensive industry expertise across project management, program management, portfolio management, PMO leadership, agile delivery, risk management, business analysis, leadership, and digital transformation.",
  },
  {
    question:
      "Can training programs be tailored to our organization's requirements?",
    answer:
      "Yes. We can customize course content, case studies, workshops, assessments, learning paths, and delivery formats to align with your organization's strategic goals, industry challenges, competency frameworks, and workforce development needs.",
  },
  {
    question: "What delivery formats are available?",
    answer:
      "We offer multiple delivery options, including:\n\nInstructor-led virtual training\nIn-person classroom workshops\nHybrid learning solutions\nSelf-paced online learning\nMentoring and coaching programs\nEnterprise learning portal subscriptions\n\nOrganizations can choose the format that best suits their workforce and operational requirements.",
  },
  {
    question: "Do employees need prior experience to attend?",
    answer:
      "Prerequisites vary by program. Many courses are suitable for both beginners and experienced professionals, while advanced certifications and specialized programs may require relevant work experience or foundational knowledge. We can recommend the most appropriate learning pathway based on participant profiles.",
  },
  {
    question: "What is the ideal class size for corporate training?",
    answer:
      "Class sizes can be adjusted based on learning objectives and delivery style. Small groups encourage interaction and coaching, while larger cohorts can be accommodated for enterprise-wide capability development initiatives.",
  },
  {
    question: "How interactive are the training sessions?",
    answer:
      "Our training programs emphasize active participation through discussions, case studies, simulations, practical exercises, group activities, assessments, and real-world scenarios. This approach helps participants apply concepts immediately and retain knowledge more effectively.",
  },
  {
    question: "Can you support certification preparation programs?",
    answer:
      "Yes. We offer training and exam preparation solutions for globally recognized certifications, including PMP®, PgMP®, PfMP®, PMI-PMOCP™, PMI-RMP®, PMI-SP®, PMI-ACP®, PMI-PBA®, CAPM®, Lean Six Sigma (all belts), and other professional credentials.",
  },
  {
    question: "Do you provide learning progress tracking and reporting?",
    answer:
      "Yes. Our learning platform provides visibility into learner participation, course completion, assessment results, and overall training progress, helping organizations measure engagement and monitor workforce development initiatives.",
  },
  {
    question: "Is there an on-demand learning option available?",
    answer:
      "Yes. Organizations can provide employees with access to our digital learning platform, which includes self-paced courses, recorded sessions, practice assessments, study resources, certification preparation tools, and ongoing learning content accessible anytime, anywhere.",
  },
  {
    question: "Can training be delivered globally?",
    answer:
      "Yes. vCare Project Management delivers programs for organizations across North America, Europe, the Middle East, Asia-Pacific, and other regions through virtual, hybrid, and in-person delivery models.",
  },
  {
    question: "How do we get started?",
    answer:
      "Simply contact our team to discuss your learning objectives, target audience, preferred delivery model, and desired outcomes. We will work with you to design a customized training solution that aligns with your organizational goals and budget.",
  },
];

const CorporateTraining = () => {
  return (
    <>
      <FooterPageHeroSection
        title="Transform Learning into Organizational Success"
        description="Equip your employees with world-class training programs, expert mentoring, certification pathways, and flexible learning solutions designed to accelerate workforce readiness, strengthen delivery capability, and support strategic business growth."
      />

      <section className="py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="flex flex-col mb-5 md:mb-7 text-center">
            <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
              Professional Certification Training
            </h2>
            <p className="text-paragraph text-sm font-normal mt-1 w-full leading-[26px]">
              Advance your career with expert-led certification training, exam preparation, and practical learning solutions designed for today's professionals.
            </p>
            <h3 className="text-Black_light text-xl md:text-2xl font-bold mt-5">
              Corporate Certification Training Programs
            </h3>
            <p className="text-paragraph text-sm font-normal mt-1 leading-[26px]">
              Empower your teams with globally recognized certification training programs delivered by industry experts through flexible live online, onsite, and self-paced learning formats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.43fr] gap-5 md:gap-5 items-center">
            <div>
              <img
                src={CorporateImage}
                alt="Corporate Training"
                className="w-full rounded-[20px] aspect-[1/1] object-cover"
              />
            </div>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-4 md:gap-5 items-center mb-5 md:mb-7">
                {learningData.map((item) => (
                  <div
                    key={item.id}
                    className="md:p-[30px] py-6 px-4 bg-[#f0f8ff] rounded-[20px] inline-flex flex-col justify-start items-start gap-3"
                  >
                    <h3 className="self-stretch justify-start text-[#1f1f1f] text-lg md:text-[19px] font-bold">
                      {item.title}
                    </h3>
                    <p className="flex-1 justify-start text-[#556378] text-sm font-normal leading-[26px]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => {
                  const section = document.getElementById("enquiry-form-scroll");
                  section?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Request a Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light-blue py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
            A Branded Learning Portal for Your Organization
          </h2>
          <p className="text-paragraph text-sm font-normal mt-1 leading-[26px]">
            Empower your teams with a fully hosted and branded learning platform powered by vCare Project Management's professional certification training content, exam preparation systems, and learning solutions.
          </p>
          <p className="text-paragraph text-sm font-normal mt-3 leading-[26px]">
            Your learners can access training, practice exams, and learning resources through one secure portal, while your organization benefits from learner analytics, progress tracking, performance insights, and reporting visibility.
          </p>
          <h4 className="text-Black_light text-xl font-bold mt-5 mb-4">
            Platform Features
          </h4>
          <ul className="space-y-1 self-stretch justify-start text-paragraph text-sm font-normal leading-[26px] ml-1">
            {portalFeatures.map((text) => (
              <li
                key={text}
                className="flex items-start gap-2 self-stretch justify-start"
              >
                <span className="text-[8px]">&bull;</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq
        heading="Frequently Asked Questions (FAQs)"
        faqs={corporateTrainingFaqs}
        hideButton
      />

      <div
        id="enquiry-form-scroll"
        className="-mt-10 md:-mt-14 lg:-mt-20 relative"
      >
        <EnquiryForm
          formTitle="Request Corporate Training Information"
          formDescription="Share your training requirements with us, and one of our corporate learning specialists will get in touch with you shortly."
          showCorporateFields
          defaultSubject="request-a-quote"
        />
      </div>
      <TopFooterSection />
    </>
  );
};

export default CorporateTraining;
