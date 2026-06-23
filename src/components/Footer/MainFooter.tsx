import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/home/logo.png";

const MainFooter = () => {
  return (
    <footer className="bg-[#0F2D63] text-white mt-0">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="content-stretch flex flex-col gap-[48px] items-start pt-[80px] pb-0 w-full">
          {/* Footer Grid */}
          <div className="gap-x-[40px] gap-y-[48px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))] relative shrink-0 w-full min-h-[203px]">
            {/* Column 1 - Logo & Address */}
            <div className="relative shrink-0">
              <div className="mb-[14px]">
                <img
                  alt="Magalela Media"
                  src={Logo}
                  className="h-20 w-auto object-contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
              <div className="font-normal leading-[26px] text-[15px] text-[rgba(255,255,255,0.8)]">
                <p className="mb-[0.4px]">1st Floor, Cradock Square,</p>
                <p className="mb-[0.4px]">169 Oxford Road,</p>
                <p className="mb-[0.4px]">Rosebank,</p>
                <p className="mb-[0.4px]">Johannesburg, 2196</p>
                <p className="mt-[10px] mb-[0.4px]">
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
            <div className="content-stretch flex flex-col gap-[16px] items-start shrink-0">
              <h4 className="font-semibold leading-[24px] text-[16px] text-white">
                Company
              </h4>
              <ul className="content-stretch flex flex-col gap-[12px] items-start w-full">
                <li className="content-stretch flex h-[20px] items-start w-full">
                  <Link
                    to="/about"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li className="content-stretch flex h-[20px] items-start w-full">
                  <Link
                    to="/careers"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li className="content-stretch flex h-[20px] items-start w-full">
                  <Link
                    to="/case-studies"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Partnerships
                  </Link>
                </li>
                <li className="content-stretch flex h-[20px] items-start w-full">
                  <Link
                    to="/pricing"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 - Solutions */}
            <div className="content-stretch flex flex-col gap-[16px] items-start shrink-0">
              <h4 className="font-semibold leading-[24px] text-[16px] text-white">
                Solutions
              </h4>
              <ul className="content-stretch flex flex-col gap-[12px] items-start w-full">
                <li className="content-stretch flex items-start w-full">
                  <Link
                    to="/solutions/academics-research"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Academics &amp; Research
                  </Link>
                </li>
                <li className="content-stretch flex items-start w-full">
                  <Link
                    to="/solutions/university-communications"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    University Communications
                  </Link>
                </li>
                <li className="content-stretch flex items-start w-full">
                  <Link
                    to="/solutions/higher-education"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Higher Education Organisations
                  </Link>
                </li>
                <li className="content-stretch flex items-start w-full">
                  <Link
                    to="/solutions/global-development"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Global Development &amp; Philanthropy
                  </Link>
                </li>
                <li className="content-stretch flex items-start w-full">
                  <Link
                    to="/solutions/corporate-social-impact"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Corporate Social Impact
                  </Link>
                </li>
                <li className="content-stretch flex items-start w-full">
                  <Link
                    to="/solutions/executive-leaders"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Executive Leaders &amp; Founders
                  </Link>
                </li>
                <li className="content-stretch flex items-start w-full">
                  <Link
                    to="/workshops"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Workshops
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 - Resources */}
            <div className="content-stretch flex flex-col gap-[16px] items-start shrink-0">
              <h4 className="font-semibold leading-[24px] text-[16px] text-white">
                Resources
              </h4>
              <ul className="content-stretch flex flex-col gap-[12px] items-start w-full">
                <li className="content-stretch flex h-[20px] items-start w-full">
                  <Link
                    to="/blog"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Insights
                  </Link>
                </li>
                <li className="content-stretch flex h-[20px] items-start w-full">
                  <Link
                    to="/digital-toolkit"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Digital Toolkit
                  </Link>
                </li>
                <li className="content-stretch flex h-[20px] items-start w-full">
                  <Link
                    to="/faqs"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5 - Legal */}
            <div className="content-stretch flex flex-col gap-[16px] items-start shrink-0">
              <h4 className="font-semibold leading-[24px] text-[16px] text-white">
                Legal
              </h4>
              <ul className="content-stretch flex flex-col gap-[12px] items-start w-full">
                <li className="content-stretch flex h-[20px] items-start w-full">
                  <Link
                    to="/privacy"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className="content-stretch flex h-[20px] items-start w-full">
                  <Link
                    to="/terms"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Terms of Use
                  </Link>
                </li>
                <li className="content-stretch flex h-[20px] items-start w-full">
                  <Link
                    to="/refund-policy"
                    className="flex-[1_0_0] font-normal leading-[20px] text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                  >
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative shrink-0 w-full border-t border-[rgba(255,255,255,0.2)] py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-normal text-[13px] text-[rgba(255,255,255,0.6)]">
              © 2026, Magalela Media Services. Company number: 2023/996906/07
              All Rights Reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/magalela-media-services/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:bg-[#C85A32] hover:border-[#C85A32] hover:text-white transition-all duration-200"
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
                  className="w-3.5 h-3.5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/magalelamedia_?s=21&t=7v7jTjfx6LicKrQMe_SzSA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:bg-[#C85A32] hover:border-[#C85A32] hover:text-white transition-all duration-200"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.731-8.836L2.25 2.25h6.978l4.255 5.624 5.761-5.624Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/magalelamedia_?igsh=OXpya2wxb3FuaWFx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:bg-[#C85A32] hover:border-[#C85A32] hover:text-white transition-all duration-200"
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
                  className="w-3.5 h-3.5"
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
                className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:bg-[#C85A32] hover:border-[#C85A32] hover:text-white transition-all duration-200"
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
                  className="w-3.5 h-3.5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/message/EC7HP3GW7O2NP1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:bg-[#C85A32] hover:border-[#C85A32] hover:text-white transition-all duration-200"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;