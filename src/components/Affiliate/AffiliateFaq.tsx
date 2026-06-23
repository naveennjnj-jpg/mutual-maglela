import { useState } from "react";

const faqs = [
  {
    question: "What is the vCare Affiliate Program?",
    answer:
      "The vCare Affiliate Program allows individuals and organizations to earn commissions by referring customers to eligible vCare training programs, certification courses, mentoring services, exam simulators, and professional development solutions.",
  },
  {
    question: "Who can become an affiliate?",
    answer:
      "Anyone with a professional network or audience interested in project management, program management, portfolio management, PMO leadership, agile delivery, risk management, business analysis, leadership, or professional certifications may apply to join the program.",
  },
  {
    question: "Is there a cost to join?",
    answer: "No. Joining the vCare Affiliate Program is free.",
  },
  {
    question: "How do I earn commissions?",
    answer:
      "You earn commissions when a customer uses your affiliate referral link and successfully purchases an eligible vCare product or service in accordance with the affiliate program terms.",
  },
  {
    question: "What products can I promote?",
    answer:
      "Affiliates can promote a wide range of products and services, including certification training programs, mentoring services, exam simulators, self-paced courses, PDU bundles, and corporate training solutions.",
  },
  {
    question: "Do I need to provide training or customer support?",
    answer:
      "No. vCare manages all aspects of enrollment, training delivery, learner support, mentoring, assessments, and customer service.",
  },
  {
    question: "How are referrals tracked?",
    answer:
      "Each affiliate receives a unique referral link that enables eligible referrals and purchases to be tracked through our affiliate system.",
  },
  {
    question: "When are commissions paid?",
    answer:
      "Commission payment schedules and eligibility requirements are outlined in the affiliate agreement and partner onboarding documentation.",
  },
  {
    question: "Can I promote internationally?",
    answer:
      "Yes. Our programs are delivered globally, allowing affiliates to refer professionals and organizations from different countries and regions.",
  },
  {
    question: "Is there a limit to how much I can earn?",
    answer:
      "No. Your earning potential depends entirely on the number and value of successful referrals generated through your affiliate activities.",
  },
  {
    question: "How do I become an affiliate?",
    answer:
      "Complete the Contact Us form and our team will contact you with program details, onboarding information, and your affiliate referral link.",
  },
];

export default function AffiliateFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-10 md:py-14 lg:py-20">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px] mb-7">
          Frequently Asked Questions
        </h2>

        <div className="border-b border-gray-200 divide-y divide-gray-200">
          {faqs.map((faq, index) => {
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
      </div>
    </section>
  );
}
