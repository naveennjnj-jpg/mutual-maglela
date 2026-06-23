import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavHeroSection from "@/components/ReusableComponents/NavPageHeroSection/NavHeroSection";
import InnerPage from "@/assets/inner-page.jpg";
import StartFreeTrial from "@/components/ReusableComponents/StartFreeTrial/StartFreeTrial";
import Testimonials from "@/components/ReusableComponents/TestimonialsSection/Testimonials";
import ScreenshortsSlider from "@/components/ReusableComponents/ScreenshortsSlider/ScreenshortsSlider";
import TraningImage from "@/assets/training-image.png";
import {
  ChartIcon,
  ClockIcon,
  ComIcon,
  DetailIcon,
  ExamsIcon,
  FlashCardIcon,
  GreenTickIcon,
} from "@/utils/svgicons";
import TopFooterSection from "@/components/ReusableComponents/TopFooterSection/TopFooterSection";
import { Button } from "@/components/ui/button";
import { getSubscriptionUrl } from "@/utils/links";

const flashCard = {
  cards: [
    {
      id: 1,
      icon: FlashCardIcon,
      title: "Organized by Categories",
      description: "Review cards grouped by categories for focused preparation",
    },
    {
      id: 2,
      icon: ComIcon,
      title: "Formulas & Key Concepts Included",
      description:
        "Core formulas, essential frameworks and high-impact concepts aligned with your exam",
    },
    {
      id: 3,
      icon: ExamsIcon,
      title: "Scenario-Based Prompts",
      description: "Practice thinking in PMI-style question formats",
    },
    {
      id: 4,
      icon: ClockIcon,
      title: "Quick Revision",
      description: "Perfect for short study sessions and knowledge refresh",
    },
    {
      id: 5,
      icon: ChartIcon,
      title: "Top-Rated Cards",
      description:
        "Study the highest-rated cards to focus on high-impact topics",
    },
    {
      id: 6,
      icon: DetailIcon,
      title: "Boost Exam Confidence",
      description:
        "Strengthen knowledge recall and identify gaps before exam day with focused, bite-sized learning.",
    },
  ],
};

const SampleFlashCard = [
  {
    title: "Front Side",
    description:
      "A question or key concept prompts you to think and respond before revealing the answer, training your exam mindset.",
  },
  {
    title: "Back Side",
    description:
      "A concise, easy-to-understand explanation helps reinforce concepts and eliminate confusion.",
  },
];

const Knowledge = [
  "Reinforce key concepts and terminology",
  "Improve recall speed for scenario-based questions",
  "Strengthen formula and process knowledge",
  "Support spaced repetition for long-term retention",
  "Ideal for quick daily revision sessions",
];

const WhatIncluded = [
  "Formulas & key calculations",
  "Acronyms & glossary terms",
  "Exam tips & confusion busters",
  "High-impact screenshots and visuals",
];

const flashcardLinks = [
  { title: "Explore PMP® Flashcards", href: getSubscriptionUrl("PMP") },
  { title: "Explore PgMP® Flashcards", href: getSubscriptionUrl("PgMP") },
  { title: "Explore PfMP® Flashcards", href: getSubscriptionUrl("PfMP") },
  { title: "Explore PMOCP Flashcards", href: getSubscriptionUrl("PMOCP") },
  {
    title: "Explore PMI-RMP® Flashcards",
    href: getSubscriptionUrl("PMI-RMP"),
  },
];

const allFaqs = [
  {
    question: "Are these flash cards aligned with the latest exam?",
    answer:
      "Yes. The content is aligned with the current Exam Content Outline and reflects updated industry practices.",
  },
  {
    question: "How many flash cards are included?",
    answer:
      "You receive access to a comprehensive collection of structured flash cards across all exam domains, with content continuously updated.",
  },
  {
    question: "Can I access the flash cards on mobile?",
    answer:
      "Yes. The flash cards are fully mobile-friendly for convenient revision on the go.",
  },
  {
    question: "Are formulas and key definitions included?",
    answer:
      "Yes. Important formulas, definitions, frameworks, and core concepts are included for quick recall and reinforcement.",
  },
  {
    question: "Are these enough to pass the certification exam?",
    answer:
      "Flash cards are an excellent revision tool. For full preparation, they work best alongside structured training and mock exams.",
  },
  {
    question: "How long do I get access?",
    answer: "Access details depend on your purchase plan.",
  },
  {
    question: "Are the flash cards suitable for last-minute revision?",
    answer:
      "Absolutely. They are ideal for quick review sessions, helping reinforce high-impact concepts before exam day.",
  },
  {
    question: "Are the flash cards updated regularly?",
    answer:
      "Yes. Content is periodically reviewed and updated to reflect evolving exam requirements.",
  },
];

