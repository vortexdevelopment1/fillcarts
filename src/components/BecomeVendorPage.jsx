import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  Store, User, ChevronRight, TrendingUp,
  Users, LayoutDashboard, Wallet, CheckCircle2, Star, ClipboardList,
  PackageCheck, Bell, Banknote, Building2, Phone, Mail, Upload
} from "lucide-react";

const benefits = [
  { icon: Users, bg: "bg-blue-50", color: "text-blue-600", title: "More Customers", desc: "Reach thousands of local shoppers already using FillCarts." },
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

      {/* Shared Common Navbar */}
      <Navbar searchPlaceholder="Search vendor partner resources..." />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center gap-1.5">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={13} />
          <span className="text-slate-900 font-bold">Become a Vendor</span>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3.5 py-1.5 text-sm font-bold mb-5">
            <Store size={14} className="text-blue-600" /> Partner With FillCarts
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            Grow your store business <br /><span className="text-blue-600">with local deliveries.</span>
          </h1>
          <p className="text-slate-500 text-base mb-7 max-w-md font-medium">
            Join 1,200+ neighbourhood Kiranas, bakeries and pharmacies reaching thousands of local customers daily.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="#register" className="bg-slate-900 text-white font-bold rounded-full px-6 py-3 text-sm shadow-md">Register Your Store</a>
            <a href="#calculator" className="bg-white border border-slate-200 text-slate-800 font-bold rounded-full px-6 py-3 text-sm">Calculate Earnings</a>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xl w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Store size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Store Onboarding</h3>
                <p className="text-xs text-slate-500">Takes less than 3 minutes</p>
              </div>
            </div>
            <div className="space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={15} className="text-teal-600" /> Zero registration fees
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={15} className="text-teal-600" /> 24-Hour quick approval
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={15} className="text-teal-600" /> Transparent weekly payouts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="max-w-6xl mx-auto px-6 py-14">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="max-w-xl mx-auto text-center mb-8">
            <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-400 mb-2">Earnings Estimator</span>
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Estimate your store earnings</h2>
            <p className="text-sm text-slate-300">Based on average partner store performance on FillCarts.</p>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>Monthly Store Sales</span>
                <span className="text-blue-400">₹{monthlySales.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="300000"
                step="5000"
                value={monthlySales}
                onChange={(e) => setMonthlySales(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">Estimated Net Payout</div>
                <div className="text-2xl font-bold text-teal-400 mt-0.5" style={{ fontFamily: "'Fraunces', serif" }}>₹{estEarnings.toLocaleString()}/mo</div>
              </div>
              <div className="text-xs text-slate-400 text-right">
                <div>Commission: ~12%</div>
                <div>No hidden charges</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-2">Partner Perks</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Why partner with FillCarts?</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className={`w-11 h-11 rounded-full ${b.bg} ${b.color} flex items-center justify-center mb-3.5`}>
                <b.icon size={19} />
              </div>
              <div className="font-extrabold text-base mb-1">{b.title}</div>
              <div className="text-sm text-slate-500">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Form */}
      <section id="register" className="max-w-3xl mx-auto px-6 py-14">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Register Your Store</h2>
            <p className="text-sm text-slate-500">Fill in your details and our merchant team will contact you within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 text-center text-teal-800">
              <CheckCircle2 size={36} className="mx-auto mb-3 text-teal-600" />
              <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
              <p className="text-sm">Thank you for registering <strong>{form.store}</strong>. Our team will call you at <strong>{form.phone}</strong> shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Store Name</label>
                  <input required name="store" value={form.store} onChange={handleChange} placeholder="e.g. Sharma General Store" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Owner Name</label>
                  <input required name="owner" value={form.owner} onChange={handleChange} placeholder="e.g. Ramesh Sharma" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-600" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
                  <input required type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Store Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-600 bg-white">
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Store Address / Area</label>
                <textarea required rows={3} name="address" value={form.address} onChange={handleChange} placeholder="Shop number, street, area, pincode..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-600" />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full py-3 text-sm shadow-md shadow-blue-600/20 transition-all">Submit Registration</button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="mb-8 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-2">Vendor FAQ</span>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Frequently Asked Questions</h2>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          {faqs.map((f, i) => (
            <div key={i} className="border-b border-slate-200 py-4 last:border-b-0">
              <div className="font-bold text-base text-slate-900 mb-1">{f.q}</div>
              <div className="text-sm text-slate-500">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
