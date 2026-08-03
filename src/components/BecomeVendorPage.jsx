import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import {
  Store, MapPin, Search, User, ShoppingCart, ChevronRight, TrendingUp,
  Users, LayoutDashboard, Wallet, CheckCircle2, Star, ClipboardList,
  PackageCheck, Bell, Banknote, Building2, Phone, Mail, Upload
} from "lucide-react";

const benefits = [
  { icon: Users, bg: "bg-blue-50", color: "text-blue-600", title: "More Customers", desc: "Reach thousands of local shoppers already using AppKart." },
  { icon: TrendingUp, bg: "bg-teal-50", color: "text-teal-600", title: "Grow Your Sales", desc: "Vendors typically see steady order growth within weeks." },
  { icon: LayoutDashboard, bg: "bg-violet-50", color: "text-violet-600", title: "Easy Dashboard", desc: "Manage inventory, orders and earnings from one screen." },
  { icon: Wallet, bg: "bg-amber-50", color: "text-amber-700", title: "Fast Payouts", desc: "Transparent commission and weekly settlements." },
  { icon: Bell, bg: "bg-blue-50", color: "text-blue-600", title: "Instant Notifications", desc: "Never miss an order with real-time alerts." },
  { icon: Star, bg: "bg-teal-50", color: "text-teal-600", title: "Build Reputation", desc: "Customer ratings help you stand out locally." },
];

const steps = [
  { icon: ClipboardList, title: "Register your store", desc: "Fill in your store details and submit basic documents." },
  { icon: CheckCircle2, title: "Get verified", desc: "Our team verifies your details, usually within 24-48 hours." },
  { icon: PackageCheck, title: "List your products", desc: "Add your inventory with prices from the vendor dashboard." },
  { icon: Banknote, title: "Start earning", desc: "Accept orders, pack them, and get paid on schedule." },
];

const testimonials = [
  { n: "Sharma Kirana Store", t: "Naye customers milne lage hain, orders badh gaye." },
  { n: "Fresh Mart", t: "Dashboard se stock manage karna bahut easy hai." },
  { n: "City Pharmacy", t: "Commission fair hai aur payout time pe milta hai." },
];

const faqs = [
  { q: "What documents do I need?", a: "Shop registration/GST (if applicable), owner ID proof, and a bank account for payouts." },
  { q: "What is the commission?", a: "Commission varies by category, shown clearly in your dashboard before you list products." },
  { q: "How soon do I start getting orders?", a: "Once verified and products are listed, orders can start the same day." },
  { q: "Can I pause my store temporarily?", a: "Yes, you can toggle store availability anytime from the dashboard." },
];

