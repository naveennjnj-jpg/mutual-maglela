import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Check, ArrowRight } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer?: string;
}

interface EnterpriseFeature {
  id: number;
  text: string;
}

interface PricingFAQProps {
  badge?: string;
  title?: string;
  faqs?: FAQItem[];
  enterpriseBadge?: string;
  enterpriseTitle?: string;
  enterpriseDescription?: string;
  enterpriseFeatures?: EnterpriseFeature[];
  enterpriseButton?: {
    text: string;
    link: string;
  };
  bgColor?: string;
  textColor?: string;
  badgeColor?: string;
  faqBgColor?: string;
  faqBorderColor?: string;
  enterpriseBgColor?: string;
  enterpriseTextColor?: string;
  enterpriseFeatureColor?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  maxWidth?: string;
  padding?: string;
  titleSize?: string;
}

const PricingFAQ = ({
  badge = "FAQs",
  title = "Pricing FAQs",
  faqs: propFaqs,
  enterpriseBadge = "For Large Institutions",
  enterpriseTitle = "Enterprise Packages",
  enterpriseDescription = "For universities, national associations, government bodies, and large foundations requiring bespoke, high-volume communications support.",
  enterpriseFeatures: propEnterpriseFeatures,
  enterpriseButton = {
    text: "Talk to Enterprise Sales",
    link: "/contact",
  },
  bgColor = "bg-white",
  textColor = "text-[#1C1C1C]",
  badgeColor = "text-[#C85A32]",
  faqBgColor = "bg-white",
  faqBorderColor = "border-gray-100",
  enterpriseBgColor = "bg-[#0F2D63]",
  enterpriseTextColor = "text-white",
  enterpriseFeatureColor = "text-white/80",
  buttonColor = "bg-[#C85A32]",
  buttonHoverColor = "hover:bg-[#a8472a]",
  maxWidth = "max-w-[1500px]",
  padding = "py-20",
  titleSize = "text-2xl md:text-[32px]",
}: PricingFAQProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const defaultFaqs: FAQItem[] = [
    {
      id: 1,
      question: "Do you charge fixed or variable fees?",
      answer:
        "We offer both fixed and variable pricing models. Fixed fees are available for clearly defined projects with specific deliverables. Variable fees apply to ongoing retainers or projects where scope may evolve. We provide transparent quotes before any work begins.",
    },
    {
      id: 2,
      question: "What is a retainer?",
      answer:
        "A retainer is a recurring monthly fee that guarantees a set amount of our team's time and expertise. It ensures priority access to our services, consistent strategic support, and predictable budgeting for your institution.",
    },
    {
      id: 3,
      question: "Can I combine retainer work with one-off projects?",
      answer:
        "Yes! Many of our clients maintain a retainer for ongoing strategic support while also engaging us for specific one-off projects. This hybrid approach provides both consistency and flexibility.",
    },
    {
      id: 4,
      question: "How quickly do you deliver?",
      answer:
        "Delivery times vary based on project complexity. Standard projects are typically delivered within 5-7 business days. Rush deliveries are available for an additional fee. Enterprise clients receive priority 24-48 hour turnaround.",
    },
  ];

  const defaultEnterpriseFeatures: EnterpriseFeature[] = [
    {
      id: 1,
      text: "Dedicated editorial team of 3–5 specialists",
    },
    {
      id: 2,
      text: "Unlimited content requests within agreed scope",
    },
    {
      id: 3,
      text: "Monthly strategy and planning sessions",
    },
    {
      id: 4,
      text: "Crisis communications on-call support",
    },
    {
      id: 5,
      text: "Staff training programme (monthly)",
    },
    {
      id: 6,
      text: "Custom SLA and reporting dashboard",
    },
    {
      id: 7,
      text: "Priority 24–48 hour turnaround",
    },
  ];

  const faqs = propFaqs || defaultFaqs;
  const enterpriseFeatures = propEnterpriseFeatures || defaultEnterpriseFeatures;

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className={`${padding} ${bgColor}`}>
      <div className={`${maxWidth} mx-auto px-6 lg:px-8`}>
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column - FAQs */}
          <div className="lg:w-1/2">
            {badge && (
              <p className={`${badgeColor} text-xs font-semibold uppercase tracking-widest mb-4`}>
                {badge}
              </p>
            )}
            {title && (
              <h2 className={`${titleSize} font-['Roboto'] ${textColor} leading-[1.2] mb-8`}>
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

          {/* Right Column - Enterprise */}
          <div className="lg:w-1/2">
            <div className={`${enterpriseBgColor} rounded-2xl p-8 h-full flex flex-col`}>
              {enterpriseBadge && (
                <p className={`${enterpriseTextColor}/50 text-xs font-semibold uppercase tracking-widest mb-4`}>
                  {enterpriseBadge}
                </p>
              )}
              {enterpriseTitle && (
                <h2 className={`text-2xl md:text-[28px] font-['Roboto'] ${enterpriseTextColor} leading-[1.2] mb-4`}>
                  {enterpriseTitle}
                </h2>
              )}
              {enterpriseDescription && (
                <p className={`${enterpriseTextColor}/60 text-sm leading-relaxed mb-8`}>
                  {enterpriseDescription}
                </p>
              )}

              <ul className="space-y-3 mb-8 flex-1">
                {enterpriseFeatures.map((feature) => (
                  <li key={feature.id} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#C85A32] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className={`text-sm ${enterpriseFeatureColor} leading-relaxed`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to={enterpriseButton.link}
                className={`w-full ${buttonColor} ${buttonHoverColor} text-white py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2`}
              >
                {enterpriseButton.text}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingFAQ;