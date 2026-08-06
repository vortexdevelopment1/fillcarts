import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import {
  Bike, User, ChevronRight, Clock, Banknote,
  Navigation, Gift, CheckCircle2, Star, ClipboardList, IdCard, ShieldCheck,
  Phone, Mail, Upload, Calendar
} from "lucide-react";

const benefits = [
  { icon: Clock, bg: "bg-teal-50", color: "text-teal-600", title: "Flexible Hours", desc: "Go online whenever you want — no fixed shifts." },
  { icon: Banknote, bg: "bg-amber-50", color: "text-amber-700", title: "Daily Earnings", desc: "Get paid weekly, with clear breakdown per delivery." },
  { icon: Navigation, bg: "bg-blue-50", color: "text-blue-600", title: "In-App Navigation", desc: "Turn-by-turn directions to pickup and drop points." },
  { icon: Gift, bg: "bg-violet-50", color: "text-violet-600", title: "Bonuses", desc: "Extra incentives during peak hours and busy days." },
  { icon: ShieldCheck, bg: "bg-teal-50", color: "text-teal-600", title: "Rider Support", desc: "Dedicated helpdesk for any delivery issues." },
  { icon: Star, bg: "bg-amber-50", color: "text-amber-700", title: "Recognition", desc: "Top-rated riders get priority order access." },
];

const steps = [
  { icon: ClipboardList, title: "Register", desc: "Share your basic details and vehicle information." },
  { icon: IdCard, title: "Verify documents", desc: "Upload ID, license and vehicle papers for a quick check." },
  { icon: Bike, title: "Go online", desc: "Open the rider app and start accepting nearby orders." },
  { icon: Banknote, title: "Get paid weekly", desc: "Earnings are settled directly to your bank account." },
];

const requirements = [
  "Minimum age 18 years",
  "Valid driving license",
  "Own two-wheeler / bicycle",
  "Smartphone with internet",
  "Valid ID proof (Aadhaar/PAN)",
  "Bank account for payouts",
];

const testimonials = [
  { n: "Aman R.", t: "Apne time pe kaam kar sakta hoon, earning acchi hai." },
  { n: "Deepak V.", t: "Navigation clear hai, pickup-drop easy ho jata hai." },
  { n: "Suresh P.", t: "Weekly payout time pe aata hai, bonuses bhi milte hain." },
];

const faqs = [
  { q: "How much can I earn per delivery?", a: "Earnings depend on distance and demand, shown upfront before you accept an order." },
  { q: "Do I need my own vehicle?", a: "Yes, a two-wheeler or bicycle depending on your city's delivery zone." },
  { q: "When do I get paid?", a: "Payouts are settled weekly directly to your registered bank account." },
  { q: "Can I work part-time?", a: "Yes, you can go online and offline anytime — there are no fixed shifts." },
];

