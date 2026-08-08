import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Zap, Gift, CreditCard, Sparkles, MapPin, Search, User,
  ShoppingCart, ChevronRight, ChevronDown, QrCode, X
} from "lucide-react";
import { useCart } from "../context/CartContext";
import api from "../api";

export default function Navbar({ searchPlaceholder = "Search products, stores...", onSearchChange }) {
  const { cartCount, user, logoutUser, setShowLoginModal } = useCart();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();

  const [showAppModal, setShowAppModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");

  const handleLogout = async () => {
    await logoutUser();
    setProfileOpen(false);
    window.location.reload();
  };

  const openAppModal = (title, desc) => {
    setModalTitle(title);
    setModalDesc(desc);
    setShowAppModal(true);
    setProfileOpen(false);
  };

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
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-3 py-1.5 hover:border-blue-500 hover:text-blue-600 transition-colors text-xs font-extrabold text-slate-800 cursor-pointer animate-[fadeIn_0.3s_ease]"
                >
                  <User size={14} className="text-slate-500" />
                  <span>Hi, {user.name?.split(" ")[0]}</span>
                  <ChevronDown size={12} className="text-slate-500 transition-transform" />
                </button>

                {profileOpen && (
                  <div className="absolute top-11 right-0 bg-white border border-slate-200 rounded-[24px] shadow-xl w-64 p-4 z-[999] text-left">
                    {/* Account Header */}
                    <div className="pb-3 border-b border-slate-100 mb-2.5">
                      <h3 className="font-extrabold text-sm text-slate-900 leading-none mb-1">My Account</h3>
                      <p className="text-xs text-slate-500 font-bold">{user.phone || user.email}</p>
                    </div>

                    {/* Options List */}
                    <div className="space-y-0.5">
                      <Link
                        to="/profile?tab=profile"
                        onClick={() => setProfileOpen(false)}
                        className="block w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Edit Profile
                      </Link>
                      <Link
                        to="/profile?tab=orders"
                        onClick={() => setProfileOpen(false)}
                        className="block w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/profile?tab=addresses"
                        onClick={() => setProfileOpen(false)}
                        className="block w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Saved Addresses
                      </Link>
                      <Link
                        to="/profile?tab=subscriptions"
                        onClick={() => setProfileOpen(false)}
                        className="block w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        My Subscriptions
                      </Link>
                      <Link
                        to="/profile?tab=giftcards"
                        onClick={() => setProfileOpen(false)}
                        className="block w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        E-Gift Cards
                      </Link>
                      <Link
                        to="/profile?tab=help"
                        onClick={() => setProfileOpen(false)}
                        className="block w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Help Center
                      </Link>
                      <Link
                        to="/profile?tab=privacy"
                        onClick={() => setProfileOpen(false)}
                        className="block w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Account Privacy
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Log Out
                      </button>
                    </div>

                    {/* QR Code download widget */}
                    <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex gap-2.5 items-start text-left">
                      <div className="bg-slate-50 p-1 rounded-lg border border-slate-200 flex-shrink-0">
                        <QrCode size={34} className="text-slate-900" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-900 leading-tight">
                          Simple way to get groceries <span className="text-blue-600">at your doorstep</span>
                        </h4>
                        <p className="text-[8px] font-bold text-slate-400 mt-1 leading-none">
                          Scan the QR code and download FillCarts app
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-full text-xs transition-colors whitespace-nowrap shadow-sm"
              >
                <User size={13} />
                <span>Login</span>
              </Link>
            )}

            <Link
              to="/cart"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  setShowLoginModal(true);
                }
              }}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center relative hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <ShoppingCart size={16} />
              {cartCount > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 border border-white text-white text-[9px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              ) : (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-600 border-2 border-slate-50" />
              )}
            </Link>

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
                className={`whitespace-nowrap transition-colors ${active ? "text-blue-600 font-extrabold border-b-2 border-blue-600 pb-0.5" : "text-slate-600 hover:text-blue-600"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* App Action redirect modal */}
      {showAppModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl relative overflow-hidden text-center animate-[scaleUp_0.3s_ease-out]">
            <button
              onClick={() => setShowAppModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <X size={14} />
            </button>

            <div className="mt-2 mb-5">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <User size={22} />
              </div>
              <h2 className="text-lg font-black text-slate-900 leading-snug" style={{ fontFamily: "'Fraunces', serif" }}>
                {modalTitle} on our App
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1.5 max-w-[240px] mx-auto leading-relaxed">
                {modalDesc}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center mb-5">
              <div className="relative p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm mb-2.5">
                <QrCode size={110} className="text-slate-900" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center border border-white shadow">
                  <span className="text-[8px] font-black text-white leading-none">FC</span>
                </div>
              </div>
              <div className="text-[11px] font-extrabold text-slate-900 mb-0.5">Scan with phone camera</div>
              <div className="text-[9px] font-semibold text-slate-400">Download FillCarts App</div>
            </div>

            <button
              onClick={() => setShowAppModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl text-xs transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}