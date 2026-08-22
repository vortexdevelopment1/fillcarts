import React from "react";
import { Link } from "react-router-dom";
import RiderNavbar from "../components/RiderNavbar";
import Footer from "../components/Footer";
import {
  Bike, ShieldCheck, Wallet, Clock, Navigation, Award, Users, MapPin,
  CheckCircle2, HeartPulse, Sparkles, ArrowRight, Zap, Star, PhoneCall
} from "lucide-react";

export default function RiderAboutPage() {
  return (
    <div className="bg-[#F8FAF7] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Dedicated Rider Navbar */}
      <RiderNavbar />

      {/* Hero Banner Section */}
      <section className="relative bg-slate-950 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/rider-partner-hero.jpg"
            alt="Delivery Partner Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#16A34A] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-sm">
              <Sparkles size={14} />
              <span>ABOUT FILLCARTS DELIVERY PARTNERS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Empowering 50,000+ Local <br />
              <span className="text-[#22C55E]">Delivery Partners</span> Across India
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 font-medium leading-relaxed">
              FillCarts Delivery Partner Network is dedicated to creating flexible, reliable, and rewarding delivery opportunities for two-wheeler, EV scooter, and bicycle partners delivering neighborhood groceries.
            </p>

            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <a
                href="/rider#register"
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-7 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
              >
                <span>Join as Delivery Partner</span>
                <ArrowRight size={16} />
              </a>
              <Link
                to="/rider"
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all"
              >
                View Earnings & Shifts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rider Partner Stats Banner */}
      <div className="bg-white border-y border-slate-200/90 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-black text-[#16A34A]">50,000+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Delivery Partners</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-black text-amber-500">100+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cities Operating</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-black text-slate-900">₹120 Cr+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Rider Earnings Paid</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-black text-emerald-600">99.4%</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">On-Time Deliveries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 flex-1 w-full text-left">
        
        {/* Our Mission & Values */}
        <section className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3.5 py-1 rounded-full border border-emerald-200">
              OUR MISSION & PURPOSE
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Transforming hyperlocal delivery with dignity & flexibility
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              At FillCarts, we believe delivery partners are the backbone of our neighborhood ecosystem. We aim to empower riders with transparent payouts, 100% schedule flexibility, comprehensive insurance cover, and smart app technology.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: "Fair & Transparent Earnings", desc: "No hidden deductions. Live trip breakdown, tips & weekly direct bank deposits." },
                { title: "Safety & Medical Security", desc: "Free health and accidental insurance up to ₹5 Lakh for active riders." },
                { title: "Hyperlocal Efficiency", desc: "Deliver orders within a 3km radius from local Kirana stores near your home." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <CheckCircle2 size={20} className="text-[#16A34A] shrink-0 mt-0.5" />
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
              Why 50,000+ Partners Choose FillCarts
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-bold">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1">
                <Clock size={20} className="text-[#16A34A]" />
                <div className="text-slate-900 font-extrabold">Flexible Slots</div>
                <div className="text-[10px] text-slate-500 font-medium">Work 4, 8 or 12 hrs/day</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1">
                <Wallet size={20} className="text-amber-600" />
                <div className="text-slate-900 font-extrabold">Weekly Payouts</div>
                <div className="text-[10px] text-slate-500 font-medium">Deposited every Tuesday</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-1">
                <ShieldCheck size={20} className="text-blue-600" />
                <div className="text-slate-900 font-extrabold">₹5 Lakh Cover</div>
                <div className="text-[10px] text-slate-500 font-medium">Free medical insurance</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
                <PhoneCall size={20} className="text-slate-700" />
                <div className="text-slate-900 font-extrabold">24/7 Helpline</div>
                <div className="text-[10px] text-slate-500 font-medium">On-duty rider support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Rider Testimonials / Success Stories */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              ⭐ RIDER STORIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Hear from our active Delivery Partners
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sumit Roy",
                city: "Gurgaon",
                vehicle: "EV Scooter",
                story: "I deliver 8 hours daily near my area. Weekly payouts are on time, and the rider app navigation makes deliveries smooth!",
                earnings: "₹28,500 / month"
              },
              {
                name: "Vikram Singh",
                city: "Indore",
                vehicle: "Motorbike",
                story: "The flexibility is what I love most. I manage my college in the morning and deliver during peak lunch and dinner hours.",
                earnings: "₹19,200 / month (Part-Time)"
              },
              {
                name: "Ramesh Sharma",
                city: "Delhi NCR",
                vehicle: "Two-Wheeler",
                story: "FillCarts gives direct weekly deposits and free medical cover. The rider support team responds immediately if I ever need help.",
                earnings: "₹34,000 / month"
              }
            ].map((story, i) => (
              <div key={i} className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-black text-sm">
                      {story.name[0]}
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">{story.name}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{story.city} · {story.vehicle}</div>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-[#166534] border border-emerald-200 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    {story.earnings}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium italic">"{story.story}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Join CTA Banner */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-xl border border-slate-800">
          <h2 className="text-2xl sm:text-4xl font-black">
            Ready to start delivering with FillCarts?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-semibold max-w-xl mx-auto">
            Apply online in 2 minutes, get your documents verified, download the Rider Partner App and start earning weekly.
          </p>
          <div>
            <a
              href="/rider#register"
              className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs sm:text-sm font-extrabold px-8 py-4 rounded-2xl transition-all shadow-md"
            >
              <span>Register as Delivery Partner Now</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
