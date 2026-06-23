import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import FooterPageHeroSection from "@/components/ReusableComponents/FooterPageHeroSection/FooterPageHeroSection";
import TopFooterSection from "@/components/ReusableComponents/TopFooterSection/TopFooterSection";
import { CALENDLY_CONSULTATION_URL } from "@/utils/links";
import { Button } from "@/components/ui/button";
import { faqCategories } from "@/data/faqs";

const Faq = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedSearch) {
      return faqCategories;
    }

    return faqCategories
      .map((category) => ({
        ...category,
        faqs: category.faqs.filter((faq) => {
          const searchableText = `${category.title} ${faq.question} ${faq.answer}`;
          return searchableText.toLowerCase().includes(normalizedSearch);
        }),
      }))
      .filter((category) => category.faqs.length > 0);
  }, [normalizedSearch]);

  return (
    <>
      <FooterPageHeroSection title="FAQs" description="" />

      <section className="bg-white py-10 md:py-14 lg:py-16">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="max-w-[1074px] mx-auto">
            <h1 className="text-Black_light text-3xl md:text-4xl font-bold md:leading-[52px]">
              Hi! How can we help?
            </h1>
            <label htmlFor="faq-search" className="sr-only">
              Search FAQs
            </label>
            <div className="relative mt-6">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-paragraph"
              />
              <input
                id="faq-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search here"
                style={{ paddingLeft: "48px" }}
                className="w-full appearance-none rounded-[18px] border border-primary_blue bg-white py-4 pr-4 text-sm text-Black_light outline-none transition focus:ring-2 focus:ring-primary_blue/20"
              />
            </div>

            <div className="bg-light-blue rounded-[20px] p-5 md:p-6 mt-8">
              <h2 className="text-Black_light text-base md:text-lg font-bold mb-3">
                Overview
              </h2>
              <p className="text-paragraph text-sm md:text-base font-normal leading-[28px]">
              In this section, we have provided answers to the most frequently
              asked questions we receive. If you do not find the answer to your
              question here, please do not hesitate to contact us. Our support
              team is always here to help.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light-blue py-8 md:py-10">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {faqCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="rounded-[30px] border border-primary_blue bg-white px-4 py-2 text-primary_blue text-xs md:text-sm font-medium hover:bg-primary_blue hover:text-white transition-colors"
              >
                {category.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="max-w-[920px] mx-auto">
            {filteredCategories.length > 0 ? (
              <div className="space-y-10 md:space-y-12">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    id={category.id}
                    className="scroll-mt-28"
                  >
                    <div className="flex items-end justify-between gap-4 mb-4">
                      <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
                        {category.title}
                      </h2>
                      <span className="text-paragraph text-xs md:text-sm shrink-0">
                        {category.faqs.length} FAQs
                      </span>
                    </div>
                    <div className="space-y-3">
                      {category.faqs.map((faq) => (
                        <details
                          key={faq.question}
                          className="group rounded-[16px] border border-gray-200 bg-white px-4 md:px-6 py-4 shadow-sm"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                            <span className="text-black text-sm md:text-base lg:text-lg font-semibold leading-7">
                              {faq.question}
                            </span>
                            <svg
                              className="w-4 h-4 shrink-0 transition-transform duration-300 text-paragraph group-open:rotate-180"
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
                          </summary>
                          <p className="mt-4 border-t border-gray-100 pt-4 text-paragraph text-sm md:text-base leading-[26px] md:leading-[30px]">
                            {faq.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-light-blue rounded-[20px] p-6 text-center">
                <h2 className="text-Black_light text-xl md:text-2xl font-bold">
                  No FAQs found
                </h2>
                <p className="text-paragraph text-sm leading-[26px] mt-2">
                  Try a different search term or contact our support team for
                  help.
                </p>
                <Button className="mt-5" asChild>
                  <Link to="/contact-us">Contact Us</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <TopFooterSection
        content={{
          title: <>Let our experts help you achieve exceptional results.</>,
          description:
            "Get guidance on the right certification path, preparation resources, and next steps for your goals.",
          points: [
            "Discuss your certification goals",
            "Find the right preparation path",
            "Clarify course and resource options",
            "Plan your next step with confidence",
          ],
          buttonText: "Book a free Consultation",
          buttonLink: CALENDLY_CONSULTATION_URL,
        }}
      />
    </>
  );
};

export default Faq;
