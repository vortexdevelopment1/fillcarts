import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Store, Menu, X, ArrowRight, ExternalLink } from "lucide-react";

export default function VendorNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Why Filcarts", path: "/#why-filcarts" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "Merchant App", path: "/#merchant-app" },
    { name: "FAQs", path: "/#faqs" },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Filcarts Merchant Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-extrabold shadow-xs group-hover:scale-105 transition-transform">
              <Store size={20} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[20px] sm:text-[22px] font-extrabold tracking-tight text-[#17231A]">
                Filcarts
              </span>
              <span className="text-[11px] font-bold text-[#166534] bg-[#ECFDF3] px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                Merchant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-semibold text-slate-600">
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.path || (link.path.startsWith("/#") && location.hash === link.path.replace("/", ""));
              return (
                <a
                  key={idx}
                  href={link.path}
                  className={`transition-colors hover:text-[#16A34A] ${isActive ? "text-[#16A34A] font-bold" : ""}`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Customer Website Link */}
            <a
              href="http://localhost:5173"
              className="text-[13px] sm:text-[14px] font-medium text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              title="Visit Customer Shopping Site"
            >
              <span>Customer Website</span>
              <ExternalLink size={13} className="text-slate-400" />
            </a>

            {/* Merchant Login */}
            <a
              href="#login"
              className="text-[14px] font-semibold text-slate-700 hover:text-[#16A34A] px-3 py-2 rounded-lg transition-colors"
            >
              Merchant Login
            </a>

            {/* Register Your Store Primary CTA */}
            <a
              href="#register"
              className="bg-[#16A34A] hover:bg-[#166534] text-white text-[14px] sm:text-[15px] font-semibold px-4.5 py-2.5 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Register Your Store</span>
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-md animate-[slideDown_0.2s_ease-out]">
          <div className="space-y-1">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[14px] font-semibold text-slate-700 hover:text-[#16A34A] hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="#login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] font-semibold text-slate-700 bg-slate-100 px-4 py-2.5 rounded-lg text-center"
            >
              Merchant Login
            </a>
            <a
              href="#register"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#16A34A] text-white text-[14px] font-semibold px-4 py-2.5 rounded-lg text-center shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Register Your Store</span>
              <ArrowRight size={15} />
            </a>
            <a
              href="http://localhost:5173"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[13px] font-medium text-slate-500 text-center pt-1 hover:underline flex items-center justify-center gap-1"
            >
              <span>Visit Customer Website</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
