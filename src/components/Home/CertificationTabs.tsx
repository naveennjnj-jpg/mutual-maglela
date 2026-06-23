import { useState } from "react";
import { Button } from "../ui/button";
import TabImage from "@/assets/tab-image.jpg";
import {
  CALENDLY_CONSULTATION_URL,
  getCoursePagePath,
  getDashboardUrl,
  getMockExamUrl,
  getSubscriptionUrl,
  SHOPIFY_TRAINING_LINKS,
} from "@/utils/links";
import type { CourseKey } from "@/components/ReusableComponents/PlanSection/plans";

type Tab =
  | "PMP"
  | "PgMP"
  | "PfMP"
  | "CAPM"
  | "PMI-RMP"
  | "PMI-PMOCP";

interface Course {
  id: number;
  title: string;
  subheading?: string;
  description: string;
  image: string;
  button:string;
  href?: string;
}

const tabs: Tab[] = ["PMP", "PgMP", "PfMP","PMI-PMOCP", "PMI-RMP", "CAPM"];

const certificationImages: Record<Tab, Record<string, string>> = {
  PMP: {
    "exam prep training": new URL(
      "../../assets/PMPCertificationPath/ExamPrepTraining.png",
      import.meta.url,
    ).href,
    "exam simulator": new URL(
      "../../assets/PMPCertificationPath/ExamSimulator.png",
      import.meta.url,
    ).href,
    "application support": new URL(
      "../../assets/PMPCertificationPath/ApplicationSupport.png",
      import.meta.url,
    ).href,
    "on-demand course": new URL(
      "../../assets/PMPCertificationPath/PMPOnDemandCourse.png",
      import.meta.url,
    ).href,
    consultation: new URL(
      "../../assets/PMPCertificationPath/PMPConsultation.png",
      import.meta.url,
    ).href,
    "online exam prep": new URL(
      "../../assets/PMPCertificationPath/PMPOnlineExamPrepCourse.png",
      import.meta.url,
    ).href,
    "exam voucher bundle": new URL(
      "../../assets/PMPCertificationPath/ApplicationSupport.png",
      import.meta.url,
    ).href,
  },
  PgMP: {
    "exam prep training": new URL(
      "../../assets/PgMPCertificationPath/PgMPExamPrepTraining.png",
      import.meta.url,
    ).href,
    "exam simulator": new URL(
      "../../assets/PgMPCertificationPath/PgMPExamSimulator.png",
      import.meta.url,
    ).href,
    "online exam prep": new URL(
      "../../assets/PgMPCertificationPath/PgMPOnlineExamPrepCourse.png",
      import.meta.url,
    ).href,
    consultation: new URL(
      "../../assets/PgMPCertificationPath/PgMPConsultation.png",
      import.meta.url,
    ).href,
    "on-demand course": new URL(
      "../../assets/PgMPCertificationPath/PgMPOnDemandCourse.png",
      import.meta.url,
    ).href,
    "application support": new URL(
      "../../assets/PgMPCertificationPath/PgMPApplicationSupport.png",
      import.meta.url,
    ).href,
  },
  PfMP: {
    "exam prep training": new URL(
      "../../assets/PfMPCertificationPath/PfMPExamPrepTraining.png",
      import.meta.url,
    ).href,
    "exam simulator": new URL(
      "../../assets/PfMPCertificationPath/PfMPExamSimulator.png",
      import.meta.url,
    ).href,
    "online exam prep": new URL(
      "../../assets/PfMPCertificationPath/PfMPOnlineExamPrepCourse.png",
      import.meta.url,
    ).href,
    consultation: new URL(
      "../../assets/PfMPCertificationPath/PfMPConsultation.png",
      import.meta.url,
    ).href,
    "application support": new URL(
      "../../assets/PfMPCertificationPath/PfMPApplicationSupport.png",
      import.meta.url,
    ).href,
    "on-demand course": new URL(
      "../../assets/PfMPCertificationPath/PfMPOnDemandCourse.png",
      import.meta.url,
    ).href,
  },
  "PMI-PMOCP": {
    "exam prep training": new URL(
      "../../assets/PMOCPCertificationPath/PMOCPExamPrepTraining.png",
      import.meta.url,
    ).href,
    "exam simulator": new URL(
      "../../assets/PMOCPCertificationPath/PMOCPExamSimulator.png",
      import.meta.url,
    ).href,
    "online exam prep": new URL(
      "../../assets/PMOCPCertificationPath/PMOCPOnlineExamPrepCourse.png",
      import.meta.url,
    ).href,
    "application support": new URL(
      "../../assets/PMOCPCertificationPath/PMOCPApplicationSupport.png",
      import.meta.url,
    ).href,
    consultation: new URL(
      "../../assets/PMOCPCertificationPath/PMOCPConsultation.png",
      import.meta.url,
    ).href,
    "on-demand course": new URL(
      "../../assets/PMOCPCertificationPath/PMOCPOnDemandCourse.png",
      import.meta.url,
    ).href,
  },
  CAPM: {
    "exam prep training": new URL(
      "../../assets/CAPMCertificationPath/CAPMExamPrepTraining.png",
      import.meta.url,
    ).href,
    "exam simulator": new URL(
      "../../assets/CAPMCertificationPath/CAPMExamSimulator.png",
      import.meta.url,
    ).href,
    "online exam prep": new URL(
      "../../assets/CAPMCertificationPath/CAPMOnlineExamPrepCourse.png",
      import.meta.url,
    ).href,
    "application support": new URL(
      "../../assets/CAPMCertificationPath/CAPMApplicationSupport.png",
      import.meta.url,
    ).href,
    consultation: new URL(
      "../../assets/CAPMCertificationPath/CAPMConsultation.png",
      import.meta.url,
    ).href,
    "on-demand course": new URL(
      "../../assets/CAPMCertificationPath/CAPMOnDemandCourse.png",
      import.meta.url,
    ).href,
  },
  "PMI-RMP": {
    "exam prep training": new URL(
      "../../assets/RMPCertificationPath/RMPExamPrepTraining.png",
      import.meta.url,
    ).href,
    "exam simulator": new URL(
      "../../assets/RMPCertificationPath/RMPExamSimulator.png",
      import.meta.url,
    ).href,
    "online exam prep": new URL(
      "../../assets/RMPCertificationPath/RMPOnlineExamPrepCourse.png",
      import.meta.url,
    ).href,
    "application support": new URL(
      "../../assets/RMPCertificationPath/RMPApplicationSupport.png",
      import.meta.url,
    ).href,
    consultation: new URL(
      "../../assets/RMPCertificationPath/PMIRMPConsultation.png",
      import.meta.url,
    ).href,
    "on-demand course": new URL(
      "../../assets/RMPCertificationPath/RMPOnDemandCourse.png",
      import.meta.url,
    ).href,
  },
};

