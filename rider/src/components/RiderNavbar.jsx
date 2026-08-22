import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bike, Menu, X, ArrowRight, ExternalLink } from "lucide-react";

export default function RiderNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Why Join", path: "/#why-join" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "FAQs", path: "/#faqs" },
  ];

  return (
    <header className="bg-[#18181B] text-white border-b border-[#27272A] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Filcarts Delivery Partner Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-extrabold shadow-xs group-hover:scale-105 transition-transform">
              <Bike size={20} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[20px] sm:text-[22px] font-extrabold tracking-tight text-white">
                Filcarts
              </span>
              <span className="text-[11px] font-bold text-[#F97316] bg-[#FFF7ED]/10 border border-[#F97316]/30 px-2 py-0.5 rounded uppercase tracking-wider">
                Delivery Partner
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-semibold text-[#D4D4D8]">
            {navLinks.map((link, idx) => {
              const isActive =
                (location.pathname === "/" && link.path === "/") ||
                (link.path.startsWith("/#") && location.hash === link.path.replace("/", ""));
              return (
                <a
                  key={idx}
                  href={link.path}
                  className={`transition-colors hover:text-[#F97316] ${
                    isActive ? "text-[#F97316] font-bold" : ""
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Rider Login Secondary Button */}
            <a
              href="#register"
              className="text-[14px] font-semibold text-[#FAFAF9] hover:text-[#F97316] px-3.5 py-2 border border-[#3F3F46] hover:border-[#F97316]/50 rounded-xl transition-colors"
            >
              Rider Login
            </a>

            {/* Become a Rider Primary CTA */}
            <a
              href="#register"
              className="bg-[#F97316] hover:bg-[#EA580C] text-white text-[15px] font-semibold px-4.5 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Become a Rider</span>
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#18181B] border-b border-[#27272A] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-[slideDown_0.2s_ease-out]">
          <div className="space-y-1">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[14px] font-semibold text-[#D4D4D8] hover:text-[#F97316] hover:bg-[#27272A] px-3 py-2.5 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#27272A] flex flex-col gap-2.5">
            <a
              href="#register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] font-semibold text-[#FAFAF9] bg-[#27272A] px-4 py-2.5 rounded-xl text-center"
            >
              Rider Login
            </a>
            <a
              href="#register"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white text-[14px] font-semibold px-4 py-2.5 rounded-xl text-center shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Become a Rider</span>
              <ArrowRight size={15} />
            </a>
            <a
              href="http://localhost:5173"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[13px] font-medium text-slate-400 text-center pt-1 hover:underline flex items-center justify-center gap-1"
            >
              <span>Visit Filcarts</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
