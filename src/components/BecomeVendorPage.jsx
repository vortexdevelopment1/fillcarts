import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  Store, User, ChevronRight, TrendingUp,
  Users, LayoutDashboard, Wallet, CheckCircle2, Star, ClipboardList,
  PackageCheck, Bell, Banknote, Building2, Phone, Mail, Upload, QrCode, Smartphone,
  FileText, ShieldCheck, ArrowRight, ChevronDown, RefreshCw, AlertCircle, Clock, Lock, Sparkles, Zap
} from "lucide-react";

// 4 Core Discovery Benefits
const benefits = [
  {
    icon: Users,
    title: "Reach More Customers",
    desc: "Get discovered by nearby FillCarts shoppers in your neighborhood.",
    badge: "🔥 HIGH DEMAND"
  },
  {
    icon: LayoutDashboard,
    title: "Easy Store Management",
    desc: "Manage products, inventory and orders from one simple dashboard.",
    badge: "⭐ 1-TAP CONTROL"
  },
  {
    icon: Wallet,
    title: "Transparent Payouts",
    desc: "Know your commission and weekly payout schedule clearly.",
    badge: "💰 WEEKLY SETTLEMENT"
  },
  {
    icon: Bell,
    title: "Real-Time Order Alerts",
    desc: "Get instant notifications when new orders arrive at your store.",
    badge: "⚡ INSTANT SOUND"
  }
];

// 4 Merchant Tools
const merchantTools = [
  {
    icon: PackageCheck,
    title: "Products & Inventory",
    desc: "Add products, update prices, and manage stock in real-time."
  },
  {
    icon: ClipboardList,
    title: "Order Management",
    desc: "View, accept, and track incoming customer orders effortlessly."
  },
  {
    icon: Wallet,
    title: "Earnings & Reports",
    desc: "Monitor daily sales, commission breakdowns, and bank settlements."
  },
  {
    icon: Bell,
    title: "Instant Store Alerts",
    desc: "Receive immediate sound and push notifications for new orders."
  }
];

// 4-Step Onboarding Process
const onboardingSteps = [
  {
    step: "01",
    title: "Register",
    desc: "Submit your store and owner details online in under 3 minutes."
  },
  {
    step: "02",
    title: "Get Verified",
    desc: "Our merchant onboarding team reviews your store information."
  },
  {
    step: "03",
    title: "Add Products",
    desc: "List products, set your prices, and update your available inventory."
  },
  {
    step: "04",
    title: "Start Selling",
    desc: "Accept local orders, hand over to riders, and receive payouts."
  }
];

// FAQ Data
const faqs = [
  {
    q: "What documents do I need to register?",
    a: "Requirements may vary by store category. Generally, keep your Store Registration/GST (if applicable), Owner ID proof, and Bank Account details ready for payouts."
  },
  {
    q: "How does commission work?",
    a: "Commission varies by product category and is shown transparently in your vendor dashboard before you list products. There are no hidden fees."
  },
  {
    q: "When do I receive my payouts?",
    a: "Payouts are settled directly to your registered bank account on a regular weekly schedule, visible inside your earnings dashboard."
  },
  {
    q: "Can I pause my store temporarily when away?",
    a: "Yes! You can toggle your store status to 'Offline' anytime from the merchant dashboard or mobile app whenever you need a break."
  },
  {
    q: "How long does store verification take?",
    a: "Once registered, our merchant team usually reviews and verifies store details within 24 to 48 business hours."
  }
];

