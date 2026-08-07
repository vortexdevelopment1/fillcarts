import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MapPin, Search, User, ShoppingCart, ChevronDown, Percent, HelpCircle,
  Zap, Gift, CreditCard, Sparkles, ChevronRight, Store, Repeat, UtensilsCrossed
} from "lucide-react";

export default function Navbar({ searchPlaceholder = "Search for 'Apple', 'Milk', 'Medicine'...", onSearchChange }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
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
    { label: "Features", to: "/features" },
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
    <div className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Utility Marquee */}
      <div className="bg-slate-950 text-slate-100 text-xs font-semibold h-8 overflow-hidden flex items-center">
        <div className="flex whitespace-nowrap animate-[marquee_22s_linear_infinite]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              <span className="px-8 flex items-center gap-2"><Zap size={13} className="text-amber-400" /> Express Local Delivery</span>
              <span className="px-8 flex items-center gap-2"><Gift size={13} className="text-teal-400" /> FLAT 50% OFF on first 3 orders</span>
              <span className="px-8 flex items-center gap-2"><CreditCard size={13} className="text-blue-400" /> Free delivery above ₹199</span>
              <span className="px-8 flex items-center gap-2"><Sparkles size={13} className="text-violet-400" /> 100% Verified Local Kiranas & Restaurants</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>

      {/* Main Swiggy-Style Navigation Header */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        {/* Brand & Location Selector */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white font-black flex items-center justify-center text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              F
            </div>
            <div className="text-2xl font-black tracking-tight text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
              Fill<span className="text-blue-600">Carts</span>
            </div>
          </Link>

          {/* Location Selector Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className="flex items-center gap-2 text-xs text-left group px-3 py-1.5 rounded-xl hover:bg-slate-100/80 transition-colors"
            >
              <MapPin size={18} className="text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-extrabold text-slate-900 flex items-center gap-1">
                  Sector 14, Gurgaon <ChevronDown size={14} className="text-slate-500" />
                </div>
                <div className="text-[11px] text-slate-500 font-semibold truncate max-w-[160px]">Haryana, 122001</div>
              </div>
            </button>

            {locationOpen && (
              <div className="absolute top-12 left-0 bg-white border border-slate-200 rounded-2xl shadow-xl w-72 p-3 z-50">
                <div className="text-xs font-black uppercase text-slate-400 mb-2 px-2">Select Your Location</div>
                <div className="space-y-1">
                  {["Sector 14, Gurgaon", "DLF Phase 3, Cyber City", "Connaught Place, New Delhi", "Hauz Khas, South Delhi"].map((loc, i) => (
                    <button
                      key={i}
                      onClick={() => setLocationOpen(false)}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <MapPin size={13} className="text-blue-600" /> {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Big Search Bar */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100/90 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm max-w-md flex-1 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <Search size={17} className="text-slate-400" />
          <input
            value={searchValue}
            onChange={handleSearchInput}
            placeholder={searchPlaceholder}
            className="bg-transparent outline-none w-full text-slate-900 text-xs font-semibold placeholder:text-slate-400"
          />
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-6">
          <Link to="/categories" className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-slate-700 hover:text-blue-600 transition-colors">
            <Search size={16} /> Search
          </Link>

          <a href="#offers" className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-slate-700 hover:text-blue-600 transition-colors">
            <Percent size={16} className="text-amber-500" /> Offers
          </a>

          <Link to="/support" className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-slate-700 hover:text-blue-600 transition-colors">
            <HelpCircle size={16} /> Help
          </Link>

          {/* Customer Login Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-500/60 rounded-full px-3.5 py-1.5 text-xs font-extrabold text-slate-800 shadow-2xs transition-all"
            >
              <User size={15} className="text-blue-600" />
              <span>Sign In</span>
            </button>

            {loginOpen && (
              <div className="absolute top-11 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl w-52 p-2 z-50">
                <Link
                  to="/login"
                  onClick={() => setLoginOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <ChevronRight size={14} className="text-blue-600" />
                  Customer Login
                </Link>
                <Link
                  to="/become-vendor"
                  onClick={() => setLoginOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors mt-1"
                >
                  <Store size={14} className="text-teal-600" />
                  Vendor Dashboard
                </Link>
              </div>
            )}
          </div>

          {/* Cart Pill */}
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-full px-4 py-2.5 shadow-md shadow-blue-600/20 transition-all">
            <ShoppingCart size={15} />
            <span>Cart</span>
            <span className="w-5 h-5 rounded-full bg-white text-blue-600 text-[11px] font-black flex items-center justify-center ml-0.5">
              2
            </span>
          </button>
        </div>
      </div>

      {/* Sub Header Links Strip */}
      <div className="bg-slate-50/90 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex gap-7 text-xs font-extrabold tracking-wide uppercase overflow-x-auto no-scrollbar">
          {navLinks.map((link, i) => {
            const active = isActiveRoute(link.to);
            return (
              <Link
                key={i}
                to={link.to}
                className={`whitespace-nowrap transition-colors ${active ? "text-blue-600 font-black border-b-2 border-blue-600 pb-0.5" : "text-slate-600 hover:text-blue-600"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
