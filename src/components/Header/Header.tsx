import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import AnnouncementBar from "./AnnouncementBar";
import { Link, NavLink } from "react-router-dom";
import Logo from "@/assets/home/logo.png";
import Search from "./Search";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { PORTAL_BASE_URL } from "@/utils/links";

const LOGIN_REDIRECT_URL = `${PORTAL_BASE_URL}/login`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginRedirect = () => {
    window.location.href = LOGIN_REDIRECT_URL;
  };

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

  return (
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
      <nav className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src={Logo}
              alt="Magalela Media"
              className="h-24 transition-all duration-300"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <button className="text-sm px-3 py-2 rounded-lg text-white hover:bg-white/10">
              Solutions
            </button>

            <NavLink
              to="/partnerships"
              className="text-sm px-3 py-2 rounded-lg text-white hover:bg-white/10"
            >
              Partnerships
            </NavLink>

            <NavLink
              to="/pricing"
              className="text-sm px-3 py-2 rounded-lg text-white hover:bg-white/10"
            >
              Pricing
            </NavLink>

            <NavLink
              to="/blog"
              className="text-sm px-3 py-2 rounded-lg text-white hover:bg-white/10"
            >
              Insights
            </NavLink>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="text-white border-white bg-transparent hover:bg-white hover:text-black"
                onClick={handleLoginRedirect}
              >
                Login
              </Button>

              <Button className="bg-[#C85A32] text-white hover:opacity-90">
                Get a Demo
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-white">
            <Menu />
          </button>

        </div>
      </nav>
    </header>
  );
};

export default Header;
