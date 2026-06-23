import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  getCoursePagePath,
  getMockExamUrl,
  isExternalUrl,
} from "@/utils/links";

type MenuItem = {
  label: string;
  href?: string;
  dropdown?: { label: string; href: string }[];
};

const menuItems: MenuItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Exam Prep Courses",
    dropdown: [
      { label: "PMP Exam Prep Course", href: getCoursePagePath("PMP", "exam-prep") },
      { label: "PgMP Exam Prep Course", href: getCoursePagePath("PgMP", "exam-prep") },
      { label: "PfMP Exam Prep Course", href: getCoursePagePath("PfMP", "exam-prep") },
      {
        label: "PMOCP Exam Prep Course",
        href: getCoursePagePath("PMOCP", "exam-prep"),
      },
      {
        label: "PMI-RMP Exam Prep Course",
        href: getCoursePagePath("PMI-RMP", "exam-prep"),
      },
    ],
  },
  {
    label: "On-Demand Courses",
    dropdown: [
      { label: "PMP On-Demand Course", href: getCoursePagePath("PMP", "on-demand-course") },
      { label: "PgMP On-Demand Course", href: getCoursePagePath("PgMP", "on-demand-course") },
      { label: "PfMP On-Demand Course", href: getCoursePagePath("PfMP", "on-demand-course") },
      {
        label: "PMOCP On-Demand Course",
        href: getCoursePagePath("PMOCP", "on-demand-course"),
      },
      {
        label: "PMI-RMP On-Demand Course",
        href: getCoursePagePath("PMI-RMP", "on-demand-course"),
      },
    ],
  },
  {
    label: "Exam Simulator",
    href: "/exam-simulators",
    dropdown: [
      { label: "PMP Exam Simulator", href: getMockExamUrl("PMP") },
      { label: "PgMP Exam Simulator", href: getMockExamUrl("PgMP") },
      { label: "PfMP Exam Simulator", href: getMockExamUrl("PfMP") },
      { label: "PMOCP Exam Simulator", href: getMockExamUrl("PMOCP") },
      {
        label: "PMI-RMP Exam Simulator",
        href: getMockExamUrl("PMI-RMP"),
      },
    ],
  },
  {
    label: "Application Support",
    dropdown: [
      {
        label: "PMP Application Support",
        href: getCoursePagePath("PMP", "application-support"),
      },
      {
        label: "PgMP Application Support",
        href: getCoursePagePath("PgMP", "application-support"),
      },
      {
        label: "PfMP Application Support",
        href: getCoursePagePath("PfMP", "application-support"),
      },
      {
        label: "PMOCP Application Support",
        href: getCoursePagePath("PMOCP", "application-support"),
      },
      {
        label: "PMI-RMP Application Support",
        href: getCoursePagePath("PMI-RMP", "application-support"),
      },
    ],
  },
  {
    label: "Resources",
    dropdown: [
      { label: "Practice Exams", href: "/real-practice-exam" },
      { label: "PMP Domains and Tasks", href: "/pmp/pmp-domains-and-tasks" },
      { label: "PgMP Domains and Tasks", href: "/pgmp/pgmp-domains-and-tasks" },
      { label: "PfMP Domains and Tasks", href: "/pfmp/pfmp-domains-and-tasks" },
      {
        label: "PMOCP Domains and Tasks",
        href: "/pmocp/pmocp-domains-and-tasks",
      },
      {
        label: "PMI-RMP Domains and Tasks",
        href: "/pmi-rmp/pmi-rmp-domains-and-tasks",
      },
      { label: "Flashcards", href: "/flash-cards" },
    ],
  },
  {
    label: "Corporate Training",
    href: "/corporate-training",
  },
  {
    label: "More",
    dropdown: [
      { label: "PDUs", href: "/pdus" },
      { label: "Other Certifications", href: "" },
    ],
  },
];

interface NavigationProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const LinkOrAnchor = ({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className: string;
  onClick?: () => void;
  children: React.ReactNode;
}) =>
  isExternalUrl(href) ? (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ) : (
    <Link to={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );

const Navigation: React.FC<NavigationProps> = ({
  isMobile = false,
  onItemClick,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  if (isMobile) {
    return (
      <nav className="flex flex-col">
        {menuItems.map((item, index) => (
          <div key={item.label}>
            {/* Menu WITHOUT dropdown */}
            {!item.dropdown && item.href && (
              <LinkOrAnchor
                href={item.href}
                className="flex items-center justify-between px-6 py-3 text-paragraph text-sm hover:text-primary_heading transition-colors group"
                onClick={onItemClick}
              >
                <span>{item.label}</span>
              </LinkOrAnchor>
            )}

            {/* Menu WITH dropdown */}
            {item.dropdown && (
              <div>
                <div className="w-full flex items-center justify-between px-6 py-3 text-paragraph text-sm hover:text-primary_heading transition-colors">
                  {item.href ? (
                    <LinkOrAnchor
                      href={item.href}
                      className="flex-1"
                      onClick={onItemClick}
                    >
                      {item.label}
                    </LinkOrAnchor>
                  ) : (
                    <span>{item.label}</span>
                  )}
                  <button
                    type="button"
                    aria-label={`Toggle ${item.label} menu`}
                    onClick={() => toggleDropdown(item.label)}
                  >
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      openDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                  </button>
                </div>

                {/* Dropdown Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 bg-light-blue ${
                    openDropdown === item.label
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="py-2">
                    {item.dropdown.map((sub) => (
                      <LinkOrAnchor
                        key={sub.label}
                        href={sub.href}
                        className="block px-8 py-2 text-paragraph text-xs hover:text-primary_heading transition-colors"
                        onClick={onItemClick}
                      >
                        {sub.label}
                      </LinkOrAnchor>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Divider (except for last item) */}
            {index < menuItems.length - 1 && (
              <div className="border-b border-gray-100 " />
            )}
          </div>
        ))}
      </nav>
    );
  }

  // Desktop Navigation
  return (
    <nav className="flex-wrap flex gap-3 xl:gap-7 px-4 justify-center items-center border-[1px] border-primary_blue rounded-[20px] bg-white">
      {menuItems.map((item) => (
        <div key={item.label} className="relative group inline-block">
          {!item.dropdown && item.href && (
            <NavLink
              to={item.href}
              className="px-1 py-4 text-sm transition-colors inline-block text-paragraph hover:text-primary_heading"
            >
              {item.label}
            </NavLink>
          )}

          {item.dropdown && (
            <div className="relative">
              {item.href ? (
                <NavLink
                  to={item.href}
                  className="px-1 py-4 text-paragraph text-sm hover:text-primary_heading flex items-center gap-1 transition-colors"
                >
                  {item.label}
                  <ChevronDown size={16} />
                </NavLink>
              ) : (
                <button className="px-1 py-4 text-paragraph text-sm hover:text-primary_heading flex items-center gap-1 transition-colors">
                  {item.label}
                  <ChevronDown size={16} />
                </button>
              )}

              <div className="absolute left-0 top-full bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] z-50">
                {item.dropdown.map((sub) =>
                  isExternalUrl(sub.href) ? (
                    <a
                      key={sub.label}
                      href={sub.href}
                      className="block px-4 py-2 text-sm transition-colors text-paragraph hover:text-primary_heading"
                    >
                      {sub.label}
                    </a>
                  ) : (
                    <NavLink
                      key={sub.label}
                      to={sub.href}
                      className="block px-4 py-2 text-sm transition-colors text-paragraph hover:text-primary_heading"
                    >
                      {sub.label}
                    </NavLink>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
