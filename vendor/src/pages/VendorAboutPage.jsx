import React from "react";
import { Link } from "react-router-dom";
import VendorNavbar from "../components/VendorNavbar";
import Footer from "../components/Footer";
import {
  Store, ShieldCheck, Wallet, Clock, Users, MapPin, Building2,
  CheckCircle2, Sparkles, ArrowRight, Zap, Star, PhoneCall, TrendingUp,
  LayoutDashboard, Check, X
} from "lucide-react";

const threePillars = [
  {
    icon: Store,
    title: "1. Trust & Local Focus",
    desc: "We empower neighborhood Kiranas, Dairies, and Retailers to serve their existing community and attract nearby households online."
  },
  {
    icon: LayoutDashboard,
    title: "2. Technology Simplicity",
    desc: "No complex software or technical knowledge needed. Manage catalog items, prices, and stock in seconds on your mobile phone."
  },
  {
    icon: Wallet,
    title: "3. Financial Growth & Transparency",
    desc: "Enjoy zero upfront onboarding fees, 100% transparent platform charges, and direct next-day settlements into your bank account."
  }
];

const comparisonData = [
  {
    feature: "Customer Reach",
    offlineOnly: "Limited to footfall within 200 meters",
    withFilcarts: "Expanded to 2-3 km neighborhood radius"
  },
  {
    feature: "Stock & Price Control",
    offlineOnly: "Manual price tags & paper ledger books",
    withFilcarts: "1-Tap stock updates & mobile price edits"
  },
  {
    feature: "Order Preparation",
    offlineOnly: "Customers wait in long shop queues",
    withFilcarts: "Pack items in advance; partner picks up"
  },
  {
    feature: "Doorstep Delivery",
    offlineOnly: "Requires hiring your own delivery boy",
    withFilcarts: "Dedicated Filcarts delivery fleet"
  },
  {
    feature: "Payment Settlements",
    offlineOnly: "Cash or scattered UPI QR receipts",
    withFilcarts: "Direct automated next-day bank transfer"
  }
];

export default function VendorAboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 flex flex-col font-sans antialiased">
      {/* Navbar */}
      <VendorNavbar />

      {/* Hero Header Section */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
            <Store size={14} className="text-emerald-600" />
            <span>About Filcarts Merchant Network</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Digitizing local <span className="text-emerald-600">neighborhood stores</span>
          </h1>

          <p className="text-sm leading-relaxed text-slate-600 max-w-2xl">
            Filcarts is built with a clear vision: to empower local Kiranas, dairies, bakeries, and retail shops with simple digital tools, fair partnership terms, and reliable doorstep delivery.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <a
              href="/#register"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-3 rounded-lg transition shadow-sm"
            >
              <span>Register Your Store</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 flex-1 w-full text-left">
        
        {/* 1. Our 3 Core Merchant Pillars */}
        <section className="space-y-6">
          <div className="text-left space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Our 3 pillars of merchant partnership
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              We design every feature around the needs of local shopkeepers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {threePillars.map((p, i) => {
              const IconComponent = p.icon;
              return (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <IconComponent size={20} />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-slate-900">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Step Comparison: Traditional Offline Store vs. Store with Filcarts */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Traditional Offline Store vs. Store with Filcarts
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              See how Filcarts transforms daily store operations and local customer reach.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-900 text-sm font-semibold">
                  <th className="p-3.5 rounded-l-lg">Feature</th>
                  <th className="p-3.5 text-slate-500">Traditional Offline Store</th>
                  <th className="p-3.5 text-emerald-700 bg-emerald-50/70 rounded-r-lg">Store with Filcarts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="p-3.5 font-semibold text-slate-900">{row.feature}</td>
                    <td className="p-3.5 text-slate-600 flex items-center gap-2">
                      <X size={16} className="text-red-400 shrink-0" />
                      <span>{row.offlineOnly}</span>
                    </td>
                    <td className="p-3.5 text-slate-900 font-medium bg-emerald-50/30">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Check size={16} className="text-emerald-600 shrink-0" />
                        <span>{row.withFilcarts}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Register Store CTA */}
        <section className="bg-emerald-900 text-white rounded-2xl p-8 sm:p-10 text-center space-y-4 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Ready to empower your local store?
          </h2>
          <p className="text-sm text-emerald-100 max-w-lg mx-auto leading-relaxed">
            Join hundreds of local Kiranas and retail partners already serving nearby households with Filcarts.
          </p>
          <div className="pt-2">
            <a
              href="/#register"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-lg transition shadow-sm"
            >
              <span>Register Your Store Today</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
