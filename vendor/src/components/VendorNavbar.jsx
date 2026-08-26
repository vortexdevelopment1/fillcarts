import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store, Menu, X, ArrowRight, ExternalLink } from "lucide-react";

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
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
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
          <div className="hidden sm:flex items-center gap-3">
            {/* Customer Website Link */}
            <a
              href="http://localhost:5173"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              title="Visit Customer Shopping Site"
            >
              <span>Customer Site</span>
              <ExternalLink size={14} className="text-slate-400" />
            </a>

            {/* Register Your Store Primary CTA */}
            <a
              href="/#register"
              onClick={(e) => handleNavClick(e, { path: "/#register" })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4.5 py-2.5 rounded-lg transition-colors shadow-xs flex items-center gap-2"
            >
              <span>Register Your Store</span>
              <ArrowRight size={16} />
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
              link.path.startsWith("/#") ? (
                <a
                  key={idx}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className="block text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="/#register"
              onClick={(e) => handleNavClick(e, { path: "/#register" })}
              className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Register Your Store</span>
              <ArrowRight size={16} />
            </a>
            <a
              href="http://localhost:5173"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium text-slate-500 text-center pt-1 hover:underline flex items-center justify-center gap-1"
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

