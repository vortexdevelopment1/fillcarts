import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Zap, Gift, CreditCard, Sparkles, MapPin, Search, User,
  ShoppingCart, ChevronRight
} from "lucide-react";

export default function Navbar({ searchPlaceholder = "Search products, stores...", onSearchChange }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();

  const handleSearchInput = (e) => {
    setSearchValue(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Categories", to: "/categories" },
    { label: "Features", to: "/#features", isAnchor: true },
    { label: "Become Vendor", to: "/become-vendor" },
    { label: "Become Rider", to: "/become-rider" },
    { label: "About", to: "/about" },
    { label: "Support", to: "/support" },
  ];

  const isActiveRoute = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-full">
      {/* Utility Bar */}
      <div className="bg-slate-900 text-slate-50 text-xs font-semibold h-9 overflow-hidden flex items-center">
        <div className="flex whitespace-nowrap animate-[marquee_22s_linear_infinite]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              <span className="px-10 flex items-center gap-2">
                <Zap size={13} className="text-amber-400" /> Express Local Delivery
              </span>
              <span className="px-10 flex items-center gap-2">
                <Gift size={13} className="text-blue-400" /> Today's offers live now
              </span>
              <span className="px-10 flex items-center gap-2">
                <CreditCard size={13} className="text-teal-400" /> Free delivery above ₹299
              </span>
              <span className="px-10 flex items-center gap-2">
                <Sparkles size={13} className="text-violet-400" /> 100% Fresh & Quality Assured
              </span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-slate-50/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link to="/" className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            Fill<span className="text-blue-600">Carts</span>
          </Link>

          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold border border-slate-200 rounded-full px-3 py-2 bg-white flex-shrink-0">
            <MapPin size={14} className="text-blue-600" /> Your Location
          </div>

          <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-base text-slate-500 max-w-xs flex-1">
            <Search size={15} />
            <input
              value={searchValue}
              onChange={handleSearchInput}
              placeholder={searchPlaceholder}
              className="bg-transparent outline-none w-full text-slate-900 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto relative">
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-blue-500 transition-colors"
            >
              <User size={16} />
            </button>

            {loginOpen && (
              <div className="absolute top-11 right-24 bg-white border border-slate-200 rounded-xl shadow-lg w-48 p-1.5 z-50">
                <Link
                  to="/login"
                  onClick={() => setLoginOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  <ChevronRight size={14} className="text-blue-600" />
                  Customer Login
                </Link>
              </div>
            )}

            <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center relative hover:border-blue-500 transition-colors">
              <ShoppingCart size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-600 border-2 border-slate-50" />
            </button>

            <button className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-full px-5 py-2.5 whitespace-nowrap transition-colors">
              Download App
            </button>
          </div>
        </div>
      </header>

      {/* Main Nav Links */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-7 text-sm font-bold overflow-x-auto">
          {navLinks.map((link, i) => {
            const active = !link.isAnchor && isActiveRoute(link.to);
            if (link.isAnchor) {
              return (
                <a
                  key={i}
                  href={link.to}
                  className="text-slate-600 hover:text-blue-600 whitespace-nowrap transition-colors"
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={i}
                to={link.to}
                className={`whitespace-nowrap transition-colors ${
                  active ? "text-blue-600 font-extrabold border-b-2 border-blue-600 pb-0.5" : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
