import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/home/logo.png";

const MainFooter = () => {
  return (
    <footer className="bg-[#0F2D63] text-white pt-16 pb-8">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-10 gap-y-12 mb-12">
          {/* Column 1 - Logo & Address */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <img
                alt="Magalela Media"
                src={Logo}
                className="h-28 w-auto object-contain brightness-0 invert"
              />
            </div>
            <div className="text-[14px] leading-[24px] text-white/70 space-y-0.5">
              <p>1st Floor, Graddock Square,</p>
              <p>169 Oxford Road,</p>
              <p>Rosebank,</p>
              <p>Johannesburg, 2196</p>
              <p className="mt-3">
                Phone:{" "}
                <a
                  href="tel:+27645467068"
                  className="hover:text-white transition-colors"
                >
                  +2764 546 7068
                </a>
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:info@magalelamedia.com"
                  className="hover:text-white transition-colors"
                >
                  info@magalelamedia.com
                </a>
              </p>
            </div>
          </div>

          {/* Column 2 - Company */}
          <div>
            <h4 className="font-semibold text-white text-[15px] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/about"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/partnerships"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Partnerships
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Solutions */}
          <div>
            <h4 className="font-semibold text-white text-[15px] mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/solutions/academics-research"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Academics &amp; Research
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/university-communications"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  University Communications
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/higher-education"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Higher Education Organisations
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/global-development"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Global Development &amp; Philanthropy
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/corporate-social-impact"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Corporate Social Impact
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/executive-leaders"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Executive Leaders &amp; Founders
                </Link>
              </li>
              <li>
                <Link
                  to="/workshops"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Resources */}
          <div>
            <h4 className="font-semibold text-white text-[15px] mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/blog"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Insights
                </Link>
              </li>
              <li>
                <Link
                  to="/digital-toolkit"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Digital Toolkit
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Legal */}
          <div>
            <h4 className="font-semibold text-white text-[15px] mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/privacy"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-white/60">
            © 2026, Magalela Media Services. Company number: 2023/996006/07 All
            Rights Reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/magalela-media-services/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-md border border-white/20 flex items-center justify-center text-white/60 hover:bg-[#C85A32] hover:border-[#C85A32] hover:text-white transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* X (Twitter) */}
            <a
              href="https://x.com/magalelamedia_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="w-9 h-9 rounded-md border border-white/20 flex items-center justify-center text-white/60 hover:bg-[#C85A32] hover:border-[#C85A32] hover:text-white transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/magalelamedia_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-md border border-white/20 flex items-center justify-center text-white/60 hover:bg-[#C85A32] hover:border-[#C85A32] hover:text-white transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61589354015218"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-md border border-white/20 flex items-center justify-center text-white/60 hover:bg-[#C85A32] hover:border-[#C85A32] hover:text-white transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/27645467068"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-md border border-white/20 flex items-center justify-center text-white/60 hover:bg-[#C85A32] hover:border-[#C85A32] hover:text-white transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;