export default function BecomeVendorPage() {
  const [monthlySales, setMonthlySales] = useState(50000);
  const commissionRate = 0.12;
  const estEarnings = Math.round(monthlySales * (1 - commissionRate));

  const [form, setForm] = useState({ store: "", owner: "", phone: "", email: "", category: "Grocery", address: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-50/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <div className="text-xl font-extrabold flex-shrink-0" style={{ fontFamily: "'Fraunces', serif" }}>App<span className="text-blue-600">Kart</span></div>
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
          <Link to="/" className="hover:text-blue-600">Home</Link><ChevronRight size={13} /><span className="text-slate-900 font-bold">Become a Vendor</span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 rounded-full px-3.5 py-1.5 text-sm font-bold mb-5">
            <Store size={14} /> For Local Businesses
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            Grow your business<br /><span className="text-violet-600">online, today.</span>
          </h1>
          <p className="text-slate-500 text-base mb-7 max-w-md font-medium">
            Bring your shop onto AppKart and reach local customers who are ready to order — no tech skills needed.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="#register" className="bg-violet-600 text-white font-bold rounded-full px-6 py-3 text-sm">Register Your Store</a>
            <a href="#calculator" className="bg-white border border-slate-200 font-bold rounded-full px-6 py-3 text-sm">See Earnings Estimate</a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { n: "1,200+", l: "Active Vendors" },
            { n: "150K+", l: "Orders Delivered" },
            { n: "24-48h", l: "Verification Time" },
            { n: "4.6★", l: "Avg Vendor Rating" },
          ].map((s) => (
            <div key={s.l} className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
              <div className="text-2xl font-bold text-violet-600" style={{ fontFamily: "'Fraunces', serif" }}>{s.n}</div>
              <div className="text-sm text-slate-500 font-semibold mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-violet-600 mb-2">Why sell with us</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Everything you need to sell online.</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className={`w-11 h-11 rounded-full ${b.bg} ${b.color} flex items-center justify-center mb-3.5`}><b.icon size={19} /></div>
              <div className="font-extrabold text-base mb-1">{b.title}</div>
              <div className="text-sm text-slate-500">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-violet-600 mb-2">Getting started</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Four steps to your first order.</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 relative">
              <div className="absolute top-4 right-5 text-3xl font-bold text-slate-100" style={{ fontFamily: "'Fraunces', serif" }}>{i + 1}</div>
              <div className="w-11 h-11 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mb-4"><s.icon size={19} /></div>
              <div className="font-extrabold text-base mb-1">{s.title}</div>
              <div className="text-sm text-slate-500">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Commission calculator */}
      <section id="calculator" className="max-w-6xl mx-auto px-6 py-14">
        <div className="bg-slate-900 text-white rounded-3xl p-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-violet-400 mb-2">Earnings Estimator</div>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Fraunces', serif" }}>See what you could take home.</h2>
            <p className="text-sm text-slate-300 mb-6">Move the slider to match your expected monthly sales.</p>
            <input
              type="range" min="10000" max="300000" step="5000"
              value={monthlySales}
              onChange={(e) => setMonthlySales(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
            <div className="text-sm text-slate-300 mt-2 font-semibold">Monthly Sales: ₹{monthlySales.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-7 backdrop-blur">
            <div className="text-sm text-slate-300 font-semibold mb-1">Estimated monthly earnings (after 12% commission)</div>
            <div className="text-4xl font-bold text-violet-300 mb-4" style={{ fontFamily: "'Fraunces', serif" }}>₹{estEarnings.toLocaleString()}</div>
            <div className="flex justify-between text-sm text-slate-300 border-t border-white/10 pt-3">
              <span>Gross Sales</span><span className="font-bold text-white">₹{monthlySales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-300 mt-1.5">
              <span>Platform Commission (12%)</span><span className="font-bold text-white">₹{Math.round(monthlySales * commissionRate).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-violet-600 mb-2">Vendor Stories</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Trusted by local shops.</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex gap-0.5 text-violet-500 mb-3">{[...Array(5)].map((_, s) => <Star key={s} size={13} fill="currentColor" />)}</div>
              <p className="text-sm text-slate-500 mb-4">"{t.t}"</p>
              <div className="font-extrabold text-sm">{t.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Registration form */}
      <section id="register" className="max-w-3xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-violet-600 mb-2">Register</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Register your store.</h2>
        </div>
        {submitted ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <CheckCircle2 size={40} className="text-violet-600 mx-auto mb-4" />
            <h3 className="font-extrabold text-lg mb-1.5">Registration submitted!</h3>
            <p className="text-sm text-slate-500">Our team will verify your details and reach out within 24-48 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><Building2 size={14} /> Store Name</label>
                <input name="store" required value={form.store} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400" placeholder="e.g. Sharma Kirana Store" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><User size={14} /> Owner Name</label>
                <input name="owner" required value={form.owner} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400" placeholder="Your full name" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><Phone size={14} /> Phone Number</label>
                <input name="phone" required value={form.phone} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400" placeholder="10-digit mobile number" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><Mail size={14} /> Email</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold mb-1.5 block">Store Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400">
                {["Grocery", "Fruits & Vegetables", "Pharmacy", "Bakery", "Food & Restaurant", "Electronics"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold mb-1.5 block">Store Address</label>
              <textarea name="address" required value={form.address} onChange={handleChange} rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400" placeholder="Shop no, street, area, landmark" />
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-sm text-slate-400">
              <Upload size={20} className="mx-auto mb-2" />
              Upload shop registration / ID proof (drag & drop or click)
            </div>
            <button type="submit" className="w-full bg-violet-600 text-white font-bold rounded-full py-3 text-sm">Submit Registration</button>
          </form>
        )}
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-violet-600 mb-2">FAQ</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Common questions.</h2>
        </div>
        {faqs.map((f, i) => {
          const open = openFaq === i;
          return (
            <div key={i} onClick={() => setOpenFaq(open ? null : i)} className="border-b border-slate-200 py-5 cursor-pointer">
              <div className="flex justify-between items-center font-bold text-sm">{f.q}<ChevronRight size={16} className={`text-violet-600 transition-transform ${open ? "rotate-90" : ""}`} /></div>
              {open && <div className="text-sm text-slate-500 mt-2.5">{f.a}</div>}
            </div>
          );
        })}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
