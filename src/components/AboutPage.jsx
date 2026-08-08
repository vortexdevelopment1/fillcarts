import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  ChevronRight, Target, Heart, ShieldCheck, Store, Bike, Sparkles, TrendingUp
} from "lucide-react";

const values = [
  { icon: Heart, bg: "bg-blue-50", color: "text-blue-600", title: "Community First", desc: "We build for the neighbourhoods we operate in, not against them." },
  { icon: ShieldCheck, bg: "bg-teal-50", color: "text-teal-600", title: "Trust & Transparency", desc: "Clear pricing, honest commissions, verified partners." },
  { icon: TrendingUp, bg: "bg-violet-50", color: "text-violet-600", title: "Local Growth", desc: "Every order helps a local shop and a local rider earn more." },
  { icon: Sparkles, bg: "bg-amber-50", color: "text-amber-700", title: "Simplicity", desc: "Ordering, selling, and delivering should all feel effortless." },
];

const journey = [
  
  { year: "The Idea", text: "FillCarts started with a simple question — why should local shops be left out of fast delivery?" },
  { year: "Building the Network", text: "We onboarded local vendors and riders neighbourhood by neighbourhood, not city by city." },
  { year: "Today", text: "A growing network of shops, riders and customers connected through one simple app." },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Shared Common Navbar */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center gap-1.5">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={13} />
          <span className="text-slate-900 font-bold">About</span>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 text-sm font-bold mb-5">
          <Target size={14} className="text-blue-600" /> Our Mission
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
          Connecting local shops, riders and customers — one neighbourhood at a time.
        </h1>
        <p className="text-slate-500 text-base max-w-2xl mx-auto font-medium">
          FillCarts isn't built around a handful of cities. It's built around the idea that any local vendor and any local rider should be able to join, wherever they are.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: "150K+", l: "Orders Delivered" },
            { n: "1,200+", l: "Local Vendors" },
            { n: "3,500+", l: "Active Riders" },
            { n: "4.7★", l: "Average Rating" },
          ].map((s) => (
            <div key={s.l} className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
              <div className="text-2xl font-bold text-blue-600" style={{ fontFamily: "'Fraunces', serif" }}>{s.n}</div>
              <div className="text-sm text-slate-500 font-semibold mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-2">Our Journey</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>How we got here.</h2>
        </div>
        <div className="space-y-4">
          {journey.map((j, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-5">
              <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold flex-shrink-0" style={{ fontFamily: "'Fraunces', serif" }}>{i + 1}</div>
              <div>
                <div className="font-extrabold text-base mb-1">{j.year}</div>
                <p className="text-sm text-slate-500">{j.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-2">What we believe</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Our values.</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {values.map((v, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className={`w-11 h-11 rounded-full ${v.bg} ${v.color} flex items-center justify-center mb-3.5`}><v.icon size={19} /></div>
              <div className="font-extrabold text-base mb-1">{v.title}</div>
              <div className="text-sm text-slate-500">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-violet-50 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <Store size={22} className="text-violet-600 mb-3" />
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Own a local shop?</h3>
              <p className="text-sm text-slate-500 mb-6">Bring it online and reach more customers nearby.</p>
            </div>
            <Link to="/become-vendor" className="inline-block bg-slate-900 text-white font-bold rounded-full px-6 py-2.5 text-sm w-fit">Become a Vendor</Link>
          </div>
          <div className="bg-teal-50 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <Bike size={22} className="text-teal-600 mb-3" />
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Want flexible earnings?</h3>
              <p className="text-sm text-slate-500 mb-6">Deliver on your own schedule and get paid weekly.</p>
            </div>
            <Link to="/become-rider" className="inline-block bg-blue-600 text-white font-bold rounded-full px-6 py-2.5 text-sm w-fit">Become a Rider</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
