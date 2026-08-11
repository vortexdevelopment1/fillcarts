import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  Bike, User, ChevronRight, ShieldCheck, Wallet, Clock, Navigation,
  CheckCircle2, Star, Smartphone, HeartPulse, FileText, BadgePercent, QrCode,
  ArrowRight, ChevronDown, RefreshCw, AlertCircle, Lock, Sparkles, Zap, MapPin, Check
} from "lucide-react";

// 3 Quick Highlight Benefits Below Hero
const quickBenefits = [
  {
    icon: Clock,
    title: "Flexible Hours",
    desc: "Choose when you want to deliver."
  },
  {
    icon: Navigation,
    title: "Local Deliveries",
    desc: "Get nearby delivery opportunities."
  },
  {
    icon: Wallet,
    title: "Weekly Payouts",
    desc: "Track your earnings and payouts."
  }
];

// 4 Core Rider Benefits
const benefits = [
  {
    icon: Clock,
    title: "Flexible Working",
    desc: "Choose your delivery hours according to your schedule.",
    badge: "⏱️ FLEXIBLE SHIFTS"
  },
  {
    icon: Wallet,
    title: "Weekly Earnings",
    desc: "Track your earnings and payout schedule transparently.",
    badge: "💰 DIRECT PAYOUTS"
  },
  {
    icon: Smartphone,
    title: "Easy Rider App",
    desc: "Accept deliveries, navigate routes and monitor earnings in one place.",
    badge: "📱 EASY APP"
  },
  {
    icon: ShieldCheck,
    title: "Safety & Support",
    desc: "Access partner helpline support and guidance during your active shifts.",
    badge: "🛡️ 24/7 HELPLINE"
  }
];

// 4 Rider Requirements
const requirements = [
  {
    icon: FileText,
    title: "Identity Proof",
    desc: "Aadhaar Card / PAN Card or applicable identity documents."
  },
  {
    icon: Bike,
    title: "Vehicle Options",
    desc: "Two-wheeler, EV scooter or bicycle depending on location."
  },
  {
    icon: Navigation,
    title: "Driving License",
    desc: "Required where applicable for motorized vehicle drivers."
  },
  {
    icon: Smartphone,
    title: "Android Smartphone",
    desc: "Active smartphone with GPS and internet connection."
  }
];

// 4-Step Onboarding Process
const onboardingSteps = [
  {
    step: "01",
    title: "Apply",
    desc: "Submit your basic information and vehicle type online."
  },
  {
    step: "02",
    title: "Get Verified",
    desc: "Complete required identity and vehicle document verification."
  },
  {
    step: "03",
    title: "Get Activated",
    desc: "Once approved, download and activate the FillCarts Rider App."
  },
  {
    step: "04",
    title: "Start Delivering",
    desc: "Accept nearby delivery opportunities and earn weekly."
  }
];

// Rider FAQ Data
const faqs = [
  {
    q: "When do I get paid?",
    a: "Earnings are processed and deposited directly into your registered bank account on a regular weekly schedule, viewable in your Rider App."
  },
  {
    q: "Can I deliver using a bicycle?",
    a: "Yes! Bicycle delivery partners are welcome in select zones for short-distance hyperlocal deliveries."
  },
  {
    q: "What documents do I need to get started?",
    a: "Requirements include an Aadhaar Card, PAN Card, Driving License (for motorized vehicles), Vehicle RC (if applicable), and Bank Account details."
  },
  {
    q: "How does verification work?",
    a: "After submitting your online application, our rider fleet team reviews your details and guides you through document verification."
  },
  {
    q: "Can I choose my working hours?",
    a: "Absolutely! You can choose full-time or part-time delivery slots according to your convenience using the Rider App."
  }
];

