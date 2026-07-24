import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer?: string;
}

interface FAQCategory {
  id: number;
  title: string;
  items: FAQItem[];
}

interface FAQSectionProps {
  categories?: FAQCategory[];
  bgColor?: string;
  textColor?: string;
  titleColor?: string;
  cardBgColor?: string;
  cardBorderColor?: string;
  maxWidth?: string;
  padding?: string;
  titleSize?: string;
}

const FAQSection = ({
  categories: propCategories,
  bgColor = "bg-[#F9F7F4]",
  textColor = "text-[#1C1C1C]",
  titleColor = "text-[#0F2D63]",
  cardBgColor = "bg-white",
  cardBorderColor = "border-gray-100",
  maxWidth = "max-w-[900px]",
  padding = "py-20 lg:py-24",
  titleSize = "text-2xl",
}: FAQSectionProps) => {
  const [openItems, setOpenItems] = useState<Record<number, number | null>>({});

  const defaultCategories: FAQCategory[] = [
    {
      id: 1,
      title: "Getting Started",
      items: [
        {
          id: 1,
          question: "How do I create an account?",
          answer:
            "Creating an account is simple. Click on the 'Get Started' button, fill in your details, choose your plan, and you'll be ready to go within minutes.",
        },
        {
          id: 2,
          question: "Is there a free trial?",
          answer:
            "Yes, we offer a 14-day free trial on all plans. No credit card required. You can cancel anytime during the trial period.",
        },
        {
          id: 3,
          question: "What's the difference between Individual and Institutional accounts?",
          answer:
            "Individual accounts are designed for solo researchers and academics. Institutional accounts offer team collaboration features, multiple user seats, and dedicated account management.",
        },
      ],
    },
    {
      id: 2,
      title: "Services & Deliverables",
      items: [
        {
          id: 4,
          question: "What types of content do you produce?",
          answer:
            "We produce a wide range of content including research summaries, policy briefs, op-eds, press releases, social media content, annual reports, and strategic communication materials.",
        },
        {
          id: 5,
          question: "What's the difference between 'AI-assisted drafts' and 'expert-edited pieces'?",
          answer:
            "AI-assisted drafts are generated using our AI tools and then reviewed by our team. Expert-edited pieces are fully crafted and polished by our human editors for the highest quality output.",
        },
        {
          id: 6,
          question: "How long does it take to complete a project?",
          answer:
            "Timelines vary based on project complexity. Most projects are completed within 5-7 business days. Rush delivery is available for urgent needs.",
        },
        {
          id: 7,
          question: "Can you help with media placement?",
          answer:
            "Yes, we have relationships with media outlets and can help pitch your research or stories to journalists and publications.",
        },
      ],
    },
    {
      id: 3,
      title: "Pricing & Billing",
      items: [
        {
          id: 8,
          question: "Do you offer discounts for annual commitments?",
          answer:
            "Yes, annual commitments receive a 20% discount on all plans. Contact our sales team for more information.",
        },
        {
          id: 9,
          question: "Can we pay by invoice?",
          answer:
            "Yes, we accept invoice payments for institutional and enterprise clients. Please contact our billing team to set up invoice billing.",
        },
        {
          id: 10,
          question: "What happens if we exceed our plan limits?",
          answer:
            "You'll be notified when you're approaching your limit. Additional usage can be purchased as add-ons or you can upgrade to a higher plan.",
        },
        {
          id: 11,
          question: "Do you offer refunds?",
          answer:
            "We offer a 30-day money-back guarantee on all plans. If you're not satisfied, we'll refund your payment in full.",
        },
      ],
    },
    {
      id: 4,
      title: "Security & Confidentiality",
      items: [
        {
          id: 12,
          question: "How do you protect our intellectual property?",
          answer:
            "We take IP protection seriously. All work is conducted under strict confidentiality agreements, and you retain 100% ownership of your intellectual property.",
        },
        {
          id: 13,
          question: "Can you sign our institution's NDA?",
          answer:
            "Absolutely. We're happy to sign your institution's NDA or provide our own confidentiality agreement.",
        },
        {
          id: 14,
          question: "Where is our data stored?",
          answer:
            "All data is stored on secure, encrypted servers located in compliant data centers. We follow industry best practices for data security.",
        },
        {
          id: 15,
          question: "Who will have access to our materials?",
          answer:
            "Only the designated team members working on your project will have access to your materials. All team members are bound by confidentiality agreements.",
        },
      ],
    },
    {
      id: 5,
      title: "Team & Collaboration",
      items: [
        {
          id: 16,
          question: "Can multiple people from our organization use one account?",
          answer:
            "Institutional and enterprise plans include multiple user seats with role-based access control for your team.",
        },
        {
          id: 17,
          question: "Who will be our main point of contact?",
          answer:
            "You'll be assigned a dedicated account manager who will serve as your primary point of contact throughout our engagement.",
        },
        {
          id: 18,
          question: "Do you provide training for our team?",
          answer:
            "Yes, we offer training sessions on media engagement, science communication, and content development for your team members.",
        },
      ],
    },
    {
      id: 6,
      title: "Technical Questions",
      items: [
        {
          id: 19,
          question: "Do you integrate with other tools?",
          answer:
            "Yes, we integrate with popular tools including Slack, Microsoft Teams, Google Workspace, and various project management platforms.",
        },
        {
          id: 20,
          question: "Is there a mobile app?",
          answer:
            "We offer a mobile-friendly web application that works seamlessly on all devices. Native mobile apps are currently in development.",
        },
        {
          id: 21,
          question: "What browsers do you support?",
          answer:
            "We support all modern browsers including Chrome, Firefox, Safari, and Edge.",
        },
      ],
    },
  ];

  const categories = propCategories || defaultCategories;

  const toggleItem = (categoryId: number, itemId: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] === itemId ? null : itemId,
    }));
  };

  return (
    <section className={`${padding} ${bgColor}`}>
      <div className={`${maxWidth} mx-auto px-6`}>
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category.id}>
              <h2 className={`${titleSize} font-['Roboto'] font-bold ${titleColor} mb-6`}>
                {category.title}
              </h2>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    className={`${cardBgColor} rounded-2xl border ${cardBorderColor} shadow-sm overflow-hidden`}
                  >
                    <button
                      onClick={() => toggleItem(category.id, item.id)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className={`font-semibold ${textColor} text-base pr-4`}>
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#C85A32] shrink-0 transition-transform duration-200 ${
                          openItems[category.id] === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openItems[category.id] === item.id && item.answer && (
                      <div className="px-6 pb-6">
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;