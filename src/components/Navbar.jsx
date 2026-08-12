import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Zap, Gift, CreditCard, Sparkles, MapPin, Search, User,
  ShoppingCart, ChevronRight, ChevronDown, QrCode, X, Navigation,
  Compass, Loader2, CheckCircle2, Building2, Check, Store, Bike
} from "lucide-react";
import { useCart } from "../context/CartContext";
import api from "../api";

export default function Navbar({ searchPlaceholder = "Search products, stores...", onSearchChange }) {
  const { cartCount, user, logoutUser, setShowLoginModal, userLocation, changeLocation } = useCart();
  const [profileOpen, setProfileOpen] = useState(false);
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

  const popularCities = [
    { city: "Indore", area: "Vijay Nagar", pincode: "452010", state: "M.P." },
    { city: "Bhopal", area: "MP Nagar", pincode: "462011", state: "M.P." },
    { city: "Bengaluru", area: "Koramangala", pincode: "560034", state: "Karnataka" },
    { city: "Mumbai", area: "Andheri West", pincode: "400053", state: "Maharashtra" },
    { city: "Delhi NCR", area: "Connaught Place", pincode: "110001", state: "Delhi" },
    { city: "Hyderabad", area: "Hitech City", pincode: "500081", state: "Telangana" },
    { city: "Pune", area: "Viman Nagar", pincode: "411014", state: "Maharashtra" },
    { city: "Ahmedabad", area: "SG Highway", pincode: "380015", state: "Gujarat" },
    { city: "Jaipur", area: "Malviya Nagar", pincode: "302017", state: "Rajasthan" },
  ];

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
    window.location.reload();
  };

  const handleSearchInput = (e) => {
    setSearchValue(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const navLinks = [
    { label: "Categories", to: "/categories" },
    { label: "Offers", to: "/#offers", badge: "HOT", badgeBg: "bg-amber-500" },
    { label: "Subscription", to: "/subscriptions", badge: "⭐", badgeBg: "bg-[#16A34A]" },
    { label: "Features", to: "/features" },
  ];

  const isActiveRoute = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path.startsWith("/#")) return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm border-b border-emerald-900/10">
      {/* 5. TOP OFFER BAR WITH MARQUEE ANIMATION (VISUAL ONLY) */}
      <div className="bg-[#0B2616] text-emerald-50 text-xs font-semibold h-9 overflow-hidden flex items-center border-b border-emerald-950 select-none">
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

      {/* 6. MAIN NAVBAR */}
      <div className="glass-nav bg-white/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 md:gap-6">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-tight flex-shrink-0 flex items-center gap-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
            <span className="text-[#17231A]">Fill</span>
            <span className="text-[#16A34A]">Carts</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] inline-block ml-0.5" />
          </Link>

          {/* Location Selector Trigger */}
          <button
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
              <span className="text-xs font-black text-[#17231A] truncate max-w-[130px] mt-0.5">
                {userLocation?.area || userLocation?.city || "Select City"}
              </span>
            </div>
            <ChevronDown size={13} className="text-slate-400 group-hover:text-[#16A34A] transition-colors shrink-0" />
          </button>

          {/* Search Input Bar */}
          <div className="hidden md:flex items-center gap-2 bg-[#FFFCF5] border border-slate-200 rounded-full px-4 py-2 text-base text-slate-500 max-w-xs flex-1 focus-within:border-[#16A34A]">
            <Search size={15} className="text-slate-400" />
            <input
              value={searchValue}
              onChange={handleSearchInput}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchValue.trim()) {
                  navigate(`/categories?q=${encodeURIComponent(searchValue.trim())}`);
                }
              }}
              placeholder={searchPlaceholder}
              className="bg-transparent outline-none w-full text-slate-900 text-sm font-medium"
            />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Account / User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 bg-[#FFFCF5] hover:bg-[#ECFDF3] border border-slate-200 hover:border-emerald-300 rounded-full px-3.5 py-1.5 text-xs font-extrabold text-[#17231A] transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-black">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline">Hi, {user.name?.split(" ")[0]}</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>

                {profileOpen && (
                  <div className="absolute top-11 right-0 bg-white border border-emerald-100 rounded-2xl shadow-xl w-60 p-3.5 z-[999] text-left">
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
              className="w-9 h-9 rounded-full bg-[#FFFCF5] border border-slate-200 hover:border-[#16A34A] hover:bg-[#ECFDF3] flex items-center justify-center relative text-[#17231A] hover:text-[#166534] transition-all cursor-pointer shadow-2xs"
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

            {/* Become a Vendor & Become a Rider Links */}
            <div className="ml-auto flex items-center gap-2 sm:gap-3 text-xs font-bold whitespace-nowrap">
              <Link
                to="/become-vendor"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  isActiveRoute("/become-vendor")
                    ? "bg-[#ECFDF3] text-[#166534] border-emerald-300 font-extrabold shadow-2xs"
                    : "text-slate-700 border-slate-200/80 hover:border-emerald-300 hover:text-[#166534] hover:bg-[#ECFDF3]/50"
                }`}
              >
                <Store size={13} className="text-[#16A34A]" />
                <span>Become a Vendor</span>
              </Link>
              <Link
                to="/become-rider"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                  isActiveRoute("/become-rider")
                    ? "bg-[#ECFDF3] text-[#166534] border-emerald-300 font-extrabold shadow-2xs"
                    : "text-slate-700 border-slate-200/80 hover:border-emerald-300 hover:text-[#166534] hover:bg-[#ECFDF3]/50"
                }`}
              >
                <Bike size={13} className="text-[#16A34A]" />
                <span>Become a Rider</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Download App Modal */}
      {showAppModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-100 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-center">
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

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-100 rounded-[32px] w-full max-w-md p-6 shadow-2xl relative overflow-hidden text-left">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#ECFDF3] text-[#16A34A] rounded-2xl flex items-center justify-center shrink-0 border border-emerald-200">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#17231A] leading-snug">
                  Select Delivery Location
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Pick your area or city for express 15-minute delivery
                </p>
              </div>
            </div>

            {/* Current Active Location Display Pill */}
            <div className="bg-[#FFFCF5] border border-slate-200 rounded-2xl p-3.5 mb-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Location</div>
                <div className="text-xs font-extrabold text-[#17231A] flex items-center gap-1.5 mt-0.5">
                  <MapPin size={13} className="text-[#16A34A]" />
                  <span>{userLocation?.formatted || `${userLocation?.area}, ${userLocation?.city}`}</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0">
                ⚡ Active
              </span>
            </div>

            {/* GPS Auto Detection Button */}
            <button
              onClick={handleDetectGps}
              disabled={isDetectingGps}
              className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold p-3.5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mb-4"
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
              <p className="text-[11px] font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl mb-4 border border-rose-200">
                {gpsError}
              </p>
            )}

            {/* Saved Profile Addresses if available */}
            {user && (
              <div className="mb-4">
                <div className="text-xs font-black text-[#17231A] mb-2 flex items-center gap-1.5">
                  <Building2 size={13} className="text-[#16A34A]" /> Your Saved Addresses
                </div>
                {loadingSavedAddresses ? (
                  <div className="text-xs text-slate-400 font-bold py-2 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-[#16A34A]" /> Loading addresses...
                  </div>
                ) : savedAddresses.length === 0 && !user.address ? (
                  <div className="text-xs text-slate-400 font-semibold bg-[#FFFCF5] p-3 rounded-xl border border-slate-100">
                    No saved addresses found. Enter one below or add in your profile.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {user.address && (
                      <button
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
                        className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-[#16A34A] hover:bg-[#ECFDF3] transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-extrabold text-[#17231A] group-hover:text-[#166534]">Primary Profile Address</div>
                          <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{user.address}</div>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 shrink-0" />
                      </button>
                    )}
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => {
                          changeLocation({
                            city: addr.type || "Address",
                            area: addr.address_line,
                            pincode: addr.pincode || "452010",
                            state: addr.type,
                            formatted: `${addr.address_line} (${addr.pincode || ''})`,
                            isGps: false
                          });
                          setShowLocationModal(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-[#16A34A] hover:bg-[#ECFDF3] transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-extrabold text-[#17231A] group-hover:text-[#166534]">{addr.type} Address</div>
                          <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{addr.address_line}</div>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Popular Cities Quick Select */}
            <div className="mb-4">
              <div className="text-xs font-black text-[#17231A] mb-2 flex items-center gap-1.5">
                <Compass size={13} className="text-[#16A34A]" /> Popular Cities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularCities.map((item) => {
                  const isSelected = userLocation?.city === item.city;
                  return (
                    <button
                      key={item.city}
                      onClick={() => {
                        changeLocation({
                          city: item.city,
                          area: item.area,
                          pincode: item.pincode,
                          state: item.state,
                          formatted: `${item.area}, ${item.city} (${item.pincode})`,
                          isGps: false
                        });
                        setShowLocationModal(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#16A34A] text-white border-[#16A34A] shadow-xs"
                          : "bg-[#FFFCF5] text-slate-700 border-slate-200 hover:bg-[#ECFDF3] hover:border-emerald-300"
                      }`}
                    >
                      {item.city}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Custom Locality Form */}
            <form onSubmit={handleSaveCustomLocation} className="border-t border-slate-100 pt-3 space-y-2.5">
              <div className="text-xs font-black text-[#17231A]">Or Enter City / Area / Pincode Manually</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City / Area"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold bg-[#FFFCF5] border border-slate-200 rounded-xl outline-none focus:border-[#16A34A]"
                />
                <input
                  type="text"
                  placeholder="6-digit Pincode"
                  value={customPincode}
                  onChange={(e) => setCustomPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="px-3 py-2 text-xs font-semibold bg-[#FFFCF5] border border-slate-200 rounded-xl outline-none focus:border-[#16A34A]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
              >
                Set Delivery Location
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}