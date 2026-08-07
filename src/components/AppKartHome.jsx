import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  Truck, Gift, CreditCard, Moon, MapPin, Search, User, ShoppingCart,
  Store, Carrot, Apple, Milk, Croissant, Pill, UtensilsCrossed,
  PawPrint, Home, Sparkles, Smartphone, Zap, Navigation, Lock, Star,
  Radar, Wallet, Bell, RotateCcw, Repeat, Plus, QrCode,
  Download, ChevronRight, ArrowRight, Percent, Clock, Award, ShieldCheck
} from "lucide-react";

// Primary Service Hubs (Swiggy-style 4-Hub Banners)
const serviceHubs = [
  {
    id: "instamart",
    title: "FillCarts Instamart",
    subtitle: "Instant Groceries & Fresh Fruits",
    badge: "DELIVERED IN MINS",
    badgeBg: "bg-teal-500",
    gradient: "from-teal-600 via-emerald-600 to-teal-700",
    icon: Carrot,
    link: "/categories?category=grocery",
    tag: "Groceries & Vegetables"
  },
  {
    id: "food",
    title: "Food & Restaurants",
    subtitle: "80+ Local Restaurants & Dishes",
    badge: "FLAT 50% OFF",
    badgeBg: "bg-blue-600",
    gradient: "from-blue-600 via-indigo-600 to-blue-700",
    icon: UtensilsCrossed,
    link: "/categories?category=food",
    tag: "Burgers, Biryani & Pizza"
  },
  {
    id: "subscriptions",
    title: "Daily Subscriptions",
    subtitle: "Milk, Bread & Curd at 7 AM",
    badge: "AUTO-DELIVERED",
    badgeBg: "bg-violet-600",
    gradient: "from-violet-600 via-purple-600 to-indigo-700",
    icon: Repeat,
    link: "/subscriptions",
    tag: "Never Run Out"
  },
  {
    id: "pharmacy",
    title: "Genie & Pharmacy",
    subtitle: "Medicines & Urgent Packages",
    badge: "24/7 EXPRESS",
    badgeBg: "bg-amber-600",
    gradient: "from-amber-600 via-orange-600 to-amber-700",
    icon: Pill,
    link: "/categories?category=pharmacy",
    tag: "Verified Chemists"
  }
];

// "What's on your mind?" (Swiggy Circular Avatars Carousel)
const whatsOnMind = [
  { key: "fruits", name: "Fresh Fruits", img: "fresh-fruit-01", count: "180+ Items" },
  { key: "grocery", name: "Groceries", img: "grocery-basket-01", count: "420+ Items" },
  { key: "dairy", name: "Milk & Dairy", img: "dairy-milk-01", count: "96+ Items" },
  { key: "food", name: "Biryani & Food", img: "fastfood-01", count: "80+ Stores" },
  { key: "bakery", name: "Bakery Bread", img: "bakery-bread-01", count: "74+ Items" },
  { key: "pharmacy", name: "Medicines", img: "pharmacy-01", count: "260+ Items" },
  { key: "personal", name: "Personal Care", img: "personalcare-01", count: "210+ Items" },
  { key: "pet", name: "Pet Food", img: "petcare-01", count: "58+ Items" },
  { key: "home", name: "Home Essentials", img: "homeessentials-01", count: "132+ Items" },
  { key: "electronics", name: "Gadgets", img: "gadgets-01", count: "64+ Items" },
];

// "Top Verified Stores & Restaurants Near You" (Swiggy Store Cards)
const topStores = [
  {
    name: "Sharma Kirana & Supermart",
    rating: "4.5",
    time: "15-20 mins",
    distance: "0.8 km",
    cuisines: "Groceries, Staples, Daily Needs",
    offer: "FLAT 20% OFF",
    offerCode: "USE FILLCARTS20",
    img: "store-kirana-01"
  },
  {
    name: "Fresh Greens Organic Farm",
    rating: "4.7",
    time: "12-18 mins",
    distance: "1.2 km",
    cuisines: "Fruits, Vegetables, Organics",
    offer: "EVERYDAY LOW PRICES",
    offerCode: "NO CODE NEEDED",
    img: "store-farm-fresh"
  },
  {
    name: "City Pharmacy & Healthcare",
    rating: "4.8",
    time: "15-25 mins",
    distance: "0.5 km",
    cuisines: "Medicines, Supplements, First Aid",
    offer: "FLAT 15% OFF",
    offerCode: "USE HEALTH15",
    img: "store-pharmacy-01"
  },
  {
    name: "Bakehouse Fresh Bakery",
    rating: "4.6",
    time: "20-25 mins",
    distance: "1.4 km",
    cuisines: "Cakes, Cookies, Fresh Bread",
    offer: "BUY 1 GET 1 FREE",
    offerCode: "BOGO BAKE",
    img: "store-bakery-01"
  }
];

