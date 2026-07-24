import React, { useState } from "react";
import { ChevronDown, CircleCheckBig } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer?: string;
}

interface FeatureItem {
  id: number;
  text: string;
}

interface GeneralFAQProps {
  badge?: string;
  title?: string;
  faqs?: FAQItem[];
  sidebarBadge?: string;
  sidebarTitle?: string;
  sidebarFeatures?: FeatureItem[];
  bgColor?: string;
  textColor?: string;
  badgeColor?: string;
  faqBorderColor?: string;
  sidebarBgColor?: string;
  sidebarTextColor?: string;
  sidebarFeatureColor?: string;
  maxWidth?: string;
  padding?: string;
  titleSize?: string;
}

const GeneralFAQ = ({
  badge = "Common Questions",
  title = "Frequently Asked Questions",
  faqs: propFaqs,
  sidebarBadge = "Our Difference",
  sidebarTitle = "Why Choose Magalela Media?",
  sidebarFeatures: propSidebarFeatures,
  bgColor = "bg-white",
  textColor = "text-[#1C1C1C]",
  badgeColor = "text-[#C85A32]",
  faqBorderColor = "border-gray-100",
  sidebarBgColor = "bg-[#0F2D63]",
  sidebarTextColor = "text-white",
  sidebarFeatureColor = "text-white/80",
  maxWidth = "max-w-[1500px]",
  padding = "py-20",
  titleSize = "text-2xl md:text-[34px]",
}: GeneralFAQProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const defaultFaqs: FAQItem[] = [
    {
      id: 1,
      question: "What is Magalela Media?",
      answer:
        "Magalela Media is a strategic communication agency based in Johannesburg, South Africa, dedicated to transforming complex research, data, and insights into high-impact messaging. We bridge the gap between academic rigour and public understanding.",
    },
    {
      id: 2,
      question: "Do you work with international clients?",
      answer:
        "Yes! We work with clients across Africa and globally. Our team is experienced in cross-cultural communication and understands the nuances of different markets and audiences.",
    },
    {
      id: 3,
      question: "What industries do you specialise in?",
      answer:
        "We specialise in higher education, research institutions, global development organisations, NGOs, and corporate social impact teams. Our expertise spans science communication, academic publishing, policy advocacy, and strategic storytelling.",
    },
    {
      id: 4,
      question: "How quickly can you start?",
      answer:
        "We can typically begin work within 24-48 hours of signing an agreement. For urgent projects, we offer expedited turnaround times to meet your deadlines.",
    },
  ];

  const defaultSidebarFeatures: FeatureItem[] = [
    {
      id: 1,
      text: "Journalism-trained writers with deep sector expertise",
    },
    {
      id: 2,
      text: "Senior editorial oversight on every deliverable",
    },
    {
      id: 3,
      text: "100% intellectual property retained by you",
    },
    {
      id: 4,
      text: "Transparent pricing with no hidden fees",
    },
    {
      id: 5,
      text: "Dedicated account manager from day one",
    },
    {
      id: 6,
      text: "Response within 24 business hours, guaranteed",
    },
  ];

  const faqs = propFaqs || defaultFaqs;
  const sidebarFeatures = propSidebarFeatures || defaultSidebarFeatures;

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section id="faq" className={`${padding} ${bgColor}`}>
      <div className={`${maxWidth} mx-auto px-6 lg:px-8`}>
        <div className="flex flex-col lg:flex-row gap-14 items-start">
          {/* Left Column - FAQs */}
          <div className="lg:w-[55%]">
            {badge && (
              <p className={`${badgeColor} text-xs font-semibold uppercase tracking-widest mb-4`}>
                {badge}
              </p>
            )}
            {title && (
              <h2 className={`${titleSize} font-['Roboto'] font-bold ${textColor} leading-[1.2] mb-8`}>
                {title}
              </h2>
            )}

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`border ${faqBorderColor} rounded-xl overflow-hidden`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-start justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors gap-3"
                  >
                    <span className="font-semibold text-sm text-[#1C1C1C] leading-relaxed">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform duration-200 ${
                        openFaq === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === faq.id && faq.answer && (
                    <div className="px-5 pb-4">
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:w-[45%]">
            <div className={`${sidebarBgColor} rounded-2xl p-8`}>
              {sidebarBadge && (
                <p className={`${sidebarTextColor}/50 text-xs font-semibold uppercase tracking-widest mb-4`}>
                  {sidebarBadge}
                </p>
              )}
              {sidebarTitle && (
                <h3 className={`text-xl font-['Roboto'] font-bold ${sidebarTextColor} mb-6`}>
                  {sidebarTitle}
                </h3>
              )}

              <ul className="space-y-4">
                {sidebarFeatures.map((feature) => (
                  <li key={feature.id} className="flex items-start gap-3">
                    <CircleCheckBig className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
                    <span className={`${sidebarFeatureColor} text-sm leading-relaxed`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralFAQ;