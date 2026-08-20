import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Store, Menu, X, ArrowRight, ShoppingBag } from "lucide-react";

export default function VendorNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Vendor Home", path: "/vendor" },
    { name: "About Merchant Network", path: "/vendor/about" },
    { name: "Why Partner", path: "/vendor#benefits" },
    { name: "Merchant Tools", path: "/vendor#tools" },
    { name: "Store FAQs", path: "/vendor#faqs" },
  ];

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Vendor / Merchant Brand Logo */}
          <Link to="/vendor" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
              <Store size={22} />
            </div>
            <div>
              <div className="text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span>FillCarts</span>
                <span className="text-amber-400 text-xs uppercase tracking-widest bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Merchant Partner
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block -mt-0.5">
                Store & Retail Website
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300">
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={idx}
                  to={link.path}
                  className={`transition-colors hover:text-white ${isActive ? "text-amber-400 font-extrabold" : ""}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Link back to main shopping site */}
            <Link
              to="/"
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-900 transition-colors flex items-center gap-1.5 border border-slate-800"
            >
              <ShoppingBag size={14} className="text-amber-400" />
              <span>Customer Store</span>
            </Link>

            <a
              href="/vendor#register"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Register Store</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-[slideDown_0.2s_ease-out]">
          <div className="space-y-2">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2.5 rounded-xl transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-slate-300 bg-slate-800 px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={14} className="text-amber-400" /> Customer Store
            </Link>
            <a
              href="/vendor#register"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-amber-500 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl text-center shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Register Store</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