export default function BecomeVendorPage() {
  // Calculator State
  const [monthlySales, setMonthlySales] = useState(50000);
  const commissionRate = 0.12;
  const estEarnings = Math.round(monthlySales * (1 - commissionRate));

  // Form State
  const [form, setForm] = useState({
    store: "",
    owner: "",
    phone: "",
    email: "",
    category: "Grocery & Kirana",
    address: ""
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
        name === "owner"
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

    if (!form.store.trim() || !form.owner.trim() || !form.phone.trim() || !form.email.trim() || !form.address.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.store.trim().length < 2) {
      setError("Store Name must contain at least 2 characters.");
      return;
    }

    if (form.owner.trim().length < 2) {
      setError("Owner Name must contain at least 2 letters.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Mobile Phone must be exactly 10 digits (digits only).");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address (e.g. store@gmail.com).");
      return;
    }

    if (form.address.trim().length < 5) {
      setError("Please enter a complete store address.");
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
      <Navbar searchPlaceholder="Search vendor partner resources..." />

      {/* Breadcrumb & Journey Progress Indicator */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="hover:text-[#16A34A] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#166534] font-bold">Become a Vendor</span>
          </div>

          {/* Progress Indicator */}
          <div className="hidden md:flex items-center gap-2 bg-[#ECFDF3] border border-emerald-200 px-3.5 py-1 rounded-full text-[11px] font-bold text-[#166534]">
            <span className="text-[#16A34A]">Discover</span>
            <span>→</span>
            <span>Register</span>
            <span>→</span>
            <span>Get Verified</span>
            <span>→</span>
            <span>Start Selling</span>
          </div>
        </div>
      </div>

      {/* 1. HERO SECTION — DISCOVERY */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 space-y-5 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-2">
              <Sparkles size={13} /> 🔥 Partner With FillCarts
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#17231A] leading-tight tracking-tight">
              Grow your local store with <span className="text-[#16A34A]">FillCarts.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
              Reach nearby customers, manage orders easily and grow your business with simple digital tools.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-2 flex-wrap justify-center sm:justify-start">
              <a
                href="#register"
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-7 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Register Your Store</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="#how-it-works"
                className="bg-[#FFFCF5] hover:bg-[#ECFDF3] text-[#166534] border border-emerald-200 font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
              >
                See How It Works
              </a>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
                <Zap size={13} className="fill-amber-500 text-amber-500" /> ZERO REGISTRATION FEE
              </span>
            </div>
          </div>

          {/* Right Visual: Vendor Dashboard Preview Illustration */}
          <div className="md:col-span-5 relative">
            <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 shadow-lg space-y-4 text-left relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold">
                    <Store size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-[#17231A]">Today's Store Activity</h3>
                    <span className="text-[10px] text-slate-400 font-semibold">Live Merchant Overview</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                  ⭐ 4.9★ Partner
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FFFCF5] p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">Today's Orders</div>
                  <div className="text-xl font-black text-[#166534]">24</div>
                </div>

                <div className="bg-[#FFFCF5] p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">Total Sales</div>
                  <div className="text-xl font-black text-[#F59E0B]">₹8,450</div>
                </div>

                <div className="bg-[#FFFCF5] p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">Listed Products</div>
                  <div className="text-xl font-black text-[#17231A]">128</div>
                </div>

                <div className="bg-[#FFFCF5] p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">Pending Pickup</div>
                  <div className="text-xl font-black text-[#F59E0B]">3 Pending</div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold text-center italic">
                Vendor Dashboard Preview · Illustrative Representation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN BODY CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16 flex-1 w-full">
        {/* 2. DISCOVERY — WHY JOIN FILLCARTS */}
        <section className="space-y-6 text-center sm:text-left">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-2">
                <Sparkles size={13} /> Partner Advantages
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
                Everything you need to grow your store.
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
              🔥 100% Transparent Terms
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

        {/* 3. MERCHANT TOOLS SECTION */}
        <section className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
                <Sparkles size={13} /> Store Control Suite
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
                Your store, managed in one place.
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
              ⭐ Web Dashboard + Merchant App
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchantTools.map((tool, idx) => (
              <div
                key={idx}
                className="bg-[#FFFCF5] border border-slate-200 hover:border-[#16A34A] hover:bg-white rounded-2xl p-5 transition-all text-left space-y-3 group hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold">
                  <tool.icon size={20} />
                </div>
                <h4 className="font-extrabold text-sm text-[#17231A] group-hover:text-[#166534]">{tool.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. COMMISSION & PAYOUT SECTION + EARNINGS CALCULATOR */}
        <section id="calculator" className="space-y-8">
          <div className="grid md:grid-cols-12 gap-8 items-stretch">
            {/* Left Explanation Column */}
            <div className="md:col-span-5 bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-5 text-left flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#16A34A] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
                    <Sparkles size={13} /> Fair Settlement Terms
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#17231A]">Simple, transparent earnings.</h3>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-[#166534]">Commission</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Commission varies by product category and is shown clearly in your merchant dashboard before you list products.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-[#166534]">Payouts</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Track your earnings and scheduled bank settlements transparently directly from the vendor dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#ECFDF3] p-3 rounded-2xl border border-emerald-200 text-xs font-bold text-[#166534] flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#16A34A] flex-shrink-0" />
                <span>Zero hidden charges or registration fees</span>
              </div>
            </div>

            {/* Right Earnings Calculator */}
            <div className="md:col-span-7 bg-[#ECFDF3] border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 text-left space-y-6 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-white px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
                    <Sparkles size={13} /> Payout Estimator
                  </span>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> ⭐ POPULAR TOOL
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#17231A] mt-1">
                  Estimate your potential payout
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Illustrative estimate based on average partner store performance.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-extrabold text-[#17231A] mb-2">
                    <span>Monthly Sales Volume</span>
                    <span className="text-[#F59E0B] font-black text-base bg-white px-3 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                      ₹{monthlySales.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20000"
                    max="300000"
                    step="5000"
                    value={monthlySales}
                    onChange={(e) => setMonthlySales(Number(e.target.value))}
                    className="w-full accent-[#F59E0B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-1">
                    <span>₹20,000</span>
                    <span>₹3,000,000</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] text-slate-400 font-black uppercase">Estimated Net Payout</div>
                    <div className="text-3xl font-black text-[#F59E0B] mt-0.5">₹{estEarnings.toLocaleString()}/mo</div>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold space-y-0.5">
                    <div className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-md font-extrabold inline-block">
                      Commission: ~12%
                    </div>
                    <div className="text-[#16A34A] font-bold pt-1">Weekly Bank Settlement</div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-semibold italic">
                * Actual commission may vary by category and list price.
              </div>
            </div>
          </div>
        </section>

        {/* 5. HOW VENDOR ONBOARDING WORKS */}
        <section id="how-it-works" className="space-y-8 text-center sm:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-2">
              <Sparkles size={13} /> Onboarding Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
              How Vendor Onboarding Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Register → Verify → List → Sell
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

        {/* 6. DOCUMENT CHECKLIST */}
        <section className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-4 text-left shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#16A34A] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
                <Sparkles size={13} /> Pre-Registration Checklist
              </span>
              <h3 className="text-xl font-extrabold text-[#17231A]">Keep these ready before you start</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              Documents may vary by store category
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
            {[
              { title: "Owner ID Proof", sub: "Aadhaar / PAN" },
              { title: "Store Details", sub: "Address & Shop photo" },
              { title: "GST Details", sub: "If applicable" },
              { title: "Bank Account", sub: "Cancelled Cheque / Passbook" },
              { title: "Relevant Licenses", sub: "FSSAI for Food/Bakery" }
            ].map((doc, i) => (
              <div key={i} className="bg-[#FFFCF5] p-3 rounded-xl border border-slate-100 text-center space-y-1">
                <FileText size={18} className="text-[#16A34A] mx-auto" />
                <div className="font-extrabold text-xs text-[#17231A]">{doc.title}</div>
                <div className="text-[10px] text-slate-400 font-semibold">{doc.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. REGISTRATION FORM OR SUCCESS SCREEN */}
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
                    <h3 className="text-2xl font-extrabold text-[#17231A]">You're registered! 🎉</h3>
                    <p className="text-xs text-slate-600 font-semibold max-w-md mx-auto mt-1">
                      Your store registration for <strong>{form.store}</strong> ({form.owner}) has been submitted successfully.
                    </p>
                  </div>
                </div>

                {/* VERIFICATION STATUS CARD */}
                <div className="bg-white border border-emerald-100 rounded-2xl p-6 space-y-4 text-left shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-[#F59E0B]" />
                      <h4 className="font-extrabold text-sm text-[#17231A]">Verification Status</h4>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-300">
                      🟡 Under Review
                    </span>
                  </div>

                  {/* Verification Timeline */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold pt-1">
                    <div className="bg-emerald-50 text-[#166534] p-3 rounded-xl border border-emerald-200">
                      <div>✓ Submitted</div>
                      <div className="text-[10px] font-normal text-slate-500 mt-0.5">Registration Done</div>
                    </div>
                    <div className="bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-200">
                      <div>● Verification</div>
                      <div className="text-[10px] font-normal text-slate-500 mt-0.5">Team Reviewing</div>
                    </div>
                    <div className="bg-slate-50 text-slate-400 p-3 rounded-xl border border-slate-200">
                      <div>○ Store Activation</div>
                      <div className="text-[10px] font-normal text-slate-400 mt-0.5">Pending Approval</div>
                    </div>
                  </div>
                </div>

                {/* VENDOR DASHBOARD CTA */}
                <div className="bg-[#FFFCF5] border border-emerald-100 rounded-2xl p-6 text-left space-y-3">
                  <h4 className="font-extrabold text-sm text-[#17231A]">Manage your store</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Once your account is activated, manage products, orders, inventory and earnings from your Vendor Dashboard.
                  </p>
                  <button
                    disabled
                    className="bg-slate-200 text-slate-500 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-not-allowed"
                  >
                    <Lock size={14} /> Open Vendor Dashboard (Available after verification)
                  </button>
                </div>

                {/* MERCHANT APP DOWNLOAD */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4">
                  <div>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300 inline-block mb-1">
                      ⭐ MERCHANT APP 4.9★
                    </span>
                    <h4 className="font-extrabold text-sm text-[#17231A]">Manage your store on the go</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Use the FillCarts Merchant App to manage orders and stock alerts.
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
              /* REGISTRATION FORM VIEW WITH WARM ORANGE ACCENTS */
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="text-center sm:text-left border-b border-slate-100 pb-4 space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-black">
                    <Zap size={13} className="fill-amber-500 text-amber-500" />
                    <span>🔥 Zero Registration Fee · Fast 24-Hour Approval</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#17231A]">Register Your Store</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Fill in your store details and our merchant team will contact you within 24 hours.
                  </p>
                </div>

                {/* Section 1: Store Details */}
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase tracking-widest text-[#16A34A] block">
                    Step 1 — Store Details
                  </span>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#17231A] mb-1">Store Name *</label>
                      <input
                        required
                        name="store"
                        value={form.store}
                        onChange={handleChange}
                        placeholder="e.g. Sharma General Store"
                        className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#17231A] mb-1">Store Category *</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors cursor-pointer"
                      >
                        <option>Grocery & Kirana</option>
                        <option>Pharmacy & Medical</option>
                        <option>Fruits & Vegetables</option>
                        <option>Bakery & Confectionery</option>
                        <option>Restaurant & Food</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#17231A] mb-1">Store Address / Area *</label>
                    <textarea
                      required
                      rows={2}
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Shop number, street, area, pincode..."
                      className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Section 2: Owner Details */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <span className="text-xs font-black uppercase tracking-widest text-[#16A34A] block">
                    Step 2 — Owner Details
                  </span>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#17231A] mb-1">Owner Name *</label>
                      <input
                        required
                        name="owner"
                        value={form.owner}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Sharma"
                        className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#17231A] mb-1">Mobile Phone (10 Digits) *</label>
                      <input
                        required
                        type="text"
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
                        placeholder="store@example.com"
                        className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors"
                      />
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
                        <span>Submit Registration</span>
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
              <Sparkles size={13} /> Vendor Support
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
