import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import {
  MapPin, Search, User, ShoppingCart, ChevronRight, ChevronDown, Package,
  CreditCard, RotateCcw, UserCog, Truck, Store, Bike, Phone, Mail,
  MessageCircle, Clock
} from "lucide-react";

const helpTopics = [
  { key: "orders", icon: Package, bg: "bg-blue-50", color: "text-blue-600", title: "Orders", desc: "Placing, tracking & cancelling orders" },
  { key: "payments", icon: CreditCard, bg: "bg-teal-50", color: "text-teal-600", title: "Payments", desc: "UPI, cards, wallet & refunds" },
  { key: "returns", icon: RotateCcw, bg: "bg-violet-50", color: "text-violet-600", title: "Returns", desc: "Return & replacement process" },
  { key: "account", icon: UserCog, bg: "bg-amber-50", color: "text-amber-700", title: "Account", desc: "Login, profile & addresses" },
  { key: "delivery", icon: Truck, bg: "bg-blue-50", color: "text-blue-600", title: "Delivery", desc: "Delivery time & tracking issues" },
  { key: "vendor", icon: Store, bg: "bg-teal-50", color: "text-teal-600", title: "Vendor Support", desc: "For registered store partners" },
  { key: "rider", icon: Bike, bg: "bg-violet-50", color: "text-violet-600", title: "Rider Support", desc: "For delivery partners" },
];

const faqsByTopic = {
  orders: [
    { q: "How do I track my order?", a: "Go to Order History and tap on the active order to see live tracking on the map." },
    { q: "Can I cancel an order after placing it?", a: "Yes, orders can be cancelled before the vendor accepts them, from the order details screen." },
    { q: "Why is my order delayed?", a: "Delays can happen during high demand or bad weather — check live tracking for updated ETA." },
  ],
  payments: [
    { q: "What payment methods are accepted?", a: "UPI, debit/credit cards, net banking, AppKart wallet, and cash on delivery." },
    { q: "How long do refunds take?", a: "Refunds are processed within 3-5 business days to your original payment method." },
    { q: "Is my payment information secure?", a: "Yes, all transactions are encrypted and we never store your full card details." },
  ],
  returns: [
    { q: "How do I return an item?", a: "Go to Order History, select the item, and choose Return — eligible items are picked up within 24 hours." },
    { q: "Which items are non-returnable?", a: "Perishables like fresh produce, dairy and cooked food usually can't be returned once delivered." },
  ],
  account: [
    { q: "How do I change my delivery address?", a: "Go to Profile > Saved Addresses to add, edit or remove delivery addresses." },
    { q: "I forgot my password, what do I do?", a: "Use 'Forgot Password' on the login screen to reset it via OTP." },
  ],
  delivery: [
    { q: "What are the delivery hours?", a: "Most areas support delivery from early morning to late night, including select night-delivery zones." },
    { q: "My rider isn't moving on the map, why?", a: "This can happen briefly due to network issues — it usually resolves within a minute." },
  ],
  vendor: [
    { q: "How do I update my store inventory?", a: "Log into the Vendor Dashboard and go to Manage Products to update stock and pricing." },
    { q: "When do I get paid?", a: "Vendor payouts are settled weekly directly to your registered bank account." },
  ],
  rider: [
    { q: "How do I go online to accept orders?", a: "Open the Rider App and toggle yourself Online from the home screen." },
    { q: "When are rider payouts made?", a: "Rider earnings are settled weekly, with a full breakdown available in the app." },
  ],
};

export default function SupportPage() {
  const [activeTopic, setActiveTopic] = useState("orders");
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const filteredFaqs = useMemo(() => {
    const list = faqsByTopic[activeTopic] || [];
    if (!query.trim()) return list;
    return list.filter((f) => f.q.toLowerCase().includes(query.toLowerCase()));
  }, [activeTopic, query]);

  const activeTopicData = helpTopics.find((t) => t.key === activeTopic);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-50/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link to="/" className="text-xl font-extrabold flex-shrink-0" style={{ fontFamily: "'Fraunces', serif" }}>Fill<span className="text-blue-600">Carts</span></Link>
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
          <Link to="/" className="hover:text-blue-600">Home</Link><ChevronRight size={13} /><span className="text-slate-900 font-bold">Support</span>
        </div>
      </header>

      {/* Hero + search */}
      <section className="max-w-3xl mx-auto px-6 py-14 text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Fraunces', serif" }}>How can we help you?</h1>
        <p className="text-slate-500 text-base mb-7">Search for help topics or browse categories below.</p>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-5 py-3 max-w-lg mx-auto shadow-sm">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a question..."
            className="bg-transparent outline-none w-full text-base"
          />
        </div>
      </section>

      {/* Help topic cards */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {helpTopics.map((t) => {
            const isActive = activeTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => { setActiveTopic(t.key); setOpenFaq(0); setQuery(""); }}
                className={`text-left bg-white border rounded-2xl p-5 transition-all ${isActive ? "border-blue-400 shadow-md" : "border-slate-200 hover:-translate-y-1 hover:shadow-md"}`}
              >
                <div className={`w-11 h-11 rounded-xl ${t.bg} ${t.color} flex items-center justify-center mb-3.5`}><t.icon size={19} /></div>
                <div className="font-extrabold text-base mb-1">{t.title}</div>
                <div className="text-sm text-slate-500">{t.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQ for selected topic */}
      <section className="max-w-3xl mx-auto px-6 py-4 pb-14">
        <div className="flex items-center gap-2.5 mb-6">
          <div className={`w-9 h-9 rounded-lg ${activeTopicData.bg} ${activeTopicData.color} flex items-center justify-center`}>
            <activeTopicData.icon size={17} />
          </div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>{activeTopicData.title} FAQs</h2>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
            No matching questions found. Try a different search or contact us below.
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200">
            {filteredFaqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} onClick={() => setOpenFaq(open ? null : i)} className="p-5 cursor-pointer">
                  <div className="flex justify-between items-center font-bold text-sm">
                    {f.q}
                    <ChevronDown size={16} className={`text-blue-600 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
                  </div>
                  {open && <div className="text-sm text-slate-500 mt-2.5">{f.a}</div>}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Contact options */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-2">Still need help</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Talk to our support team.</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3"><Phone size={20} /></div>
            <div className="font-extrabold text-base mb-1">Call Us</div>
            <div className="text-sm text-slate-500 mb-3">Mon-Sun, 8am - 11pm</div>
            <div className="text-sm font-bold text-blue-600">1800-123-4567</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3"><MessageCircle size={20} /></div>
            <div className="font-extrabold text-base mb-1">Live Chat</div>
            <div className="text-sm text-slate-500 mb-3">Fastest response time</div>
            <button className="text-sm font-bold text-teal-600">Start Chat →</button>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-3"><Mail size={20} /></div>
            <div className="font-extrabold text-base mb-1">Email Us</div>
            <div className="text-sm text-slate-500 mb-3">Reply within 24 hours</div>
            <div className="text-sm font-bold text-violet-600">support@appkart.com</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mt-6">
          <Clock size={14} /> Average response time: under 2 hours
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