const FlashCards = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const navigate = useNavigate();

  return (
    <>
      <NavHeroSection
        title="Flash Cards for Accelerated Exam Success"
        description="Master key concepts quickly and effectively. Designed for focused revision and rapid knowledge reinforcement, these flash cards help strengthen retention, improve recall, and reinforce critical concepts, frameworks, formulas, terminology, and exam-focused knowledge aligned with the latest certification standards and exam content outlines."
        descriptionsecond="Whether you're in the early stages of preparation or completing your final review before the exam, our flash cards help you study smarter, retain more information, and build confidence for exam success."
        sideImage={InnerPage}
      />

      <section className="bg-white py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="flex flex-col justify-center items-center mb-6 md:mb-7 text-center">
            <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
              Why Use Flash Cards?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
            {flashCard.cards.map((card) => (
              <div
                key={card.id}
                className="p-5 bg-light-blue rounded-[20px] text-center transition"
              >
                <div className="w-[60px] h-[60px] flex items-center justify-center m-auto relative bg-white rounded-[99px] outline outline-1 outline-offset-[-1px] outline-[#4c8dea]">
                  <card.icon />
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
          <div className="flex flex-col justify-start items-start gap-2 text-left">
            <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
              Flashcards Designed for Exam Success
            </h2>
            <p className="text-paragraph text-sm font-normal leading-[26px]">
              Flashcards are an effective and convenient study tool designed to
              support focused learning and improve knowledge retention. They
              present essential concepts, terminology, frameworks, formulas,
              processes, and key exam topics in a concise, easy-to-remember
              format, making complex information easier to understand and
              recall.
            </p>
            <p className="text-paragraph text-sm font-normal leading-[26px]">
              Each flashcard is designed with a question, concept, term,
              formula, or scenario on one side and a clear explanation or answer
              on the other, helping reinforce learning, strengthen memory, and
              improve exam readiness. Whether you're studying during your daily
              commute, reviewing during short breaks, or completing final exam
              preparation, flashcards provide a flexible and efficient way to
              revise critical content and build confidence for exam success.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="flex flex-col justify-center items-center mb-6">
            <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px] text-center">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 md:gap-y-5">
            {SampleFlashCard.map((item, index) => (
              <div
                key={index}
                className="p-5 md:p-7 bg-light-blue text-center transition"
              >
                <h4 className="text-Black_light text-base md:text-xl font-bold mb-2">
                  {item.title}
                </h4>
                <p className="text-paragraph text-sm font-normal leading-6">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light-blue py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-5 lg:gap-10 items-center">
            <div>
              <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px] mb-3">
                Expand Your Recall with Digestible Knowledge
              </h2>
              <ul className="space-y-1 self-stretch justify-start text-paragraph text-sm font-normal leading-[26px] ml-1">
                {Knowledge.map((text, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 self-stretch justify-start"
                  >
                    <span className="text-[8px]">•</span> <span>{text}</span>
                  </li>
                ))}
              </ul>
              <h4 className="text-Black_light text-xl font-bold mt-6 mb-5">
                What's Included
              </h4>
              <div className="mt-3 space-y-3">
                {WhatIncluded.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-paragraph text-sm"
                  >
                    <span>
                      <GreenTickIcon />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src={TraningImage}
                alt="Training"
                className="rounded-3xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="flex flex-col justify-center items-center mb-6 md:mb-7 text-center">
            <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
              Explore Flashcards by Certification
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {flashcardLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="min-h-28 p-5 bg-light-blue rounded-[20px] flex items-center justify-center text-center text-primary_heading text-base font-bold hover:shadow-md transition"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <ScreenshortsSlider id="four" />
      <Testimonials id="two" />
      <StartFreeTrial />
      <section className="pb-10 md:pb-14 lg:pb-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px] mb-7">
            Frequently Asked Questions
          </h2>

          <div className="border-b border-gray-200 divide-y divide-gray-200">
            {allFaqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="py-4 md:py-6">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="text-black text-sm md:text-base lg:text-xl font-semibold">
                      {faq.question}
                    </span>

                    <svg
                      className={`w-4 h-4 transition-transform duration-300 text-paragraph ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isOpen && (
                    <p className="mt-4 text-paragraph text-sm md:text-base leading-[26px] md:leading-[30px]">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-7">
            <Button onClick={() => navigate("/faq")}>View all FAQs</Button>
          </div>
        </div>
      </section>

      <TopFooterSection
        content={{
          title: (
            <>
              Flash Cards <br /> That Build Exam Confidence
            </>
          ),
          description:
            " Reinforce critical concepts with structured, category-based flash cards designed for focused revision and lasting retention.",
          points: [
            "Quick review, anytime access",
            "Key formulas and definitions included",
            "Target high-impact exam topics",
            "Designed to support smarter preparation",
          ],
          buttonText: "Start Learning",
          buttonLink: getSubscriptionUrl("PMP"),
        }}
      />
    </>
  );
};

export default FlashCards;
