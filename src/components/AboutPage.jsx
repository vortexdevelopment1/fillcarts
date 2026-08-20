import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  ChevronRight, Target, Heart, ShieldCheck, Store, Bike, Sparkles, TrendingUp,
  ShoppingBag, ArrowRight, CheckCircle2, Users, MapPin, Layers, Clock, Zap, MessageSquare
} from "lucide-react";

// Ecosystem Roles Data - Styled in Homepage Green & Warm Orange Palette
const ecosystemRoles = [
  {
    title: "Customers",
    tagline: "Convenient Local Shopping",
    desc: "Discover products from nearby stores and get them delivered to your doorstep.",
    icon: ShoppingBag,
    color: "text-[#16A34A]",
    bgColor: "bg-[#ECFDF3]",
    borderColor: "hover:border-emerald-300",
    ctaText: "Browse Categories",
    ctaLink: "/categories"
  },
  {
    title: "Local Vendors",
    tagline: "Empowering Local Commerce",
    desc: "Bring your store online, manage products and reach more customers nearby.",
    icon: Store,
    color: "text-[#166534]",
    bgColor: "bg-[#ECFDF3]",
    borderColor: "hover:border-emerald-300",
    ctaText: "Become a Vendor",
    ctaLink: "/vendor"
  },
  {
    title: "Delivery Partners",
    tagline: "Flexible Local Earnings",
    desc: "Choose delivery opportunities, deliver locally and earn on your schedule.",
    icon: Bike,
    color: "text-[#F59E0B]",
    bgColor: "bg-amber-50",
    borderColor: "hover:border-amber-300",
    ctaText: "Become a Rider",
    ctaLink: "/rider"
  }
];

// 3-Step Flow Data
const steps = [
  {
    step: "01",
    title: "Customer Orders",
    desc: "Customer discovers a nearby store on FillCarts and places an order.",
    icon: ShoppingBag,
    color: "text-[#16A34A]",
    badgeBg: "bg-[#ECFDF3] text-[#166534] border-emerald-200"
  },
  {
    step: "02",
    title: "Vendor Prepares",
    desc: "The local vendor receives the order and prepares the fresh items.",
    icon: Store,
    color: "text-[#166534]",
    badgeBg: "bg-[#ECFDF3] text-[#166534] border-emerald-200"
  },
  {
    step: "03",
    title: "Rider Delivers",
    desc: "A delivery partner picks up the order and delivers it locally in minutes.",
    icon: Bike,
    color: "text-[#F59E0B]",
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200"
  }
];

// 4 Core Values Data
const values = [
  {
    icon: MapPin,
    bg: "bg-[#ECFDF3]",
    color: "text-[#16A34A]",
    title: "Local First",
    desc: "We believe neighbourhood businesses should have a strong place in digital commerce."
  },
  {
    icon: ShieldCheck,
    bg: "bg-[#ECFDF3]",
    color: "text-[#166534]",
    title: "Trust & Transparency",
    desc: "Clear experiences, reliable partners and transparent processes."
  },
  {
    icon: Sparkles,
    bg: "bg-amber-50",
    color: "text-[#F59E0B]",
    title: "Simplicity",
    desc: "Ordering, selling and delivering should feel easy."
  },
  {
    icon: Users,
    bg: "bg-[#ECFDF3]",
    color: "text-[#16A34A]",
    title: "Grow Together",
    desc: "Customers, vendors and riders should all benefit from the ecosystem."
  }
];

// Timeline Journey Data (Dynamic-Ready)
const journeyItems = [
  {
    step: "01",
    year: "The Idea",
    title: "Enabling Local Commerce",
    desc: "FillCarts started with a simple question — why shouldn't local neighbourhood shops and local riders participate directly in fast digital delivery?"
  },
  {
    step: "02",
    year: "Building the Network",
    title: "Neighbourhood Fulfillment",
    desc: "We onboarded local vendors and delivery partners neighbourhood by neighbourhood, establishing fast, trusted local delivery loops."
  },
  {
    step: "03",
    year: "Today",
    title: "A Connected Ecosystem",
    desc: "A growing network of local shops, delivery riders, and customers connected seamlessly through one simple platform."
  }
];