function getCertificationImage(tab: Tab, title: string) {
  const normalizedTitle = title.toLowerCase();
  const matchedKey = Object.keys(certificationImages[tab]).find((key) =>
    normalizedTitle.includes(key),
  );

  return matchedKey ? certificationImages[tab][matchedKey] : TabImage;
}

function getCourseCtaHref(course: Course) {
  const title = course.title.toLowerCase();
  const courseKey: CourseKey | undefined = title.includes("pmi-rmp")
    ? "PMI-RMP"
    : title.includes("pmocp")
      ? "PMOCP"
      : title.includes("pgmp")
        ? "PgMP"
        : title.includes("pfmp")
          ? "PfMP"
          : title.includes("pmp")
            ? "PMP"
            : undefined;

  if (title.includes("consultation")) return CALENDLY_CONSULTATION_URL;
  if (!courseKey) return getDashboardUrl();
  if (title.includes("exam prep training")) return SHOPIFY_TRAINING_LINKS[courseKey];
  if (title.includes("exam simulator")) return getMockExamUrl(courseKey);
  if (title.includes("application support")) {
    return getCoursePagePath(courseKey, "application-support");
  }
  if (title.includes("on-demand") || title.includes("online exam prep")) {
    return getSubscriptionUrl(courseKey);
  }

  return getDashboardUrl();
}

