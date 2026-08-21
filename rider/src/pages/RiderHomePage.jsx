import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import RiderNavbar from "../components/RiderNavbar";
import {
  Bike, User, ChevronRight, ShieldCheck, Wallet, Clock, Navigation,
  CheckCircle2, Star, Smartphone, HeartPulse, FileText, BadgePercent, QrCode,
  ArrowRight, ChevronDown, RefreshCw, AlertCircle, Lock, Sparkles, Zap, MapPin, Check,
  Award, Shield, DollarSign, PhoneCall
} from "lucide-react";

// 4 Core Swiggy-Style Rider Benefits
const benefits = [
  {
    icon: Clock,
    title: "100% Flexible Work Hours",
    desc: "Choose full-time or part-time delivery slots according to your own convenience.",
    badge: "⏱️ FLEXIBLE SHIFTS"
  },
  {
    icon: Wallet,
    title: "Transparent Weekly Payouts",
    desc: "Track daily trip earnings, surge incentives & tips. Direct bank transfers every week.",
    badge: "💰 DIRECT PAYOUTS"
  },
  {
    icon: ShieldCheck,
    title: "Free Insurance Cover",
    desc: "Comprehensive health and medical accidental cover up to ₹5 Lakh for active riders.",
    badge: "🛡️ FREE COVER"
  },
  {
    icon: Smartphone,
    title: "Easy Rider Partner App",
    desc: "Accept nearby orders, live GPS route navigation and real-time earnings tracker.",
    badge: "📱 EASY APP"
  }
];

// Required Documents List
const requirements = [
  {
    icon: FileText,
    title: "Identity Proof",
    desc: "Aadhaar Card or PAN Card for identity verification."
  },
  {
    icon: Bike,
    title: "Vehicle Options",
    desc: "Two-wheeler, EV scooter or bicycle depending on your area."
  },
  {
    icon: Navigation,
    title: "Driving License",
    desc: "Valid license required for motorized vehicle riders."
  },
  {
    icon: Smartphone,
    title: "Android Smartphone",
    desc: "Active smartphone with GPS & internet connection."
  }
];

// 4-Step Onboarding Process
const onboardingSteps = [
  {
    step: "01",
    title: "Submit Online Form",
    desc: "Fill your basic details, city and vehicle choice in 2 minutes."
  },
  {
    step: "02",
    title: "Document Verification",
    desc: "Our fleet team verifies your Aadhaar, DL & vehicle details online."
  },
  {
    step: "03",
    title: "Download Rider App",
    desc: "Get activated and log in to the FillCarts Delivery Partner App."
  },
  {
    step: "04",
    title: "Start Delivering & Earn",
    desc: "Accept local deliveries near you and start earning weekly."
  }
];

// Rider FAQ Data
const faqs = [
  {
    q: "When do I get paid?",
    a: "Earnings are deposited directly into your registered bank account every week. You can track daily trip payouts, incentives, and tips live in the Rider App."
  },
  {
    q: "Can I deliver using a bicycle or EV scooter?",
    a: "Yes! Bicycle and EV scooter partners are welcome in select zones for short-distance hyperlocal deliveries with special green incentives."
  },
  {
    q: "What documents do I need to join?",
    a: "You need an Aadhaar Card, PAN Card, Driving License (for motorized vehicles), Vehicle RC (if applicable), and Bank Account details."
  },
  {
    q: "How does verification work?",
    a: "After submitting your online application, our fleet onboarding team reviews your details and guides you through document verification in 24 hours."
  },
  {
    q: "Can I choose my working hours?",
    a: "Absolutely! You can choose part-time (peak lunch/dinner hours) or full-time delivery shifts according to your availability."
  }
];