export default function BecomeRiderPage() {
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const perHourRate = 90;
  const daysPerWeek = 6;
  const estWeekly = Math.round(hoursPerDay * perHourRate * daysPerWeek);

  const [form, setForm] = useState({ name: "", phone: "", email: "", vehicle: "Two-Wheeler", city: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-50/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-extrabold flex-shrink-0" style={{ fontFamily: "'Fraunces', serif" }}>Fill<span className="text-blue-600">Carts</span></Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:border-teal-500 transition-colors"><User size={16} /></Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-3 text-sm text-slate-500 font-medium flex items-center gap-1.5">
          <Link to="/" className="hover:text-blue-600">Home</Link><ChevronRight size={13} /><span className="text-slate-900 font-bold">Become a Rider</span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 rounded-full px-3.5 py-1.5 text-sm font-bold mb-5">
            <Bike size={14} /> For Delivery Partners
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            Deliver on your<br /><span className="text-teal-600">own schedule.</span>
          </h1>
          <p className="text-slate-500 text-base mb-7 max-w-md font-medium">
            Join as a delivery partner, work whenever you want, and get paid weekly with clear earnings tracking.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="#register" className="bg-teal-600 text-white font-bold rounded-full px-6 py-3 text-sm">Join as Rider</a>
            <a href="#calculator" className="bg-white border border-slate-200 font-bold rounded-full px-6 py-3 text-sm">Estimate Earnings</a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { n: "3,500+", l: "Active Riders" },
            { n: "₹450+", l: "Avg Daily Earning" },
            { n: "Weekly", l: "Payout Cycle" },
            { n: "4.7★", l: "Avg Rider Rating" },
          ].map((s) => (
            <div key={s.l} className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
              <div className="text-2xl font-bold text-teal-600" style={{ fontFamily: "'Fraunces', serif" }}>{s.n}</div>
              <div className="text-sm text-slate-500 font-semibold mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-teal-600 mb-2">Why ride with us</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Built around your schedule.</h2>
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
          <span className="block text-xs font-extrabold tracking-widest uppercase text-teal-600 mb-2">Getting started</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Four steps to your first delivery.</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 relative">
              <div className="absolute top-4 right-5 text-3xl font-bold text-slate-100" style={{ fontFamily: "'Fraunces', serif" }}>{i + 1}</div>
              <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-4"><s.icon size={19} /></div>
              <div className="font-extrabold text-base mb-1">{s.title}</div>
              <div className="text-sm text-slate-500">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Earnings calculator */}
      <section id="calculator" className="max-w-6xl mx-auto px-6 py-14">
        <div className="bg-slate-900 text-white rounded-3xl p-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-teal-400 mb-2">Earnings Estimator</div>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Fraunces', serif" }}>See what you could earn weekly.</h2>
            <p className="text-sm text-slate-300 mb-6">Move the slider to match how many hours a day you plan to ride.</p>
            <input
              type="range" min="2" max="12" step="1"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
            <div className="text-sm text-slate-300 mt-2 font-semibold">{hoursPerDay} hours/day · {daysPerWeek} days/week</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-7 backdrop-blur">
            <div className="text-sm text-slate-300 font-semibold mb-1">Estimated weekly earnings</div>
            <div className="text-4xl font-bold text-teal-300 mb-4" style={{ fontFamily: "'Fraunces', serif" }}>₹{estWeekly.toLocaleString()}</div>
            <div className="flex justify-between text-sm text-slate-300 border-t border-white/10 pt-3">
              <span>Per Hour Rate</span><span className="font-bold text-white">₹{perHourRate}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-300 mt-1.5">
              <span>Hours/Week</span><span className="font-bold text-white">{hoursPerDay * daysPerWeek} hrs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-teal-600 mb-2">Eligibility</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>What you'll need.</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {requirements.map((r) => (
            <div key={r} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-teal-600 flex-shrink-0" />
              <span className="text-sm font-semibold">{r}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-teal-600 mb-2">Rider Stories</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Riders love the flexibility.</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex gap-0.5 text-teal-500 mb-3">{[...Array(5)].map((_, s) => <Star key={s} size={13} fill="currentColor" />)}</div>
              <p className="text-sm text-slate-500 mb-4">"{t.t}"</p>
              <div className="font-extrabold text-sm">{t.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Registration form */}
      <section id="register" className="max-w-3xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-teal-600 mb-2">Register</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Join as a rider.</h2>
        </div>
        {submitted ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <CheckCircle2 size={40} className="text-teal-600 mx-auto mb-4" />
            <h3 className="font-extrabold text-lg mb-1.5">Registration submitted!</h3>
            <p className="text-sm text-slate-500">Our team will verify your documents and reach out within 24-48 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><User size={14} /> Full Name</label>
                <input name="name" required value={form.name} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400" placeholder="Your full name" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><Phone size={14} /> Phone Number</label>
                <input name="phone" required value={form.phone} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400" placeholder="10-digit mobile number" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><Mail size={14} /> Email</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><Calendar size={14} /> City</label>
                <input name="city" required value={form.city} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400" placeholder="Your city / area" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold mb-1.5 block">Vehicle Type</label>
              <select name="vehicle" value={form.vehicle} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400">
                {["Two-Wheeler", "Bicycle", "Electric Scooter"].map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-sm text-slate-400">
              <Upload size={20} className="mx-auto mb-2" />
              Upload ID proof, driving license & vehicle documents
            </div>
            <button type="submit" className="w-full bg-teal-600 text-white font-bold rounded-full py-3 text-sm">Submit Registration</button>
          </form>
        )}
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-teal-600 mb-2">FAQ</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Common questions.</h2>
        </div>
        {faqs.map((f, i) => {
          const open = openFaq === i;
          return (
            <div key={i} onClick={() => setOpenFaq(open ? null : i)} className="border-b border-slate-200 py-5 cursor-pointer">
              <div className="flex justify-between items-center font-bold text-sm">{f.q}<ChevronRight size={16} className={`text-teal-600 transition-transform ${open ? "rotate-90" : ""}`} /></div>
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
