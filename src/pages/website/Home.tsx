import React from "react";
import HomeBanner from "@/assets/home-banner.png";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/Home/HeroSection";
import { PremiumPacks } from "@/components/ReusableComponents/PlanSection/PremiumPacks";
import ThevCareExam from "@/components/Home/ThevCareExam";
import CertificationTabs from "@/components/Home/CertificationTabs";
import StartFreeTrial from "@/components/ReusableComponents/StartFreeTrial/StartFreeTrial";
import Testimonials from "@/components/ReusableComponents/TestimonialsSection/Testimonials";
import VideoSection from "@/components/ReusableComponents/VideoSection/VideoSection";
import DownloadvCare from "@/components/Home/DownloadvCare";
import Faq from "@/components/ReusableComponents/FAQSection/FaqSection";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const homeFaqs = [
    {
      question: "What does vCare Project Management offer?",
      answer:
        "We provide PMI® certification training, mentoring, exam simulators, application support, and self-paced learning for certifications such as PMP®, PgMP®, PfMP®, PMI-RMP®, PMI-RMP®, PMOCP™, CAPM®, PMI-PBA®, PMI-SP® and more.",
    },
    {
      question: "Are you an official PMI partner?",
      answer:
        "Yes. We are a PMI Premier Authorized Training Partner, since 2013, delivering trusted training aligned with PMI standards.",
    },
    {
      question: "Do you offer live online classes?",
      answer:
        "Yes. We offer live instructor-led online classes, in-person bootcamps, and flexible self-paced programs.",
    },
    {
      question: "Which certification is right for me?",
      answer:
        "It depends on your experience and career goals. We offer free consultations to help you choose the best certification pathway.",
    },
    {
      question: "Do you provide exam simulators?",
      answer:
        "Yes. Our exam simulators include realistic mock exams, scenario-based questions, detailed explanations, and progress tracking.",
    },
    {
      question: "Can you help with PMI applications?",
      answer:
        "Yes. We provide expert application support, draft reviews, audit guidance, and submission assistance.",
    },
    {
      question: "Do your courses include PDUs or contact hours?",
      answer:
        "Many of our courses provide the required contact hours for certification applications and may also help earn PDUs where applicable.",
    },
    {
      question: "Can I study on mobile devices?",
      answer:
        "Yes. Many of our learning resources and simulators are accessible on phone, tablet, and desktop devices.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Selected products may include satisfaction guarantees or refund policies. Please check individual course details.",
    },
    {
      question: "How do I get started?",
      answer:
        "Choose your certification path, enroll online, or contact us for a free consultation.",
    },
  ];

  return (
    <>

      <HeroSection  />
      <div id="premium-packs-scroll" className="pt-5 md:pt-7 lg:pt-10">
        <PremiumPacks
          showCourseSelect={true}
          heading="Find the Right Plan for Your Success"
          description="Choose the plan that matches your learning style, study schedule, and certification goals."
        />
      </div>
      <ThevCareExam />
      <CertificationTabs />
      <StartFreeTrial />
      <Testimonials id="two" />

      <VideoSection
        videoSrc="https://www.w3schools.com/html/mov_bbb.mp4"
        title={<>Watch the Exam Simulator in Action</>}
        description="Our Exam Simulator provides one of the most authentic preparation experiences in the industry. When it’s time for the real exam, you’ll feel more confident and prepared because you’ll know what to expect. With 1,500+ scenario-based questions and detailed explanations designed to reflect the real exam environment, you can trust that your preparation is practical, relevant, and reliable."
      />

      <DownloadvCare />
      <Faq faqs={homeFaqs} />
    </>
  );
};

export default Home;