export default function AboutPage({ statsData = null }) {
  // Active state for step interactive highlights
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Shared Common Navbar */}
      <Navbar />


      {/* 1. HERO / MISSION SECTION */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Main Hero Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80 mb-1">
              <Sparkles size={13} /> OUR MISSION
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#17231A] leading-[1.12] tracking-tight">
              Local shops. Local riders. <br />
              <span className="text-[#16A34A] relative inline-block">
                Better neighbourhood delivery.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              FillCarts connects local customers with nearby stores and local delivery partners through one simple, transparent platform.
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
              <Link
                to="/categories"
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-7 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer group"
              >
                <span>Explore FillCarts</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#join-ecosystem"
                className="bg-[#FFFCF5] hover:bg-[#ECFDF3] text-[#166534] border border-emerald-200 font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <span>Become a Partner</span>
              </a>
            </div>
          </div>

          {/* Interactive Ecosystem Visual (Customer → Vendor → Rider) */}
          <div className="max-w-4xl mx-auto pt-4">
            <div className="text-center text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
              The FillCarts Neighbourhood Ecosystem
            </div>

            <div className="grid sm:grid-cols-3 gap-4 md:gap-6 items-center">
              {/* Card 1: Customer */}
              <div className="group bg-[#FFFCF5] hover:bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-center space-y-3 relative">
                <div className="w-12 h-12 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#17231A]">01. Local Customer</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Orders fresh everyday essentials from nearby neighbourhood shops.</p>
                </div>
                <div className="text-[10px] font-extrabold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block">
                  Discover & Order
                </div>
              </div>

              {/* Card 2: Vendor */}
              <div className="group bg-[#FFFCF5] hover:bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-center space-y-3 relative">
                <div className="w-12 h-12 rounded-2xl bg-[#ECFDF3] text-[#166534] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Store size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#17231A]">02. Local Vendor</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Receives order, packs items fresh, and prepares for pickup.</p>
                </div>
                <div className="text-[10px] font-extrabold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block">
                  Prepare & Pack
                </div>
              </div>

              {/* Card 3: Rider */}
              <div className="group bg-[#FFFCF5] hover:bg-white border border-slate-200 hover:border-amber-300 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-center space-y-3 relative">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#F59E0B] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Bike size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#17231A]">03. Delivery Rider</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Picks up from shop and completes express doorstep delivery.</p>
                </div>
                <div className="text-[10px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full inline-block">
                  Fast Doorstep Drop
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT CONTAINERS */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-16 flex-1 w-full text-left">

        {/* 2. WHAT IS FILLCARTS? */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-1">
              <Sparkles size={13} /> Platform Overview
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#17231A]">
              Everything local, connected in one place.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              FillCarts brings neighborhood stores, local delivery partners, and customers together seamlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ecosystemRoles.map((role, idx) => (
              <div
                key={idx}
                className={`bg-white border border-emerald-100 ${role.borderColor} rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${role.bgColor} ${role.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <role.icon size={22} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{role.tagline}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-[#17231A] mb-2">
                      {role.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {role.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6">
                  <Link
                    to={role.ctaLink}
                    className={`text-xs font-extrabold ${role.color} flex items-center gap-1.5 group-hover:translate-x-1 transition-transform cursor-pointer`}
                  >
                    <span>{role.ctaText}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. HOW FILLCARTS WORKS */}
        <section className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-1">
                <Sparkles size={13} /> Interactive Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
                How FillCarts Works
              </h2>
            </div>
            <div className="text-xs font-extrabold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-3.5 py-1.5 rounded-full w-fit">
              ⚡ Hyperlocal 3-Step Fulfillment
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {steps.map((s, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`bg-[#FFFCF5] border rounded-2xl p-6 text-left space-y-4 cursor-pointer transition-all duration-300 relative group ${
                  activeStep === idx
                    ? "border-[#16A34A] bg-white shadow-md"
                    : "border-slate-200 hover:border-emerald-300 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black px-3 py-1 rounded-full border ${s.badgeBg}`}>
                    {s.step}
                  </span>
                  <div className={`w-9 h-9 rounded-xl bg-white border border-slate-200 ${s.color} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                    <s.icon size={18} />
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-[#17231A] mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                {/* Arrow connector on desktop */}
                {idx < 2 && (
                  <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 bg-white border border-slate-200 rounded-full p-1 shadow-2xs text-slate-400">
                    <ChevronRight size={14} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 4. WHY FILLCARTS EXISTS / OUR MISSION */}
        <section className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Mission Rationale Text */}
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-1">
                <Heart size={13} className="text-[#16A34A]" /> Community-Driven Commerce
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17231A] leading-tight">
                Built around local communities.
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                FillCarts was designed to help local stores participate in digital commerce while giving customers convenient access to nearby products and creating earning opportunities for delivery partners.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <CheckCircle2 size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#17231A] block font-extrabold">Empowering Local Stores</strong>
                    <span className="text-slate-500 font-medium">Helping neighborhood kiranas and artisan shops grow digitally.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <CheckCircle2 size={18} className="text-[#166534] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#17231A] block font-extrabold">Flexible Local Earnings</strong>
                    <span className="text-slate-500 font-medium">Providing riders with transparent weekly earnings in their own areas.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Local Ecosystem Visual Card */}
            <div className="lg:col-span-6">
              <div className="bg-[#ECFDF3] border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-4">
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-[#16A34A]" />
                    <h3 className="font-extrabold text-sm text-[#17231A]">
                      Neighbourhood Loop
                    </h3>
                  </div>
                  <span className="text-[10px] font-black text-[#166534] bg-white border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    100% Local Operations
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold">
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#17231A]">Customer Convenience</div>
                        <div className="text-[11px] text-slate-500 font-medium">Fresh morning & express delivery</div>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono text-[#16A34A]">Fast Drop</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#ECFDF3] text-[#166534] flex items-center justify-center font-bold">
                        <Store size={18} />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#17231A]">Local Merchant Growth</div>
                        <div className="text-[11px] text-slate-500 font-medium">Digital store catalog & instant orders</div>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono text-[#166534]">100% Online</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold">
                        <Bike size={18} />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#17231A]">Delivery Fleet Opportunity</div>
                        <div className="text-[11px] text-slate-500 font-medium">Flexible shifts & transparent payouts</div>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono text-amber-700">Weekly Pay</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-semibold text-center italic border-t border-emerald-200/80 pt-3">
                  Connecting local supply with local demand seamlessly.
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. OUR VALUES */}
        <section className="space-y-8 text-center sm:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-1">
              <Sparkles size={13} /> Guiding Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A] mt-1">
              Our Core Values
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="group bg-white border border-emerald-100 hover:border-[#16A34A] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left flex flex-col justify-between"
              >
                <div>
                  <div className={`w-11 h-11 rounded-2xl ${v.bg} ${v.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <v.icon size={20} />
                  </div>
                  <h3 className="font-extrabold text-base text-[#17231A] mb-2">
                    {v.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. OUR JOURNEY */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-1">
              <Sparkles size={13} /> Evolution
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A] mt-1">
              Our Journey
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Building neighbourhood delivery networks step by step.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {journeyItems.map((j, i) => (
              <div
                key={i}
                className="bg-white border border-emerald-100 hover:border-[#16A34A] rounded-3xl p-6 space-y-4 shadow-2xs hover:shadow-md transition-all duration-300 group text-left relative"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="w-9 h-9 rounded-xl bg-[#ECFDF3] text-[#166534] font-black text-xs flex items-center justify-center font-mono">
                    {j.step}
                  </span>
                  <span className="text-xs font-extrabold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-3 py-1 rounded-full">
                    {j.year}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-[#17231A] group-hover:text-[#166534] transition-colors mb-1.5">
                    {j.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {j.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. DYNAMIC TRUST / ECOSYSTEM SECTION */}
        <section className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-1">
                <ShieldCheck size={13} className="text-[#16A34A]" /> Platform Foundation
              </span>
              <h3 className="text-xl font-extrabold text-[#17231A]">
                Built for the whole local delivery ecosystem.
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-[#FFFCF5] border border-slate-200 px-3 py-1 rounded-full w-fit">
              ✓ Verified & Reliable Infrastructure
            </span>
          </div>

          {statsData && Array.isArray(statsData) && statsData.length > 0 ? (
            /* Render Dynamic Backend Stats if available */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statsData.map((s, idx) => (
                <div key={idx} className="bg-[#FFFCF5] p-4 rounded-2xl border border-slate-200 text-center">
                  <div className="text-2xl font-black text-[#166534]">{s.value}</div>
                  <div className="text-xs font-bold text-slate-600 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          ) : (
            /* Render Clean Fallback Ecosystem Summary Card without Hardcoded Fake Stats */
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-[#FFFCF5] border border-slate-200 rounded-2xl p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-[#16A34A] font-extrabold text-xs">
                  <ShoppingBag size={16} /> Customers
                </div>
                <p className="text-xs text-slate-500 font-medium">Easy browsing, fresh morning delivery, and live tracking.</p>
              </div>

              <div className="bg-[#FFFCF5] border border-slate-200 rounded-2xl p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-[#166534] font-extrabold text-xs">
                  <Store size={16} /> Local Vendors
                </div>
                <p className="text-xs text-slate-500 font-medium">Digital store catalog, fair commissions, and weekly payouts.</p>
              </div>

              <div className="bg-[#FFFCF5] border border-slate-200 rounded-2xl p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-[#F59E0B] font-extrabold text-xs">
                  <Bike size={16} /> Delivery Partners
                </div>
                <p className="text-xs text-slate-500 font-medium">Flexible delivery shifts, local routes, and weekly deposits.</p>
              </div>
            </div>
          )}
        </section>

        {/* 8. JOIN THE FILLCARTS ECOSYSTEM */}
        <section id="join-ecosystem" className="space-y-8 pt-4">
          <div className="text-center max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-1">
              <Sparkles size={13} /> Get Started
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#17231A] mt-1">
              Join the FillCarts Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Choose your role and start experiencing better local commerce today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 1. Customer CTA Card */}
            <div className="bg-[#ECFDF3] border border-emerald-200 hover:border-emerald-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#16A34A] flex items-center justify-center shadow-2xs">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#166534] uppercase tracking-widest block mb-1">For Customers</span>
                  <h3 className="text-xl font-extrabold text-[#17231A]">
                    Shop from stores around you.
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                    Discover fresh groceries, daily essentials, and local treats delivered straight to your door.
                  </p>
                </div>
              </div>

              <Link
                to="/categories"
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span>Start Shopping</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* 2. Vendor CTA Card */}
            <div className="bg-[#ECFDF3] border border-emerald-200 hover:border-emerald-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#166534] flex items-center justify-center shadow-2xs">
                  <Store size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#166534] uppercase tracking-widest block mb-1">For Local Vendors</span>
                  <h3 className="text-xl font-extrabold text-[#17231A]">
                    Bring your local store online.
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                    List your products, accept orders from nearby customers, and grow your local business.
                  </p>
                </div>
              </div>

              <Link
                to="/vendor"
                className="w-full bg-[#17231A] hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span>Become a Vendor</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* 3. Rider CTA Card */}
            <div className="bg-amber-50/90 border border-amber-200 hover:border-amber-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#F59E0B] flex items-center justify-center shadow-2xs">
                  <Bike size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block mb-1">For Delivery Partners</span>
                  <h3 className="text-xl font-extrabold text-[#17231A]">
                    Deliver locally and earn flexibly.
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                    Choose delivery slots according to your schedule and get paid weekly direct to your bank.
                  </p>
                </div>
              </div>

              <Link
                to="/rider"
                className="w-full bg-[#166534] hover:bg-[#15803D] text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span>Become a Rider</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