// Today's Offers & Deals Picked For You
const todaysDeals = [
  { name: "Fresh Fruits Combo Pack 1kg", off: "25% OFF", price: 149, mrp: 199, img: "deal-fruits-combo", tag: "bg-blue-600" },
  { name: "Daily Dairy Essentials Pack", off: "Flat ₹40 OFF", price: 189, mrp: 229, img: "deal-dairy-pack", tag: "bg-teal-600" },
  { name: "Snacks & Beverage Munchies", off: "Buy 1 Get 1", price: 99, mrp: 180, img: "deal-snacks", tag: "bg-violet-600" },
  { name: "Pharmacy Health Care Kit", off: "15% OFF", price: 129, mrp: 149, img: "deal-pharmacy", tag: "bg-amber-600" },
];

const whyChoose = [
  { icon: Zap, bg: "bg-blue-50", color: "text-blue-600", title: "Direct Store Dispatch", desc: "Orders are picked fresh and dispatched directly from nearby partner stores." },
  { icon: Navigation, bg: "bg-teal-50", color: "text-teal-600", title: "Live GPS Tracking", desc: "Watch your delivery rider move on the map live in real time." },
  { icon: Lock, bg: "bg-emerald-50", color: "text-emerald-600", title: "Encrypted Payments", desc: "UPI, cards, wallet, and Cash on Delivery — 100% secure." },
  { icon: Moon, bg: "bg-violet-50", color: "text-violet-600", title: "24/7 Night Delivery", desc: "Order essential medicines & snacks even late at night." },
  { icon: Store, bg: "bg-amber-50", color: "text-amber-700", title: "Support Local Kiranas", desc: "Empower verified neighbourhood merchants in your community." },
  { icon: Star, bg: "bg-blue-50", color: "text-blue-600", title: "Verified Merchant Ratings", desc: "Every shop is customer-rated for quality and hygiene." },
];

const steps = [
  { title: "Select your category", desc: "Choose groceries, food, medicine or subscriptions." },
  { title: "Add items to cart", desc: "Pick fresh products directly from nearby local stores." },
  { title: "Pay in 1 tap", desc: "Use UPI, wallet, cards or Cash on Delivery." },
  { title: "Live track to doorstep", desc: "Watch your rider deliver directly to your door." },
];

