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
    <div className="bg-[#F8FAF7] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Dedicated Vendor Navbar */}
      <VendorNavbar />

      {/* Hero Banner Section */}
      <section className="relative bg-slate-950 text-white py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 text-xs font-black px-4 py-1.5 rounded-full shadow-sm">
              <Sparkles size={14} />
              <span>ABOUT FILLCARTS MERCHANT NETWORK</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Digitizing 10,000+ Local <br />
              <span className="text-amber-400">Neighborhood Kirana Stores</span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 font-medium leading-relaxed">
              FillCarts Merchant Network helps local grocery stores, bakeries, dairies, and retail shops expand online sales, manage inventory seamlessly, and fulfill 15-minute neighborhood deliveries.
            </p>

            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <a
                href="/vendor#register"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-7 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
              >
                <span>Register Store Online</span>
                <ArrowRight size={16} />
              </a>
              <Link
                to="/vendor"
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all"
              >
                Explore Merchant Advantages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Merchant Stats Banner */}
      <div className="bg-white border-y border-slate-200/90 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-black text-amber-500">10,000+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partner Stores Onboarded</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-black text-[#16A34A]">50 Lakh+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hyperlocal Orders Delivered</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-black text-slate-900">₹250 Cr+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Store Revenue Generated</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-black text-blue-600">3x</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Store Sales Growth</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 flex-1 w-full text-left">
        
        {/* Merchant Mission & Values */}
        <section className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
              OUR MERCHANT VISION
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Empowering local retail with zero technical barrier
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Local neighborhood Kirana stores have been the trust foundation of Indian shopping for generations. FillCarts provides offline retailers with the digital tools, order notifications, and rider fleet required to thrive alongside quick-commerce.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: "0% Commission Trial & Setup", desc: "No upfront registration fees or hidden monthly software charges." },
                { title: "Smart Inventory & Price Management", desc: "Add products, update stock and prices in 1-tap using your Merchant Portal." },
                { title: "Instant Neighborhood Rider Dispatch", desc: "FillCarts rider fleet picks up orders directly from your store counter." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <CheckCircle2 size={20} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Why Retailers Partner with FillCarts
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-bold">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1">
                <TrendingUp size={20} className="text-amber-600" />
                <div className="text-slate-900 font-extrabold">3x Sales Growth</div>
                <div className="text-[10px] text-slate-500 font-medium">Reach 5,000+ nearby buyers</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1">
                <Wallet size={20} className="text-[#16A34A]" />
                <div className="text-slate-900 font-extrabold">Weekly Settlement</div>
                <div className="text-[10px] text-slate-500 font-medium">Direct bank transfer every week</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                <LayoutDashboard size={20} className="text-slate-700" />
                <div className="text-slate-900 font-extrabold">Simple Dashboard</div>
                <div className="text-[10px] text-slate-500 font-medium">Manage stock on mobile or PC</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-1">
                <PhoneCall size={20} className="text-blue-600" />
                <div className="text-slate-900 font-extrabold">Dedicated Manager</div>
                <div className="text-[10px] text-slate-500 font-medium">1-on-1 merchant support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Merchant Success Stories */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ⭐ MERCHANT PARTNER SUCCESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Stories from our partner store owners
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                store: "Gupta Kirana & General Store",
                owner: "Rajesh Gupta",
                location: "Gurgaon Sector 14",
                story: "Since joining FillCarts, our store receives 40+ extra delivery orders daily from societies nearby. Revenue increased by 2.5x in 3 months!",
                sales: "+140% Online Growth"
              },
              {
                store: "Mahalaxmi Supermarket",
                owner: "Suresh Patel",
                location: "Indore Vijay Nagar",
                story: "The inventory catalog management is super easy. Payouts arrive automatically every week. Best decision for our retail business.",
                sales: "+200% Orders/Day"
              },
              {
                store: "Fresh Farm Organic Dairy",
                owner: "Anil Sharma",
                location: "Delhi Dwarka",
                story: "FillCarts riders pick up orders instantly. We don't need to maintain our own delivery staff anymore. Zero hassle!",
                sales: "+180% Revenue"
              }
            ].map((story, i) => (
              <div key={i} className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">{story.store}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{story.owner} · {story.location}</div>
                  </div>
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    {story.sales}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium italic">"{story.story}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Register CTA Banner */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-xl border border-slate-800">
          <h2 className="text-2xl sm:text-4xl font-black">
            Grow your Kirana store sales online today!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-semibold max-w-xl mx-auto">
            Register your store details online in 3 minutes. Our merchant onboarding team will help you catalog products and launch online.
          </p>
          <div>
            <a
              href="/vendor#register"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-extrabold px-8 py-4 rounded-2xl transition-all shadow-md"
            >
              <span>Register Store Partner Now</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
