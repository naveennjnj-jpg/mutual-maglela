import FooterPageHeroSection from "@/components/ReusableComponents/FooterPageHeroSection/FooterPageHeroSection";
import { PremiumPacks } from "@/components/ReusableComponents/PlanSection/PremiumPacks";
import TopFooterSection from "@/components/ReusableComponents/TopFooterSection/TopFooterSection";
import { getSubscriptionUrl } from "@/utils/links";

const ExamSimulators = () => {
  return (
    <>
      <FooterPageHeroSection title="Exam Simulators" description="Test your knowledge. Get ready for exam-day." />
      <div className="pt-10 md:pt-14 lg:pt-20">
        <PremiumPacks 
          showCourseSelect={true}
          heading="Choose Your Exam Simulator Package"
          description="Select from individual tests or value bundles to accelerate your exam readiness."
        />
      </div>
       <TopFooterSection
        content={{
          title: (
            <>
             Ace the<br/> exam in the first attempt
            </>
          ),
          description:
            "  Practice with full-length mock exams designed to mirror the actual exam structure - an on-demand, cost-effective way to prepare for the certification exam. It'll help you get familiar with question format, wording, and sample content in advance and you know what to expect on the exam day. The Mock Exam Simulator helps you assess your readiness with full-length, exam-style questions in a real testing environment. Identify gaps, strengthen weak areas, and walk into your exam fully prepared.",
          points: [
            "Experience real exam-style simulations",
            "Identify knowledge gaps instantly",
            "Improve accuracy with detailed explanations",
            "Track domain-wise performance analytics",
          ],
          buttonText: "Test Your Readiness Now",
          buttonLink: getSubscriptionUrl("PMP"),
        }}
      />
    </>
  );
};

export default ExamSimulators;
