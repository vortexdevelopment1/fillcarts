import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  Bike, User, ChevronRight, ShieldCheck, Wallet, Clock, Navigation,
  CheckCircle2, Star, Smartphone, HeartPulse, FileText, BadgePercent
} from "lucide-react";

const benefits = [
  { icon: Wallet, bg: "bg-blue-50", color: "text-blue-600", title: "Flexible Weekly Earnings", desc: "Get paid every week with bonus incentives for peak hours." },
  { icon: Clock, bg: "bg-teal-50", color: "text-teal-600", title: "Choose Your Shifts", desc: "Work full-time or part-time — whenever it suits your routine." },
  { icon: ShieldCheck, bg: "bg-violet-50", color: "text-violet-600", title: "Medical Insurance", desc: "100% health & accident cover for every active rider partner." },
  { icon: Navigation, bg: "bg-amber-50", color: "text-amber-700", title: "Hyperlocal Routes", desc: "Deliver within short 1-3km radiuses near your area." },
  { icon: Smartphone, bg: "bg-blue-50", color: "text-blue-600", title: "Easy Rider App", desc: "Accept orders, track routes and view daily income in one tap." },
  { icon: BadgePercent, bg: "bg-teal-50", color: "text-teal-600", title: "Rider Bonuses", desc: "Earn extra payouts during weekend peaks and rainy days." },
];

const requirements = [
  { icon: Bike, title: "Vehicle & License", desc: "Valid driving license (for 2-wheeler) or bicycle." },
  { icon: Smartphone, title: "Smartphone", desc: "Android smartphone with active internet." },
  { icon: FileText, title: "Identity Proof", desc: "Aadhaar Card / PAN Card for quick verification." },
  { icon: HeartPulse, title: "Age Criteria", desc: "Must be 18 years or older." },
];

const testimonials = [
  { n: "Vikram R.", t: "Part-time job karke college fees nikal jaati hai." },
  { n: "Sunil K.", t: "Weekly payout bilkul time pe milta hai." },
  { n: "Amit M.", t: "Insurance cover hone se tension free delivery hoti hai." },
];

const faqs = [
  { q: "When do I get paid?", a: "Earnings are deposited directly to your bank account every Tuesday." },
  { q: "Can I deliver on a bicycle?", a: "Yes, bicycle delivery partners are welcome for short-distance orders." },
  { q: "What documents are required?", a: "Aadhaar card, PAN card, driving license (if driving motorized vehicle), and bank account details." },
  { q: "Is insurance provided?", a: "Yes, active rider partners get medical and accidental insurance cover." },
];

export default function BecomeRiderPage() {
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const perHourRate = 90;
  const daysPerWeek = 6;
  const estWeekly = Math.round(hoursPerDay * perHourRate * daysPerWeek);

  const [form, setForm] = useState({ name: "", phone: "", email: "", vehicle: "Two-Wheeler (Motorbike/Scooter)", city: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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
      setError("Mobile Phone must be exactly 10 digits (digits only, no letters).");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address (e.g. partner@gmail.com).");
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Shared Common Navbar */}
      <Navbar searchPlaceholder="Search rider partner resources..." />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center gap-1.5">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={13} />
          <span className="text-slate-900 font-bold">Become a Rider</span>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-full px-3.5 py-1.5 text-sm font-bold mb-5">
            <Bike size={14} className="text-teal-600" /> Deliver With FillCarts
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            Earn on your terms <br /><span className="text-teal-600">as a delivery partner.</span>
          </h1>
          <p className="text-slate-500 text-base mb-7 max-w-md font-medium">
            Join 3,500+ active riders delivering groceries, food and medicines with flexible hours and weekly payouts.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="#register" className="bg-slate-900 text-white font-bold rounded-full px-6 py-3 text-sm shadow-md">Apply Now</a>
            <a href="#calculator" className="bg-white border border-slate-200 text-slate-800 font-bold rounded-full px-6 py-3 text-sm">Calculate Income</a>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xl w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Bike size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Rider Signup</h3>
                <p className="text-xs text-slate-500">Quick onboarding process</p>
              </div>
            </div>
            <div className="space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={15} className="text-teal-600" /> Weekly direct bank payouts
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={15} className="text-teal-600" /> Free health & accident insurance
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={15} className="text-teal-600" /> Flexible shift hours
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="max-w-6xl mx-auto px-6 py-14">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="max-w-xl mx-auto text-center mb-8">
            <span className="block text-xs font-extrabold tracking-widest uppercase text-teal-400 mb-2">Income Calculator</span>
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Estimate your weekly earnings</h2>
            <p className="text-sm text-slate-300">Based on average rider partner hours and bonuses.</p>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>Work Hours Per Day</span>
                <span className="text-teal-400">{hoursPerDay} Hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="1"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>

            <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">Estimated Weekly Income</div>
                <div className="text-2xl font-bold text-teal-400 mt-0.5" style={{ fontFamily: "'Fraunces', serif" }}>₹{estWeekly.toLocaleString()}/wk</div>
              </div>
              <div className="text-xs text-slate-400 text-right">
                <div>~₹{estWeekly * 4}/month</div>
                <div>+ Peak bonuses</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-teal-600 mb-2">Rider Perks</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Why deliver with FillCarts?</h2>
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

      {/* Requirements */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-teal-600 mb-2">Requirements</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>What you need to get started</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {requirements.map((r, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-3.5 font-bold">
                <r.icon size={19} />
              </div>
              <div className="font-extrabold text-base mb-1">{r.title}</div>
              <div className="text-sm text-slate-500">{r.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section id="register" className="max-w-3xl mx-auto px-6 py-14">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Apply as Delivery Partner</h2>
            <p className="text-sm text-slate-500">Fill in your details and our team will get you onboarded quickly.</p>
          </div>

          {submitted ? (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 text-center text-teal-800">
              <CheckCircle2 size={36} className="mx-auto mb-3 text-teal-600" />
              <h3 className="text-xl font-bold mb-2">Application Received!</h3>
              <p className="text-sm">Thank you <strong>{form.name}</strong>. Our onboarding executive will call you at <strong>{form.phone}</strong> shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input required name="name" value={form.name} onChange={handleChange} placeholder="e.g. Vikram Singh" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-600 font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone (10 Digits)</label>
                  <input required type="text" maxLength={10} name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-600 font-semibold" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="rider@example.com" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-600 font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Delivery Area</label>
                  <input required name="city" value={form.city} onChange={handleChange} placeholder="e.g. Gurgaon / Delhi" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-600 font-semibold" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Type</label>
                <select name="vehicle" value={form.vehicle} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-600 bg-white font-semibold">
                  <option>Two-Wheeler (Motorbike/Scooter)</option>
                  <option>EV Scooter</option>
                  <option>Bicycle</option>
                </select>
              </div>

              {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full py-3 text-sm shadow-md shadow-teal-600/20 transition-all cursor-pointer">Submit Application</button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="mb-8 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-teal-600 mb-2">Rider FAQ</span>
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
