import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Search, User, ShoppingCart, ChevronRight, Repeat, Clock,
  Percent, Bell, PauseCircle, CheckCircle2, Milk, ShoppingBasket,
  Sparkles, Star
} from "lucide-react";
import Footer from "./Footer";

const benefits = [
  { icon: Clock, bg: "bg-blue-50", color: "text-blue-600", title: "Never Run Out", desc: "Essentials delivered automatically on your schedule." },
  { icon: Percent, bg: "bg-teal-50", color: "text-teal-600", title: "Save More", desc: "Subscribers get extra discounts on every delivery." },
  { icon: Bell, bg: "bg-violet-50", color: "text-violet-600", title: "Smart Reminders", desc: "Get notified a day before every scheduled delivery." },
  { icon: PauseCircle, bg: "bg-amber-50", color: "text-amber-700", title: "Pause Anytime", desc: "Skip a delivery or cancel — no questions asked." },
];

const plans = [
  {
    key: "daily-milk",
    icon: Milk,
    color: "blue",
    name: "Daily Milk & Dairy",
    desc: "Fresh milk, curd and paneer delivered every morning.",
    price: 45,
    unit: "/day",
    features: ["Delivered by 7 AM daily", "Skip anytime from app", "5% subscriber discount"],
  },
  {
    key: "grocery-essentials",
    icon: ShoppingBasket,
    color: "violet",
    name: "Weekly Grocery Essentials",
    desc: "Your regular grocery list, delivered every week automatically.",
    price: 599,
    unit: "/week",
    popular: true,
    features: ["Customizable item list", "Choose your delivery day", "10% subscriber discount"],
  },
  {
    key: "custom-plan",
    icon: Sparkles,
    color: "teal",
    name: "Build Your Own Plan",
    desc: "Pick any products and set your own delivery frequency.",
    price: null,
    unit: "",
    features: ["Fully customizable", "Daily, weekly or monthly", "Flexible cancellation"],
  },
];

const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", btn: "bg-blue-600", ring: "border-blue-400" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", btn: "bg-violet-600", ring: "border-violet-400" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", btn: "bg-teal-600", ring: "border-teal-400" },
};

const steps = [
  { title: "Pick a plan", desc: "Choose a ready-made plan or build your own." },
  { title: "Set your schedule", desc: "Daily, weekly, or monthly — whatever suits you." },
  { title: "We deliver, automatically", desc: "No need to reorder — it just shows up." },
  { title: "Adjust anytime", desc: "Pause, skip, or cancel a delivery in one tap." },
];

const testimonials = [
  { n: "Meera J.", t: "Subscription lagane ke baad milk kabhi khatam nahi hota, bahut relax feel hota hai." },
  { n: "Karan P.", t: "Weekly grocery plan se time bachta hai, aur discount bhi milta hai." },
  { n: "Divya R.", t: "Skip karna bahut easy hai jab travel pe jaana ho." },
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-50/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link to="/" className="text-xl font-extrabold flex-shrink-0" style={{ fontFamily: "'Fraunces', serif" }}>App<span className="text-blue-600">Kart</span></Link>
          <div className="hidden md:flex items-center gap-1.5 text-sm font-semibold border border-slate-200 rounded-full px-3 py-2 bg-white flex-shrink-0">
            <MapPin size={14} className="text-blue-600" /> Your Location
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-base text-slate-500 max-w-xs flex-1">
            <Search size={16} /> <span>Search products, stores...</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center"><User size={16} /></button>
            <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center"><ShoppingCart size={16} /></button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-3 text-sm text-slate-500 font-medium flex items-center gap-1.5">
          <Link to="/" className="hover:text-blue-600">Home</Link><ChevronRight size={13} /><span className="text-slate-900 font-bold">Subscriptions</span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-14 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 text-sm font-bold mb-5">
          <Repeat size={14} className="text-blue-600" /> Subscription
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
          Never run out of essentials.
        </h1>
        <p className="text-slate-500 text-base max-w-xl mx-auto font-medium">
          Set it once and let your milk, groceries and daily needs arrive on their own schedule — with subscriber-only savings.
        </p>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map((b, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className={`w-11 h-11 rounded-full ${b.bg} ${b.color} flex items-center justify-center mb-3.5`}><b.icon size={19} /></div>
              <div className="font-extrabold text-base mb-1">{b.title}</div>
              <div className="text-sm text-slate-500">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-2">Choose a plan</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Plans that fit your routine.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((p) => {
            const c = colorMap[p.color];
            const isSelected = selectedPlan === p.key;
            return (
              <div
                key={p.key}
                className={`relative bg-white rounded-2xl p-7 border-2 transition-all ${isSelected ? c.ring : "border-slate-200"}`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-7 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                )}
                <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-4`}><p.icon size={22} /></div>
                <h3 className="text-lg font-bold mb-1.5" style={{ fontFamily: "'Fraunces', serif" }}>{p.name}</h3>
                <p className="text-sm text-slate-500 mb-5">{p.desc}</p>
                <div className="mb-5">
                  {p.price ? (
                    <span className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>₹{p.price}<span className="text-sm text-slate-400 font-semibold">{p.unit}</span></span>
                  ) : (
                    <span className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Custom pricing</span>
                  )}
                </div>
                <ul className="space-y-2 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                      <CheckCircle2 size={15} className={c.text} /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedPlan(p.key)}
                  className={`w-full font-bold rounded-full py-2.5 text-sm ${isSelected ? `${c.btn} text-white` : "bg-slate-100 text-slate-700"}`}
                >
                  {isSelected ? "Selected" : "Choose Plan"}
                </button>
              </div>
            );
          })}
        </div>
        {selectedPlan && (
          <div className="text-center mt-8">
            <button className="bg-slate-900 text-white font-bold rounded-full px-7 py-3 text-sm">Continue with {plans.find((p) => p.key === selectedPlan).name}</button>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-2">How it works</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Set up in under a minute.</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 relative">
              <div className="absolute top-4 right-5 text-3xl font-bold text-slate-100" style={{ fontFamily: "'Fraunces', serif" }}>{i + 1}</div>
              <div className="font-extrabold text-base mb-1">{s.title}</div>
              <div className="text-sm text-slate-500">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-2">Subscriber Stories</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Loved by subscribers.</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex gap-0.5 text-blue-500 mb-3">{[...Array(5)].map((_, s) => <Star key={s} size={13} fill="currentColor" />)}</div>
              <p className="text-sm text-slate-500 mb-4">"{t.t}"</p>
              <div className="font-extrabold text-sm">{t.n}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
