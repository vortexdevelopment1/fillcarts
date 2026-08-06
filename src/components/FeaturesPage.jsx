import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Zap, Navigation, Radar, Repeat, Wallet, CreditCard, Bell, RotateCcw,
  Store, Moon, ShieldCheck, ChevronRight, CheckCircle2, ArrowRight,
  Smartphone, QrCode, Download, Sparkles, Star, MapPin, Search, Lock
} from "lucide-react";

const featurePillars = [
  {
    category: "Hyperlocal Speed & Dispatch",
    badge: "Express Dispatch",
    badgeColor: "bg-blue-50 text-blue-600 border-blue-200",
    features: [
      {
        icon: Zap,
        bg: "bg-blue-50",
        color: "text-blue-600",
        title: "Direct Store-to-Door Express Delivery",
        desc: "Orders are picked fresh from your nearest trusted neighbourhood Kirana or pharmacy and dispatched immediately by local riders with zero warehouse delay."
      },
      {
        icon: Navigation,
        bg: "bg-teal-50",
        color: "text-teal-600",
        title: "Live GPS Order Tracking",
        desc: "Watch your delivery partner move live on the interactive map from vendor pickup to your doorstep with exact ETA."
      },
      {
        icon: Moon,
        bg: "bg-violet-50",
        color: "text-violet-600",
        title: "24/7 Night Delivery Zones",
        desc: "Need medicines, baby food, or snacks at 2 AM? Our verified 24/7 partner stores fulfill urgent late-night orders."
      }
    ]
  },
  {
    category: "Smart Inventory & Shopping",
    badge: "Real-Time Sync",
    badgeColor: "bg-teal-50 text-teal-600 border-teal-200",
    features: [
      {
        icon: Radar,
        bg: "bg-teal-50",
        color: "text-teal-600",
        title: "Real-Time Kirana Stock Sync",
        desc: "See exact item availability before placing an order. Our merchant app updates store inventory instantly to prevent out-of-stock items."
      },
      {
        icon: Repeat,
        bg: "bg-violet-50",
        color: "text-violet-600",
        title: "Automated Daily Subscriptions",
        desc: "Never run out of daily essentials. Subscribe to morning milk, fresh bread, and curd with automated 7 AM delivery. Pause or skip anytime."
      },
      {
        icon: Store,
        bg: "bg-amber-50",
        color: "text-amber-700",
        title: "Empowering Local Vendors",
        desc: "Every order supports local Kirana shopkeepers and neighbourhood vendors in your immediate community."
      }
    ]
  },
  {
    icon: Wallet,
    category: "Instant Payments & Wallet",
    badge: "100% Secure",
    badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    features: [
      {
        icon: Wallet,
        bg: "bg-emerald-50",
        color: "text-emerald-600",
        title: "FillCarts Digital Wallet",
        desc: "Experience 1-tap checkout with saved wallet balance. Enjoy instant refunds directly credited within seconds for cancelled items."
      },
      {
        icon: Lock,
        bg: "bg-blue-50",
        color: "text-blue-600",
        title: "Encrypted Multiple Payment Options",
        desc: "Pay seamlessly via UPI (GPay, PhonePe, Paytm), Debit/Credit cards, Netbanking, or Cash on Delivery with end-to-end security."
      },
      {
        icon: Bell,
        bg: "bg-amber-50",
        color: "text-amber-700",
        title: "Smart Push Notifications",
        desc: "Receive real-time order status updates (Store Accepted, Packing, Out for Delivery) without needing to keep the app open."
      }
    ]
  },
  {
    category: "Customer Trust & Protection",
    badge: "Quality Assured",
    badgeColor: "bg-violet-50 text-violet-600 border-violet-200",
    features: [
      {
        icon: ShieldCheck,
        bg: "bg-violet-50",
        color: "text-violet-600",
        title: "100% Freshness Guarantee",
        desc: "Fresh fruits, vegetables, and dairy are sourced daily from verified local mandis with stringent quality checks."
      },
      {
        icon: RotateCcw,
        bg: "bg-teal-50",
        color: "text-teal-600",
        title: "Hassle-Free Easy Returns",
        desc: "Not satisfied with an item? Initiate a simple 24-hour return request directly from your order history for instant resolution."
      },
      {
        icon: Star,
        bg: "bg-blue-50",
        color: "text-blue-600",
        title: "Verified Merchant Ratings",
        desc: "Every merchant on FillCarts is rated by local neighbours, ensuring top-tier service, packaging, and product hygiene."
      }
    ]
  }
];