export default function AppKartHome() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const onScroll = () => {
      let closest = 0;
      let closestDist = Infinity;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveStep(closest);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Shared Swiggy-Style Navbar */}
      <Navbar />

      {/* 1. SWIGGY-STYLE PRIMARY SERVICE HUBS (4-Grid Gradient Banners) */}
      <section className="max-w-7xl mx-auto px-6 pt-6 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceHubs.map((hub) => (
            <Link
              key={hub.id}
              to={hub.link}
              className={`group relative rounded-3xl p-6 text-white bg-gradient-to-br ${hub.gradient} shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[170px]`}
            >
              {/* Background Glow Overlay */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full text-white ${hub.badgeBg} shadow-xs`}>
                    {hub.badge}
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                    <hub.icon size={18} />
                  </div>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-white mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
                  {hub.title}
                </h2>
                <p className="text-xs text-white/90 font-medium">{hub.subtitle}</p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/20 mt-4">
                <span className="text-[11px] font-extrabold text-white/90">{hub.tag}</span>
                <div className="w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. "WHAT'S ON YOUR MIND?" (Swiggy Circular Avatars Carousel) */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="block text-xs font-black tracking-widest uppercase text-blue-600 mb-1">Quick Explore</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
              What's on your mind?
            </h2>
          </div>
          <Link to="/categories" className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            See All Categories <ChevronRight size={14} />
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
          {whatsOnMind.map((item) => (
            <Link
              key={item.key}
              to={`/categories?category=${item.key}`}
              className="group flex flex-col items-center flex-shrink-0 cursor-pointer text-center"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1.5 border border-slate-200 shadow-sm group-hover:border-blue-500 group-hover:shadow-md group-hover:scale-105 transition-all duration-300 relative overflow-hidden mb-2">
                <img
                  src={`https://picsum.photos/seed/${item.img}/200/200`}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-108 transition-transform duration-500"
                />
              </div>
              <span className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                {item.name}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">{item.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. "TOP STORES & RESTAURANTS NEAR YOU" (Swiggy Store Cards Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="block text-xs font-black tracking-widest uppercase text-blue-600 mb-1">Neighbourhood Favorites</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
              Top verified stores near you
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topStores.map((store, idx) => (
            <Link
              key={idx}
              to="/categories"
              className="group bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Store Image & Offer Banner Overlay */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${store.img}/400/300`}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Offer Tag Badge on Image */}
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="font-black text-sm tracking-tight drop-shadow-md">{store.offer}</div>
                  <div className="text-[10px] font-bold text-teal-300 drop-shadow-xs">{store.offerCode}</div>
                </div>
              </div>

              {/* Store Details */}
              <div className="p-4">
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {store.name}
                </h3>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 my-1.5">
                  <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-md flex items-center gap-1 font-extrabold text-[11px]">
                    <Star size={11} fill="currentColor" /> {store.rating}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600"><Clock size={12} /> {store.time}</span>
                  <span>•</span>
                  <span className="text-slate-500">{store.distance}</span>
                </div>

                <p className="text-xs text-slate-400 font-semibold truncate">{store.cuisines}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. TODAY'S OFFERS & DEALS PICKED FOR YOU */}
      <section id="offers" className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
                <Gift size={14} /> Today's Exclusive Offers
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-1" style={{ fontFamily: "'Fraunces', serif" }}>
                Best deals picked for you.
              </h2>
            </div>
            <Link to="/categories" className="bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold px-5 py-2.5 rounded-full border border-white/20 backdrop-blur-md transition-colors">
              Explore All Offers
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {todaysDeals.map((d, i) => (
              <div key={i} className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-md hover:-translate-y-1 transition-all">
                <div className="relative aspect-square bg-slate-100">
                  <img src={`https://picsum.photos/seed/${d.img}/300/300`} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                  <span className={`absolute top-2 left-2 ${d.tag} text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-xs`}>
                    {d.off}
                  </span>
                </div>
                <div className="p-3.5">
                  <div className="font-bold text-sm mb-2 leading-snug">{d.name}</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-base text-slate-900">₹{d.price}</span>
                      <span className="text-xs text-slate-400 line-through ml-1.5">₹{d.mrp}</span>
                    </div>
                    <button className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AUTOMATED SUBSCRIPTIONS BANNER */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white rounded-3xl p-8 md:p-12 flex flex-wrap items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-blue-200 mb-2 flex items-center gap-1.5">
              <Repeat size={14} /> Morning Essentials Service
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Never run out of daily milk & fresh bread.
            </h2>
            <p className="text-xs md:text-sm text-blue-100 max-w-md font-medium">
              Set automated daily morning delivery at 7 AM — pause, skip or cancel anytime with zero commitments.
            </p>
          </div>
          <Link to="/subscriptions" className="bg-slate-900 hover:bg-slate-850 text-white font-extrabold rounded-full px-7 py-3.5 text-xs shadow-xl whitespace-nowrap transition-all">
            Explore Subscriptions
          </Link>
        </div>
      </section>

      {/* 6. WHY CHOOSE FILLCARTS */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-black tracking-widest uppercase text-blue-600 mb-2">Why FillCarts</span>
          <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>Why Choose FillCarts?</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {whyChoose.map((w, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 text-left hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className={`w-11 h-11 rounded-2xl ${w.bg} ${w.color} flex items-center justify-center mb-4`}>
                <w.icon size={20} />
              </div>
              <div className="font-extrabold text-base mb-1 text-slate-900">{w.title}</div>
              <div className="text-xs text-slate-500 font-medium leading-relaxed">{w.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. APP DOWNLOAD BANNER */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 flex flex-wrap items-center justify-between gap-6 shadow-xl">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold max-w-sm leading-tight mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Get the FillCarts app & order in seconds.
            </h2>
            <p className="text-xs text-slate-400 font-medium">Available on Google Play & Apple App Store.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white/10 border border-white/20 hover:bg-white/20 rounded-2xl px-5 py-3 font-extrabold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all">
              <Download size={16} /> Google Play
            </div>
            <div className="bg-white/10 border border-white/20 hover:bg-white/20 rounded-2xl px-5 py-3 font-extrabold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all">
              <Smartphone size={16} /> App Store
            </div>
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl">
              <QrCode size={28} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
