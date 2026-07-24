export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  faqs: FaqItem[];
}

export const faqCategories: FaqCategory[] = [
  {
    id: "general",
    title: "General",
    faqs: [
      {
        question: "What does vCare Project Management offer?",
        answer:
          "vCare Project Management provides certification training, exam simulators, on-demand learning, application support, practice resources, flashcards, and PDUs for project management professionals.",
      },
      {
        question: "Which certifications do you support?",
        answer:
          "We support multiple project management certifications, including PMP, PgMP, PfMP, PMI-RMP, and PMOCP, along with related learning and renewal resources.",
      },
      {
        question: "How do I know which course is right for me?",
        answer:
          "You can compare course pages or book a free consultation. Our team can help you choose the right learning path based on your certification goal, experience, timeline, and current preparation level.",
      },
      {
        question: "Can I contact support if my question is not listed here?",
        answer:
          "Yes. If you do not find the answer you need, please contact us and our support team will help you.",
      },
    ],
  },
  {
    id: "exam-prep",
    title: "Exam Prep Courses",
    faqs: [
      {
        question: "Are the exam prep courses aligned with the latest exam content?",
        answer:
          "Yes. Our courses are designed around the latest exam content outlines, certification standards, and current exam expectations.",
      },
      {
        question: "Do the courses include practice questions?",
        answer:
          "Yes. Courses include exam-focused learning resources and practice support to help you reinforce concepts and prepare with confidence.",
      },
      {
        question: "Can beginners join the exam prep courses?",
        answer:
          "Yes. The courses are structured to support learners who are beginning their preparation as well as professionals who need focused revision.",
      },
      {
        question: "Do I get guidance on how to study for the exam?",
        answer:
          "Yes. The training includes structured guidance, study direction, and exam-focused preparation support.",
      },
    ],
  },
  {
    id: "exam-simulators",
    title: "Exam Simulators",
    faqs: [
      {
        question: "What is included in the exam simulator?",
        answer:
          "The exam simulator includes practice questions, mock exam style preparation, and tools designed to help you assess readiness and improve exam confidence.",
      },
      {
        question: "Are simulator questions similar to the real exam?",
        answer:
          "The questions are designed to reflect exam-style thinking, scenario-based reasoning, and the structure of current certification exams.",
      },
      {
        question: "Can I use the simulator for final exam review?",
        answer:
          "Yes. The simulator is useful for both ongoing preparation and final readiness checks before exam day.",
      },
      {
        question: "Will I be able to identify weak areas?",
        answer:
          "Yes. Practice results help you identify knowledge gaps so you can focus your review on the areas that need more attention.",
      },
    ],
  },
  {
    id: "on-demand",
    title: "On-Demand Courses",
    faqs: [
      {
        question: "Are the on-demand courses self-paced?",
        answer:
          "Yes. On-demand courses are designed for flexible self-paced learning so you can study at a time that works for you.",
      },
      {
        question: "Can I access on-demand courses from different devices?",
        answer:
          "Yes. On-demand learning is built for convenient access across supported devices.",
      },
      {
        question: "Do on-demand courses help with exam preparation?",
        answer:
          "Yes. They are structured to build certification knowledge, reinforce exam concepts, and support your preparation journey.",
      },
    ],
  },
  {
    id: "application-support",
    title: "Application Support",
    faqs: [
      {
        question: "What is application support?",
        answer:
          "Application support helps you prepare, review, and strengthen your certification application before submission.",
      },
      {
        question: "Can you help if my application is selected for audit?",
        answer:
          "Yes. We provide guidance to help you understand audit requirements and prepare the necessary supporting information.",
      },
      {
        question: "Do you write the application for me?",
        answer:
          "We guide, review, and support your application, but the information submitted must accurately reflect your own professional experience.",
      },
    ],
  },
  {
    id: "flashcards",
    title: "Flashcards",
    faqs: [
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
          "Yes. The flash cards are mobile-friendly for convenient revision on the go.",
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
    ],
  },
  {
    id: "pdus",
    title: "PDUs",
    faqs: [
      {
        question: "What are PDUs?",
        answer:
          "PDUs are Professional Development Units used by credential holders to maintain eligible PMI certifications.",
      },
      {
        question: "Can PDUs be used for certification renewal?",
        answer:
          "Yes. Eligible PDUs can support certification renewal requirements based on the rules for your credential.",
      },
      {
        question: "Do I receive proof of completion?",
        answer:
          "Completion and access details depend on the selected program. Please review the specific PDU page or contact support for details.",
      },
    ],
  },
  {
    id: "account-access",
    title: "Account & Access",
    faqs: [
      {
        question: "How do I access my purchased resources?",
        answer:
          "After purchase or enrollment, you can access eligible resources through your account or the designated learning portal.",
      },
      {
        question: "What should I do if I forget my password?",
        answer:
          "Use the forgot password option on the login page to reset your password. If you still need help, contact support.",
      },
      {
        question: "Who should I contact for billing or access issues?",
        answer:
          "Please contact our support team with your account details and the issue you are facing so we can assist you.",
      },
    ],
  },
];

export const allFaqs: FaqItem[] = faqCategories.flatMap(
  (category) => category.faqs,
);