const comparisonData = [
  { feature: "Delivery Speed", fillcarts: "Direct Store Dispatch (Fastest)", traditional: "2 - 5 Days", darkstore: "Standard Quick Hub" },
  { feature: "Inventory Source", fillcarts: "Local Neighbourhood Kiranas", traditional: "Centralized Distant Hubs", darkstore: "Company Warehouses" },
  { feature: "Support Local Vendors", fillcarts: "100% Empowered", traditional: "No Impact", darkstore: "Displaces Local Shops" },
  { feature: "Produce Freshness", fillcarts: "Sourced Daily at 4 AM", traditional: "Cold Stored 3-7 Days", darkstore: "Stored in Warehouses" },
  { feature: "Daily Subscriptions (Milk/Bread)", fillcarts: "Automated 7 AM Delivery", traditional: "Not Available", darkstore: "Limited" },
  { feature: "Instant Refund System", fillcarts: "Immediate Wallet Credit", traditional: "5-7 Business Days", darkstore: "1-3 Days" },
];

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState(0);

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

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3.5 py-1.5 text-sm font-bold mb-5">
          <Sparkles size={14} className="text-blue-600" /> Engineered for Speed & Local Trust
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
          Built for direct store dispatch,<br /><span className="text-blue-600">live tracking & local trust.</span>
        </h1>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8">
          Explore the powerful technology and customer-first features that make FillCarts the preferred hyperlocal delivery platform for thousands of households.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/categories" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-7 py-3.5 text-sm shadow-md shadow-blue-600/20 transition-all">
            Browse Categories
          </Link>
          <a href="#comparison" className="bg-white border border-slate-200 hover:border-blue-500 text-slate-800 font-bold rounded-full px-7 py-3.5 text-sm shadow-2xs transition-all">
            Compare Features
          </a>
        </div>
      </section>

      {/* Feature Pillar Tabs */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex gap-2 overflow-x-auto pb-4 justify-center">
          {featurePillars.map((pillar, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-3 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                activeTab === idx
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              {pillar.category}
            </button>
          ))}
        </div>

        {/* Active Pillar Features Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-2 ${featurePillars[activeTab].badgeColor}`}>
                {featurePillars[activeTab].badge}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                {featurePillars[activeTab].category}
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featurePillars[activeTab].features.map((feat, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-7 hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center mb-5`}>
                    <feat.icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{feat.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{feat.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-blue-600">
                  <CheckCircle2 size={14} /> Active on FillCarts App
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section id="comparison" className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-2">Why We Stand Out</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>How FillCarts Compares</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">See why hyperlocal Kirana delivery offers better freshness and speed.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-slate-900 text-white uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-4 md:p-5">Platform Capability</th>
                  <th className="p-4 md:p-5 text-blue-400 font-extrabold bg-slate-800">FillCarts (Hyperlocal)</th>
                  <th className="p-4 md:p-5 text-slate-300">Mega Dark-Store Apps</th>
                  <th className="p-4 md:p-5 text-slate-400">Traditional E-Commerce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-5 font-bold text-slate-900">{row.feature}</td>
                    <td className="p-4 md:p-5 font-extrabold text-blue-600 bg-blue-50/50">{row.fillcarts}</td>
                    <td className="p-4 md:p-5 text-slate-600">{row.darkstore}</td>
                    <td className="p-4 md:p-5 text-slate-500">{row.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* App Download Banner */}
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
