import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {
  ChevronRight, ChevronDown, Package, CreditCard, RotateCcw, UserCog,
  Truck, Store, Bike, Phone, Mail, MessageCircle, Clock, Search, Plus,
  AlertCircle, CheckCircle2, ArrowRight, Sparkles, HelpCircle, X, ShieldAlert,
  LifeBuoy, Send, ShieldCheck, Zap
} from "lucide-react";

// 5 Help Categories for Customer App
const helpCategories = [
  { key: "orders", icon: Package, title: "Orders", desc: "Placing, tracking & cancelling orders" },
  { key: "payments", icon: CreditCard, title: "Payments & Refunds", desc: "UPI, cards, wallet & refund status" },
  { key: "returns", icon: RotateCcw, title: "Returns", desc: "Return & replacement process" },
  { key: "delivery", icon: Truck, title: "Delivery", desc: "Delivery SLA, slots & rider tracking" },
  { key: "account", icon: UserCog, title: "Account", desc: "Login, addresses & profile settings" },
];

// Most Common Questions Per Category (Accordion Format)
const faqsByCategory = {
  orders: [
    { q: "How do I track my active order in real time?", a: "Go to 'My Orders' in your profile or click 'Track Order'. You will see live rider movement on an interactive map with updated delivery ETA." },
    { q: "Can I cancel an order after placing it?", a: "Yes, you can cancel an order free of cost before the local store accepts it. Once accepted, cancellation fees equal to the order amount may apply." },
    { q: "What should I do if my order is delayed?", a: "Delays can occur during heavy rainfall or peak traffic hours. Check your live order map for updated ETA or tap 'Delivery Delay' to speak with support." },
    { q: "Can I change my delivery address after placing an order?", a: "Address changes are allowed within 2 minutes of checkout if the rider has not been assigned. Contact live chat support immediately for address updates." }
  ],
  payments: [
    { q: "What payment methods are accepted on FillCarts?", a: "We accept UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, Net Banking, FillCarts Wallet, and Cash on Delivery (COD)." },
    { q: "How long does a refund take to process?", a: "Refunds for cancelled or returned orders are initiated instantly and credited to your original payment method within 3 to 5 business days." },
    { q: "What should I do if my payment failed but money was deducted?", a: "Bank deductions for failed transactions are auto-refunded by your bank within 24 to 48 hours. You can also check refund status with live chat support." },
    { q: "Are my card and UPI details secure?", a: "Yes, 100%. All transactions are encrypted via PCI-DSS compliant payment gateways. FillCarts never stores your full card credentials." }
  ],
  returns: [
    { q: "How do I request a return or replacement?", a: "Navigate to 'My Orders', select the delivered order, click 'Return/Replacement', select the reason, and attach a photo if damaged. Pickup is arranged within 24 hours." },
    { q: "Which items are eligible for return?", a: "Packaged grocery, household goods, and personal care items are returnable within 3 days. Perishables (fresh milk, bread, vegetables) can be reported for instant refund if spoiled on delivery." },
    { q: "What if I received a wrong or damaged item?", a: "Tap 'Wrong/Damaged Item' in the order section, upload a quick photo, and our support team will issue an instant replacement or store refund." },
    { q: "How does pickup for returned items work?", a: "A local delivery partner will visit your address to verify and collect the returned item. Ensure original packaging and tags are intact." }
  ],
  delivery: [
    { q: "What are FillCarts daily delivery hours?", a: "Express delivery operates from 6:00 AM to 11:00 PM daily. Select urban zones support 24/7 late-night pharmacy and food delivery." },
    { q: "What is the minimum order value for Free Delivery?", a: "Orders above ₹299 qualify for Free Express Delivery. Orders below ₹299 incur a nominal delivery fee shown clearly at checkout." },
    { q: "My rider is not moving on the map, what do I do?", a: "Riders may stop briefly at traffic signals or store pickups. If stationary for more than 5 minutes, tap 'Live Chat' to call your rider directly." },
    { q: "Can I schedule a morning delivery slot?", a: "Yes! Use our Subscription feature to schedule daily morning milk, bakery, and produce drops between 6:30 AM and 8:30 AM." }
  ],
  account: [
    { q: "How do I update my profile name or delivery address?", a: "Go to Profile > Account Settings or Saved Addresses to add, edit, or set default delivery addresses for 1-tap checkout." },
    { q: "I am unable to receive OTP for login, what should I do?", a: "Ensure your phone network is active. If OTP is delayed, wait 30 seconds and click 'Resend OTP' or try logging in via WhatsApp OTP." },
    { q: "How do I delete my FillCarts account and data?", a: "Go to Profile > Account Settings > Privacy & Data, or email privacy@fillcarts.com. Account data will be permanently removed within 14 days." }
  ]
};

