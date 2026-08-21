import React from "react";
import { Link } from "react-router-dom";
import VendorNavbar from "../components/VendorNavbar";
import Footer from "../components/Footer";
import {
  Store, ShieldCheck, Wallet, Clock, Users, MapPin, Building2,
  CheckCircle2, Sparkles, ArrowRight, Zap, Star, PhoneCall, TrendingUp, LayoutDashboard
} from "lucide-react";

export default function VendorAboutPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#17231A] flex flex-col font-sans">
      {/* Dedicated Vendor Navbar */}
      <VendorNavbar />

      {/* Hero Banner Section */}
      <section className="relative bg-white border-b border-slate-200 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#ECFDF3] border border-emerald-200 text-[#166534] text-xs font-bold px-3 py-1 rounded-md">
              <Sparkles size={14} className="text-[#16A34A]" />
              <span>ABOUT FILCARTS MERCHANT NETWORK</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17231A] leading-tight tracking-tight">
              Digitizing Local <br />
              <span className="text-[#16A34A]">Neighborhood Stores</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Filcarts Merchant Network helps local grocery stores, bakeries, dairies, and retail shops expand online sales, manage inventory seamlessly, and connect with nearby shoppers.
            </p>

            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <a
                href="/#register"
                className="bg-[#16A34A] hover:bg-[#166534] text-white font-extrabold px-6 py-3 rounded-lg text-xs sm:text-sm transition-colors shadow-xs flex items-center gap-2"
              >
                <span>Register Store Online</span>
                <ArrowRight size={16} />
              </a>
              <Link
                to="/"
                className="border border-slate-300 hover:border-slate-400 text-slate-700 bg-white font-bold px-5 py-3 rounded-lg text-xs sm:text-sm transition-colors"
              >
                Explore Merchant Advantages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 flex-1 w-full text-left">
        
        {/* Merchant Mission & Values */}
        <section className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-md border border-emerald-200">
              OUR MERCHANT VISION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
              Empowering local retail with simple digital tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Local neighborhood stores have been the trust foundation of Indian shopping. Filcarts provides offline retailers with digital store management tools and delivery network support to reach nearby customers.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: "Free Store Registration", desc: "No upfront registration fee or complex setup process." },
                { title: "Smart Inventory & Price Management", desc: "Manage catalog items, prices, and stock in 1-tap using your Merchant App." },
                { title: "Neighborhood Order Delivery", desc: "Filcarts delivery partners collect orders from your shop for doorstep customer delivery." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <CheckCircle2 size={20} className="text-[#16A34A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-[#17231A]">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-extrabold text-[#17231A] border-b border-slate-100 pb-3">
              Why Retailers Partner with Filcarts
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-bold">
              <div className="bg-[#ECFDF3] border border-emerald-200 p-4 rounded-xl space-y-1">
                <TrendingUp size={20} className="text-[#166534]" />
                <div className="text-[#17231A] font-bold">Customer Reach</div>
                <div className="text-[10px] text-slate-600 font-normal">Connect with shoppers nearby</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                <Wallet size={20} className="text-[#16A34A]" />
                <div className="text-[#17231A] font-bold">Transparent Settlements</div>
                <div className="text-[10px] text-slate-600 font-normal">Direct bank transfers & clear reports</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                <LayoutDashboard size={20} className="text-slate-700" />
                <div className="text-[#17231A] font-bold">Simple Dashboard</div>
                <div className="text-[10px] text-slate-600 font-normal">Manage stock easily on mobile</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                <PhoneCall size={20} className="text-slate-700" />
                <div className="text-[#17231A] font-bold">Merchant Support</div>
                <div className="text-[10px] text-slate-600 font-normal">Dedicated onboarding assistance</div>
              </div>
            </div>
          </div>
        </section>

        {/* Register CTA Banner */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 text-center space-y-5 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
            Grow your store sales online with Filcarts
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Register your store details online. Our merchant onboarding team will help you catalog products and launch online.
          </p>
          <div>
            <a
              href="/#register"
              className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#166534] text-white text-xs sm:text-sm font-extrabold px-7 py-3.5 rounded-lg transition-colors shadow-xs"
            >
              <span>Register Your Store Now</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
