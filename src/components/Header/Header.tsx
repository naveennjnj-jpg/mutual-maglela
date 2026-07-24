import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "@/assets/home/logo.png";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";

const LOGIN_REDIRECT_URL = `/login`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const solutionsRef = useRef<HTMLDivElement | null>(null);
  const companyRef = useRef<HTMLDivElement | null>(null);

  const handleLoginRedirect = () => {
    window.location.href = LOGIN_REDIRECT_URL;
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  // Solutions data with icons
  const solutionsData = [
    {
      icon: "BookOpen",
      title: "Academics & Research",
      description: "Amplify the reach of your research",
      link: "/solutions/academics-research",
    },
    {
      icon: "GraduationCap",
      title: "University Communications",
      description: "Strategic support for campus teams",
      link: "/solutions/university-communications",
    },
    {
      icon: "Building2",
      title: "Higher Education Organisations",
      description: "Sector-level advocacy and reputation",
      link: "/solutions/higher-education",
    },
    {
      icon: "Globe",
      title: "Global Development & Philanthropy",
      description: "Impact storytelling for development orgs",
      link: "/solutions/global-development",
    },
    {
      icon: "Heart",
      title: "Corporate Social Impact Teams",
      description: "Credible CSI and ESG communications",
      link: "/solutions/corporate-social-impact",
    },
    {
      icon: "Zap",
      title: "Executive Leaders & Founders",
      description: "Personal communication authority",
      link: "/solutions/executive-leaders",
    },
    {
      icon: "Presentation",
      title: "Workshops",
      description: "Expert-led training programmes",
      link: "/workshops",
    },
  ];

  // Icon mapping
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      BookOpen: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#C85A32] group-hover:text-white transition-colors">
          <path d="M12 7v14" />
          <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
        </svg>
      ),
      GraduationCap: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#C85A32] group-hover:text-white transition-colors">
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
          <path d="M22 10v6" />
          <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
        </svg>
      ),
      Building2: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#C85A32] group-hover:text-white transition-colors">
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
          <path d="M10 6h4" />
          <path d="M10 10h4" />
          <path d="M10 14h4" />
          <path d="M10 18h4" />
        </svg>
      ),
      Globe: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#C85A32] group-hover:text-white transition-colors">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
      Heart: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#C85A32] group-hover:text-white transition-colors">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      ),
      Zap: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#C85A32] group-hover:text-white transition-colors">
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </svg>
      ),
      Presentation: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#C85A32] group-hover:text-white transition-colors">
          <path d="M2 3h20" />
          <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
          <path d="m7 21 5-5 5 5" />
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={Logo}
              alt="Magalela Media"
              className={`h-20 w-auto object-contain logo-image transition-all duration-300 ${
                isScrolled ? 'brightness-0' : 'brightness-0 invert'
              }`}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Solutions Dropdown */}
            <div 
              className="relative" 
              ref={solutionsRef}
              onMouseEnter={() => handleMouseEnter(setIsSolutionsOpen)}
              onMouseLeave={() => handleMouseLeave(setIsSolutionsOpen)}
            >
              <button
                className={`text-sm transition-all duration-300 px-3 py-2 rounded-lg flex items-center gap-1 outline-none ${
                  isScrolled 
                    ? 'text-[#0F2D63] hover:bg-[#0F2D63]/10' 
                    : 'text-white hover:bg-white/10'
                }`}
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
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[660px] z-50">
                  <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50/70 border-b border-white/40 px-6 py-3">
                      <p className="text-[#1C1C1C] font-semibold text-sm">Solutions</p>
                      <p className="text-gray-400 text-xs mt-0.5">Communication strategies for every sector</p>
                    </div>

                    {/* Grid Items */}
                    <div className="grid grid-cols-2 gap-0 p-3">
                      {solutionsData.map((item, index) => (
                        <Link
                          key={index}
                          to={item.link}
                          className="flex items-start gap-3 p-3.5 rounded-xl hover:bg-white/60 transition-colors group"
                        >
                          <div className="w-9 h-9 bg-[#F3EDE6] group-hover:bg-[#C85A32] rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                            {getIcon(item.icon)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1C1C1C] leading-snug">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="border-t border-white/40 px-6 py-3 bg-white/40 flex items-center justify-between">
                      <p className="text-xs text-gray-500">Not sure which solution fits? We'll help.</p>
                      <Link
                        to="/contact"
                        className="text-xs font-semibold text-[#C85A32] hover:text-[#a8472a] transition-colors ml-4"
                      >
                        Talk to us →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/partnerships"
              className={`text-sm transition-all duration-300 px-3 py-2 rounded-lg ${
                isScrolled 
                  ? 'text-[#0F2D63] hover:bg-[#0F2D63]/10' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Partnerships
            </NavLink>

            <NavLink
              to="/pricing"
              className={`text-sm transition-all duration-300 px-3 py-2 rounded-lg ${
                isScrolled 
                  ? 'text-[#0F2D63] hover:bg-[#0F2D63]/10' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Pricing
            </NavLink>

            {/* Company Dropdown */}
            <div 
              className="relative" 
              ref={companyRef}
              onMouseEnter={() => handleMouseEnter(setIsCompanyOpen)}
              onMouseLeave={() => handleMouseLeave(setIsCompanyOpen)}
            >
              <button
                type="button"
                className={`text-sm transition-all duration-300 px-3 py-2 rounded-lg flex items-center gap-1 outline-none ${
                  isScrolled 
                    ? 'text-[#0F2D63] hover:bg-[#0F2D63]/10' 
                    : 'text-white hover:bg-white/10'
                }`}
                aria-expanded={isCompanyOpen}
              >
                Company
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isCompanyOpen ? 'rotate-180' : ''
                }`} />
              </button>

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
              className={`text-sm transition-all duration-300 px-3 py-2 rounded-lg ${
                isScrolled 
                  ? 'text-[#0F2D63] hover:bg-[#0F2D63]/10' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Insights
            </NavLink>

            {/* Login and Get a Demo */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className={`inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isScrolled 
                    ? 'text-[#0F2D63] border border-[#0F2D63] hover:bg-[#0F2D63] hover:text-white' 
                    : 'text-white border border-white hover:bg-white hover:text-black'
                }`}
              >
                Login
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium text-white bg-[#C85A32] rounded-lg hover:bg-[#a8472a] transition-colors"
              >
                Get a Demo
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 transition-colors duration-300 ${
              isScrolled ? 'text-[#0F2D63]' : 'text-white'
            }`}
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
                  <div className="mt-3 space-y-3 pl-3">
                    {solutionsData.map((item, index) => (
                      <Link
                        key={index}
                        to={item.link}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="w-8 h-8 bg-[#F3EDE6]/20 rounded-lg flex items-center justify-center shrink-0">
                          {getIcon(item.icon)}
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{item.title}</p>
                          <p className="text-xs text-white/60">{item.description}</p>
                        </div>
                      </Link>
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
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
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
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-white border border-white bg-transparent hover:bg-white hover:text-black w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium text-white bg-[#C85A32] rounded-lg transition-all duration-300 hover:bg-[#a8472a] w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get a Demo
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;