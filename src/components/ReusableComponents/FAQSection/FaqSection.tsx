import { Button } from "@/components/ui/button";
import { allFaqs, type FaqItem } from "@/data/faqs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FaqProps {
  limit?: number;
  hideButton?: boolean;
  faqs?: FaqItem[];
  heading?: string;
  subheading?: string;
}

export default function FaqSection({
  limit,
  hideButton,
  faqs,
  heading = "Frequently Asked Questions",
  subheading,
}: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = faqs ?? allFaqs;
  const displayedFaqs = limit ? faqItems.slice(0, limit) : faqItems;
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-14 lg:py-20">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        {subheading && (
          <p className="text-paragraph text-sm font-medium mb-1">{subheading}</p>
        )}
        <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px] mb-7">
          {heading}
        </h2>

        <div className="border-b border-gray-200 divide-y divide-gray-200">
          {displayedFaqs.map((faq, index) => {
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
                  <p className="mt-4 whitespace-pre-line text-paragraph text-sm md:text-base leading-[26px] md:leading-[30px]">
                    {faq.answer}
                  </p>
                )}
              </div>
            ); 
          })}
        </div>

        {!hideButton && (
          <div className="flex justify-center mt-7">
            <Button onClick={() => navigate("/faq")}>View all FAQs</Button>
          </div>
        )}
      </div>
    </section>
  );
}
