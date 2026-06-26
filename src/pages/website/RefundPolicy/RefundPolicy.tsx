import React, { useState, useEffect } from "react";

interface Section {
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
}

const RefundPolicy = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const sections: Section[] = [
    {
      id: "overview",
      number: "01",
      title: "Overview",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          Magalela Media is committed to delivering high-quality, strategic communication services.
          This Refund Policy outlines the circumstances under which refunds are granted for
          engagements relating to our services. We encourage clients to raise any concerns with
          their dedicated account manager at the earliest opportunity so we can resolve issues
          promptly.
        </p>
      ),
    },
    {
      id: "project-based-services",
      number: "02",
      title: "Project-Based Services",
      content: (
        <>
          <p className="text-gray-600 text-sm leading-relaxed">
            For all fixed-scope, project-based engagements (including op-ed writing, science
            communication, policy briefs, narrative impact development, and executive speechwriting),
            the following refund terms apply:
          </p>
          <ul className="space-y-2.5 mt-4">
            {[
              "Full refunds available if cancellation is requested before work has commenced within 24 hours of payment.",
              "50% refund available if cancellation is requested after commencement but before the first draft has been delivered.",
              "No refund is available once a first draft has been delivered, as significant work and expertise will have been invested.",
              "If the delivered work materially fails to meet the agreed brief, a revision cycle will be offered at no additional charge.",
              "Magalela Media reserves the right to assess refund eligibility on a case-by-case basis for extenuating circumstances.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C85A32] shrink-0 mt-2"></div>
                <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: "retainer-plans",
      number: "03",
      title: "Retainer Plans",
      content: (
        <>
          <p className="text-gray-600 text-sm leading-relaxed">
            For monthly retainer agreements (Individual Scholar, Department, and Organisation plans),
            the following terms apply:
          </p>
          <ul className="space-y-2.5 mt-4">
            {[
              "Retainer fees are billed monthly in advance and are non-refundable once a billing cycle has commenced.",
              "Clients may cancel a retainer with 30 days written notice prior to the next billing date.",
              "Unused capacity within a billing month does not carry over or qualify for partial refund.",
              "Annual retainer commitments may be cancelled within 14 days of the commencement date for a full refund of the first month's payment.",
              "In the event that Magalela Media fails to deliver agreed services within a retainer period, a pro-rata credit will be applied to the following billing cycle.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C85A32] shrink-0 mt-2"></div>
                <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: "workshops-training",
      number: "04",
      title: "Workshops & Training",
      content: (
        <>
          <p className="text-gray-600 text-sm leading-relaxed">
            For workshop and training engagements, refund eligibility is as follows:
          </p>
          <ul className="space-y-2.5 mt-4">
            {[
              "Full refund if cancellation is requested more than 14 days before the scheduled workshop date.",
              "50% refund if cancellation is requested between 7 and 14 days before the scheduled date.",
              "No refund for cancellations made fewer than 7 days before the scheduled date.",
              "If a workshop is cancelled by Magalela Media, a full refund or rescheduled session will be offered at the client's discretion.",
              "If a participant fails to attend without prior notice, no refund will be issued.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C85A32] shrink-0 mt-2"></div>
                <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: "digital-toolkit",
      number: "05",
      title: "Digital Toolkit & Downloadable Products",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          All digital products, toolkits, and downloadable resources are non-refundable once
          purchased and downloaded. If you experience a technical issue preventing access, please
          contact us within 48 hours of purchase and we will resolve the matter or provide a
          replacement.
        </p>
      ),
    },
    {
      id: "process",
      number: "06",
      title: "How to Request a Refund",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          To request a refund, please contact your account manager or email{" "}
          <a href="mailto:hello@magalelamed.co.za" className="text-[#C85A32] hover:underline">
            hello@magalelamed.co.za
          </a>{" "}
          with your invoice number, a description of the issue, and your preferred resolution.
          We aim to respond to all refund requests within 3 business days and process approved
          refunds within 7–10 business days.
        </p>
      ),
    },
    {
      id: "contact",
      number: "07",
      title: "Contact Us",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          If you have any questions about this Refund Policy or your specific engagement, please
          reach out to us at{" "}
          <a href="mailto:hello@magalelamed.co.za" className="text-[#C85A32] hover:underline">
            hello@magalelamed.co.za
          </a>{" "}
          or call +27 11 000 0000. Our team is available Monday to Friday, 08:00–17:00 SAST.
        </p>
      ),
    },
  ];

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let currentSection = "overview";

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            currentSection = section.id;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[380px] overflow-hidden -mt-20">
        <img
          src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80"
          alt="Refund Policy"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C]/92 via-[#1C1C1C]/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/60 via-transparent to-transparent"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(at 20% 65%, rgb(200, 90, 50) 0%, transparent 55%)",
          }}
        ></div>
        <div className="relative h-full max-w-[1500px] mx-auto px-6 lg:px-8 flex flex-col justify-end pb-12 pt-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs px-4 py-1.5 rounded-full mb-4 font-semibold uppercase tracking-widest">
              Policy
            </div>
            <h1 className="text-3xl md:text-[40px] font-['Roboto'] text-white mb-3 leading-[1.15]">
              Refund Policy
            </h1>
            <p className="text-white/60 text-sm">
              We stand behind the quality of our work · Last updated: June 13, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-[#F5F0EA]">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Sidebar */}
            <div className="lg:w-[22%] shrink-0 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Contents
                </p>
                <nav className="flex flex-col gap-0.5">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={`flex items-start gap-3 text-sm transition-colors py-1.5 leading-snug group w-full text-left ${
                        activeSection === section.id
                          ? "text-[#C85A32]"
                          : "text-gray-500 hover:text-[#C85A32]"
                      }`}
                    >
                      <span
                        className={`font-bold text-xs w-5 shrink-0 mt-0.5 ${
                          activeSection === section.id
                            ? "text-[#C85A32]"
                            : "text-[#C85A32]"
                        }`}
                      >
                        {section.number}
                      </span>
                      <span className="group-hover:text-[#C85A32] transition-colors">
                        {section.title}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-[78%] flex flex-col gap-5">
              {sections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#C85A32] flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold">
                        {section.number}
                      </span>
                    </div>
                    <h2 className="font-['Roboto'] font-bold text-[#0F2D63] text-lg">
                      {section.title}
                    </h2>
                  </div>
                  <div className="h-px bg-gray-100 mb-5"></div>
                  {section.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RefundPolicy;