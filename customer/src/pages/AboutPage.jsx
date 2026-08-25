import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Clock,
  Heart,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  MapPin,
  Users,
  Zap,
  Star,
  RefreshCw,
  Award,
  HelpCircle,
  Truck,
  ThumbsUp,
  Store,
  Bike
} from "lucide-react";

// Clean & Simple Customer Highlights
const customerHighlights = [
  {
    icon: Sparkles,
    title: "Handpicked Quality",
    desc: "Local merchants carefully pick the freshest fruits, vegetables & grocery items for your order.",
    color: "text-[#16A34A]",
    bg: "bg-[#ECFDF3]"
  },
  {
    icon: Zap,
    title: "15-30 Min Delivery",
    desc: "Fast doorstep fulfillment from nearby neighborhood stores in your area.",
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  {
    icon: Store,
    title: "Honest Store Prices",
    desc: "Pay genuine local shop shelf prices with zero hidden markups.",
    color: "text-[#166534]",
    bg: "bg-[#ECFDF3]"
  },
  {
    icon: RefreshCw,
    title: "Instant Returns",
    desc: "1-Tap wallet refund or replacement if any item doesn't meet your expectation.",
    color: "text-blue-600",
    bg: "bg-blue-50"
  }
];

// Simple 4 Steps
const simpleSteps = [
  {
    step: "01",
    title: "Select Store",
    desc: "Browse top-rated local kiranas & fresh markets near your address.",
    icon: MapPin
  },
  {
    step: "02",
    title: "Add Items",
    desc: "Pick daily groceries, dairy, snacks & fresh produce at store prices.",
    icon: ShoppingBag
  },
  {
    step: "03",
    title: "Store Packs",
    desc: "Merchant handpicks and packages your order with care.",
    icon: Store
  },
  {
    step: "04",
    title: "Fast Delivery",
    desc: "Local rider delivers straight to your door with real-time GPS tracking.",
    icon: Bike
  }
];

// Customer Guarantees
const guarantees = [
  {
    icon: Award,
    title: "Freshness Guaranteed",
    desc: "Fresh replacement or refund if any produce item is not up to standard.",
    color: "text-[#16A34A]"
  },
  {
    icon: Truck,
    title: "On-Time Arrival",
    desc: "Over 99% of neighborhood orders arrive within 30 minutes.",
    color: "text-amber-600"
  },
  {
    icon: ThumbsUp,
    title: "Support Local Kiranas",
    desc: "Directly empowers neighborhood shopkeepers in your community.",
    color: "text-[#166534]"
  },
  {
    icon: ShieldCheck,
    title: "24/7 Customer Care",
    desc: "Friendly instant support available for any order queries.",
    color: "text-blue-600"
  }
];

// Simple FAQ List
const faqs = [
  {
    q: "How fast is delivery on FillCarts?",
    a: "Orders are delivered within 15 to 30 minutes because we connect you directly with stores in your immediate neighborhood (within 2-3 km)."
  },
  {
    q: "Are prices higher than buying directly at the shop?",
    a: "No! We show genuine local shop shelf prices, with regular app-exclusive discounts and coupon deals."
  },
  {
    q: "What if an item is missing or not fresh?",
    a: "You can request an instant 1-tap replacement or wallet refund directly from your order details screen."
  },
  {
    q: "Can I schedule delivery for a specific time?",
    a: "Yes! Choose express immediate delivery or schedule a morning slot for daily milk, bread, and breakfast items."
  }
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div
      className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans"
      style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}
    >
      {/* Navbar */}
      <Navbar />

      {/* 1. HERO SECTION (IMAGE AT TOP, SIMPLE 'ABOUT US' HEADING) */}
      <section className="bg-white border-b border-slate-100 py-6 sm:py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          
          {/* Top Hero Image */}
          <div className="relative rounded-2xl overflow-hidden border border-emerald-100 shadow-xs max-h-[260px] sm:max-h-[340px] mx-auto">
            <img
              src="/images/about-hero.jpg"
              alt="About FillCarts"
              className="w-full h-full object-cover object-center max-h-[340px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center p-4">
              <span className="text-white text-xs font-bold bg-emerald-700/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-emerald-400/40">
                ⚡ Hyperlocal Neighborhood Delivery
              </span>
            </div>
          </div>

          {/* Simple Compact Heading */}
          <div className="space-y-2 pt-1 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200">
              <Sparkles size={13} className="text-[#16A34A]" /> FillCarts
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17231A] tracking-tight">
              About Us
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              FillCarts connects you directly with trusted local kiranas, fresh markets, and neighborhood bakeries for fast, transparent, doorstep grocery delivery.
            </p>
          </div>

          {/* Clean Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-1 flex-wrap">
            <Link
              to="/categories"
              className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag size={15} />
              <span>Start Shopping</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              to="/support"
              className="bg-[#FFFCF5] hover:bg-slate-100 text-slate-700 border border-slate-200 font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle size={15} className="text-slate-500" />
              <span>Help & Support</span>
            </Link>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12 flex-1 w-full text-left">

        {/* 2. SIMPLE HIGHLIGHTS GRID */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#17231A]">
              Why Shop With Us
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Everything you love about neighborhood shopping, made effortless.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {customerHighlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-4 text-left space-y-2 hover:border-emerald-300 transition-colors shadow-2xs"
              >
                <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                  <item.icon size={18} />
                </div>
                <h3 className="font-extrabold text-sm text-[#17231A]">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section className="bg-white border border-emerald-100 rounded-2xl p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#17231A]">
              How FillCarts Works
            </h2>
            <span className="text-xs font-bold text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200">
              4 Quick Steps
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {simpleSteps.map((s, idx) => (
              <div
                key={idx}
                className="bg-[#FFFCF5] border border-slate-200 rounded-xl p-4 text-left space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-2 py-0.5 rounded-md">
                    Step {s.step}
                  </span>
                  <s.icon size={16} className="text-[#16A34A]" />
                </div>
                <h3 className="font-extrabold text-xs text-[#17231A]">
                  {s.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. OUR PROMISES TO YOU */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#17231A]">
              Our Guarantees
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guarantees.map((g, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-4 text-left space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <g.icon size={16} className={g.color} />
                  <h3 className="font-extrabold text-xs text-[#17231A]">
                    {g.title}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. TRUST STATS */}
        <section className="bg-[#ECFDF3]/60 border border-emerald-200/80 rounded-2xl p-5 text-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-xl font-black text-[#16A34A]">50,000+</div>
              <div className="text-[11px] font-bold text-slate-600">Happy Homes</div>
            </div>
            <div>
              <div className="text-xl font-black text-[#166534]">1,200+</div>
              <div className="text-[11px] font-bold text-slate-600">Local Kiranas</div>
            </div>
            <div>
              <div className="text-xl font-black text-amber-600">15-30 Mins</div>
              <div className="text-[11px] font-bold text-slate-600">Avg Delivery</div>
            </div>
            <div>
              <div className="text-xl font-black text-emerald-600">4.9 ★</div>
              <div className="text-[11px] font-bold text-slate-600">App Rating</div>
            </div>
          </div>
        </section>

        {/* 6. SIMPLE FAQ */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#17231A] text-center">
            Frequently Asked Questions
          </h2>

          <div className="max-w-2xl mx-auto space-y-2">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-[#FFFCF5]/40"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-3.5 text-left font-extrabold text-xs text-[#17231A] flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-[#16A34A] shrink-0 transition-transform duration-300 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-3.5 pb-3 text-[11px] text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-2 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 7. CLEAN SIMPLE CTA */}
        <section className="bg-[#166534] rounded-2xl p-6 text-white text-center space-y-3">
          <h2 className="text-xl font-extrabold">Ready to Shop Local?</h2>
          <p className="text-xs text-emerald-100 max-w-md mx-auto">
            Order fresh groceries and daily essentials from nearby stores in minutes.
          </p>
          <div className="pt-1">
            <Link
              to="/categories"
              className="bg-white hover:bg-slate-100 text-[#166534] font-extrabold px-6 py-2.5 rounded-xl text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShoppingBag size={14} />
              <span>Explore Categories</span>
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
