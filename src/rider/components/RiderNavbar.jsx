import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bike, Menu, X, ArrowRight, ShoppingBag } from "lucide-react";

export default function RiderNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Rider Home", path: "/rider" },
    { name: "About Fleet", path: "/rider/about" },
    { name: "Rider Benefits", path: "/rider#benefits" },
    { name: "Requirements", path: "/rider#requirements" },
    { name: "FAQs", path: "/rider#faqs" },
  ];

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Rider Brand Logo */}
          <Link to="/rider" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
              <Bike size={22} />
            </div>
            <div>
              <div className="text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span>FillCarts</span>
                <span className="text-[#22C55E] text-xs uppercase tracking-widest bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Rider Partner
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block -mt-0.5">
                Delivery Partner Website
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
                  className={`transition-colors hover:text-white ${isActive ? "text-[#22C55E] font-extrabold" : ""}`}
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
              <ShoppingBag size={14} className="text-emerald-400" />
              <span>Customer Store</span>
            </Link>

            <a
              href="/rider#register"
              className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Apply as Rider</span>
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
              <ShoppingBag size={14} className="text-emerald-400" /> Customer Store
            </Link>
            <a
              href="/rider#register"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#16A34A] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl text-center shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Apply as Rider</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
