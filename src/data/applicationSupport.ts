import type { FaqItem } from "@/data/faqs";

export type ApplicationSupportContent = {
  title: string;
  heroDescription: string;
  heading: string;
  introNote?: string;
  paragraphs: string[];
  price: string;
  faqs: FaqItem[];
};

const sharedFaqs: FaqItem[] = [
  {
    question: "Why should I use application support?",
    answer:
      "It saves time, reduces confusion, and gives you confidence that your application is clear, complete, professionally reviewed, and aligned with PMI expectations.",
  },
  {
    question: "Can I speak with an expert if I need help?",
    answer:
      "Yes. You will have access to experienced PMI-certified professionals who can discuss your questions and guide you through the process.",
  },
];

export const applicationSupportContent = {
  pmp: {
    title: "PMP® Application Support",
    heroDescription:
      "End-to-end support for the PMP® application process, fully aligned with PMI expectations, helping applicants submit a strong, compliant application with confidence - backed by an Application Approval Guarantee.",
    heading:
      "Best Step-by-Step Guide with Examples, Tips, and Audit & Application Success Guarantee",
    introNote: "Included Free with Any Live Class Enrollment.",
    price: "$299",
    paragraphs: [
      "Completing the PMP® application can be confusing and time-consuming, especially if you are applying for the first time. Many experienced professionals struggle not with eligibility, but with clearly presenting their project experience in line with PMI's expectations. Our PMP® Application Support Package is designed to simplify the process and help you submit a strong, compliant application with confidence.",
      "This support guides you step by step through the PMP® application process, explaining what PMI looks for in each section and how to describe your experience using the right structure and terminology. You'll receive practical tips and real-world guidance to help you avoid common mistakes that can lead to delays, audits, or rework.",
      "The package includes two real-life examples of successful PMP® applications, giving you a clear benchmark for the level of detail and wording expected by PMI. You'll also receive a writable sample application template that helps you organize your project experience before entering it into the PMI system, making the process smoother and more efficient.",
      "Once your draft is ready, your application will be reviewed by a PMP®-certified Subject Matter Expert, who will provide personalized feedback and recommendations to strengthen clarity, alignment, and compliance.",
      "To give you complete peace of mind, this package includes a Guaranteed Application Pass, ensuring your application is professionally refined to meet PMI submission standards. In the event of an audit, we also provide a Guaranteed Audit Support Service, guiding you through every step of the audit process with the right documentation and responses until successfully cleared.",
      "With expert guidance, proven examples, professional review, and guaranteed support, this package removes uncertainty and helps you move forward with confidence toward your PMP® certification.",
    ],
    faqs: [
      {
        question: "What is included in the PMP® Application Support Package?",
        answer:
          "This package includes end-to-end support for your PMP® application, including eligibility guidance, application drafting support, experience write-up refinement, PMI-aligned formatting, expert review, and audit support.",
      },
      {
        question: "Can you help me write my application from scratch?",
        answer:
          "Yes. Full support is available to help develop your PMP® application from scratch. Based on your experience, we help structure your project descriptions, align them with PMI expectations, and create a strong, submission-ready application.",
      },
      {
        question: "How does this package improve my chances of approval?",
        answer:
          "The package helps present your project management experience in the right format, uses PMI-aligned language, and ensures your application is complete, clear, and compliant before submission.",
      },
      {
        question: "Do you provide support if my application is selected for audit?",
        answer:
          "Yes. If your application is selected for PMI audit, full support is provided to guide you through the documentation process, required forms, and successful submission.",
      },
      {
        question: "How long does the application support process take?",
        answer:
          "The timeline depends on your readiness and experience details. In many cases, a draft can be reviewed and refined quickly, allowing you to submit your application with confidence in a short timeframe.",
      },
      ...sharedFaqs,
    ],
  },
  pgmp: {
    title: "PgMP® Application Support",
    heroDescription:
      "End-to-end support for the PgMP® application process, fully aligned with PMI expectations, helping applicants submit a strong application with confidence - including full Panel Review support and a Panel Approval Guarantee.",
    heading: "Full Application Support, Panel Review Support & Pass Guarantee",
    introNote: "Included Free with Any Live Class Enrollment.",
    price: "$299",
    paragraphs: [
      "Completing the PgMP® application can be complex and time-consuming, especially for first-time applicants. Many highly experienced professionals meet the eligibility requirements but struggle to clearly present their program management experience in line with PMI's expectations. Our PgMP® Application Support Package is designed to simplify the process and help you submit a strong, compliant application with confidence.",
      "This support guides you step by step through the PgMP® application process, explaining what PMI looks for in each section and how to describe your program experience using the right structure, language, and strategic focus. You'll receive practical tips and expert guidance to help you avoid common mistakes that can lead to delays, audits, rework, or rejection.",
      "The package includes real-life examples for a successful PgMP® application, giving you a clear benchmark for the level of detail, leadership focus, and benefits-driven wording expected by PMI. You'll also receive a writable sample application template that helps you organize your program experience before entering it into the PMI system, making the process smoother and more efficient.",
      "Your application will be reviewed by a PgMP® certified Subject Matter Expert, who will provide personalized feedback and recommendations to strengthen clarity, alignment, and compliance.",
      "To give you complete peace of mind, this package includes a Guaranteed Application Pass, ensuring your application is professionally refined to meet PMI submission standards. In the event of an audit, we also provide Guaranteed Audit Support, guiding you through every step of the audit process until successfully cleared.",
      "Most importantly, because the PgMP® certification includes the Panel Review stage, we provide full Panel Review Support, helping you prepare strong competency-based responses aligned with PMI expectations. This includes expert coaching, response refinement, and strategic positioning of your program leadership experience. We also include a Panel Review Pass Guarantee, giving you confidence through one of the most challenging stages of the PgMP® journey.",
      "With expert guidance, proven examples, professional review, guaranteed support, and end-to-end assistance through the Panel Review, this package removes uncertainty and helps you move forward with confidence toward your PgMP® certification.",
    ],
    faqs: [
      {
        question: "What is included in the PgMP® Application Support Package?",
        answer:
          "The package includes end-to-end support for your PgMP® application, including eligibility guidance, application drafting support, experience write-up refinement, PMI-aligned formatting, expert review, audit support, and full Panel Review support.",
      },
      {
        question: "Can you help me write my application from scratch?",
        answer:
          "Yes. Full support is available to help develop your PgMP® application from scratch. Based on your experience, we help structure your program descriptions, align them with PMI expectations, and create a strong, submission-ready application.",
      },
      {
        question: "How does this package help with the PgMP® Panel Review?",
        answer:
          "The package includes dedicated Panel Review support, helping you strengthen your program management narratives, align responses with PMI expectations, and present your strategic leadership experience effectively.",
      },
      {
        question: "Do you provide support if my application is selected for audit?",
        answer:
          "Yes. If your application is selected for PMI audit, full support is provided to guide you through the documentation process, required forms, and successful submission.",
      },
      {
        question: "How long does the application support process take?",
        answer:
          "The timeline depends on your readiness and experience details. In many cases, a draft can be reviewed and refined quickly, allowing you to submit your application with confidence in a short timeframe.",
      },
      ...sharedFaqs,
    ],
  },
  pfmp: {
    title: "PfMP® Application Support",
    heroDescription:
      "End-to-end support for the PfMP® application process, fully aligned with PMI expectations, helping applicants submit a strong application with confidence - including full Panel Review support and a Panel Approval Guarantee.",
    heading: "Full Application Support, Panel Review Support & Pass Guarantee",
    introNote: "Included Free with Any Live Class Enrollment.",
    price: "$199",
    paragraphs: [
      "Completing the PfMP® application can be complex and time-consuming, especially for first-time applicants. Many highly experienced professionals meet the eligibility requirements but struggle to clearly present their program management experience in line with PMI's expectations. Our PfMP® Application Support Package is designed to simplify the process and help you submit a strong, compliant application with confidence.",
      "This support guides you step by step through the PfMP® application process, explaining what PMI looks for in each section and how to describe your program experience using the right structure, language, and strategic focus. You'll receive practical tips and expert guidance to help you avoid common mistakes that can lead to delays, audits, rework, or rejection.",
      "The package includes real-life examples for a successful PfMP® application, giving you a clear benchmark for the level of detail, leadership focus, and benefits-driven wording expected by PMI. You'll also receive a writable sample application template that helps you organize your program experience before entering it into the PMI system, making the process smoother and more efficient.",
      "Your application will be reviewed by a PfMP® certified Subject Matter Expert, who will provide personalized feedback and recommendations to strengthen clarity, alignment, and compliance.",
      "To give you complete peace of mind, this package includes a Guaranteed Application Pass, ensuring your application is professionally refined to meet PMI submission standards. In the event of an audit, we also provide Guaranteed Audit Support, guiding you through every step of the audit process until successfully cleared.",
      "Most importantly, because the PfMP® certification includes the Panel Review stage, we provide full Panel Review Support, helping you prepare strong competency-based responses aligned with PMI expectations. This includes expert coaching, response refinement, and strategic positioning of your program leadership experience. We also include a Panel Review Pass Guarantee, giving you confidence through one of the most challenging stages of the PfMP® journey.",
      "With expert guidance, proven examples, professional review, guaranteed support, and end-to-end assistance through the Panel Review, this package removes uncertainty and helps you move forward with confidence toward your PfMP® certification.",
    ],
    faqs: [
      {
        question: "What is included in the PfMP® Application Support Package?",
        answer:
          "The package provides end-to-end support for your PfMP® application, including eligibility guidance, application drafting support, experience write-up refinement, PMI-aligned formatting, expert review, audit support, and full Panel Review support.",
      },
      {
        question: "Can you help me write my application from scratch?",
        answer:
          "Yes. Full support is available to help develop your PfMP® application from scratch. Based on your experience, we help structure your portfolio descriptions, align them with PMI expectations, and create a strong, submission-ready application.",
      },
      {
        question: "How does this package help with the PfMP® Panel Review?",
        answer:
          "The package includes dedicated Panel Review support, helping you strengthen your portfolio management narratives, align responses with PMI expectations, and present your strategic leadership experience effectively.",
      },
      {
        question: "Do you provide support if my application is selected for audit?",
        answer:
          "Yes. If your application is selected for PMI audit, full support is provided to guide you through the documentation process, required forms, and successful submission.",
      },
      {
        question: "How long does the application support process take?",
        answer:
          "The timeline depends on your readiness and experience details. In many cases, a draft can be reviewed and refined quickly, allowing you to submit your application with confidence in a short timeframe.",
      },
      ...sharedFaqs,
    ],
  },
  pmiRmp: {
    title: "PMI-RMP® Application Support",
    heroDescription:
      "End-to-end support for the PMI-RMP® application process, fully aligned with PMI expectations, helping applicants apply with confidence.",
    heading:
      "Best Step-by-Step Guide with Examples, Tips, and Audit & Application Success Guarantee",
    introNote: "Included Free with Any Live Class Enrollment.",
    price: "$199",
    paragraphs: [
      "Completing the PMI-RMP® application can be confusing and time-consuming, especially for first-time applicants. Many experienced professionals meet the eligibility requirements but struggle to clearly present their risk management experience in line with PMI's expectations. Our PMI-RMP® Application Support Package is designed to simplify the process and help you submit a strong, compliant application with confidence.",
      "This support guides you step by step through the PMI-RMP® application process, explaining what PMI looks for in each section and how to describe your risk management experience using the right structure, language, and terminology. You'll receive practical tips and expert guidance to help you avoid common mistakes that can lead to delays, audits, rework, or rejection.",
      "The package includes real-life examples of successful PMI-RMP® applications, giving you a clear benchmark for the level of detail and wording expected by PMI. You'll also receive a writable sample application template that helps you organize your risk management experience before entering it into the PMI system, making the process smoother and more efficient.",
      "Once your draft is ready, your application will be reviewed by a PMI-RMP®-certified Subject Matter Expert, who will provide personalized feedback and recommendations to strengthen clarity, alignment, and compliance.",
      "To give you complete peace of mind, this package includes a Guaranteed Application Pass, ensuring your application is professionally refined to meet PMI submission standards. In the event of an audit, we also provide Guaranteed Audit Support, guiding you through every step of the audit process with the right documentation and responses until successfully cleared.",
      "With expert guidance, proven examples, professional review, and guaranteed support, this package removes uncertainty and helps you move forward with confidence toward your PMI-RMP® certification.",
    ],
    faqs: [
      {
        question: "What is included in the PMI-RMP® Application Support Package?",
        answer:
          "The package provides end-to-end support for your PMI-RMP® application, including eligibility guidance, application drafting support, experience write-up refinement, PMI-aligned formatting, expert review, and audit support.",
      },
      {
        question: "Can you help me write my application from scratch?",
        answer:
          "Yes. Full support is available to help develop your PMI-RMP® application from scratch. Based on your experience, we help structure your risk management experience, align it with PMI expectations, and create a strong, submission-ready application.",
      },
      {
        question: "How does this package improve my chances of approval?",
        answer:
          "The package helps present your risk management experience in the right format, uses PMI-aligned language, and ensures your application is complete, clear, and compliant before submission.",
      },
      {
        question: "Do you provide support if my application is selected for audit?",
        answer:
          "Yes. If your application is selected for PMI audit, full support is provided to guide you through the documentation process, required forms, and successful submission.",
      },
      {
        question: "How long does the application support process take?",
        answer:
          "The timeline depends on your readiness and experience details. In many cases, a draft can be reviewed and refined quickly, allowing you to submit your application with confidence in a short timeframe.",
      },
      ...sharedFaqs,
    ],
  },
  pmocp: {
    title: "PMI-PMOCP™ Application Support",
    heroDescription:
      "End-to-end support for the PMOCP™ application process, fully aligned with PMI expectations, helping applicants apply with confidence.",
    heading:
      "Best Step-by-Step Guide with Examples, Tips, and Audit & Application Success Guarantee",
    introNote: "Included Free with Any Live Class Enrollment.",
    price: "$199",
    paragraphs: [
      "Completing the PMOCP™ application can be confusing and time-consuming, especially for first-time applicants. Many experienced professionals meet the eligibility requirements but struggle to clearly present their PMO leadership, governance, and organizational support experience in line with PMI's expectations. Our PMOCP™ Application Support Package is designed to simplify the process and help you submit a strong, compliant application with confidence.",
      "This support guides you step by step through the PMOCP™ application process, explaining what PMI looks for in each section and how to describe your PMO experience using the right structure, language, and terminology. You'll receive practical tips and expert guidance to help you avoid common mistakes that can lead to delays, audits, rework, or rejection.",
      "The package includes real-life examples of successful PMOCP™ applications, giving you a clear benchmark for the level of detail and wording expected by PMI. You'll also receive a writable sample application template that helps you organize your PMO leadership and governance experience before entering it into the PMI system, making the process smoother and more efficient.",
      "Once your draft is ready, your application will be reviewed by a PMOCP™-qualified Subject Matter Expert, who will provide personalized feedback and recommendations to strengthen clarity, alignment, and compliance.",
      "To give you complete peace of mind, this package includes a Guaranteed Application Pass, ensuring your application is professionally refined to meet PMI submission standards. In the event of an audit or verification request, we also provide Guaranteed Audit Support, guiding you through every step of the process with the right documentation and responses until successfully cleared.",
      "With expert guidance, proven examples, professional review, and guaranteed support, this package removes uncertainty and helps you move forward with confidence toward your PMOCP™ credential.",
    ],
    faqs: [
      {
        question: "What is included in the PMOCP™ Application Support Package?",
        answer:
          "The package provides end-to-end support for your PMOCP™ application, including eligibility guidance, application drafting support, experience write-up refinement, PMI-aligned formatting, expert review, and audit or verification support.",
      },
      {
        question: "Can you help me write my application from scratch?",
        answer:
          "Yes. Full support is available to help develop your PMOCP™ application from scratch. Based on your experience, we help structure your PMO leadership, governance, and organizational support experience, align it with PMI expectations, and create a strong, submission-ready application.",
      },
      {
        question: "How does this package improve my chances of approval?",
        answer:
          "The package helps present your PMO experience in the right format, uses PMI-aligned language, and ensures your application is complete, clear, and compliant before submission.",
      },
      {
        question:
          "Do you provide support if my application is selected for audit or verification?",
        answer:
          "Yes. If your application is selected for audit or verification, full support is provided to guide you through the documentation process, required forms, and successful submission.",
      },
      {
        question: "How long does the application support process take?",
        answer:
          "The timeline depends on your readiness and experience details. In many cases, a draft can be reviewed and refined quickly, allowing you to submit your application with confidence in a short timeframe.",
      },
      ...sharedFaqs,
    ],
  },
  other: {
    title: "PMI Application Support",
    heroDescription:
      "End-to-end support for the application process, fully aligned with PMI expectations, helping applicants submit a strong application with confidence.",
    heading:
      "Best Step-by-Step Guide with Examples, Tips, and Audit & Application Success Guarantee",
    price: "$199",
    paragraphs: [
      "The application confirms candidates meet strict eligibility criteria, making the certification more valuable to employers. However, completing the application can be confusing and time-consuming, especially when presenting experience in line with PMI expectations.",
      "This support guides you step by step through the application process, explaining what PMI looks for in each section and how to describe your experience using the right structure, language, and terminology. You'll receive practical tips and expert guidance to help you avoid common mistakes that can lead to delays, audits, rework, or rejection.",
      "The package includes real-life examples of successful applications, giving you a clear benchmark for the level of detail and wording expected by PMI. You'll also receive a writable sample application template that helps you organize your experience before entering it into the PMI system, making the process smoother and more efficient.",
      "We support professionals across PMI-ACP®, PMI-PBA®, PMI-SP®, CAPM®, PMI-RMP®, and other eligible PMI certifications.",
      "Your draft will be reviewed by a certified expert who provides personalized feedback to improve clarity and alignment. The package also includes Guaranteed Application Support and full Audit Support, helping you navigate submission or audit requirements with confidence.",
      "With expert guidance, proven examples, professional review, and guaranteed support, this package removes uncertainty and helps you move forward with confidence toward your credential.",
    ],
    faqs: [
      {
        question: "What is included in the Application Support Package?",
        answer:
          "The package provides end-to-end support for your application, including eligibility guidance, application drafting support, experience write-up refinement, PMI-aligned formatting, expert review, and audit support.",
      },
      {
        question: "Can you help me write my application from scratch?",
        answer:
          "Yes. Full support is available to help develop your application from scratch. Based on your experience, we help structure your agile project experience, align it with PMI expectations, and create a strong, submission-ready application.",
      },
      {
        question: "How does this package improve my chances of approval?",
        answer:
          "The package helps present your agile experience in the right format, uses PMI-aligned language, and ensures your application is complete, clear, and compliant before submission.",
      },
      {
        question: "Do you provide support if my application is selected for audit?",
        answer:
          "Yes. If your application is selected for PMI audit, full support is provided to guide you through the documentation process, required forms, and successful submission.",
      },
      {
        question: "How long does the application support process take?",
        answer:
          "The timeline depends on your readiness and experience details. In many cases, a draft can be reviewed and refined quickly, allowing you to submit your application with confidence in a short timeframe.",
      },
      ...sharedFaqs,
    ],
  },
} satisfies Record<string, ApplicationSupportContent>;
