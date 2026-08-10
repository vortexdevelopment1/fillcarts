import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Zap, Navigation, Radar, Repeat, Wallet, RotateCcw,
  Store, CheckCircle2, ArrowRight, Smartphone, QrCode, Download,
  Sparkles, Star, Pause, Play, ChevronRight
} from "lucide-react";

// 6 Core Small Feature Cards (Simple, Clean & USP-Focused)
const mainFeatures = [
  {
    icon: Radar,
    bg: "bg-blue-50 text-blue-600 border-blue-100",
    title: "1. Real-Time Inventory",
    desc: "Know instantly if products are in stock at your local vendor before placing an order."
  },
  {
    icon: Navigation,
    bg: "bg-teal-50 text-teal-600 border-teal-100",
    title: "2. Live Delivery Tracking",
    desc: "Track your assigned local rider live on the GPS map in real-time right to your doorstep."
  },
  {
    icon: Wallet,
    bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    title: "3. Flexible & Secure Payments",
    desc: "Multiple payment modes (UPI, cards, netbanking, COD) plus Digital Wallet for 1-tap checkout & instant refunds."
  },
  {
    icon: RotateCcw,
    bg: "bg-amber-50 text-amber-700 border-amber-100",
    title: "4. Instant Returns",
    desc: "Product issue? Initiate quick & hassle-free returns with instant credit back to your account."
  },
  {
    icon: Store,
    bg: "bg-violet-50 text-violet-600 border-violet-100",
    title: "5. Local & Trusted Vendors",
    desc: "Order directly from nearby neighbourhood shops and support your local community businesses."
  },
  {
    icon: Zap,
    bg: "bg-blue-50 text-blue-600 border-blue-100",
    title: "6. Fast Local Delivery",
    desc: "Everyday grocery & medicine orders picked fresh and delivered fast by local neighbourhood riders."
  }
];

export default function FeaturesPage() {
  // Interactive state for the Subscription Flow Mockup Demo
  const [demoState, setDemoState] = useState("active"); // active | paused
  const [demoSchedule, setDemoSchedule] = useState("Daily"); // Daily | Weekly

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Shared Navbar */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center gap-1.5">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={13} />
          <span className="text-slate-900 font-bold">App Features</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto px-6 pt-14 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-4 py-1.5 text-xs font-extrabold mb-5 shadow-2xs">
          <Sparkles size={14} className="text-blue-600" /> Hyperlocal Speed & Automated Essentials
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
          Everything You Need for Easier Local Delivery
        </h1>

        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8">
          Shop from local vendors, track your delivery, and automate your everyday essentials.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/subscriptions"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-7 py-3.5 text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Star size={15} fill="currentColor" className="text-amber-300" /> ⭐ Explore Subscriptions
          </Link>
          <Link
            to="/categories"
            className="bg-slate-900 hover:bg-slate-950 text-white font-bold rounded-full px-7 py-3.5 text-sm shadow-md transition-all"
          >
            Browse Categories
          </Link>
        </div>
      </section>

      {/* 6 MAIN FEATURE CARDS */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-1.5">Core Features</span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
            Simple, Fast & Reliable Customer Features
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Everything designed to make neighbourhood shopping effortless.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mainFeatures.map((feat, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-3xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${feat.bg} flex items-center justify-center mb-4 border`}>
                  <feat.icon size={22} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug">{feat.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
                <CheckCircle2 size={13} /> Active Feature
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ HERO FEATURE: SUBSCRIPTION SERVICE */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-slate-900 text-white rounded-[32px] p-8 md:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
          
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 rounded-full px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider">
                <Star size={13} fill="currentColor" /> Standout Feature
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                Your Everyday Essentials, On Autopilot
              </h2>

              <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-xl">
                Automated morning deliveries for staples like <strong>Milk 🥛, Bakery Bread 🥐, and Water 💧</strong>. Guaranteed 7 AM doorstep drops with 1-tap Pause & Resume controls.
              </p>

              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl">
                  <div className="font-extrabold text-white text-xs mb-0.5">📅 Daily / Weekly</div>
                  <div className="text-[11px] text-slate-400">Flexible schedule options</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl">
                  <div className="font-extrabold text-teal-300 text-xs mb-0.5">🌅 7:00 AM Delivery</div>
                  <div className="text-[11px] text-slate-400">Fresh morning drops</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl">
                  <div className="font-extrabold text-amber-300 text-xs mb-0.5">⏸️ Pause & Resume</div>
                  <div className="text-[11px] text-slate-400">1-tap pause anytime</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/subscriptions"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
                >
                  Build Your Subscription Now <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-2xl">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-xs">
                <div className="font-extrabold text-white flex items-center gap-1.5">
                  <Repeat size={15} className="text-blue-400" /> Morning Staples Basket
                </div>
                <span className="text-[10px] font-mono text-teal-400 font-bold bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                  {demoSchedule} 7:00 AM
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-300">
                <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg">🥛 Fresh Milk</span>
                <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg">🥐 Bread</span>
                <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg">💧 Water</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium text-[11px]">Schedule Status:</span>
                  {demoState === "active" ? (
                    <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Schedule
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold text-[11px] flex items-center gap-1">
                      ⏸️ Delivery Paused
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setDemoState(demoState === "active" ? "paused" : "active")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      demoState === "active"
                        ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                        : "bg-emerald-500 hover:bg-emerald-600 text-slate-950"
                    }`}
                  >
                    {demoState === "active" ? <><Pause size={13} /> Pause Delivery</> : <><Play size={13} /> Resume Delivery</>}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SIMPLE 3-STEP SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-1.5">Easy Process</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
            How It Works in 3 Simple Steps
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Get everyday items or automated subscriptions delivered effortlessly.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 hover:-translate-y-1 hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 font-extrabold rounded-2xl flex items-center justify-center mx-auto text-xl" style={{ fontFamily: "'Fraunces', serif" }}>
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Choose Products</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Select fresh milk, bakery items, vegetables, or groceries directly from verified nearby Kirana stores.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 hover:-translate-y-1 hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 font-extrabold rounded-2xl flex items-center justify-center mx-auto text-xl" style={{ fontFamily: "'Fraunces', serif" }}>
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Subscribe & Schedule</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Choose one-time delivery or set a Daily / Weekly recurring schedule with 1-tap AutoPay setup.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 hover:-translate-y-1 hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 font-extrabold rounded-2xl flex items-center justify-center mx-auto text-xl" style={{ fontFamily: "'Fraunces', serif" }}>
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Receive & Control</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Enjoy 7 AM morning doorstep delivery. Track riders live or <strong>Pause & Resume</strong> anytime you travel.
            </p>
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD BANNER */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-blue-600 text-white rounded-3xl p-8 md:p-12 flex flex-wrap items-center justify-between gap-6 shadow-xl">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold max-w-sm leading-tight mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Experience all features live on the FillCarts app.
            </h2>
            <p className="text-xs md:text-sm text-blue-100 font-semibold">
              Available on Google Play Store & Apple App Store.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-slate-900 rounded-xl px-5 py-3 font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-800 transition-colors">
              <Download size={15} /> Google Play
            </div>
            <div className="bg-slate-900 rounded-xl px-5 py-3 font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-800 transition-colors">
              <Smartphone size={15} /> App Store
            </div>
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-slate-900 shadow-md">
              <QrCode size={26} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
