import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Zap, Navigation, Radar, Wallet, RotateCcw,
  Store, CheckCircle2, ArrowRight, Smartphone, QrCode, Download,
  Sparkles, Star, Pause, Play, ChevronRight, ShoppingBag, Clock,
  AlertCircle, RefreshCw, Layers
} from "lucide-react";
import { STORE_IMAGE_MAP, SUBSCRIPTION_IMAGE_MAP } from "../utils/productImages";

// 4 Core Customer Features Data
const coreFeatures = [
  {
    id: "feat-inventory",
    icon: Radar,
    title: "Real-Time Inventory",
    desc: "Know what's available at your nearby local store before you place an order."
  },
  {
    id: "feat-tracking",
    icon: Navigation,
    title: "Live Rider Tracking",
    desc: "Track your delivery partner live on an interactive map from pickup to your doorstep."
  },
  {
    id: "feat-payments",
    icon: Wallet,
    title: "Flexible Payments",
    desc: "Pay easily with UPI, credit/debit cards, digital wallet or Cash on Delivery."
  },
  {
    id: "feat-returns",
    icon: RotateCcw,
    title: "Instant Returns",
    desc: "Get a simple, hassle-free return experience with instant store credit."
  }
];

// --- REUSABLE COMPONENTS ---

/** Individual Feature Card Component */
export function FeatureCard({ feature }) {
  const IconComponent = feature.icon || Radar;
  return (
    <div className="group bg-white border border-emerald-100 hover:border-[#16A34A] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between text-left">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-[#ECFDF3] text-slate-700 group-hover:text-[#16A34A] flex items-center justify-center mb-4 transition-colors">
          <IconComponent size={22} />
        </div>
        <h3 className="font-extrabold text-base text-[#17231A] group-hover:text-[#166534] transition-colors mb-2">
          {feature.title}
        </h3>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          {feature.desc}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#16A34A] opacity-80 group-hover:opacity-100">
        <span>Learn More</span>
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

/** Grid Container Component */
export function FeatureGrid({ features }) {
  if (!features || features.length === 0) {
    return <FeatureEmptyState />;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feat) => (
        <FeatureCard key={feat.id || feat.title} feature={feat} />
      ))}
    </div>
  );
}