/* ðŸ”µ Data per tab */
const tabCourses: Record<Tab, Course[]> = {
  PMP: [
    {
      id: 1,
      title: "PMP® Exam Prep Training",
      subheading: "Premier Authorized Training Partner",
      description:
        "Join expert-led online or in-person classes designed to build knowledge, confidence, and exam readiness.",
      image: TabImage,
      button:"Find A Class"
    },
    {
      id: 2,
      title: "PMP® Exam Simulator",
      description:
        "Test your readiness with realistic mock exams, timed practice, and detailed answer explanations.",
      image: TabImage,
      button:"Learn More"
    },
    {
      id: 3,
      title: "PMP® Application Support",
      description:
        "Get expert help to complete your application correctly and avoid delays or rework.",
      image: TabImage,
      button:"Learn More"
    },
    {
      id: 4,
      title: "PMP® On-Demand Course",
      description:
        "Study anytime and anywhere with guided lessons, structured modules, and flexible self-paced learning.",
      image: TabImage,
      button:"Learn More"
    },
    {
      id: 5,
      title: "Free PMP® Consultation",
      description:
        "Speak with an expert to discuss eligibility, study plans, and the best pathway to success.",
      image: TabImage,
      button:"Learn More"
    },
    {
      id: 6,
      title: "PMP® Online Exam Prep Course",
      description:
        "Prepare for the PMP® exam with our all-in-one Exam Prep bundle with access to Online Course, Practice Exams and tools that build confidence",
      image: TabImage,
      button:"Learn More"
    },
    {
      id: 7,
      title: "PMP® Exam Voucher Bundle",
      description:
        "Get Official PMIÂ® Exam Vouchers and Save on Your Exam Fees",
      image: TabImage,
      button:"Learn More"
    },
  ],
  PgMP: [
    {
      id: 1,
      title: "PgMP® Exam Prep Training",
      subheading: "Premier Authorized Training Partner",
      description:
        "Join expert-led online or in-person classes designed to build knowledge, confidence, and exam readiness.",
      image: TabImage,
      button: "Find A Class"
    },
    {
      id: 2,
      title: "PgMP® Exam Simulator",
      description:
        "Test your readiness with realistic mock exams, scenario-based practice, and detailed answer explanations.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 3,
      title: "PgMP® Online Exam Prep Course",
      description:
        "Prepare for the PgMP® exam with our all-in-one Exam Prep bundle with access to Online Course, Practice Exams and tools that build confidence",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 4,
      title: "Free PgMP® Consultation",
      description:
        "Speak with an expert to discuss eligibility, application strategy, study plans, and the best pathway to success.",
      image: TabImage,
      button: "Talk to Advisor"
    },
    {
      id: 5,
      title: "PgMP® On-Demand Course",
      description:
        "Study anytime with guided lessons, structured modules, and flexible self-paced learning aligned to the PgMP® exam.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 6,
      title: "PgMP® Application Support",
      description:
        "Get expert help to complete your PgMP® application correctly, including audit guidance and full Panel Review support.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 7,
      title: "PgMP® Exam Voucher",
      description:
        "Get Official PgMP® Exam Vouchers and Save on Your Exam Fees",
      image: TabImage,
      button: "Buy Now"
    },
  ],
  PfMP: [
    {
      id: 1,
      title: "PfMP® Exam Prep Training",
      subheading: "Premier Authorized Training Partner",
      description:
        "Join expert-led online or in-person classes designed to build knowledge, confidence, and exam readiness.",
      image: TabImage,
      button: "Find A Class"
    },
    {
      id: 2,
      title: "PfMP® Exam Simulator",
      description:
        "Test your readiness with realistic mock exams, scenario-based practice, and detailed answer explanations.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 3,
      title: "PfMP® Online Exam Prep Course",
      description:
        "Prepare for the PfMP® exam with our all-in-one Exam Prep bundle with access to Online Course, Practice Exams and tools that build confidence",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 4,
      title: "Free PfMP® Consultation",
      description:
        "Speak with an expert to discuss eligibility, application strategy, study plans, and the best pathway to success.",
      image: TabImage,
      button: "Talk to Advisor"
    },
    {
      id: 5,
      title: "PfMP® Application Support",
      description:
        "Get expert help to complete your application correctly, including audit guidance and full Panel Review support.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 6,
      title: "PfMP® On-Demand Course",
      description:
        "Study anytime with guided lessons, structured modules, and flexible self-paced learning aligned to the PgMP® exam.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 7,
      title: "PfMP® Exam Voucher",
      description:
        "Get Official PfMP® Exam Vouchers and Save on Your Exam Fees",
      image: TabImage,
      button: "Buy Now"
    },
  ],
  "PMI-PMOCP": [
    {
      id: 1,
      title: "PMI-PMOCP® Exam Prep Training",
      subheading: "Premier Authorized Training Partner",
      description:
        "Join expert-led online or in-person classes designed to build PMO leadership knowledge, confidence, and certification readiness.",
      image: TabImage,
      button: "Find A Class"
    },
    {
      id: 2,
      title: "PMI-PMOCP® Exam Simulator",
      description:
        "Test your knowledge, track your progress, and feel confident walking into the exam.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 3,
      title: "PMI-PMOCP® Online Exam Prep Bundle",
      description:
        "Get everything you need to apply and prepare for exam day with our all-in-one bundle, including online course access, practice exams, and tools that build confidence.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 4,
      title: "PMI-PMOCP® Application Support",
      description:
        "Get expert guidance to complete your PMI-PMOCP® application correctly, including audit support and eligibility assistance.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 5,
      title: "Free PMI-PMOCP® Consultation",
      description:
        "Speak with an expert to discuss eligibility, career goals, study plans, and the best pathway to success.",
      image: TabImage,
      button: "Talk to Advisor"
    },
    {
      id: 6,
      title: "PMI-PMOCP® On-Demand Course",
      description:
        "Study anytime with guided lessons, structured modules, and flexible self-paced learning aligned to the PMI-PMOCP® exam.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 7,
      title: "PMI-PMI-PMOCP® Exam Voucher",
      description:
        "Get Official PMI-PMOCP® Exam Vouchers and Save on Your Exam Fees.",
      image: TabImage,
      button: "Buy Now"
    },
  ],
  CAPM: [
    {
      id: 1,
      title: "CAPM® Exam Prep Training",
      subheading: "Premier Authorized Training Partner",
      description:
        "Join expert-led online or in-person classes designed to build advanced risk management knowledge, confidence, and certification readiness.",
      image: TabImage,
      button: "Find A Class"
    },
    {
      id: 2,
      title: "CAPM® Exam Simulator",
      description:
        "Test your knowledge, track your progress, and feel confident walking into the exam.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 3,
      title: "CAPM® Online Exam Prep Bundle",
      description:
        "Get everything you need to apply and prepare for exam day with our all-in-one bundle, including online course access, practice exams, and tools that build confidence.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 4,
      title: "CAPM® Application Support",
      description:
        "Get expert guidance to complete your CAPM® application confidently, including audit support and eligibility assistance.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 5,
      title: "Free CAPM® Consultation",
      description:
        "Speak with an expert to discuss eligibility, career goals, study plans, and the best pathway to success.",
      image: TabImage,
      button: "Talk to Advisor"
    },
    {
      id: 6,
      title: "CAPM® On-Demand Course",
      description:
        "Study anytime with guided lessons, structured modules, and flexible self-paced learning designed to advance your risk management skills and prepare you for the CAPM® exam.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 7,
      title: "CAPM® Exam Voucher",
      description:
        "Get Official PMI® Exam Vouchers and Save on Your Exam Fees.",
      image: TabImage,
      button: "Buy Now"
    },
  ],
  "PMI-RMP": [
    {
      id: 1,
      title: "PMI-RMP® Exam Prep Training",
      subheading: "Premier Authorized Training Partner",
      description:
        "Join expert-led online or in-person classes designed to build advanced risk management knowledge, confidence, and certification readiness.",
      image: TabImage,
      button: "Find A Class"
    },
    {
      id: 2,
      title: "PMI-RMP® Exam Simulator",
      description:
        "Test your knowledge, track your progress, and feel confident walking into the exam.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 3,
      title: "PMI-RMP® Online Exam Prep Bundle",
      description:
        "Get everything you need to apply and prepare for exam day with our all-in-one bundle, including online course access, practice exams, and tools that build confidence.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 4,
      title: "PMI-RMP® Application Support",
      description:
        "Get expert guidance to complete your PMI-RMP® application confidently, including audit support and eligibility assistance.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 5,
      title: "Free PMI-RMP® Consultation",
      description:
        "Speak with an expert to discuss eligibility, career goals, study plans, and the best pathway to success.",
      image: TabImage,
      button: "Talk to Advisor"
    },
    {
      id: 6,
      title: "PMI-RMP® On-Demand Course",
      description:
        "Study anytime with guided lessons, structured modules, and flexible self-paced learning designed to advance your risk management skills and prepare you for the PMI-RMP® exam.",
      image: TabImage,
      button: "Learn More"
    },
    {
      id: 7,
      title: "PMI-RMP® Exam Voucher",
      description:
        "Get Official PMIÂ® Exam Vouchers and Save on Your Exam Fees.",
      image: TabImage,
      button: "Buy Now"
    },
  ],
};