export default function RiderHomePage() {
  // Income Calculator State
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const perHourRate = 95;
  const daysPerWeek = 6;
  const estWeekly = Math.round(hoursPerDay * perHourRate * daysPerWeek);
  const estMonthly = Math.round(estWeekly * 4.2);

  // Application Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "Two-Wheeler (Motorbike/Scooter)",
    city: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "name"
          ? value.replace(/[^a-zA-Z\s]/g, "")
          : name === "phone"
            ? value.replace(/\D/g, "").slice(0, 10)
            : name === "email"
              ? value.replace(/[^a-zA-Z0-9._%+-@]/g, "")
              : value,
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.city.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.name.trim().length < 2) {
      setError("Full Name must contain at least 2 letters.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Mobile Phone must be exactly 10 digits.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address (e.g. partner@gmail.com).");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-[#F8FAF7] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Dedicated Rider Navbar */}
      <RiderNavbar />

      {/* ========================================================================= */}
      {/* HERO BANNER WITH CLEAR RIDER BACKGROUND & SIDE REGISTRATION FORM */}
      {/* ========================================================================= */}
      <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center overflow-hidden py-10 lg:py-16">
        
        {/* Clear & Proper Rider Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/rider-partner-hero.jpg"
            alt="FillCarts Delivery Partner Rider"
            className="w-full h-full object-cover object-center"
          />
          {/* Soft gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-slate-950/15" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* HERO LEFT COLUMN: Clean Title & Short Paragraph */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4 text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                Ride with FillCarts & <br />
                <span className="text-[#22C55E]">Earn Flexibly</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-100 font-semibold leading-relaxed max-w-lg drop-shadow-sm">
                Deliver groceries & daily essentials from local Kirana stores nearby. Enjoy 100% flexible working hours and weekly direct bank payouts.
              </p>
            </div>

            {/* HERO RIGHT COLUMN: Compact Registration Form Card Shifted to Side */}
            <div className="lg:col-span-5 xl:col-span-4 flex justify-end" id="register">
              <div className="w-full max-w-sm sm:max-w-md ml-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/50 text-slate-900 text-left relative overflow-hidden">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ⚡ FAST 2-MIN REGISTRATION
                    </span>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                      Register as Partner
                    </h2>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                    <Bike size={18} />
                  </div>
                </div>

                {submitted ? (
                  /* POST-SUBMISSION SUCCESS VIEW */
                  <div className="space-y-4 text-center py-2 animate-[scaleUp_0.2s_ease-out]">
                    <div className="w-12 h-12 bg-[#ECFDF3] text-[#16A34A] border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 size={26} strokeWidth={2.5} />
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Application Submitted! 🎉</h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Welcome <strong>{form.name}</strong>! Application for <strong>{form.vehicle}</strong> in {form.city} received.
                      </p>
                    </div>

                    {/* Timeline */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5 text-left text-xs">
                      <div className="flex items-center justify-between text-emerald-700 font-bold">
                        <span>1. Form Received</span>
                        <Check size={13} />
                      </div>
                      <div className="flex items-center justify-between text-amber-700 font-bold">
                        <span>2. Document Verification</span>
                        <span className="text-[9px] bg-amber-100 px-1.5 py-0.2 rounded-full">In Review</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 font-bold">
                        <span>3. Rider App Activation</span>
                        <span>Pending</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 font-semibold">
                      Our fleet onboarding manager will call you at <strong>{form.phone}</strong> within 24 hours.
                    </p>

                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-[11px] font-extrabold text-[#16A34A] hover:underline"
                    >
                      ← Submit another application
                    </button>
                  </div>
                ) : (
                  /* APPLICATION FORM VIEW */
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Full Name *</label>
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Kumar"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#16A34A] focus:bg-white rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
                      />
                    </div>

                    {/* Mobile Phone */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Mobile Phone (10 Digits) *</label>
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#16A34A] focus:bg-white rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Email Address *</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="partner@example.com"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#16A34A] focus:bg-white rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
                      />
                    </div>

                    {/* City & Vehicle in Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">City / Area *</label>
                        <input
                          required
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="e.g. Indore / Bhopal"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#16A34A] focus:bg-white rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Vehicle Type *</label>
                        <select
                          name="vehicle"
                          value={form.vehicle}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#16A34A] focus:bg-white rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-900 outline-none transition-all cursor-pointer"
                        >
                          <option>Two-Wheeler (Motorbike/Scooter)</option>
                          <option>EV Scooter</option>
                          <option>Bicycle</option>
                        </select>
                      </div>
                    </div>

                    {/* Validation Error Message */}
                    {error && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold p-2.5 rounded-lg flex items-center gap-2">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 text-white font-black py-2.5 rounded-lg text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> Registering Partner...
                        </>
                      ) : (
                        <>
                          <span>Register Now</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>

                    <p className="text-[9px] text-slate-400 font-semibold text-center pt-0.5">
                      By registering, you agree to receive fleet onboarding updates on WhatsApp & SMS.
                    </p>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK HIGHLIGHT STRIP */}
      <div className="bg-white border-y border-slate-200/90 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left" id="benefits">
          {[
            { icon: Clock, title: "Flexible Shifts", sub: "Choose daily timings" },
            { icon: Wallet, title: "Weekly Earnings", sub: "Direct bank deposit" },
            { icon: ShieldCheck, title: "Free Health Cover", sub: "Up to ₹5 Lakh insurance" },
            { icon: PhoneCall, title: "24/7 Helpline", sub: "Dedicated partner support" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] border border-emerald-200 flex items-center justify-center shrink-0">
                <item.icon size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">{item.title}</h4>
                <p className="text-[10px] text-slate-500 font-medium">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN BODY CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16 flex-1 w-full">

        {/* 1. EARNINGS CALCULATOR WIDGET */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3.5 py-1 rounded-full border border-emerald-200">
                <Wallet size={14} className="text-[#16A34A]" /> INCOME CALCULATOR
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Calculate your potential earnings
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
                Estimate how much you can earn every week based on your preferred daily delivery hours.
              </p>

              {/* Slider / Hours Picker */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                  <span>Daily Delivery Hours:</span>
                  <span className="text-[#16A34A] text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {hoursPerDay} Hours / Day
                  </span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={12}
                  step={1}
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#16A34A]"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>4 Hrs (Part-Time)</span>
                  <span>8 Hrs (Standard)</span>
                  <span>12 Hrs (Full-Time)</span>
                </div>
              </div>
            </div>

            {/* Income Display Box */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 text-center shadow-lg border border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Estimated Monthly Earnings
              </div>
              <div className="text-4xl sm:text-5xl font-black text-[#22C55E]">
                ₹{estMonthly.toLocaleString("en-IN")}
                <span className="text-xs text-slate-400 font-semibold block mt-1">/ month</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                  <div className="text-slate-400 text-[10px] font-bold">Estimated Weekly</div>
                  <div className="text-lg font-black text-amber-400 mt-0.5">₹{estWeekly.toLocaleString("en-IN")}</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                  <div className="text-slate-400 text-[10px] font-bold">Estimated Daily</div>
                  <div className="text-lg font-black text-white mt-0.5">₹{Math.round(estWeekly / 6)}</div>
                </div>
              </div>

              <a
                href="#register"
                className="inline-block bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Apply Now & Start Earning →
              </a>
            </div>
          </div>
        </section>

        {/* 2. WHY DELIVER WITH FILLCARTS */}
        <section className="space-y-6 text-left">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-2">
                <Sparkles size={13} /> Rider Partner Advantages
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Why join FillCarts Rider Fleet?
              </h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/90 hover:border-[#16A34A] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] border border-emerald-200 flex items-center justify-center font-bold">
                    <b.icon size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black tracking-wider uppercase text-[#166534] bg-[#ECFDF3] px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {b.badge}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-2">{b.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{b.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. REQUIRED DOCUMENTS & ELIGIBILITY */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-left" id="requirements">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200 mb-2">
                <FileText size={13} /> EASY ELIGIBILITY
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Documents & Vehicle Requirements
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              Check before applying
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {requirements.map((r, i) => (
              <div key={i} className="bg-[#FFFCF5] p-5 rounded-2xl border border-amber-100/90 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
                  <r.icon size={20} />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">{r.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {[
              { title: "Identity Proof", sub: "Aadhaar / PAN Card" },
              { title: "Driving License", sub: "For Motorized Vehicles" },
              { title: "Vehicle RC", sub: "If applicable" },
              { title: "Bank Account", sub: "Passbook / Cheque" },
              { title: "Smartphone", sub: "Android with Active GPS" }
            ].map((doc, i) => (
              <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center space-y-1">
                <CheckCircle2 size={18} className="text-[#16A34A] mx-auto" />
                <div className="font-extrabold text-xs text-slate-900">{doc.title}</div>
                <div className="text-[10px] text-slate-400 font-semibold">{doc.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 4-STEP ONBOARDING PROCESS */}
        <section className="space-y-6 text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#16A34A] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200 mb-2">
              <Zap size={13} /> SIMPLE STEPS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How to get started in 4 steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {onboardingSteps.map((s, i) => (
              <div key={i} className="bg-white border border-slate-200/90 rounded-3xl p-6 relative space-y-3 shadow-sm">
                <span className="text-3xl font-black text-[#16A34A] bg-emerald-50 border border-emerald-200 w-12 h-12 rounded-2xl flex items-center justify-center">
                  {s.step}
                </span>
                <h4 className="font-extrabold text-base text-slate-900">{s.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FAQ SECTION */}
        <section className="max-w-4xl mx-auto space-y-6 text-left" id="faqs">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#16A34A] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200 mb-2">
              <Sparkles size={13} /> RIDER SUPPORT
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border-b border-slate-100 last:border-b-0 pb-3 pt-1">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between font-extrabold text-xs sm:text-sm text-slate-900 hover:text-[#16A34A] transition-colors py-2 cursor-pointer text-left"
                  >
                    <span>{f.q}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-[#16A34A]" : "text-slate-400"}`} />
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1.5 pt-2 border-t border-slate-50">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
