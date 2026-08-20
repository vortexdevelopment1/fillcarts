import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import VendorNavbar from "../components/VendorNavbar";
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
    q: "How do riders pick up orders?",
    a: "When a new order arrives, accept it on your Vendor Dashboard. FillCarts delivery partners automatically navigate to your store to pick up the packed order."
  },
  {
    q: "Can I manage prices and stock from mobile?",
    a: "Yes! The Vendor Portal works seamlessly on smartphones, tablets, and laptops so you can update stock or temporarily pause items anytime."
  }
];

export default function VendorHomePage() {
  const [form, setForm] = useState({
    storeName: "",
    ownerName: "",
    phone: "",
    email: "",
    category: "Grocery & Kirana Store",
    city: "",
    address: "",
    gst: ""
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
        name === "ownerName"
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

    if (
      !form.storeName.trim() ||
      !form.ownerName.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.city.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.ownerName.trim().length < 2) {
      setError("Owner Name must contain at least 2 letters.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Mobile Phone must be exactly 10 digits.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
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
      {/* Dedicated Vendor / Merchant Navbar */}
      <VendorNavbar />

      {/* 1. HERO SECTION */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 space-y-5 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3.5 py-1 rounded-full border border-emerald-200/80 mb-2">
              <Store size={14} className="text-[#16A34A]" /> Grow With FillCarts
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#17231A] leading-tight tracking-tight">
              Grow your store sales. <br /><span className="text-[#16A34A]">Sell locally online.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
              Register your local store, add your products, and reach thousands of neighborhood customers ordering daily through FillCarts.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-2 flex-wrap justify-center sm:justify-start">
              <a
                href="#register"
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-7 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Register Store Online</span>
                <ArrowRight size={16} />
              </a>
              <Link
                to="/vendor/about"
                className="bg-[#FFFCF5] hover:bg-[#ECFDF3] text-[#166534] border border-emerald-200 font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
              >
                About Merchant Network
              </Link>
            </div>
          </div>

          {/* Right Visual: Vendor Dashboard Preview */}
          <div className="md:col-span-5 relative">
            <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 shadow-lg space-y-4 text-left relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold">
                    <Store size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-[#17231A]">My Kirana Store</h3>
                    <span className="text-[10px] text-slate-400 font-semibold">Vendor Dashboard</span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-[#166534] border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" /> Live Orders
                </span>
              </div>

              {/* Vendor Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FFFCF5] p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">Today's Orders</div>
                  <div className="text-xl font-black text-[#166534]">24</div>
                </div>

                <div className="bg-[#FFFCF5] p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">Today's Sales</div>
                  <div className="text-xl font-black text-[#F59E0B]">₹4,850</div>
                </div>

                <div className="bg-[#FFFCF5] p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">Active Products</div>
                  <div className="text-xl font-black text-[#17231A]">120</div>
                </div>

                <div className="bg-[#FFFCF5] p-3 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">Store Rating</div>
                  <div className="text-xl font-black text-[#F59E0B] flex items-center gap-1">
                    <Star size={16} fill="currentColor" /> 4.8
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN BODY CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16 flex-1 w-full">
        {/* 2. WHY PARTNER WITH FILLCARTS */}
        <section className="space-y-6 text-center sm:text-left" id="benefits">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-2">
              <Sparkles size={13} /> Store Growth Advantages
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
              Why partner with FillCarts?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="group bg-white border border-emerald-100 hover:border-[#16A34A] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold">
                    <b.icon size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black tracking-wider uppercase text-[#166534] bg-[#ECFDF3] px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {b.badge}
                    </span>
                    <h3 className="font-extrabold text-base text-[#17231A] mt-2">{b.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{b.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. MERCHANT TOOLS */}
        <section className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 text-left" id="tools">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
              <LayoutDashboard size={13} /> EASY STORE CONTROL
            </span>
            <h2 className="text-2xl font-extrabold text-[#17231A]">
              Simple tools built for local store owners
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {merchantTools.map((t, i) => (
              <div key={i} className="bg-[#FFFCF5] p-5 rounded-2xl border border-slate-100 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold">
                  <t.icon size={20} />
                </div>
                <h4 className="font-extrabold text-sm text-[#17231A]">{t.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. APPLICATION FORM */}
        <section id="register" className="max-w-3xl mx-auto">
          <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-10 shadow-lg">
            {submitted ? (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-[#16A34A] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#17231A]">Store Registration Received! 🎉</h3>
                  <p className="text-xs text-slate-600 font-semibold max-w-md mx-auto mt-1">
                    Welcome <strong>{form.storeName}</strong>! Our merchant onboarding manager will contact you at <strong>{form.phone}</strong> in 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-extrabold text-[#16A34A] hover:underline"
                >
                  ← Submit another store registration
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="border-b border-slate-100 pb-4 space-y-2">
                  <h2 className="text-2xl font-extrabold text-[#17231A]">
                    Register Your Store as Vendor Partner
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Fill in your details and start receiving local neighborhood orders.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-[#17231A] mb-1">Store Name *</label>
                    <input
                      required
                      name="storeName"
                      value={form.storeName}
                      onChange={handleChange}
                      placeholder="e.g. Gupta Kirana Store"
                      className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#17231A] mb-1">Owner Full Name *</label>
                    <input
                      required
                      name="ownerName"
                      value={form.ownerName}
                      onChange={handleChange}
                      placeholder="e.g. Rajesh Gupta"
                      className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
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
                      placeholder="store@example.com"
                      className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-[#17231A] mb-1">City / Area *</label>
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
                    <label className="block text-xs font-extrabold text-[#17231A] mb-1">Store Category *</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full bg-[#FFFCF5] border border-slate-200 focus:border-[#16A34A] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none transition-colors cursor-pointer"
                    >
                      <option>Grocery & Kirana Store</option>
                      <option>Fruits & Vegetables</option>
                      <option>Dairy & Bakery</option>
                      <option>Pharmacy & Wellness</option>
                      <option>Home & Cleaning Essentials</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Registering Store...
                    </>
                  ) : (
                    <>
                      <span>Submit Store Registration</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 5. FAQ SECTION */}
        <section className="max-w-3xl mx-auto space-y-6 text-center sm:text-left" id="faqs">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#16A34A] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
              <Sparkles size={13} /> Merchant Support
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
                    className="w-full flex items-center justify-between font-extrabold text-xs sm:text-sm text-[#17231A] hover:text-[#16A34A] transition-colors py-1 cursor-pointer text-left"
                  >
                    <span>{f.q}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-[#16A34A]" : "text-slate-400"}`} />
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
