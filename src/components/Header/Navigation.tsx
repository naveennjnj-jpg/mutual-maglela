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
  // ... (Keep your existing menuItems array exactly as it is)
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

  // ✅ MOBILE NAVIGATION - COMPLETELY REWRITTEN FOR STABILITY
  if (isMobile) {
    return (
      <nav className="flex flex-col">
        {menuItems.map((item, index) => (
          <div key={item.label} className="border-b border-gray-100 last:border-0">
            
            {/* 1. Items WITHOUT dropdown */}
            {!item.dropdown && item.href && (
              <LinkOrAnchor
                href={item.href}
                className="block px-6 py-4 text-paragraph text-sm hover:text-primary_heading transition-colors"
                onClick={onItemClick}
              >
                {item.label}
              </LinkOrAnchor>
            )}

            {/* 2. Items WITH dropdown */}
            {item.dropdown && (
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between px-6 py-4 text-paragraph text-sm">
                  
                  {/* Left side: The Label or Link */}
                  {item.href ? (
                    <LinkOrAnchor
                      href={item.href}
                      className="flex-1 hover:text-primary_heading transition-colors"
                      onClick={onItemClick}
                    >
                      {item.label}
                    </LinkOrAnchor>
                  ) : (
                    <span className="flex-1">{item.label}</span>
                  )}

                  {/* Right side: Toggle Dropdown Button */}
                  <button
                    type="button"
                    aria-label={`Toggle ${item.label} menu`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent accidental clicks
                      toggleDropdown(item.label);
                    }}
                    className="p-1 hover:text-primary_heading transition-colors"
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-200 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Dropdown Content - Simple and clean for mobile */}
                <div
                  className={`overflow-hidden transition-all duration-300 bg-light-blue/50 ${
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
                        className="block px-10 py-2 text-paragraph text-xs hover:text-primary_heading transition-colors"
                        onClick={onItemClick} // ✅ This correctly closes the entire mobile menu now
                      >
                        {sub.label}
                      </LinkOrAnchor>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }

  // ✅ DESKTOP NAVIGATION (Unchanged, keep as is)
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