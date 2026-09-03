import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Zap, Gift, CreditCard, Sparkles, MapPin, Search, User,
  ShoppingCart, ChevronRight, ChevronDown, QrCode, X, Navigation,
  Compass, Loader2, CheckCircle2, Building2, Check, Store, Bike, Edit3, Plus, Heart,
  Menu, LogOut, ExternalLink, ArrowRight
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import api from "../api";
import SearchDropdown from "./SearchDropdown";

const VENDOR_URL =
  import.meta.env.VITE_VENDOR_URL ||
  (import.meta.env.PROD
    ? "https://fillcarts-vendor.vercel.app"
    : "http://localhost:5174");

const RIDER_URL =
  import.meta.env.VITE_RIDER_URL ||
  (import.meta.env.PROD
    ? "https://fillcarts-rider.vercel.app"
    : "http://localhost:5175");

export default function Navbar({ searchPlaceholder = "Search products, stores...", onSearchChange }) {
  const { cartCount, user, logoutUser, setShowLoginModal, userLocation, changeLocation } = useCart();
  const { wishlistCount = 0 } = useWishlist();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // App Modal state
  const [showAppModal, setShowAppModal] = useState(false);

  // Location selector state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [customArea, setCustomArea] = useState("");
  const [customPincode, setCustomPincode] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingSavedAddresses, setLoadingSavedAddresses] = useState(false);

  // Close mobile drawer and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Robust Body Scroll Locking for Drawer & Modals (iOS Safari & Android friendly)
  useEffect(() => {
    const isModalOpen = mobileMenuOpen || showAppModal || showLocationModal;
    if (isModalOpen) {
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
  }, [mobileMenuOpen, showAppModal, showLocationModal]);

  // Handle escape key to close drawer/modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setProfileOpen(false);
        setShowAppModal(false);
        setShowLocationModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (showLocationModal && user) {
      setLoadingSavedAddresses(true);
      api.get("/addresses")
        .then((res) => {
          setSavedAddresses(res.data.addresses || []);
        })
        .catch(() => {})
        .finally(() => setLoadingSavedAddresses(false));
    }
  }, [showLocationModal, user]);

  const handleDetectGps = () => {
    setIsDetectingGps(true);
    setGpsError("");
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      setIsDetectingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(3);
        const lng = position.coords.longitude.toFixed(3);
        const gpsLoc = {
          city: "Live Location",
          area: `GPS (${lat}, ${lng})`,
          pincode: "Near You",
          state: "Live",
          formatted: `Live Location (${lat}, ${lng})`,
          isGps: true
        };
        changeLocation(gpsLoc);
        setIsDetectingGps(false);
        setShowLocationModal(false);
      },
      (err) => {
        console.warn("GPS error:", err);
        setGpsError("Could not access location. Please pick a city or enter pincode below.");
        setIsDetectingGps(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSaveCustomLocation = (e) => {
    e.preventDefault();
    if (!customCity.trim() && !customPincode.trim() && !customArea.trim()) return;

    const newLoc = {
      city: customCity.trim() || "Delivery Location",
      area: customArea.trim() || customCity.trim() || "Local Area",
      pincode: customPincode.replace(/\D/g, "").slice(0, 6) || "Pincode",
      state: "India",
      formatted: `${customArea ? customArea + ", " : ""}${customCity} ${customPincode}`,
      isGps: false
    };
    changeLocation(newLoc);
    setCustomCity("");
    setCustomArea("");
    setCustomPincode("");
    setShowLocationModal(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setProfileOpen(false);
    setMobileMenuOpen(false);
    window.location.reload();
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
    { label: "Offers", to: "/#offers", badge: "HOT", badgeBg: "bg-amber-500" },
    { label: "Subscription", to: "/subscriptions", badge: "⭐", badgeBg: "bg-[#16A34A]" },
    { label: "Features", to: "/features" },
  ];

  const handlePartnerLink = (e, type) => {
    if (!user) {
      e.preventDefault();
      setMobileMenuOpen(false);
      const msg = type === "vendor"
        ? "Please login first to become a Vendor."
        : "Please login first to become a Rider.";
      setShowLoginModal(msg);
      return false;
    }
  };

  const isActiveRoute = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path.startsWith("/#")) return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm border-b border-emerald-900/10">
      {/* TOP OFFER BAR WITH MARQUEE ANIMATION */}
      <div className="bg-[#0B2616] text-emerald-50 text-[11px] sm:text-xs font-semibold h-8 sm:h-9 overflow-hidden flex items-center border-b border-emerald-950 select-none">
        <div className="flex whitespace-nowrap animate-[marquee_22s_linear_infinite]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              <span className="px-6 sm:px-10 flex items-center gap-1.5 sm:gap-2">
                <Zap size={13} className="text-amber-400" /> Express Local Delivery in Minutes
              </span>
              <span className="px-6 sm:px-10 flex items-center gap-1.5 sm:gap-2">
                <Gift size={13} className="text-blue-400" /> Today's fresh offers live now
              </span>
              <span className="px-6 sm:px-10 flex items-center gap-1.5 sm:gap-2">
                <CreditCard size={13} className="text-teal-400" /> Free delivery above ₹299
              </span>
              <span className="px-6 sm:px-10 flex items-center gap-1.5 sm:gap-2">
                <Sparkles size={13} className="text-violet-400" /> 100% Fresh & Quality Assured
              </span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>

      {/* MAIN NAVBAR */}
      <div className="glass-nav bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between gap-1 sm:gap-3 md:gap-6">
          
          {/* Left: Mobile Menu Trigger + Logo */}
          <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">
            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1 sm:p-2 rounded-xl text-slate-700 hover:text-[#16A34A] hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition-colors cursor-pointer"
              aria-label="Open Mobile Menu"
            >
              <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="text-lg sm:text-2xl font-black tracking-tight flex-shrink-0 flex items-center gap-0.5 sm:gap-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
              <span className="text-[#17231A]">Fill</span>
              <span className="text-[#16A34A]">Carts</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] inline-block ml-0.5" />
            </Link>
          </div>

          {/* Center: Location Selector Trigger (Desktop & Tablet) */}
          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            className="hidden md:flex items-center gap-2 border border-slate-200 hover:border-[#16A34A] rounded-full px-3.5 py-1.5 bg-white flex-shrink-0 transition-all cursor-pointer shadow-2xs text-left group"
          >
            <div className="w-7 h-7 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MapPin size={14} />
            </div>
            <div className="flex flex-col leading-none pr-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                Deliver to {userLocation?.isGps ? <span className="text-[#166534] font-bold">● Live GPS</span> : "Location"}
              </span>
              <span className="text-xs font-black text-[#17231A] truncate max-w-[120px] lg:max-w-[150px] mt-0.5">
                {userLocation?.area || userLocation?.city || "Select City"}
              </span>
            </div>
            <ChevronDown size={13} className="text-slate-400 group-hover:text-[#16A34A] transition-colors shrink-0" />
          </button>

          {/* Search Input Bar with Responsive Width Constraint */}
          <div className="flex flex-1 min-w-[70px] max-w-[130px] min-[375px]:max-w-[160px] min-[425px]:max-w-[220px] sm:max-w-sm md:max-w-md mx-1 sm:mx-2">
            <SearchDropdown
              placeholder={searchPlaceholder}
              defaultValue={searchValue}
              onSearchSubmit={(val) => {
                setSearchValue(val);
                if (onSearchChange) onSearchChange(val);
                navigate(`/search?q=${encodeURIComponent(val)}`);
              }}
              inputClassName="bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-full shadow-2xs text-[11px] sm:text-xs py-1 sm:py-2 truncate"
            />
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
            {/* Account / User Menu */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 sm:gap-1.5 bg-[#FFFCF5] hover:bg-[#ECFDF3] border border-slate-200 hover:border-emerald-300 rounded-full p-1 sm:px-3 sm:py-1.5 text-xs font-extrabold text-[#17231A] transition-colors cursor-pointer"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <div className="w-5 h-5 sm:w-5 sm:h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-black">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="hidden md:inline">Hi, {user.name?.split(" ")[0]}</span>
                  <ChevronDown size={12} className="text-slate-400 hidden md:inline" />
                </button>

                {profileOpen && (
                  <div className="absolute top-11 right-0 bg-white border border-emerald-100 rounded-2xl shadow-xl w-60 p-3.5 z-[999] text-left animate-fade-in">
                    <div className="pb-3 border-b border-slate-100 mb-2 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <h3 className="font-extrabold text-sm text-[#17231A] truncate">{user.name || "Customer"}</h3>
                        <p className="text-xs text-slate-500 truncate font-medium">{user.phone || user.email}</p>
                      </div>
                      <span className="text-[9px] font-extrabold bg-[#ECFDF3] text-[#166534] px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">Verified</span>
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
                        to="/wishlist"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Heart size={13} className="text-rose-500" />
                          <span>My Wishlist</span>
                        </span>
                        {wishlistCount > 0 ? (
                          <span className="bg-rose-100 text-rose-700 font-extrabold text-[10px] px-1.5 py-0.5 rounded-full">
                            {wishlistCount}
                          </span>
                        ) : (
                          <span className="text-rose-600 font-bold text-[10px]">❤️</span>
                        )}
                      </Link>
                      <Link
                        to="/profile?tab=subscriptions"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#ECFDF3] hover:text-[#166534] transition-colors"
                      >
                        <span>Subscriptions</span>
                        <span className="bg-[#ECFDF3] text-[#166534] border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded">Active</span>
                      </Link>
                      <Link
                        to="/profile?tab=addresses"
                        onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#ECFDF3] hover:text-[#166534] transition-colors"
                      >
                        Saved Addresses
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <LogOut size={13} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-1 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold w-7 h-7 sm:w-auto sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs transition-colors shadow-xs"
                title="Login / Sign Up"
              >
                <User size={13} className="text-white sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-[#FFFCF5] border border-slate-200 hover:border-rose-300 hover:bg-rose-50 flex items-center justify-center relative text-slate-700 hover:text-rose-600 transition-all cursor-pointer shadow-2xs group"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={14} className={`sm:w-4 sm:h-4 ${wishlistCount > 0 ? "text-rose-600 fill-rose-600" : "group-hover:text-rose-500"}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] sm:min-w-[17px] sm:h-[17px] px-0.5 sm:px-1 rounded-full bg-rose-600 text-white text-[8px] sm:text-[9px] font-black flex items-center justify-center shadow-sm animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  setShowLoginModal(true);
                }
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-[#FFFCF5] border border-slate-200 hover:border-[#16A34A] hover:bg-[#ECFDF3] flex items-center justify-center relative text-[#17231A] hover:text-[#166534] transition-all cursor-pointer shadow-2xs"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] sm:min-w-[17px] sm:h-[17px] px-0.5 sm:px-1 rounded-full bg-[#16A34A] text-white text-[8px] sm:text-[9px] font-black flex items-center justify-center shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Download App CTA (Desktop) */}
            <button
              type="button"
              onClick={() => setShowAppModal(true)}
              className="hidden lg:flex bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-extrabold rounded-full px-3.5 py-1.5 whitespace-nowrap transition-all shadow-sm hover:shadow-md cursor-pointer items-center gap-1.5"
            >
              <QrCode size={14} />
              <span>Get App</span>
            </button>
          </div>
        </div>

        {/* Secondary Links Bar (Desktop Horizontal) */}
        <nav className="border-t border-slate-100 bg-white/70 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              {navLinks.map((link, i) => {
                const active = isActiveRoute(link.to);
                return (
                  <Link
                    key={i}
                    to={link.to}
                    className={`flex items-center gap-1.5 whitespace-nowrap py-1 transition-all ${
                      active
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
                  </Link>
                );
              })}
            </div>

            {/* Become a Vendor & Become a Rider Buttons (Desktop) */}
            <div className="flex items-center gap-2.5 text-xs font-bold whitespace-nowrap">
              <a
                href={VENDOR_URL}
                onClick={(e) => handlePartnerLink(e, "vendor")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-slate-700 border-slate-200 hover:border-emerald-300 hover:text-[#166534] hover:bg-[#ECFDF3] bg-white shadow-2xs cursor-pointer"
                title="Partner with Fillcarts as a Store Vendor"
              >
                <Store size={13} className="text-[#16A34A]" />
                <span>Become a Vendor</span>
              </a>
              <a
                href={RIDER_URL}
                onClick={(e) => handlePartnerLink(e, "rider")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-slate-700 border-slate-200 hover:border-emerald-300 hover:text-[#166534] hover:bg-[#ECFDF3] bg-white shadow-2xs cursor-pointer"
                title="Join Fillcarts as a Delivery Partner Rider"
              >
                <Bike size={13} className="text-[#16A34A]" />
                <span>Become a Rider</span>
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* MOBILE SLIDE-IN DRAWER WITH INDEPENDENT SCROLL */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99999] lg:hidden flex overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200 animate-fade-in touch-none"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel Container */}
          <div
            className="relative w-[85%] max-w-[320px] bg-white h-[100dvh] shadow-2xl flex flex-col justify-between z-10 animate-slide-right overscroll-contain touch-pan-y"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top Header (Fixed/Shrink-0) */}
            <div className="shrink-0 p-4 bg-gradient-to-b from-[#ECFDF3] to-white border-b border-slate-100 flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-black tracking-tight flex items-center gap-1"
              >
                <span className="text-[#17231A]">Fill</span>
                <span className="text-[#16A34A]">Carts</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] inline-block ml-0.5" />
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer shadow-2xs transition-colors"
                aria-label="Close Menu"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Middle Content Body (Independent Scroll) */}
            <div className="flex-1 overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch py-2">
              {/* User Account / Profile Box in Drawer */}
              <div className="px-4 pb-3 border-b border-slate-100">
                {user ? (
                  <div className="bg-[#FFFCF5] border border-emerald-200 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-black text-sm">
                        {user.name ? user.name[0].toUpperCase() : "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-sm text-[#17231A] truncate">{user.name || "Customer"}</div>
                        <div className="text-xs text-slate-500 truncate">{user.phone || user.email}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to="/profile?tab=orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center py-1.5 px-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-[#166534] hover:bg-emerald-50 transition-colors"
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/profile?tab=profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center py-1.5 px-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-[#166534] hover:bg-emerald-50 transition-colors"
                      >
                        Profile
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#ECFDF3] border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
                    <div className="text-xs font-extrabold text-[#166534]">Welcome to FillCarts</div>
                    <p className="text-[11px] text-slate-600 font-medium">Log in to track orders, manage subscriptions and saved addresses.</p>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs py-2 rounded-xl shadow-xs transition-colors text-center"
                    >
                      Login / Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Location Quick Switcher */}
              <div className="px-4 py-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLocationModal(true);
                  }}
                  className="w-full flex items-center justify-between bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-2xl p-3 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-7 h-7 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center shrink-0">
                      <MapPin size={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Delivery Location</div>
                      <div className="text-xs font-extrabold text-[#17231A] truncate mt-0.5">
                        {userLocation?.formatted || userLocation?.city || "Select Location"}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#16A34A] font-bold shrink-0">Change</span>
                </button>
              </div>

              {/* Primary Navigation Links List */}
              <div className="p-3 space-y-1">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 py-1">Menu</div>
                {navLinks.map((link, i) => {
                  const active = isActiveRoute(link.to);
                  return (
                    <Link
                      key={i}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                        active
                          ? "bg-[#ECFDF3] text-[#166534] font-extrabold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className={`${link.badgeBg} text-white text-[9px] font-black px-1.5 py-0.5 rounded-full`}>
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart size={14} className="text-rose-500" /> My Wishlist
                  </span>
                  {wishlistCount > 0 && (
                    <span className="bg-rose-100 text-rose-700 font-extrabold text-[10px] px-1.5 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Partner Onboarding Quick Cards in Mobile Drawer */}
              <div className="p-4 border-t border-slate-100 space-y-2">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Partner with FillCarts</div>
                <a
                  href={VENDOR_URL}
                  onClick={(e) => handlePartnerLink(e, "vendor")}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFCF5] border border-emerald-200 hover:bg-[#ECFDF3] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#166534] flex items-center justify-center font-bold">
                      <Store size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#17231A]">Become a Vendor</div>
                      <div className="text-[10px] text-slate-500">Sell fresh produce & daily goods</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </a>

                <a
                  href={RIDER_URL}
                  onClick={(e) => handlePartnerLink(e, "rider")}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFCF5] border border-emerald-200 hover:bg-[#ECFDF3] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Bike size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#17231A]">Become a Rider</div>
                      <div className="text-[10px] text-slate-500">Earn daily with fast deliveries</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </a>
              </div>
            </div>

            {/* Drawer Bottom Actions (Fixed/Shrink-0) */}
            <div className="shrink-0 p-4 border-t border-slate-100 bg-slate-50 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowAppModal(true);
                }}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <QrCode size={14} />
                <span>Get Mobile App</span>
              </button>

              {user && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full bg-white border border-slate-200 text-rose-600 font-bold text-xs py-2 rounded-xl hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Download App Modal */}
      {showAppModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="bg-white border border-emerald-100 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-center animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowAppModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close modal"
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
                className="flex-1 bg-[#17231A] hover:bg-slate-800 text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors"
              >
                App Store
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
              >
                Google Play
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="bg-white border border-emerald-100 rounded-[28px] sm:rounded-[32px] w-full max-w-md p-5 sm:p-6 shadow-2xl relative overflow-hidden text-left animate-scale-up max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer z-10"
              aria-label="Close location modal"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4 shrink-0 pr-8">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#ECFDF3] text-[#16A34A] rounded-2xl flex items-center justify-center shrink-0 border border-emerald-200">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#17231A] leading-snug">
                  Select Delivery Location
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Pick your area or city for express 15-minute delivery
                </p>
              </div>
            </div>

            <div className="overflow-y-auto overscroll-contain pr-1 flex-1">
              {/* Current Active Location Display Pill */}
              <div className="bg-[#FFFCF5] border border-slate-200 rounded-2xl p-3 mb-3.5 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Location</div>
                  <div className="text-xs font-extrabold text-[#17231A] flex items-center gap-1.5 mt-0.5 truncate">
                    <MapPin size={13} className="text-[#16A34A] shrink-0" />
                    <span className="truncate">{userLocation?.formatted || `${userLocation?.area}, ${userLocation?.city}`}</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0">
                  ⚡ Active
                </span>
              </div>

              {/* GPS Auto Detection Button */}
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold p-3 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mb-3.5"
              >
                {isDetectingGps ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Detecting your GPS location...</span>
                  </>
                ) : (
                  <>
                    <Navigation size={16} />
                    <span>Use Current Location (GPS)</span>
                  </>
                )}
              </button>

              {gpsError && (
                <p className="text-[11px] font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl mb-3.5 border border-rose-200">
                  {gpsError}
                </p>
              )}

              {/* Section 2: Saved Profile Locations */}
              <div>
                <div className="text-xs font-black text-[#17231A] mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-[#16A34A]" /> Your Saved Locations
                  </span>
                  {user && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowLocationModal(false);
                        navigate("/profile?tab=addresses");
                      }}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-extrabold flex items-center gap-0.5 transition-colors cursor-pointer"
                    >
                      <span>Manage</span> <ChevronRight size={12} />
                    </button>
                  )}
                </div>

                {loadingSavedAddresses ? (
                  <div className="text-xs text-slate-400 font-bold py-4 flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin text-[#16A34A]" /> Loading saved locations...
                  </div>
                ) : !user ? (
                  <div className="text-center py-4 bg-[#FFFCF5] p-3 rounded-2xl border border-slate-200 space-y-2">
                    <p className="text-xs text-slate-600 font-semibold">Log in to select or manage your saved delivery addresses.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLocationModal(false);
                        setShowLoginModal(true);
                      }}
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-4 py-2 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer inline-block"
                    >
                      Login Now
                    </button>
                  </div>
                ) : savedAddresses.length === 0 && !user.address ? (
                  <div className="text-center py-4 bg-[#FFFCF5] p-3 rounded-2xl border border-slate-200 space-y-2">
                    <p className="text-xs text-slate-600 font-semibold">No saved addresses found in your profile.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLocationModal(false);
                        navigate("/profile?tab=addresses");
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <Plus size={13} /> Add Address in Profile
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {user.address && (
                      <div
                        onClick={() => {
                          changeLocation({
                            city: "Home",
                            area: user.address,
                            pincode: user.pincode || "452010",
                            state: "Primary",
                            formatted: user.address,
                            isGps: false
                          });
                          setShowLocationModal(false);
                        }}
                        className="w-full text-left p-2.5 rounded-2xl border border-slate-200 hover:border-[#16A34A] hover:bg-[#ECFDF3] transition-all flex items-center justify-between cursor-pointer group bg-white shadow-2xs"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              PRIMARY
                            </span>
                            <span className="text-xs font-extrabold text-[#17231A] group-hover:text-[#166534] truncate">
                              {user.name || "Primary Profile Address"}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{user.address}</div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowLocationModal(false);
                            navigate("/profile?tab=addresses");
                          }}
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-extrabold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                          title="Edit address in Profile"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                      </div>
                    )}

                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => {
                          changeLocation({
                            city: addr.city || addr.type || "Address",
                            area: addr.street || addr.address_line,
                            pincode: addr.pincode || "452010",
                            state: addr.state || addr.type,
                            formatted: `${addr.street || addr.address_line}${addr.pincode ? ' (' + addr.pincode + ')' : ''}`,
                            isGps: false
                          });
                          setShowLocationModal(false);
                        }}
                        className="w-full text-left p-2.5 rounded-2xl border border-slate-200 hover:border-[#16A34A] hover:bg-[#ECFDF3] transition-all flex items-center justify-between cursor-pointer group bg-white shadow-2xs"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {addr.type || "HOME"}
                            </span>
                            <span className="text-xs font-extrabold text-[#17231A] group-hover:text-[#166534] truncate">
                              {addr.name || user?.name || "Saved Address"}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            {addr.street || addr.address_line}
                            {addr.pincode ? ` - ${addr.pincode}` : ''}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowLocationModal(false);
                            navigate("/profile?tab=addresses");
                          }}
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-extrabold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                          title="Edit address in Profile"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}