export default function BecomeRiderPage() {
  // Income Calculator State
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const perHourRate = 90;
  const daysPerWeek = 6;
  const estWeekly = Math.round(hoursPerDay * perHourRate * daysPerWeek);

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
      setError("Mobile Phone must be exactly 10 digits (digits only).");
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
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Shared Common Navbar */}
      <Navbar searchPlaceholder="Search rider partner resources..." />

      {/* Breadcrumb & Journey Progress Indicator */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="hover:text-[#16A34A] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#166534] font-bold">Become a Rider</span>
          </div>

          {/* Progress Indicator */}
          <div className="hidden md:flex items-center gap-2 bg-[#ECFDF3] border border-emerald-200 px-3.5 py-1 rounded-full text-[11px] font-bold text-[#166534]">
            <span className="text-[#16A34A]">Explore</span>
            <span>→</span>
            <span>Check Requirements</span>
            <span>→</span>
            <span>Apply</span>
            <span>→</span>
            <span>Get Verified</span>
          </div>
        </div>
      </div>

      {/* 1. HERO SECTION — DISCOVER */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 space-y-5 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3.5 py-1 rounded-full border border-emerald-200/80 mb-2">
              <Bike size={14} className="text-[#16A34A]" /> Deliver With FillCarts
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#17231A] leading-tight tracking-tight">
              Earn flexibly. <br /><span className="text-[#16A34A]">Deliver locally.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
              Choose your working hours, deliver nearby orders and manage your delivery work through the FillCarts Rider App.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-2 flex-wrap justify-center sm:justify-start">
              <a
                href="#register"
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-7 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Apply as a Delivery Partner</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="#requirements"
                className="bg-[#FFFCF5] hover:bg-[#ECFDF3] text-[#166534] border border-emerald-200 font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
              >
                See Requirements
              </a>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
                <Zap size={13} className="fill-amber-500 text-amber-500" /> WEEKLY PAYOUTS
              </span>
            </div>
          </div>

          {/* Right Visual: Rider App Preview Illustration */}
          <div className="md:col-span-5 relative">
            <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 shadow-lg space-y-4 text-left relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold">
                    <Bike size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-[#17231A]">Today's Shift</h3>
                    <span className="text-[10px] text-slate-400 font-semibold">Rider Partner App</span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-[#166534] border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" /> Online
                </span>
              </div>

              {/* Rider Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FFFCF5] p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">Completed Orders</div>
                  <div className="text-xl font-black text-[#166534]">8</div>
                </div>

                <div className="bg-[#FFFCF5] p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">Today's Earnings</div>
                  <div className="text-xl font-black text-[#F59E0B]">₹720</div>
                </div>

                <div className="bg-[#FFFCF5] p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">Distance Covered</div>
                  <div className="text-xl font-black text-[#17231A]">12.4 km</div>
                </div>

                <div className="bg-[#FFFCF5] p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">Rating</div>
                  <div className="text-xl font-black text-[#F59E0B] flex items-center gap-1">
                    <Star size={16} fill="currentColor" /> 4.9
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold text-center italic">
                Rider App Preview · Illustrative Representation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK HIGHLIGHT STRIP */}
      <div className="bg-[#ECFDF3] border-b border-emerald-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {quickBenefits.map((q, i) => (
            <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold flex-shrink-0">
                <q.icon size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-[#17231A]">{q.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{q.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN BODY CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16 flex-1 w-full">
        {/* 2. WHY DELIVER WITH FILLCARTS */}
        <section className="space-y-6 text-center sm:text-left">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-2">
                <Sparkles size={13} /> Rider Partner Advantages
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
                Why deliver with FillCarts?
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
              🔥 Flexible & Reliable
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="group bg-white border border-emerald-100 hover:border-[#16A34A] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <b.icon size={22} />
                    </div>
                    {b.badge && (
                      <span className="text-[10px] font-black text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                        {b.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-base text-[#17231A] group-hover:text-[#166534] transition-colors mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. EARNING MODEL & INCOME CALCULATOR */}
        <section id="calculator" className="space-y-8">
          <div className="grid md:grid-cols-12 gap-8 items-stretch">
            {/* Left Earning Model Explanation */}
            <div className="md:col-span-5 bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-5 text-left flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#16A34A] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
                  <Sparkles size={13} /> Income Breakdown
                </span>
                <h3 className="text-2xl font-extrabold text-[#17231A]">
                  Understand your earnings
                </h3>

                <div className="space-y-3">
                  <div className="bg-[#FFFCF5] p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <h4 className="font-extrabold text-xs text-[#166534]">Delivery Earnings</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Earn based on completed deliveries according to applicable payout rules.
                    </p>
                  </div>

                  <div className="bg-[#FFFCF5] p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <h4 className="font-extrabold text-xs text-[#F59E0B]">Peak / Incentive Earnings</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Additional incentives may apply during eligible high-demand peak hours.
                    </p>
                  </div>

                  <div className="bg-[#FFFCF5] p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <h4 className="font-extrabold text-xs text-[#166534]">Weekly Payouts</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Track your earnings and payout status transparently from the Rider App.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#ECFDF3] p-3 rounded-2xl border border-emerald-200 text-xs font-bold text-[#166534] flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#16A34A] flex-shrink-0" />
                <span>Weekly direct bank deposits</span>
              </div>
            </div>

            {/* Right Income Calculator */}
            <div className="md:col-span-7 bg-[#ECFDF3] border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 text-left space-y-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-white px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
                    <Sparkles size={13} /> Weekly Estimator
                  </span>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> ⭐ ESTIMATOR
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#17231A] mt-1">
                  Estimate your weekly earnings
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Illustrative estimate based on current calculation settings.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-extrabold text-[#17231A] mb-2">
                    <span>Hours Per Day</span>
                    <span className="text-[#F59E0B] font-black text-base bg-white px-3 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                      {hoursPerDay} Hours/day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="12"
                    step="1"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                    className="w-full accent-[#F59E0B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-1">
                    <span>4 Hours (Part-time)</span>
                    <span>12 Hours (Full-time)</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] text-slate-400 font-black uppercase">Estimated Weekly Earnings</div>
                    <div className="text-3xl font-black text-[#F59E0B] mt-0.5">
                      ₹{estWeekly.toLocaleString()}/wk
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold space-y-0.5">
                    <div className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-md font-extrabold inline-block">
                      ~₹{(estWeekly * 4).toLocaleString()} / month
                    </div>
                    <div className="text-[#16A34A] font-bold pt-1">6 Days/week basis</div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-semibold italic">
                * Actual earnings may vary based on deliveries, incentives, location and applicable payout rules.
              </div>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section id="how-it-works" className="space-y-8 text-center sm:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-2">
              <Sparkles size={13} /> Onboarding Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Apply → Verify → Get Activated → Start Delivering
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {onboardingSteps.map((s, idx) => (
              <div key={idx} className="bg-white border border-emerald-100 rounded-2xl p-6 text-left relative space-y-3 shadow-xs group hover:border-[#16A34A] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-xs flex items-center justify-center">
                    {s.step}
                  </span>
                  {idx < 3 && (
                    <ChevronRight size={16} className="hidden lg:block text-slate-300" />
                  )}
                </div>
                <h4 className="font-extrabold text-base text-[#17231A] group-hover:text-[#166534]">{s.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. REQUIREMENTS SECTION */}
        <section id="requirements" className="space-y-6 text-center sm:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#16A34A] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
              <Sparkles size={13} /> Eligibility
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
              What you need to get started
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {requirements.map((r, i) => (
              <div key={i} className="bg-white border border-emerald-100 rounded-2xl p-6 text-left space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold">
                  <r.icon size={20} />
                </div>
                <h4 className="font-extrabold text-base text-[#17231A]">{r.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100 inline-block">
            * Minimum age requirement (18+ years) applies.
          </div>
        </section>

        {/* 6. DOCUMENT CHECKLIST */}
        <section className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-4 text-left shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#16A34A] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
                <Sparkles size={13} /> Pre-Application Checklist
              </span>
              <h3 className="text-xl font-extrabold text-[#17231A]">Keep these ready</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              Requirements may vary by vehicle type and location
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
            {[
              { title: "Identity Proof", sub: "Aadhaar / PAN Card" },
              { title: "Driving License", sub: "For Motorized Vehicles" },
              { title: "Vehicle RC", sub: "If applicable" },
              { title: "Bank Account", sub: "Passbook / Cheque" },
              { title: "Smartphone", sub: "Android with Active GPS" }
            ].map((doc, i) => (
              <div key={i} className="bg-[#FFFCF5] p-3 rounded-xl border border-slate-100 text-center space-y-1">
                <CheckCircle2 size={18} className="text-[#16A34A] mx-auto" />
                <div className="font-extrabold text-xs text-[#17231A]">{doc.title}</div>
                <div className="text-[10px] text-slate-400 font-semibold">{doc.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. APPLICATION FORM OR SUCCESS SCREEN */}
        <section id="register" className="max-w-3xl mx-auto">
          <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-10 shadow-lg">
            {submitted ? (
              /* POST-SUBMISSION SUCCESS & VERIFICATION STATUS VIEW */
              <div className="space-y-8 text-center sm:text-left">
                <div className="bg-[#ECFDF3] border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-[#16A34A] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#17231A]">Application Received! 🎉</h3>
                    <p className="text-xs text-slate-600 font-semibold max-w-md mx-auto mt-1">
                      Welcome <strong>{form.name}</strong>! Your application for <strong>{form.vehicle}</strong> delivery in {form.city} has been submitted successfully.
                    </p>
                  </div>
                </div>

                {/* VERIFICATION STATUS CARD */}
                <div className="bg-white border border-emerald-100 rounded-2xl p-6 space-y-4 text-left shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-[#F59E0B]" />
                      <h4 className="font-extrabold text-sm text-[#17231A]">Application Status</h4>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-300">
                      🟡 Under Review
                    </span>
                  </div>

                  {/* Verification Timeline */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold pt-1">
                    <div className="bg-emerald-50 text-[#166534] p-3 rounded-xl border border-emerald-200">
                      <div>✓ Submitted</div>
                      <div className="text-[10px] font-normal text-slate-500 mt-0.5">Application Received</div>
                    </div>
                    <div className="bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-200">
                      <div>● Verification</div>
                      <div className="text-[10px] font-normal text-slate-500 mt-0.5">Team Reviewing</div>
                    </div>
                    <div className="bg-slate-50 text-slate-400 p-3 rounded-xl border border-slate-200">
                      <div>○ Rider Activation</div>
                      <div className="text-[10px] font-normal text-slate-400 mt-0.5">Pending Approval</div>
                    </div>
                  </div>
                </div>

                {/* RIDER APP DOWNLOAD */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4">
                  <div>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300 inline-block mb-1">
                      ⭐ RIDER PARTNER APP 4.9★
                    </span>
                    <h4 className="font-extrabold text-sm text-[#17231A]">Complete your onboarding in the Rider App</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Once your application is approved, use the FillCarts Rider App to complete verification and view delivery opportunities.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                      <QrCode size={110} className="text-slate-900 mx-auto" />
                    </div>

                    <div className="space-y-2 text-left">
                      <div className="text-xs font-bold text-slate-700">Scan to Download App</div>
                      <div className="flex gap-2">
                        <a
                          href="https://play.google.com"
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Smartphone size={14} /> Google Play
                        </a>
                        <a
                          href="https://apps.apple.com"
                          target="_blank"
                          rel="noreferrer"
                          className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Smartphone size={14} /> App Store
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* APPLICATION FORM VIEW */
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="text-center sm:text-left border-b border-slate-100 pb-4 space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-black">
                    <Zap size={13} className="fill-amber-500 text-amber-500" />
                    <span>🔥 Fast Rider Onboarding · Flexible Shifts</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#17231A]">
                    Apply as a Delivery Partner
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Fill in your details and our fleet onboarding team will get you started quickly.
                  </p>
                </div>

                {/* Section 1: Your Details */}
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase tracking-widest text-[#16A34A] block">
                    Step 1 — Your Details
                  </span>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#17231A] mb-1">Full Name *</label>
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Vikram Singh"
                        className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#17231A] mb-1">Mobile Phone (10 Digits) *</label>
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#17231A] mb-1">Email Address *</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="partner@example.com"
                        className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Delivery Details */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <span className="text-xs font-black uppercase tracking-widest text-[#16A34A] block">
                    Step 2 — Delivery Details
                  </span>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#17231A] mb-1">City / Delivery Area *</label>
                      <input
                        required
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="e.g. Gurgaon / Delhi"
                        className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#17231A] mb-1">Vehicle Type *</label>
                      <select
                        name="vehicle"
                        value={form.vehicle}
                        onChange={handleChange}
                        className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors cursor-pointer"
                      >
                        <option>Two-Wheeler (Motorbike/Scooter)</option>
                        <option>EV Scooter</option>
                        <option>Bicycle</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Validation Error Message */}
                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Section 3: Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* 8. FAQ SECTION */}
        <section className="max-w-3xl mx-auto space-y-6 text-center sm:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#16A34A] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
              <Sparkles size={13} /> Rider Support
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs space-y-3 text-left">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border-b border-slate-100 last:border-b-0 pb-3 pt-1">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between font-extrabold text-xs sm:text-sm text-[#17231A] hover:text-[#16A34A] transition-colors py-1 cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-[#16A34A]" : "text-slate-400"}`} />
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2 pt-1 border-t border-slate-50">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
