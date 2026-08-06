import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  Truck, Gift, CreditCard, Moon, MapPin, Search, User, ShoppingCart,
  Store, Carrot, Apple, Milk, Croissant, Pill, UtensilsCrossed,
  PawPrint, Home, Sparkles, Smartphone, Zap, Navigation, Lock, Star,
  Radar, Wallet, Bell, RotateCcw, Repeat, Plus, QrCode,
  Download, ChevronRight
} from "lucide-react";

const categories = [
  { name: "Grocery", sub: "420+ items", icon: Carrot, color: "text-blue-600", img: "grocery-basket-01" },
  { name: "Fruits & Veg", sub: "Fresh daily", icon: Apple, color: "text-teal-600", img: "fresh-fruit-01" },
  { name: "Dairy", sub: "Milk, curd, paneer", icon: Milk, color: "text-blue-600", img: "dairy-milk-01" },
  { name: "Bakery", sub: "Fresh baked", icon: Croissant, color: "text-amber-700", img: "bakery-bread-01" },
  { name: "Pharmacy", sub: "Verified medicines", icon: Pill, color: "text-teal-600", img: "pharmacy-01" },
  { name: "Food", sub: "80+ restaurants", icon: UtensilsCrossed, color: "text-violet-600", img: "fastfood-01" },
  { name: "Pet Care", sub: "Food & supplies", icon: PawPrint, color: "text-amber-800", img: "petcare-01" },
  { name: "Home Essentials", sub: "Daily needs", icon: Home, color: "text-slate-700", img: "homeessentials-01" },
  { name: "Personal Care", sub: "Health & beauty", icon: Sparkles, color: "text-teal-500", img: "personalcare-01" },
  { name: "Electronics", sub: "Small gadgets", icon: Smartphone, color: "text-violet-600", img: "gadgets-01" },
];

const whyChoose = [
  { icon: Zap, bg: "bg-blue-50", color: "text-blue-600", title: "Fast Local Delivery", desc: "Orders are dispatched directly from nearby trusted local stores." },
  { icon: Navigation, bg: "bg-teal-50", color: "text-teal-600", title: "Live Tracking", desc: "Watch your order move in real time." },
  { icon: Lock, bg: "bg-emerald-50", color: "text-emerald-600", title: "Secure Payments", desc: "UPI, cards and wallet — all encrypted." },
  { icon: Moon, bg: "bg-violet-50", color: "text-violet-600", title: "Night Delivery", desc: "Order essentials even late at night." },
  { icon: Store, bg: "bg-amber-50", color: "text-amber-700", title: "Local Stores", desc: "Support shops already in your area." },
  { icon: Star, bg: "bg-blue-50", color: "text-blue-600", title: "Trusted Vendors", desc: "Every seller is verified and rated." },
];

const steps = [
  { title: "Choose products", desc: "Browse nearby stores and add items to your cart." },
  { title: "Place order", desc: "Pick a payment method and confirm in one tap." },
  { title: "Vendor accepts", desc: "The local store packs your order right away." },
  { title: "Rider picks up", desc: "A delivery partner collects it within minutes." },
  { title: "Delivered", desc: "Track it live until it reaches your door." },
];

const features = [
  { icon: Radar, title: "Real-Time Inventory", desc: "See exactly what's in stock before you order." },
  { icon: Navigation, title: "Live Order Tracking", desc: "Watch your rider move on the map in real time." },
  { icon: Wallet, title: "Wallet", desc: "Faster checkout with saved balance and refunds." },
  { icon: CreditCard, title: "Multiple Payments", desc: "UPI, cards, cash on delivery — your choice." },
  { icon: Bell, title: "Notifications", desc: "Order status updates without opening the app." },
  { icon: RotateCcw, title: "Easy Returns", desc: "Simple returns on eligible items, no hassle." },
];

const testimonials = [
  { n: "Ananya S.", t: "Order bahut jaldi aa gaya, bilkul fresh saaman." },
  { n: "Rohit K.", t: "Live tracking se pata rehta hai rider kahan hai." },
  { n: "Priya M.", t: "Night me bhi medicine mil gayi, bahut helpful." },
];

const faqs = [
  { q: "How do I order?", a: "Set your location, browse categories or search, add items to cart and checkout." },
  { q: "How can I pay?", a: "UPI, debit/credit cards, wallet balance, or cash on delivery." },
  { q: "How fast is delivery?", a: "Orders are dispatched directly from nearby partner stores as soon as you order." },
  { q: "Can I return an item?", a: "Yes, eligible items can be returned easily from your order history." },
];

