import React, { useState, useEffect } from "react";

interface Section {
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
}

const Terms = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections: Section[] = [
    {
      id: "introduction",
      number: "01",
      title: "Introduction",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          These Terms of Use govern your use of Magalela Media's website, platform, and services.
          By accessing or using any part of our services, you agree to be bound by these terms.
          If you do not agree, you may not access or use our services.
        </p>
      ),
    },
    {
      id: "services",
      number: "02",
      title: "Our Services",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          Magalela Media provides strategic communications services including editorial writing,
          science communication, media training, thought leadership strategy, stakeholder
          communications, and related services. The specific scope applicable to your engagement
          is governed by your signed agreement or accepted proposal.
        </p>
      ),
    },
    {
      id: "intellectual-property",
      number: "03",
      title: "Intellectual Property",
      content: (
        <>
          <p className="text-gray-600 text-sm leading-relaxed">
            Upon full payment, all intellectual property rights in the content produced for you are
            transferred to you. Magalela Media retains no ownership over content delivered under a
            completed engagement, except as follows:
          </p>
          <ul className="space-y-2.5 mt-4">
            {[
              "We may reference the engagement for business development purposes without disclosing confidential content.",
              "We retain anonymised versions of briefs for internal training and quality improvement.",
              "Portfolio rights apply only where explicitly agreed with the client in writing.",
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
      id: "confidentiality",
      number: "04",
      title: "Confidentiality",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          Both parties agree to maintain the confidentiality of all information shared during an
          engagement. Magalela Media will not disclose your institutional information, research
          findings, or strategic communications to third parties without your written consent.
          All team members and contractors are bound by confidentiality obligations.
        </p>
      ),
    },
    {
      id: "payment",
      number: "05",
      title: "Payment Terms",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          All invoices are payable within 30 days of issue (NET 30) unless otherwise agreed in
          writing. Late payments may attract interest at 1.5% per month. We reserve the right to
          suspend services on accounts with outstanding balances older than 45 days. All pricing
          excludes VAT unless stated otherwise.
        </p>
      ),
    },
    {
      id: "liability",
      number: "06",
      title: "Limitation of Liability",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          Magalela Media's liability under any engagement is limited to the total fees paid by the
          client in the three months preceding the claim. We are not liable for indirect,
          consequential, or reputational damages arising from the use or publication of content we
          have produced. Clients are responsible for reviewing and approving all deliverables before
          publication.
        </p>
      ),
    },
    {
      id: "termination",
      number: "07",
      title: "Termination",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          Either party may terminate an engagement with 30 days written notice. In the event of a
          material breach not remedied within 14 days of written notice, the non-breaching party
          may terminate immediately. Termination does not affect rights or obligations that accrued
          prior to the termination date.
        </p>
      ),
    },
    {
      id: "governing-law",
      number: "08",
      title: "Governing Law",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          These Terms of Use are governed by the laws of the Republic of South Africa. Any disputes
          arising from these terms shall be subject to the exclusive jurisdiction of the courts of
          South Africa.
        </p>
      ),
    },
    {
      id: "contact",
      number: "09",
      title: "Contact Us",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          For questions about these Terms of Use, please contact us at{" "}
          <a href="mailto:hello@magalelamed.co.za" className="text-[#C85A32] hover:underline">
            hello@magalelamed.co.za
          </a>{" "}
          or write to us at 169 Oxford Road, Rosebank, Johannesburg, 2196.
        </p>
      ),
    },
  ];

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let currentSection = "introduction";

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
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80"
          alt="Terms of Use"
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
              Legal
            </div>
            <h1 className="text-3xl md:text-[40px] font-['Roboto'] text-white mb-3 leading-[1.15]">
              Terms of Use
            </h1>
            <p className="text-white/60 text-sm">
              Please read these terms carefully before using our services · Last updated: June 13, 2026
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

export default Terms;