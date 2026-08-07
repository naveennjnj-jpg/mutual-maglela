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
  // ... (Insert your existing menuItems array here. It's too long to copy)
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

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================
  if (isMobile) {
    return (
      <nav className="flex flex-col w-full">
        {menuItems.map((item) => (
          <div key={item.label} className="w-full border-b border-gray-100">
            
            {/* Top Level Items */}
            <div className="flex items-center justify-between w-full px-6 py-4">
              
              {/* Link (Only renders if href exists) */}
              {item.href ? (
                <LinkOrAnchor
                  href={item.href}
                  className="flex-1 text-paragraph text-sm hover:text-primary_heading"
                  onClick={onItemClick}
                >
                  {item.label}
                </LinkOrAnchor>
              ) : (
                <span className="flex-1 text-paragraph text-sm">{item.label}</span>
              )}

              {/* Chevron Button (Only renders if dropdown exists) */}
              {item.dropdown && (
                <button
                  type="button"
                  onClick={() => toggleDropdown(item.label)}
                  className="p-1"
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      openDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Dropdown Content */}
            {item.dropdown && (
              <div
                className={`overflow-hidden transition-all duration-300 bg-light-blue/30 ${
                  openDropdown === item.label ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="py-2">
                  {item.dropdown.map((sub) => (
                    <LinkOrAnchor
                      key={sub.label}
                      href={sub.href}
                      className="block w-full px-10 py-3 text-paragraph text-xs hover:text-primary_heading border-b border-gray-100/50 last:border-0"
                      // ONLY calling onItemClick here. 
                      onClick={onItemClick}
                    >
                      {sub.label}
                    </LinkOrAnchor>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }

  // ==========================================
  // DESKTOP NAVIGATION
  // ==========================================
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