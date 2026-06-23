import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "@/assets/home/logo.png";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { PORTAL_BASE_URL } from "@/utils/links";

const LOGIN_REDIRECT_URL = `${PORTAL_BASE_URL}/login`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const solutionsRef = useRef<HTMLDivElement | null>(null);
  const companyRef = useRef<HTMLDivElement | null>(null);

  const handleLoginRedirect = () => {
    window.location.href = LOGIN_REDIRECT_URL;
  };

  // Handle hover with delay for better UX
  const handleMouseEnter = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setter(true);
  };

  const handleMouseLeave = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    const timeout = setTimeout(() => {
      setter(false);
    }, 200);
    setHoverTimeout(timeout);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setIsSolutionsOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target as Node)) {
        setIsCompanyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Solutions dropdown data
  const solutionsData = [
    {
      category: "Academics & Research",
      items: [
        {
          title: "University Communications",
          description: "Strategic support for campus comms teams",
        },
        {
          title: "Higher Education Organisations",
          description: "Sector-level advocacy and reputation strategy",
        },
      ],
    },
    {
      category: "Global Development & Philanthropy",
      items: [
        {
          title: "Impact storytelling for development organisations",
          description: "Amplify the reach and impact of your research",
        },
      ],
    },
    {
      category: "Corporate Social Impact Teams",
      items: [
        {
          title: "Credible CSI and ESG communications",
          description: "Build trust through transparent reporting",
        },
      ],
    },
    {
      category: "Executive Leaders & Founders",
      items: [
        {
          title: "Personal communication authority for leaders",
          description: "Establish thought leadership and influence",
        },
      ],
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
      <nav className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={Logo}
              alt="Magalela Media"
              className="h-24 transition-all duration-300"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Solutions Dropdown - Hover */}
            <div 
              className="relative" 
              ref={solutionsRef}
              onMouseEnter={() => handleMouseEnter(setIsSolutionsOpen)}
              onMouseLeave={() => handleMouseLeave(setIsSolutionsOpen)}
            >
              <button
                className="text-sm transition-all duration-300 px-3 py-2 rounded-lg flex items-center gap-1 outline-none text-white hover:bg-white/10"
                aria-expanded={isSolutionsOpen}
              >
                Solutions
                <ChevronDown 
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isSolutionsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Solutions Dropdown Content */}
              {isSolutionsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[800px] bg-white rounded-xl shadow-2xl p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {solutionsData.map((section, idx) => (
                      <div key={idx}>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          {section.category}
                        </h3>
                        <div className="space-y-4">
                          {section.items.map((item, itemIdx) => (
                            <Link
                              key={itemIdx}
                              to="#"
                              className="block group"
                            >
                              <div className="text-sm font-medium text-gray-900 group-hover:text-[#C85A32] transition-colors">
                                {item.title}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {item.description}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link
                      to="/contact"
                      className="flex items-center justify-between text-sm text-[#C85A32] font-medium hover:opacity-80 transition-opacity group"
                    >
                      <span>Not sure which solution fits? We'll help you find the right one.</span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Talk to us <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/partnerships"
              className="text-sm transition-all duration-300 px-3 py-2 rounded-lg text-white hover:bg-white/10"
            >
              Partnerships
            </NavLink>

            <NavLink
              to="/pricing"
              className="text-sm transition-all duration-300 px-3 py-2 rounded-lg text-white hover:bg-white/10"
            >
              Pricing
            </NavLink>

            {/* Company Dropdown - Hover */}
            <div 
              className="relative" 
              ref={companyRef}
              onMouseEnter={() => handleMouseEnter(setIsCompanyOpen)}
              onMouseLeave={() => handleMouseLeave(setIsCompanyOpen)}
            >
              <button
                type="button"
                className="text-sm transition-all duration-300 px-3 py-2 rounded-lg flex items-center gap-1 outline-none text-white hover:bg-white/10"
                aria-expanded={isCompanyOpen}
              >
                Company
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  isCompanyOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Company Dropdown Content */}
              {isCompanyOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2">
                  <Link
                    to="/about"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C85A32] transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    to="/careers"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C85A32] transition-colors"
                  >
                    Careers
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C85A32] transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              )}
            </div>

            <NavLink
              to="/blog"
              className="text-sm transition-all duration-300 px-3 py-2 rounded-lg text-white hover:bg-white/10"
            >
              Insights
            </NavLink>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLoginRedirect}
                className="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-white border border-white bg-transparent hover:bg-white hover:text-black"
              >
                Login
              </button>
              <NavLink
                to="/contact"
                className="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium text-white bg-[#C85A32] rounded-lg transition-all duration-300 hover:opacity-90"
              >
                Get a Demo
              </NavLink>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 transition-colors duration-300 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-20 bg-black/95 backdrop-blur-lg overflow-y-auto">
            <div className="flex flex-col p-6 space-y-4">
              {/* Mobile Solutions */}
              <div className="border-b border-white/10 pb-4">
                <button
                  className="text-sm transition-all duration-300 px-3 py-2 rounded-lg flex items-center gap-1 outline-none text-white hover:bg-white/10 w-full justify-between"
                  onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                >
                  <span>Solutions</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isSolutionsOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                {isSolutionsOpen && (
                  <div className="mt-3 space-y-4 pl-3">
                    {solutionsData.map((section, idx) => (
                      <div key={idx}>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          {section.category}
                        </h4>
                        <div className="space-y-2">
                          {section.items.map((item, itemIdx) => (
                            <Link
                              key={itemIdx}
                              to="#"
                              className="block text-sm text-white/80 hover:text-white"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Link
                      to="/contact"
                      className="block text-sm text-[#C85A32] font-medium mt-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Talk to us →
                    </Link>
                  </div>
                )}
              </div>

              <NavLink
                to="/partnerships"
                className="text-sm transition-all duration-300 px-3 py-2 rounded-lg text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Partnerships
              </NavLink>

              <NavLink
                to="/pricing"
                className="text-sm transition-all duration-300 px-3 py-2 rounded-lg text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </NavLink>

              {/* Mobile Company */}
              <div className="border-b border-white/10 pb-4">
                <button
                  className="text-sm transition-all duration-300 px-3 py-2 rounded-lg flex items-center gap-1 outline-none text-white hover:bg-white/10 w-full justify-between"
                  onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                >
                  <span>Company</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    isCompanyOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                {isCompanyOpen && (
                  <div className="mt-2 space-y-2 pl-3">
                    <Link
                      to="/about"
                      className="block text-sm text-white/80 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link
                      to="/careers"
                      className="block text-sm text-white/80 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Careers
                    </Link>
                    <Link
                      to="/contact"
                      className="block text-sm text-white/80 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  </div>
                )}
              </div>

              <NavLink
                to="/blog"
                className="text-sm transition-all duration-300 px-3 py-2 rounded-lg text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Insights
              </NavLink>

              <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={handleLoginRedirect}
                  className="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-white border border-white bg-transparent hover:bg-white hover:text-black w-full"
                >
                  Login
                </button>
                <NavLink
                  to="/contact"
                  className="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium text-white bg-[#C85A32] rounded-lg transition-all duration-300 hover:opacity-90 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get a Demo
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;