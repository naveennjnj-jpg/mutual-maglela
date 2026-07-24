import React, { useState, useEffect } from "react";

interface Section {
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
}

const Privacy = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const sections: Section[] = [
    {
      id: "overview",
      number: "01",
      title: "Overview",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          Magalela Media is committed to protecting your privacy and handling your personal information
          responsibly. This Privacy Policy explains what information we collect, how we use it, and your
          rights in relation to it. We comply with the Protection of Personal Information Act (POPIA)
          and applicable international data protection standards.
        </p>
      ),
    },
    {
      id: "information-collected",
      number: "02",
      title: "Information We Collect",
      content: (
        <>
          <p className="text-gray-600 text-sm leading-relaxed">
            We collect personal information when you engage with our services, submit enquiries, or use
            our platform. The types of information we may collect include:
          </p>
          <ul className="space-y-2.5 mt-4">
            {[
              "Contact details: name, email address, phone number, institutional affiliation, and job title.",
              "Project information: briefs, research materials, and content you share with us for the purpose of service delivery.",
              "Usage data: how you interact with our website, including pages visited and time spent.",
              "Payment information: billing details processed securely through our payment providers (we do not store card details).",
              "Communications: records of correspondence and meeting notes relevant to your engagement.",
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
      id: "how-we-use",
      number: "03",
      title: "How We Use Your Information",
      content: (
        <>
          <p className="text-gray-600 text-sm leading-relaxed">
            We use your personal information only for legitimate purposes related to the delivery and
            improvement of our services:
          </p>
          <ul className="space-y-2.5 mt-4">
            {[
              "To deliver, manage, and improve the services you have engaged us for.",
              "To communicate with you about your project, invoices, and account matters.",
              "To send relevant updates about our services where you have consented to receive them.",
              "To comply with legal obligations and protect the rights of all parties.",
              "To improve our internal processes and service quality through anonymised analysis.",
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
      id: "sharing",
      number: "04",
      title: "Sharing Your Information",
      content: (
        <>
          <p className="text-gray-600 text-sm leading-relaxed">
            Magalela Media does not sell, rent, or trade your personal information to third parties. We
            may share your information only in the following circumstances:
          </p>
          <ul className="space-y-2.5 mt-4">
            {[
              "With contractors or freelancers engaged to work on your project — all of whom are bound by confidentiality obligations.",
              "With technology service providers (e.g. cloud storage, payment processing) under strict data processing agreements.",
              "Where required by law, court order, or regulatory authority.",
              "With your explicit consent for any purpose beyond the above.",
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
      id: "data-security",
      number: "05",
      title: "Data Security",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          We implement industry-standard technical and organisational measures to protect your personal
          information against unauthorised access, disclosure, alteration, or destruction. All client
          data is stored on encrypted servers and access is restricted to authorised personnel only.
          In the event of a data breach affecting your personal information, we will notify you as
          required by law.
        </p>
      ),
    },
    {
      id: "retention",
      number: "06",
      title: "Data Retention",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          We retain your personal information for as long as necessary to fulfil the purposes for
          which it was collected, including any legal, accounting, or reporting requirements.
          Project files are retained for seven years after project completion. You may request
          deletion of your personal information at any time, subject to our legal obligations to
          retain certain records.
        </p>
      ),
    },
    {
      id: "your-rights",
      number: "07",
      title: "Your Rights",
      content: (
        <>
          <p className="text-gray-600 text-sm leading-relaxed">
            Under POPIA and applicable data protection law, you have the following rights in relation
            to your personal information:
          </p>
          <ul className="space-y-2.5 mt-4">
            {[
              "The right to access the personal information we hold about you.",
              "The right to correct inaccurate or incomplete personal information.",
              "The right to request deletion of your personal information where there is no lawful basis for its continued processing.",
              "The right to object to or restrict certain types of processing.",
              "The right to withdraw consent at any time where processing is based on consent.",
              "The right to lodge a complaint with the Information Regulator (South Africa).",
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
      id: "cookies",
      number: "08",
      title: "Cookies & Website Tracking",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          Our website uses cookies and similar tracking technologies to improve user experience and
          analyse traffic. You may configure your browser to refuse cookies, though some features
          of our website may not function as intended as a result. We do not use cookies to collect
          personally identifiable information without your consent.
        </p>
      ),
    },
    {
      id: "contact",
      number: "09",
      title: "Contact Us",
      content: (
        <p className="text-gray-600 text-sm leading-relaxed">
          If you have any questions about this Privacy Policy or wish to exercise your rights,
          please contact our Information Officer at{" "}
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
          src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80"
          alt="Privacy Policy"
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
              Privacy Policy
            </h1>
            <p className="text-white/60 text-sm">
              How we collect, use, and protect your information · Last updated: June 13, 2026
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

export default Privacy;