export default function CertificationTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("PMP");

  return (
    <section className="bg-light-blue py-10 md:py-14 lg:py-20">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        <div className="flex flex-col gap-2 justify-center">
        <h2 className="text-Black_light text-2xl md:text-3xl font-bold text-center ">
          Certification Path Selector
        </h2>

        <p className="text-center justify-start text-paragraph text-sm">
         Access our wide range of learning resources, exam prep materials, and practice tools designed to strengthen your preparation, boost confidence, and help you succeed on exam day.
        </p>
      </div>
        {/* Tabs */}
        <div className="flex justify-start md:justify-center gap-4 lg:gap-6 mt-6 md:mt-7 
                border-b border-[#dadada] 
                overflow-x-auto whitespace-nowrap lg:overflow-x-hidden lg:overflow-y-hidden 
                px-4 md:px-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-base md:text-lg relative transition px-2 md:px-3 ${
                activeTab === tab 
                  ? "text-Black_light after:absolute after:left-0 after:bottom-[0px] after:h-[1px] after:w-full after:bg-Black_light"
                  : "text-paragraph "
              }`}
            >
              {tab}
            </button>
          ))}
        </div> 

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 items-stretch">
  {tabCourses[activeTab].map((course) => (
    <CourseCard key={course.id} course={course} tab={activeTab} />
  ))}
</div>
      </div>
    </section>
  );
}

function CourseCard({ course, tab }: { course: Course; tab: Tab }) {
  const href = course.href ?? getCourseCtaHref(course);
  const image = getCertificationImage(tab, course.title);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <img
        src={image}
        alt={course.title}
        className="w-full aspect-[1/0.82] object-cover rounded-[20px]"
      />

      <div className="flex flex-col flex-1 mt-2.5 gap-2">
        {/* Fixed area for title + subheading */}
        <div className="min-h-[50px] flex flex-col">
          <h3 className="text-center font-semibold text-Black_light text-lg md:text-[22px]">
            {course.title}
          </h3>

          {course.subheading && (
            <p className="text-center text-Black_light text-sm md:text-base font-medium mt-1">
              {course.subheading}
            </p>
          )}
        </div>

        {/* Fixed 2-line description */}
        <p className="text-center text-paragraph text-sm md:text-base leading-[26px] md:leading-[30px] line-clamp-2 min-h-[60px]">
          {course.description}
        </p>

        {/* Button always aligned at bottom */}
        <div className="mt-auto">
          <Button className="w-full" asChild>
            <a href={href}>{course.button || "Find Out More"}</a>
          </Button>
        </div>
      </div>
    </div>
  );
}