function Section({ id, eyebrow, title, center, children }) {
  return (
    <section id={id} className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {title && (
          <div className={`mb-9 ${center ? "text-center" : ""}`}>
            <span className="block text-sm font-extrabold tracking-widest uppercase text-blue-600 mb-2">{eyebrow}</span>
            <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>{title}</h2>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export default function AppKartHome() {
  const [openFeature, setOpenFeature] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const onScroll = () => {
      let closest = 0;
      let closestDist = Infinity;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveStep(closest);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Shared Common Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-4 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 text-sm font-bold mb-5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> Fresh groceries · Fast delivery · Trusted local stores
          </div>
          <h1 className="text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            Deliver anything<br /><span className="text-blue-600">near you.</span>
          </h1>
          <p className="text-slate-500 text-base mb-7 max-w-md font-medium">
            Groceries, medicines, food and daily essentials — ordered in seconds, at your door in minutes.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button className="bg-slate-900 text-white font-bold rounded-full px-6 py-3 text-sm">Download App</button>
            <Link to="/categories" className="inline-block bg-blue-600 text-white font-bold rounded-full px-6 py-3 text-sm">Browse Categories</Link>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-56 bg-slate-900 rounded-[36px] p-2.5 shadow-2xl">
            <div className="bg-white rounded-[26px] overflow-hidden">
              <div className="bg-blue-600 text-white h-12 flex items-center px-3.5 font-bold text-xs gap-1.5">
                <MapPin size={13} /> Delivering to your location
              </div>
              <div className="p-3 space-y-2.5">
                {[
                  { icon: Carrot, label: "Fresh Vegetables", bg: "bg-blue-600" },
                  { icon: Milk, label: "Dairy & Bakery", bg: "bg-teal-500" },
                  { icon: Pill, label: "Pharmacy Essentials", bg: "bg-slate-900" },
                  { icon: UtensilsCrossed, label: "Snacks & Beverages", bg: "bg-violet-500" },
                ].map((c, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-2 flex items-center gap-2.5 text-sm font-bold">
                    <div className={`w-7 h-7 rounded-lg ${c.bg} text-white flex items-center justify-center flex-shrink-0`}>
                      <c.icon size={13} />
                    </div>
                    {c.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick action cards */}
      <div className="max-w-6xl mx-auto px-6 mt-10 grid md:grid-cols-3 gap-4">
        {[
          { icon: ShoppingCart, bg: "bg-blue-50", iconBg: "bg-blue-600", title: "Browse Categories", sub: "Grocery, food & more", to: "/categories" },
          { icon: Gift, bg: "bg-violet-50", iconBg: "bg-violet-600", title: "Today's Offers", sub: "Best deals near you", to: "#deals" },
          { icon: Repeat, bg: "bg-teal-50", iconBg: "bg-teal-500", title: "Subscribe & Save", sub: "Auto-delivered essentials", to: "/subscriptions" },
        ].map((c, i) =>
          c.to.startsWith("/") ? (
            <Link key={i} to={c.to} className={`${c.bg} rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all`}>
              <div className={`w-12 h-12 rounded-xl ${c.iconBg} text-white flex items-center justify-center flex-shrink-0`}>
                <c.icon size={20} />
              </div>
              <div>
                <div className="font-extrabold text-base">{c.title}</div>
                <div className="text-sm font-semibold text-slate-500 flex items-center gap-1">{c.sub} <ChevronRight size={12} /></div>
              </div>
            </Link>
          ) : (
            <a key={i} href={c.to} className={`${c.bg} rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all`}>
              <div className={`w-12 h-12 rounded-xl ${c.iconBg} text-white flex items-center justify-center flex-shrink-0`}>
                <c.icon size={20} />
              </div>
              <div>
                <div className="font-extrabold text-base">{c.title}</div>
                <div className="text-sm font-semibold text-slate-500 flex items-center gap-1">{c.sub} <ChevronRight size={12} /></div>
              </div>
            </a>
          )
        )}
      </div>

      {/* Categories */}
      <Section id="categories" eyebrow="Shop by category" title="Everything you need, sorted.">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((c, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="relative aspect-square bg-slate-100">
                <img src={`https://picsum.photos/seed/${c.img}/300/300`} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
                  <c.icon size={14} className={c.color} />
                </div>
              </div>
              <div className="p-3">
                <div className="font-bold text-base">{c.name}</div>
                <div className="text-base text-slate-500 font-semibold">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/categories" className="text-blue-600 font-extrabold text-base inline-flex items-center gap-1">View All Categories <ChevronRight size={15} /></Link>
        </div>
      </Section>

      {/* Why choose */}
      <Section eyebrow="Why FillCarts" title="Why Choose FillCarts?" center>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {whyChoose.map((w, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 text-left">
              <div className={`w-11 h-11 rounded-full ${w.bg} ${w.color} flex items-center justify-center mb-3.5`}>
                <w.icon size={19} />
              </div>
              <div className="font-extrabold text-base mb-1">{w.title}</div>
              <div className="text-base text-slate-500">{w.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section id="how" eyebrow="How it works" title="From tap to doorstep." center>
        <div className="max-w-xl mx-auto relative">
          <div className="absolute left-[23px] top-3 bottom-3 w-0.5 bg-slate-200" />
          {steps.map((s, i) => (
            <div
              key={i}
              ref={(el) => (stepRefs.current[i] = el)}
              className={`flex gap-5 py-5 transition-all duration-500 ${activeStep === i ? "opacity-100 translate-x-0" : "opacity-40 -translate-x-1"}`}
            >
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-extrabold flex-shrink-0 z-10 transition-colors duration-500 ${activeStep === i ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-900"}`} style={{ fontFamily: "'Fraunces', serif" }}>
                {i + 1}
              </div>
              <div>
                <h3 className="font-extrabold text-base mb-0.5">{s.title}</h3>
                <p className="text-base text-slate-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section id="features" eyebrow="App features" title="Built for speed and trust.">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const open = openFeature === i;
            return (
              <div
                key={i}
                onClick={() => setOpenFeature(open ? null : i)}
                className={`rounded-2xl p-5 cursor-pointer border transition-colors ${open ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200"}`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-blue-600 flex items-center justify-center mb-3">
                  <f.icon size={18} />
                </div>
                <div className="font-extrabold text-base">{f.title}</div>
                {open && <div className="text-base text-slate-500 mt-1.5">{f.desc}</div>}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Today's Deals */}
      <Section id="deals" eyebrow="Today's deals" title="Offers picked for you.">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Fresh Fruits Combo", off: "25% OFF", price: 149, mrp: 199, img: "deal-fruits-combo", tag: "bg-blue-600" },
            { name: "Dairy Essentials Pack", off: "Flat ₹40 OFF", price: 189, mrp: 229, img: "deal-dairy-pack", tag: "bg-teal-600" },
            { name: "Snacks & Beverages", off: "Buy 1 Get 1", price: 99, mrp: 180, img: "deal-snacks", tag: "bg-violet-600" },
            { name: "Pharmacy Essentials", off: "15% OFF", price: 129, mrp: 149, img: "deal-pharmacy", tag: "bg-amber-700" },
          ].map((d, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="relative aspect-square bg-slate-100">
                <img src={`https://picsum.photos/seed/${d.img}/300/300`} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                <span className={`absolute top-2 left-2 ${d.tag} text-white text-sm font-bold px-2.5 py-1 rounded-full`}>{d.off}</span>
              </div>
              <div className="p-3.5">
                <div className="font-bold text-base mb-1.5">{d.name}</div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-base">₹{d.price}</span>
                    <span className="text-sm text-slate-400 line-through ml-1.5">₹{d.mrp}</span>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center"><Plus size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Subscription */}
      <div id="subscription" className="max-w-6xl mx-auto px-6 py-4">
        <div className="bg-slate-900 text-white rounded-3xl p-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="text-sm font-extrabold uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-1.5"><Repeat size={13} /> Subscription</div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Never run out of essentials.</h2>
            <p className="text-sm text-slate-300 max-w-md">Subscribe to your daily milk, bread and groceries — auto-delivered on schedule, cancel anytime.</p>
          </div>
          <Link to="/subscriptions" className="inline-block bg-blue-600 text-white font-bold rounded-full px-6 py-3 text-sm whitespace-nowrap">Explore Subscriptions</Link>
        </div>
      </div>

      {/* Download */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="bg-blue-600 text-white rounded-3xl p-10 flex flex-wrap items-center justify-between gap-6">
          <h2 className="text-2xl font-bold max-w-sm" style={{ fontFamily: "'Fraunces', serif" }}>Get the FillCarts app and order in under a minute.</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-slate-900 rounded-xl px-5 py-3 font-bold text-base flex items-center gap-2"><Download size={15} /> Google Play</div>
            <div className="bg-slate-900 rounded-xl px-5 py-3 font-bold text-base flex items-center gap-2"><Smartphone size={15} /> App Store</div>
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-slate-900"><QrCode size={26} /></div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <Section eyebrow="Testimonials" title="Loved by our customers." center>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex gap-0.5 text-blue-500 mb-3">
                {[...Array(5)].map((_, s) => <Star key={s} size={13} fill="currentColor" />)}
              </div>
              <p className="text-base text-slate-500 mb-4">"{t.t}"</p>
              <div className="font-extrabold text-base">{t.n}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Expansion */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>New stores joining your neighbourhood every week.</h2>
          <p className="text-base text-slate-500 max-w-md mx-auto mb-5">FillCarts keeps adding local shops nearby, so your options keep growing. Enter your area to check what's available.</p>
          <div className="flex max-w-sm mx-auto gap-2">
            <input placeholder="Enter your area / pincode" className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none" />
            <button className="bg-slate-900 text-white font-bold rounded-full px-5 py-2.5 text-sm whitespace-nowrap">Check</button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <Section id="support" eyebrow="FAQ" title="Frequently Asked Questions" center>
        <div className="max-w-2xl mx-auto">
          {faqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={i} onClick={() => setOpenFaq(open ? null : i)} className="border-b border-slate-200 py-5 cursor-pointer">
                <div className="flex justify-between items-center font-bold text-base">
                  {f.q}
                  <Plus size={17} className={`text-blue-600 transition-transform ${open ? "rotate-45" : ""}`} />
                </div>
                {open && <div className="text-base text-slate-500 mt-2.5">{f.a}</div>}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
