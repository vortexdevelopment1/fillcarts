import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  ChevronRight, ChevronDown, Package, CreditCard, RotateCcw, UserCog,
  Truck, Store, Bike, Phone, Mail, MessageCircle, Clock, Search, Plus
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
    { q: "What payment methods are accepted?", a: "UPI, debit/credit cards, net banking, FillCarts wallet, and cash on delivery." },
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

      {/* Shared Common Navbar */}
      <Navbar searchPlaceholder="Search help articles..." onSearchChange={(val) => setQuery(val)} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center gap-1.5">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={13} />
          <span className="text-slate-900 font-bold">Support & Help Center</span>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-14 text-center">
        <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-2">Help Center</span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Fraunces', serif" }}>How can we help you?</h1>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-3 text-base max-w-xl mx-auto shadow-sm">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help articles..."
            className="bg-transparent outline-none w-full text-slate-900 text-sm"
          />
        </div>
      </section>

      {/* Topics */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {helpTopics.map((t) => {
            const isActive = activeTopic === t.key;
            return (
              <div
                key={t.key}
                onClick={() => setActiveTopic(t.key)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  isActive ? "bg-white border-blue-600 shadow-md" : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className={`w-11 h-11 rounded-full ${t.bg} ${t.color} flex items-center justify-center mb-3.5`}>
                  <t.icon size={19} />
                </div>
                <div className="font-extrabold text-base mb-1">{t.title}</div>
                <div className="text-sm text-slate-500">{t.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto px-6 pb-14">
        <div className="mb-6 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${activeTopicData.bg} ${activeTopicData.color} flex items-center justify-center`}>
            <activeTopicData.icon size={18} />
          </div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>{activeTopicData.title} Questions</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          {filteredFaqs.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">No help articles found matching "{query}".</div>
          ) : (
            filteredFaqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} onClick={() => setOpenFaq(open ? null : i)} className="border-b border-slate-200 py-4 cursor-pointer last:border-b-0">
                  <div className="flex justify-between items-center font-bold text-sm text-slate-900">
                    {f.q}
                    <Plus size={16} className={`text-blue-600 transition-transform ${open ? "rotate-45" : ""}`} />
                  </div>
                  {open && <div className="text-sm text-slate-500 mt-2.5">{f.a}</div>}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3"><MessageCircle size={20} /></div>
            <h3 className="font-extrabold text-base mb-1">Live Chat</h3>
            <p className="text-sm text-slate-500 mb-4">Chat with our 24/7 support team.</p>
            <button className="bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-full">Start Chat</button>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3"><Phone size={20} /></div>
            <h3 className="font-extrabold text-base mb-1">Phone Support</h3>
            <p className="text-sm text-slate-500 mb-4">Call us toll-free for urgent help.</p>
            <a href="tel:1800123456" className="text-sm font-extrabold text-teal-600 hover:underline">1800-123-456</a>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <div className="w-11 h-11 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-3"><Mail size={20} /></div>
            <h3 className="font-extrabold text-base mb-1">Email Support</h3>
            <p className="text-sm text-slate-500 mb-4">Send us details of your query.</p>
            <a href="mailto:support@fillcarts.com" className="text-sm font-extrabold text-violet-600 hover:underline">support@fillcarts.com</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