/** 3-Step Local Delivery Flow Component */
export function DeliveryFlow() {
  const steps = [
    { step: "01", title: "Order Online", desc: "Select products from trusted neighborhood stores near you.", bg: "bg-emerald-50 text-[#166534]" },
    { step: "02", title: "Picked Up", desc: "Local store packs your order and hands it to a nearby rider.", bg: "bg-amber-50 text-amber-800" },
    { step: "03", title: "Doorstep Dropoff", desc: "Track your rider live on the map until instant delivery.", bg: "bg-emerald-100 text-[#166534]" }
  ];

  return (
    <div className="grid sm:grid-cols-3 gap-6 relative">
      {steps.map((s, idx) => (
        <div key={idx} className="bg-white border border-emerald-100 rounded-2xl p-6 text-left relative space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className={`w-9 h-9 rounded-xl font-extrabold text-xs flex items-center justify-center ${s.bg}`}>
              {s.step}
            </span>
            {idx < 2 && (
              <ChevronRight size={16} className="hidden sm:block text-slate-300" />
            )}
          </div>
          <h4 className="font-extrabold text-base text-[#17231A]">{s.title}</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

/** Subscription USP Component */
export function SubscriptionFeature() {
  const [scheduleState, setScheduleState] = useState("Daily");
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="bg-[#ECFDF3] border-2 border-emerald-300 rounded-3xl p-6 sm:p-10 shadow-lg text-left relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl -z-10" />

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Copy & Actions */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-1.5 bg-white text-[#166534] border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-black shadow-2xs">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>⭐ FEATURED USP</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17231A] leading-tight">
            Your everyday essentials, on autopilot.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
            Schedule regular deliveries for milk, bakery items, water and other daily staples.
          </p>

          {/* Schedule Badges */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-500">Schedule:</span>
            {["Daily", "Weekly"].map((sched) => (
              <button
                key={sched}
                onClick={() => setScheduleState(sched)}
                className={`px-3 py-1 rounded-full text-xs font-extrabold transition-colors cursor-pointer ${
                  scheduleState === sched
                    ? "bg-[#16A34A] text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
                }`}
              >
                {sched}
              </button>
            ))}
          </div>

          {/* Bullet Point Benefits */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            {[
              "Automatic morning deliveries",
              "Pause anytime when out of town",
              "Resume instantly with 1-tap",
              "Easy subscription wallet management"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#166534]">
                <CheckCircle2 size={16} className="text-[#16A34A] flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-3">
            <Link
              to="/subscriptions"
              className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 inline-flex"
            >
              <span>Start Subscription →</span>
            </Link>
          </div>
        </div>

        {/* Right Product Collage Demo */}
        <div className="lg:col-span-5 relative">
          <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-xs font-extrabold text-[#166534]">Daily Morning Bundle</div>
                <div className="text-[10px] text-slate-400 font-semibold">{scheduleState} 7:00 AM Delivery</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${isPaused ? "bg-amber-100 text-amber-800" : "bg-[#ECFDF3] text-[#166534]"}`}>
                {isPaused ? "⏸️ Paused" : "⚡ Active"}
              </span>
            </div>

            {/* Product Items Collage */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#FFFCF5] p-2.5 rounded-xl border border-slate-100 text-center space-y-1">
                <img src={SUBSCRIPTION_IMAGE_MAP.milk} alt="Milk" className="w-full h-16 object-cover rounded-lg" />
                <div className="text-[11px] font-extrabold text-[#17231A]">Fresh Milk 1L</div>
                <div className="text-[10px] text-slate-400 font-semibold">₹62 / day</div>
              </div>
              <div className="bg-[#FFFCF5] p-2.5 rounded-xl border border-slate-100 text-center space-y-1">
                <img src={SUBSCRIPTION_IMAGE_MAP.bread} alt="Bread" className="w-full h-16 object-cover rounded-lg" />
                <div className="text-[11px] font-extrabold text-[#17231A]">Wheat Bread</div>
                <div className="text-[10px] text-slate-400 font-semibold">₹45 / pack</div>
              </div>
            </div>

            {/* Pause / Resume Interactive Demo Toggle */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                isPaused
                  ? "bg-[#16A34A] hover:bg-[#15803D] text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              {isPaused ? <><Play size={13} /> Resume Subscription</> : <><Pause size={13} /> Pause Subscription</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton Loader for Feature Cards */
export function FeatureSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse space-y-4">
      <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
      <div className="h-5 bg-slate-200 rounded-md w-3/4" />
      <div className="h-3 bg-slate-100 rounded-md w-full" />
      <div className="h-3 bg-slate-100 rounded-md w-2/3" />
    </div>
  );
}

/** Empty State Component */
export function FeatureEmptyState() {
  return (
    <div className="bg-white border border-emerald-100 rounded-3xl p-10 text-center max-w-md mx-auto my-6 space-y-3">
      <div className="w-14 h-14 bg-[#ECFDF3] text-[#16A34A] rounded-full flex items-center justify-center mx-auto">
        <Layers size={24} />
      </div>
      <h3 className="text-base font-extrabold text-[#17231A]">No features available</h3>
      <p className="text-xs text-slate-500 font-medium">Information will be available soon.</p>
    </div>
  );
}

/** Error State Component */
export function FeatureErrorState({ onRetry }) {
  return (
    <div className="bg-white border border-rose-100 rounded-3xl p-10 text-center max-w-md mx-auto my-6 space-y-4">
      <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-base font-extrabold text-[#17231A]">Something went wrong</h3>
      <p className="text-xs text-slate-500 font-medium">Please check your network and try again.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-5 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw size={13} /> Retry
        </button>
      )}
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function FeaturesPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Shared Navbar */}
      <Navbar />


      {/* 1. FEATURES HERO SECTION */}
      <section className="bg-white border-b border-slate-100 py-12 text-center sm:text-left">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#ECFDF3] border border-emerald-200 text-[#166534] rounded-full px-4 py-1.5 text-xs font-bold shadow-2xs">
              <Sparkles size={14} className="text-[#16A34A]" />
              <span>Built for Speed, Convenience & Trust</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17231A] leading-tight">
              Everything you need for easier local shopping.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Shop from nearby stores, track your delivery and automate your everyday essentials.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-2 flex-wrap justify-center sm:justify-start">
              <Link
                to="/categories"
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-7 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>Start Shopping</span>
              </Link>
              <Link
                to="/categories"
                className="bg-[#FFFCF5] hover:bg-[#ECFDF3] text-[#166534] border border-emerald-200 font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5"
              >
                <span>Explore Categories</span>
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN BODY CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16 flex-1 w-full">
        {/* Error State Handler */}
        {error ? (
          <FeatureErrorState onRetry={() => setError(false)} />
        ) : (
          <>
            {/* 2. MAIN 4 CORE CUSTOMER FEATURES */}
            <section className="space-y-6">
              <div className="text-center sm:text-left">
                <span className="text-xs font-black uppercase tracking-widest text-[#16A34A] block mb-1">
                  Core Benefits
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
                  Why Use FillCarts?
                </h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <FeatureSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <FeatureGrid features={coreFeatures} />
              )}
            </section>

            {/* 3. SUBSCRIPTION — MAIN FEATURE ⭐ */}
            <section>
              <SubscriptionFeature />
            </section>

            {/* 4. LOCAL VENDOR BENEFIT SECTION */}
            <section className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-10 space-y-6">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-3 text-left">
                  <span className="text-xs font-black uppercase tracking-widest text-[#166534] block">
                    Support Local Business
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
                    Shop from local stores near you.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    Discover trusted neighborhood vendors and get your everyday products delivered directly to your doorstep. FillCarts connects you with shops you already know and trust.
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-bold text-[#166534]">
                    <span className="flex items-center gap-1.5"><Store size={16} className="text-[#16A34A]" /> Verified Local Shops</span>
                    <span className="flex items-center gap-1.5"><Zap size={16} className="text-[#16A34A]" /> Fast 15-30 Min Pickup</span>
                  </div>
                </div>

                <div className="md:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden aspect-16/10 border border-slate-200 shadow-md">
                    <img
                      src={STORE_IMAGE_MAP.freshMart}
                      alt="Local Vendor Store"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4 text-white">
                      <div>
                        <div className="text-xs font-extrabold">Fresh Mart Supermarket</div>
                        <div className="text-[10px] text-emerald-300 font-semibold">Indiranagar • 1.2 km away</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. FAST LOCAL DELIVERY SECTION (3-Step Flow) */}
            <section className="space-y-6 text-center sm:text-left">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#16A34A] block mb-1">
                  Simple Order Process
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
                  From local store to your doorstep.
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Track your rider in real time with end-to-end delivery visibility.
                </p>
              </div>

              <DeliveryFlow />
            </section>
          </>
        )}
      </main>

      {/* APP DOWNLOAD CTA */}
      <section className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-[#17231A] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left space-y-2 max-w-lg">
              <h3 className="text-2xl font-extrabold">Ready to start local shopping?</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Download FillCarts mobile app for express orders, live rider tracking, and easy subscription management.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-5 py-3 rounded-xl text-xs flex items-center gap-2 transition-all"
              >
                <Download size={15} /> Google Play
              </a>
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-5 py-3 rounded-xl text-xs flex items-center gap-2 transition-all border border-white/20"
              >
                <Smartphone size={15} /> App Store
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