export function SupportContent({ isEmbedded = false }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("orders");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Modals & Drawers
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showLiveChatDrawer, setShowLiveChatDrawer] = useState(false);

  // Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "Orders",
    orderId: "",
    description: ""
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Live Chat Simulation State
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hello! Welcome to Customer Support. How can we help you today?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      let botReply = "Thank you for reaching out. A support specialist is reviewing your account details and will connect in 30 seconds.";
      if (userText.toLowerCase().includes("track") || userText.toLowerCase().includes("order")) {
        botReply = "You can track your order live under 'My Orders'. Your rider is currently en-route to your location!";
      } else if (userText.toLowerCase().includes("refund")) {
        botReply = "Refunds are processed within 3-5 business days. You can check refund status with our live support.";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 800);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.description) {
      alert("Please fill in subject and description.");
      return;
    }
    setTicketSubmitted(true);
  };

  const currentCategoryData = helpCategories.find((c) => c.key === activeCategory) || helpCategories[0];
  const activeFaqs = faqsByCategory[activeCategory] || [];

  return (
    <>
      {/* HERO SECTION - Rendered only when standalone */}
      {!isEmbedded && (
        <section className="bg-white border-b border-slate-100 py-10 md:py-14 px-4 sm:px-6 relative text-center">
          <div className="max-w-3xl mx-auto space-y-3">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#17231A] leading-tight tracking-tight">
              We're here to help you <span className="text-[#16A34A]">24x7 on Zepto App</span>
            </h1>

            <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm font-medium leading-relaxed">
              Find quick answers to your questions or get in touch with our customer support team anytime.
            </p>
          </div>
        </section>
      )}

      {/* MAIN CONTENT BODY */}
      <main className={isEmbedded ? "w-full min-w-0 space-y-6 text-left" : "max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-14 flex-1 w-full min-w-0 text-left"}>

        {/* FREQUENTLY ASKED QUESTIONS SECTION */}
        <section className="space-y-4 min-w-0">
          {!isEmbedded && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-1.5">
                  <Sparkles size={13} className="text-[#16A34A]" /> Frequently Asked Questions
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#17231A] tracking-tight">
                  Got Questions? We've Got Answers
                </h2>
              </div>
              
              <button
                onClick={() => { setShowTicketModal(true); setTicketSubmitted(false); }}
                className="inline-flex items-center gap-2 bg-[#FFFCF5] hover:bg-amber-50 text-amber-900 border border-amber-300/80 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-2xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
              >
                <LifeBuoy size={15} className="text-[#F59E0B]" /> Raise Support Ticket
              </button>
            </div>
          )}

          {/* Category Chips / Navigation Bar */}
          <div className="bg-[#FFFCF5] border border-emerald-100/80 rounded-2xl p-2.5 shadow-2xs min-w-0 overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none min-w-0 w-full">
              {helpCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.key;
                const faqCount = (faqsByCategory[cat.key] || []).length;
                return (
                  <button
                    key={cat.key}
                    onClick={() => { setActiveCategory(cat.key); setOpenFaqIndex(0); }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-[#16A34A] text-white border-[#16A34A] shadow-xs"
                        : "bg-white border-slate-200/80 text-slate-700 hover:bg-[#ECFDF3] hover:border-emerald-300"
                    }`}
                  >
                    <Icon size={14} className={isActive ? "text-white" : "text-[#16A34A]"} />
                    <span>{cat.title}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {faqCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Category Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#ECFDF3]/80 border border-emerald-200/90 rounded-2xl p-4 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-extrabold shrink-0 shadow-xs">
                {React.createElement(currentCategoryData.icon, { size: 20 })}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-[#17231A] truncate">{currentCategoryData.title}</h3>
                <p className="text-[11px] text-slate-600 font-medium truncate">{currentCategoryData.desc}</p>
              </div>
            </div>

            <button
              onClick={() => { setShowTicketModal(true); setTicketSubmitted(false); }}
              className="inline-flex items-center gap-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <LifeBuoy size={14} /> Raise Ticket
            </button>
          </div>

          {/* Accordion List */}
          <div className="space-y-3 min-w-0">
            {activeFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-[#16A34A] shadow-xs ring-1 ring-[#16A34A]/20"
                      : "border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left cursor-pointer group gap-3 min-w-0"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? "bg-[#16A34A] text-white" : "bg-[#ECFDF3] text-[#166534]"
                      }`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-[#17231A] group-hover:text-[#16A34A] transition-colors leading-snug break-words min-w-0">
                        {faq.q}
                      </span>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "bg-[#16A34A] text-white rotate-180" : "bg-slate-100 text-slate-500 group-hover:bg-[#ECFDF3] group-hover:text-[#166534]"
                    }`}>
                      <ChevronDown size={14} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-0 min-w-0">
                      <div className="p-3.5 bg-[#ECFDF3]/50 border-l-4 border-[#16A34A] rounded-r-xl text-xs text-slate-700 font-medium leading-relaxed space-y-2 break-words">
                        <p className="break-words">{faq.a}</p>
                        <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#166534] font-bold">
                          <ShieldCheck size={14} className="shrink-0" />
                          <span>Was this answer helpful? If you need further help, reach our 24/7 live support below.</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CONTACT SUPPORT CHANNELS */}
        <section className="pt-4 border-t border-slate-100 space-y-3 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-[#17231A]">Need Direct Assistance?</h3>
              <p className="text-[11px] text-slate-400 font-semibold">Connect directly with our customer support team</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-[#ECFDF3] px-2.5 py-1 rounded-full self-start sm:self-auto shrink-0">24/7 Desk</span>
          </div>

          <div className={`grid gap-3 min-w-0 ${isEmbedded ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-3"}`}>
            {/* Live Chat */}
            <div className="bg-[#FFFCF5] border border-amber-200/80 rounded-2xl p-4 text-center space-y-2 shadow-2xs hover:shadow-xs transition-all min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center mx-auto">
                <MessageCircle size={18} />
              </div>
              <div className="font-extrabold text-xs text-[#17231A] truncate">Live Chat</div>
              <p className="text-[10px] text-slate-500 font-medium truncate">Instant AI & Agent Support</p>
              <button
                onClick={() => setShowLiveChatDrawer(true)}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-[11px] py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 truncate px-2"
              >
                <MessageCircle size={13} className="shrink-0" /> <span className="truncate">Chat Now</span>
              </button>
            </div>

            {/* Phone Support */}
            <div className="bg-[#FFFCF5] border border-amber-200/80 rounded-2xl p-4 text-center space-y-2 shadow-2xs hover:shadow-xs transition-all min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#ECFDF3] text-[#166534] flex items-center justify-center mx-auto">
                <Phone size={18} />
              </div>
              <div className="font-extrabold text-xs text-[#17231A] truncate">Toll-Free Phone</div>
              <p className="text-[10px] text-slate-500 font-medium truncate">Call for urgent active orders</p>
              <a
                href="tel:1800123456"
                className="w-full bg-white hover:bg-[#ECFDF3] text-[#166534] border border-emerald-200 font-extrabold text-[11px] py-2 rounded-xl transition-colors block text-center shadow-2xs truncate px-2"
              >
                📞 1800-123-456
              </a>
            </div>

            {/* Email Support */}
            <div className="bg-[#FFFCF5] border border-amber-200/80 rounded-2xl p-4 text-center space-y-2 shadow-2xs hover:shadow-xs transition-all min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center mx-auto">
                <Mail size={18} />
              </div>
              <div className="font-extrabold text-xs text-[#17231A] truncate">Email Support</div>
              <p className="text-[10px] text-slate-500 font-medium truncate">Detailed queries & feedback</p>
              <a
                href="mailto:support@fillcarts.com"
                className="w-full bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-[11px] py-2 rounded-xl transition-colors block text-center shadow-2xs truncate px-2"
              >
                ✉️ Email Us
              </a>
            </div>
          </div>
        </section>

      </main>


      {/* RAISE SUPPORT TICKET MODAL */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-emerald-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#166534] bg-[#ECFDF3] px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                  Ticket Desk
                </span>
                <h3 className="font-extrabold text-lg text-[#17231A]">Raise Support Ticket</h3>
              </div>
              <button
                onClick={() => setShowTicketModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {ticketSubmitted ? (
              <div className="bg-[#ECFDF3] border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#16A34A] text-white flex items-center justify-center mx-auto font-bold">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-base font-extrabold text-[#17231A]">Support Ticket Created! 🎉</h4>
                <p className="text-xs text-slate-600 font-medium">
                  Ticket <strong>#TKT-{Math.floor(100000 + Math.random() * 900000)}</strong> has been registered. Our senior resolution officer will respond within 2 hours.
                </p>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="bg-[#16A34A] text-white font-extrabold text-xs px-5 py-2.5 rounded-full shadow-sm cursor-pointer mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-extrabold text-[#17231A] mb-1">Issue Category *</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs focus:outline-none focus:border-[#16A34A] cursor-pointer"
                  >
                    <option>Orders & Delivery</option>
                    <option>Payments & Refunds</option>
                    <option>Return & Replacement</option>
                    <option>Account & Settings</option>
                    <option>Other Query</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#17231A] mb-1">Ticket Subject *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Delayed refund for Order #9021"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-[#17231A] mb-1">Order ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. SUB-ORD-9021"
                      value={ticketForm.orderId}
                      onChange={(e) => setTicketForm({ ...ticketForm, orderId: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-[#17231A] mb-1">Problem Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details about your issue..."
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* LIVE CHAT DRAWER SIMULATION MODAL */}
      {showLiveChatDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 overflow-hidden">
          <div className="bg-white border border-emerald-100 rounded-t-3xl sm:rounded-3xl max-w-md w-full h-[85dvh] sm:h-[520px] max-h-[90vh] shadow-2xl flex flex-col justify-between overflow-hidden text-left overscroll-contain animate-slide-right sm:animate-scale-up">
            
            {/* Drawer Header */}
            <div className="bg-[#166534] text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-bold">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <div className="font-extrabold text-xs">FillCarts Live Support</div>
                  <div className="text-[10px] text-emerald-100 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online (24/7 Desk)
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowLiveChatDrawer(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs bg-[#FFFCF5]">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 leading-relaxed font-semibold ${
                      msg.sender === "user"
                        ? "bg-[#16A34A] text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="Type your question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
              />
              <button
                type="submit"
                className="bg-[#16A34A] hover:bg-[#15803D] text-white p-2.5 rounded-xl shadow-xs shrink-0 cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}

export default function SupportPage() {
  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Shared Common Navbar */}
      <Navbar />


      <SupportContent />

      {/* Footer */}
      <Footer />
    </div>
  );
}
