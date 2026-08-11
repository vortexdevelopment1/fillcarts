import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Zap, Gift, CreditCard, Sparkles, MapPin, Search, User,
  ShoppingCart, ChevronDown, QrCode, X, Flame, Star, Check
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar({ searchPlaceholder = "Search products, stores or categories...", onSearchChange }) {
  const { cartCount, user, logoutUser, setShowLoginModal } = useCart();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const [showAppModal, setShowAppModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Indiranagar, Bengaluru");
  const [tempLocationInput, setTempLocationInput] = useState("");

  const handleLogout = async () => {
    await logoutUser();
    setProfileOpen(false);
    window.location.reload();
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(`/categories?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleSearchInput = (e) => {
    setSearchValue(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const handleSaveLocation = (loc) => {
    if (loc.trim()) {
      setCurrentLocation(loc.trim());
      setShowLocationModal(false);
    }
  };

  const navLinks = [
    { label: "Categories", to: "/categories" },
    { label: "Offers", to: "/#offers", badge: "HOT", badgeBg: "bg-amber-500" },
    { label: "Subscription", to: "/subscriptions", badge: "⭐", badgeBg: "bg-emerald-600" },
    { label: "Features", to: "/features" },
  ];

  const isActiveRoute = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path.startsWith("/#")) return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm border-b border-emerald-900/10">
      {/* 5. TOP OFFER BAR WITH MARQUEE ANIMATION */}
      <div className="bg-[#0B2616] text-emerald-50 text-xs font-semibold h-9 overflow-hidden flex items-center border-b border-emerald-950">
        <div className="flex whitespace-nowrap animate-[marquee_22s_linear_infinite]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              <span className="px-10 flex items-center gap-2">
                <Zap size={13} className="text-amber-400 fill-amber-400" /> Express Local Delivery
              </span>
              <span className="px-10 flex items-center gap-2">
                <Gift size={13} className="text-emerald-300" /> Today's offers live now
              </span>
              <span className="px-10 flex items-center gap-2">
                <CreditCard size={13} className="text-amber-300" /> Free delivery above ₹299
              </span>
              <span className="px-10 flex items-center gap-2">
                <Sparkles size={13} className="text-teal-300" /> 100% Fresh & Quality Assured
              </span>
            </div>
          ))}
        </div>
        <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      </div>

      {/* 6. MAIN NAVBAR */}
      <div className="glass-nav bg-white/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 md:gap-6">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-tight flex-shrink-0 flex items-center gap-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
            <span className="text-[#17231A]">Fill</span>
            <span className="text-[#16A34A]">Carts</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] inline-block ml-0.5" />
          </Link>

          {/* Location Selector Pill */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="hidden lg:flex items-center gap-1.5 bg-[#ECFDF3] hover:bg-emerald-100 text-[#166534] text-xs font-bold px-3 py-1.5 rounded-full transition-colors border border-emerald-200/60 cursor-pointer flex-shrink-0"
          >
            <MapPin size={13} className="text-[#16A34A] flex-shrink-0" />
            <span className="max-w-[130px] truncate">{currentLocation}</span>
            <ChevronDown size={12} className="opacity-60" />
          </button>

          {/* Center Search Input */}
          <div className="flex-1 max-w-sm relative hidden sm:block">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5 focus-within:border-[#16A34A] focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <Search size={15} className="text-slate-400 flex-shrink-0" />
              <input
                value={searchValue}
                onChange={handleSearchInput}
                onKeyDown={handleSearchSubmit}
                placeholder={searchPlaceholder}
                className="bg-transparent outline-none w-full text-slate-800 text-xs font-medium placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Account / User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-full px-3.5 py-1.5 text-xs font-extrabold text-[#17231A] transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-black">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline">Hi, {user.name?.split(" ")[0]}</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>

                {profileOpen && (
                  <div className="absolute top-11 right-0 bg-white border border-slate-100 rounded-2xl shadow-xl w-60 p-3.5 z-[999] text-left animate-in fade-in zoom-in-95 duration-150">
                    <div className="pb-3 border-b border-slate-100 mb-2">
                      <h3 className="font-extrabold text-sm text-[#17231A]">{user.name || "Customer"}</h3>
                      <p className="text-xs text-slate-500 truncate font-medium">{user.phone || user.email}</p>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        to="/profile?tab=profile"
                        onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#ECFDF3] hover:text-[#166534] transition-colors"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/profile?tab=orders"
                        onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#ECFDF3] hover:text-[#166534] transition-colors"
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/profile?tab=subscriptions"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#ECFDF3] hover:text-[#166534] transition-colors"
                      >
                        <span>Subscriptions</span>
                        <span className="bg-emerald-100 text-[#166534] text-[10px] font-bold px-1.5 py-0.5 rounded">Active</span>
                      </Link>
                      <Link
                        to="/profile?tab=addresses"
                        onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#ECFDF3] hover:text-[#166534] transition-colors"
                      >
                        Saved Addresses
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-[#ECFDF3] hover:bg-emerald-100 text-[#166534] font-extrabold px-4 py-2 rounded-full text-xs transition-colors border border-emerald-200/60"
              >
                <User size={14} className="text-[#16A34A]" />
                <span>Login</span>
              </Link>
            )}

            {/* Cart Button */}
            <Link
              to="/cart"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  setShowLoginModal(true);
                }
              }}
              className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 hover:border-[#16A34A] hover:bg-[#ECFDF3] flex items-center justify-center relative text-slate-700 hover:text-[#166534] transition-all cursor-pointer"
              title="Cart"
            >
              <ShoppingCart size={17} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#16A34A] text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Download App CTA */}
            <button
              onClick={() => setShowAppModal(true)}
              className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-extrabold rounded-full px-4 py-2 whitespace-nowrap transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <QrCode size={14} />
              <span className="hidden sm:inline">Get App</span>
            </button>
          </div>
        </div>

        {/* Secondary Links Bar */}
        <nav className="border-t border-slate-100 bg-white/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-6 text-xs font-bold overflow-x-auto no-scrollbar">
            {navLinks.map((link, i) => {
              const active = isActiveRoute(link.to);
              return (
                <a
                  key={i}
                  href={link.to}
                  className={`flex items-center gap-1.5 whitespace-nowrap py-1 transition-all ${active
                      ? "text-[#16A34A] font-extrabold border-b-2 border-[#16A34A]"
                      : "text-slate-700 hover:text-[#16A34A]"
                    }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`${link.badgeBg} text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none`}>
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}

            {/* Quick sub-text or category pill indicator */}
            <div className="ml-auto hidden md:flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <span>📍 Neighborhood Stores: <strong className="text-[#166534]">24 Active</strong></span>
            </div>
          </div>
        </nav>
      </div>

      {/* Location Picker Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X size={15} />
            </button>

            <div className="mb-4">
              <div className="w-10 h-10 bg-[#ECFDF3] text-[#16A34A] rounded-2xl flex items-center justify-center mb-3">
                <MapPin size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#17231A]">Set Delivery Location</h3>
              <p className="text-xs text-slate-500 mt-0.5">Select your area to discover local stores & fast 15-minute delivery</p>
            </div>

            <div className="space-y-3 mb-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter area, pincode or street name..."
                  value={tempLocationInput}
                  onChange={(e) => setTempLocationInput(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Popular Locations</div>
                {[
                  "Indiranagar, Bengaluru",
                  "Koramangala, Bengaluru",
                  "HSR Layout, Bengaluru",
                  "Bandra West, Mumbai",
                  "Connaught Place, New Delhi"
                ].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleSaveLocation(loc)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#ECFDF3] hover:text-[#166534] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{loc}</span>
                    {currentLocation === loc && <Check size={14} className="text-[#16A34A]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowLocationModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveLocation(tempLocationInput || currentLocation)}
                className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download App Modal */}
      {showAppModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setShowAppModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X size={15} />
            </button>

            <div className="mt-2 mb-4">
              <div className="w-12 h-12 bg-[#ECFDF3] text-[#16A34A] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <QrCode size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#17231A]">Download FillCarts App</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[260px] mx-auto">
                Scan QR code to order fresh groceries & daily subscriptions on mobile.
              </p>
            </div>

            <div className="bg-[#ECFDF3] border border-emerald-200/80 rounded-2xl p-4 flex flex-col items-center justify-center mb-4">
              <div className="p-2.5 bg-white border border-emerald-200 rounded-xl shadow-sm mb-2">
                <QrCode size={110} className="text-[#17231A]" />
              </div>
              <div className="text-xs font-extrabold text-[#166534]">Scan with Smartphone Camera</div>
              <div className="text-[10px] text-emerald-700 font-medium">Available on iOS & Android</div>
            </div>

            <div className="flex gap-2">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#17231A] hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl text-xs transition-colors"
              >
                App Store
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold py-3 rounded-xl text-xs transition-colors shadow-sm"
              >
                Google Play
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}