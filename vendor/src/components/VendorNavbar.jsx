import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store, Menu, X, ArrowRight, ExternalLink, Bike, ShoppingBag } from "lucide-react";

export default function VendorNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Why Filcarts", path: "/#why-filcarts" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "Merchant App", path: "/#merchant-app" },
    { name: "About Us", path: "/about" },
    { name: "Support", path: "/support" },
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
      if (location.pathname === "/") {
        const elem = document.getElementById(hashId);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo(0, 0);
        }
      } else {
        navigate("/#" + hashId);
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Filcarts Merchant Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold shadow-xs group-hover:scale-105 transition-transform">
              <Store size={20} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                Filcarts
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                Merchant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-semibold text-slate-600">
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.path || (link.path.startsWith("/#") && location.hash === link.path.replace("/", ""));
              return link.path.startsWith("/#") ? (
                <a
                  key={idx}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`transition-colors hover:text-emerald-600 ${isActive ? "text-emerald-600 font-bold" : ""}`}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={idx}
                  to={link.path}
                  className={`transition-colors hover:text-emerald-600 ${isActive ? "text-emerald-600 font-bold" : ""}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Customer Website Link */}
            <a
              href="http://localhost:5173"
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border border-slate-200 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Visit Customer Shopping Site"
            >
              <ShoppingBag size={13} className="text-emerald-600" />
              <span>Customer Site</span>
            </a>

            {/* Rider Link */}
            <a
              href="http://localhost:5175"
              className="text-xs font-bold text-slate-600 hover:text-amber-700 bg-slate-50 hover:bg-amber-50 border border-slate-200 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Visit Delivery Partner Portal"
            >
              <Bike size={13} className="text-amber-600" />
              <span>Rider Portal</span>
            </a>

            {/* Register Your Store Primary CTA */}
            <a
              href="/#register"
              onClick={(e) => handleNavClick(e, { path: "/#register" })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Register Store</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
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
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200 animate-fade-in touch-none"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container Panel */}
          <div 
            className="relative w-[85%] max-w-[320px] bg-white h-[100dvh] shadow-2xl flex flex-col justify-between z-10 animate-slide-right overscroll-contain touch-pan-y"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top Header (Fixed/Shrink-0) */}
            <div className="shrink-0 p-4 bg-gradient-to-b from-emerald-50 to-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold">
                  <Store size={18} />
                </div>
                <span className="font-extrabold text-lg text-slate-900">
                  Filcarts <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Merchant</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer shadow-2xs transition-colors"
                aria-label="Close Menu"
              >
                <X size={16} />
              </button>
            </div>

            {/* Middle Scrollable Section (Independent Scroll) */}
            <div className="flex-1 overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch py-2">
              {/* Navigation Links */}
              <div className="p-3 space-y-1">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 py-1">Merchant Navigation</div>
                {navLinks.map((link, idx) => (
                  link.path.startsWith("/#") ? (
                    <a
                      key={idx}
                      href={link.path}
                      onClick={(e) => handleNavClick(e, link)}
                      className="block text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2.5 rounded-xl transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      key={idx}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2.5 rounded-xl transition-colors"
                    >
                      {link.name}
                    </Link>
                  )
                ))}
              </div>

              {/* Other Portals */}
              <div className="p-3 border-t border-slate-100 space-y-2">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 py-0.5">Other Portals</div>
                <a
                  href="http://localhost:5173"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag size={14} className="text-emerald-600" /> Customer Marketplace
                  </span>
                  <ExternalLink size={12} className="text-slate-400" />
                </a>

                <a
                  href="http://localhost:5175"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Bike size={14} className="text-amber-600" /> Rider Delivery Portal
                  </span>
                  <ExternalLink size={12} className="text-slate-400" />
                </a>
              </div>
            </div>

            {/* Bottom Registration Button (Fixed/Shrink-0) */}
            <div className="shrink-0 p-4 border-t border-slate-100 bg-slate-50">
              <a
                href="/#register"
                onClick={(e) => handleNavClick(e, { path: "/#register" })}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-2.5 rounded-xl text-center shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Register Store Now</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
