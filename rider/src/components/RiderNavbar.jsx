import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bike, Menu, X, ArrowRight, ExternalLink, Store, ShoppingBag } from "lucide-react";

export default function RiderNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Why Join", path: "/#why-join" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "Support", path: "/support" },
    { name: "FAQs", path: "/#faqs" },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Robust Body Scroll Locking for Mobile Drawer (iOS & Android friendly)
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Escape key support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (e, link) => {
    if (link.path.startsWith("/#")) {
      e.preventDefault();
      const hashId = link.path.replace("/#", "");
      const elem = document.getElementById(hashId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

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
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-semibold text-[#D4D4D8]">
            {navLinks.map((link, idx) => {
              const isActive =
                (location.pathname === "/" && link.path === "/") ||
                (location.pathname === link.path) ||
                (link.path.startsWith("/#") && location.hash === link.path.replace("/", ""));
              return link.path.startsWith("/#") ? (
                <a
                  key={idx}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`transition-colors hover:text-[#F97316] ${
                    isActive ? "text-[#F97316] font-bold" : ""
                  }`}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={idx}
                  to={link.path}
                  className={`transition-colors hover:text-[#F97316] ${
                    isActive ? "text-[#F97316] font-bold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Customer Link */}
            <a
              href="http://localhost:5173"
              className="text-xs font-bold text-slate-300 hover:text-white bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Visit Customer Site"
            >
              <ShoppingBag size={13} className="text-emerald-400" />
              <span>Customer Site</span>
            </a>

            {/* Vendor Link */}
            <a
              href="http://localhost:5174"
              className="text-xs font-bold text-slate-300 hover:text-white bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Visit Merchant Portal"
            >
              <Store size={13} className="text-amber-400" />
              <span>Merchant Portal</span>
            </a>

            {/* Become a Rider Primary CTA */}
            <a
              href="#register"
              className="bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Join as Rider</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#27272A] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-colors"
            aria-label="Open Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with Independent Scrolling */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99999] lg:hidden flex overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-200 animate-fade-in touch-none"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container Panel */}
          <div 
            className="relative w-[85%] max-w-[320px] bg-[#18181B] text-white h-[100dvh] shadow-2xl flex flex-col justify-between z-10 border-r border-[#27272A] animate-slide-right overscroll-contain touch-pan-y"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top Header (Fixed/Shrink-0) */}
            <div className="shrink-0 p-4 bg-[#27272A]/50 border-b border-[#27272A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-extrabold">
                  <Bike size={18} />
                </div>
                <span className="font-extrabold text-lg text-white">
                  Filcarts <span className="text-[10px] font-bold text-[#F97316] bg-[#F97316]/10 px-1.5 py-0.5 rounded border border-[#F97316]/30">Rider</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-[#27272A] border border-[#3F3F46] flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors shadow-2xs"
                aria-label="Close Menu"
              >
                <X size={16} />
              </button>
            </div>

            {/* Middle Scrollable Section (Independent Scroll) */}
            <div className="flex-1 overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch py-2">
              {/* Navigation Links */}
              <div className="p-3 space-y-1">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 py-1">Rider Navigation</div>
                {navLinks.map((link, idx) => (
                  link.path.startsWith("/#") ? (
                    <a
                      key={idx}
                      href={link.path}
                      onClick={(e) => handleNavClick(e, link)}
                      className="block text-xs font-bold text-[#D4D4D8] hover:text-[#F97316] hover:bg-[#27272A] px-3 py-2.5 rounded-xl transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      key={idx}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-bold text-[#D4D4D8] hover:text-[#F97316] hover:bg-[#27272A] px-3 py-2.5 rounded-xl transition-colors"
                    >
                      {link.name}
                    </Link>
                  )
                ))}
              </div>

              {/* Other Portals */}
              <div className="p-3 border-t border-[#27272A] space-y-2">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 py-0.5">Other Portals</div>
                <a
                  href="http://localhost:5173"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-xs font-bold text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag size={14} className="text-emerald-400" /> Customer Shopping
                  </span>
                  <ExternalLink size={12} className="text-slate-400" />
                </a>

                <a
                  href="http://localhost:5174"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-xs font-bold text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Store size={14} className="text-amber-400" /> Merchant Store Portal
                  </span>
                  <ExternalLink size={12} className="text-slate-400" />
                </a>
              </div>
            </div>

            {/* Bottom Rider Action (Fixed/Shrink-0) */}
            <div className="shrink-0 p-4 border-t border-[#27272A] bg-[#27272A]/30">
              <a
                href="#register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-extrabold py-2.5 rounded-xl text-center shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Register as Delivery Partner</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
