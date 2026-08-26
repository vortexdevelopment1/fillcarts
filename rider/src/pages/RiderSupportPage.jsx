import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RiderNavbar from "../components/RiderNavbar";
import Footer from "../components/Footer";
import {
  Bike, Phone, Mail, MessageCircle, ShieldCheck, AlertTriangle,
  CreditCard, Package, UserCheck, LifeBuoy, Sparkles, ChevronDown,
  Send, X, CheckCircle2, Clock, HelpCircle, ShieldAlert, FileText, ArrowRight
} from "lucide-react";

const helpCategories = [
  { key: "payouts", icon: CreditCard, title: "Payouts & Earnings", desc: "Weekly bank deposits, surge bonuses & rain allowance" },
  { key: "deliveries", icon: Package, title: "Active Deliveries", desc: "Order delays, wrong address & customer unreachability" },
  { key: "account", icon: UserCheck, title: "Account & Docs", desc: "Driving license, Aadhaar & bank details update" },
  { key: "safety", icon: ShieldAlert, title: "Safety & Emergency", desc: "Accident insurance claim & vehicle breakdown support" },
];

const faqsByCategory = {
  payouts: [
    { q: "How do rider payouts work and when are they deposited?", a: "Earnings per completed order and weekly incentives are tracked in real time in your Rider App. Weekly settlements are deposited directly into your registered bank account every Tuesday." },
    { q: "What should I do if a payout amount is incorrect?", a: "Tap 'Raise Support Ticket', select 'Payout Query', and mention the order date/ID. Our rider finance team will verify trip logs and credit any discrepancy within 24 hours." },
    { q: "How are peak hour surge and rain allowances calculated?", a: "Surge multipliers (1.2x to 2.0x) apply automatically during high-demand hours (12 PM–3 PM & 7 PM–10 PM) and severe weather. The extra surge pay is itemized in your trip summary." }
  ],
  deliveries: [
    { q: "What should I do if the customer address is unreachable or incorrect?", a: "Try calling the customer twice via the masked phone button in your app. If unreachable after 5 minutes, tap 'Customer Unreachable' to alert support, and wait for cancellation instructions." },
    { q: "What if an order gets delayed due to store prep time?", a: "If the merchant store takes more than 10 minutes to hand over the packed parcel, tap 'Store Waiting Delay' in your active order screen to protect your SLA rating." },
    { q: "What if the parcel gets accidentally damaged during transit?", a: "Tap 'Vehicle Breakdown / Damaged Parcel' immediately. Do not deliver damaged items. Our team will re-assign the order to another nearby merchant store." }
  ],
  account: [
    { q: "How do I update my Driving License or Bank Account details?", a: "Go to Rider Profile > Documents, upload clear photos of your updated Driving License or Passbook/Cheque, and verification completes within 12 to 24 hours." },
    { q: "My rider account is marked 'Under Review', what does it mean?", a: "Accounts undergo routine annual document re-verification. Ensure your Driving License and Vehicle Insurance are up to date in the app." }
  ],
  safety: [
    { q: "Are delivery partners covered under medical insurance?", a: "Yes! All active Filcarts delivery partners receive 100% complimentary accident and medical hospitalization coverage up to ₹5,00,000 from Day 1." },
    { q: "How do I trigger the emergency helpline during an accident?", a: "Tap the red 'SOS Emergency' button at the top of your Rider App or call our dedicated 24/7 Rider Emergency Helpline at 1800-999-888 for instant ambulance and fleet support." }
  ]
};

export default function RiderSupportPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("payouts");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Ticket Modal & Live Chat States
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showLiveChatDrawer, setShowLiveChatDrawer] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketData, setTicketData] = useState({ category: "payouts", orderId: "", message: "" });
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hello Partner! 👋 How can I help you with your shifts, payouts, or active orders today?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const currentCategoryData = helpCategories.find(c => c.key === activeCategory) || helpCategories[0];
  const activeFaqs = faqsByCategory[activeCategory] || [];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setShowTicketModal(false);
      setTicketData({ category: "payouts", orderId: "", message: "" });
    }, 3000);
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      let botReply = "Thank you! Our 24/7 Rider Desk agent is reviewing your query. Expect a response in under 2 minutes.";
      if (userText.toLowerCase().includes("payout") || userText.toLowerCase().includes("money")) {
        botReply = "Payouts are processed every Tuesday morning directly to your registered bank account. You can track individual trip earnings under Earnings tab.";
      } else if (userText.toLowerCase().includes("accident") || userText.toLowerCase().includes("help")) {
        botReply = "Emergency Alert! If you require urgent medical assistance, please dial 1800-999-888 immediately.";
      }
      setChatMessages(prev => [...prev, { sender: "bot", text: botReply }]);
    }, 1000);
  };

  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Rider Navbar */}
      <RiderNavbar />

      {/* Hero Banner (Clean Light Theme with Rider Orange Accents) */}
      <section className="bg-gradient-to-b from-[#FFF7ED] to-[#FFFCF5] border-b border-orange-100/80 py-10 md:py-14 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#EA580C] bg-orange-100/80 px-3.5 py-1.5 rounded-full border border-orange-200 mb-1">
            <LifeBuoy size={13} className="text-[#EA580C]" /> 24/7 Rider Operations Helpdesk
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17231A] leading-tight tracking-tight">
            We're here to help you 24x7 on <span className="text-[#F97316]">Filcarts Rider App</span>
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto text-xs sm:text-sm font-medium leading-relaxed">
            Get instant support for active deliveries, weekly payouts, account documents, and emergency rider helpline.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => { setShowTicketModal(true); setTicketSubmitted(false); }}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <LifeBuoy size={15} /> Raise Support Ticket
            </button>
            <a
              href="tel:1800999888"
              className="inline-flex items-center gap-2 bg-white hover:bg-orange-50 text-[#17231A] border border-orange-200 font-extrabold text-xs px-4.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <Phone size={15} className="text-[#F97316]" /> 24/7 Emergency: 1800-999-888
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10 flex-1 w-full min-w-0 text-left">
        
        {/* FAQs Section */}
        <section className="space-y-4 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#EA580C] bg-orange-100/80 px-3 py-1 rounded-full border border-orange-200 mb-1.5">
                <Sparkles size={13} className="text-[#EA580C]" /> Frequently Asked Questions
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#17231A] tracking-tight">
                Rider Partner Knowledgebase
              </h2>
            </div>

            <button
              onClick={() => { setShowTicketModal(true); setTicketSubmitted(false); }}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-orange-50 text-[#EA580C] border border-orange-200 font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
            >
              <LifeBuoy size={14} /> Need Personal Help?
            </button>
          </div>

          {/* Category Navigation Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 min-w-0 overflow-hidden shadow-2xs">
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
                        ? "bg-[#F97316] text-white border-[#F97316] shadow-2xs"
                        : "bg-[#FFFCF5] border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-200"
                    }`}
                  >
                    <Icon size={14} className={isActive ? "text-white" : "text-[#F97316]"} />
                    <span>{cat.title}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {faqCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Category Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 min-w-0 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-extrabold shrink-0 shadow-2xs">
                {React.createElement(currentCategoryData.icon, { size: 20 })}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-[#17231A] truncate">{currentCategoryData.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium truncate">{currentCategoryData.desc}</p>
              </div>
            </div>

            <button
              onClick={() => { setShowTicketModal(true); setTicketSubmitted(false); }}
              className="inline-flex items-center gap-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-2xs transition-all cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <LifeBuoy size={14} /> Raise Ticket
            </button>
          </div>

          {/* Accordion Questions */}
          <div className="space-y-3 min-w-0">
            {activeFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-[#F97316] shadow-2xs ring-1 ring-[#F97316]/20 bg-[#FFF7ED]/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left cursor-pointer group gap-3 min-w-0"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? "bg-[#F97316] text-white" : "bg-orange-100 text-[#EA580C]"
                      }`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-[#17231A] group-hover:text-[#F97316] transition-colors leading-snug break-words min-w-0">
                        {faq.q}
                      </span>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "bg-[#F97316] text-white rotate-180" : "bg-slate-100 text-slate-500 group-hover:text-[#17231A]"
                    }`}>
                      <ChevronDown size={14} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-0 min-w-0">
                      <div className="p-3.5 bg-[#FFF7ED]/70 border-l-4 border-[#F97316] rounded-r-xl text-xs text-slate-700 font-medium leading-relaxed space-y-2 break-words">
                        <p className="break-words">{faq.a}</p>
                        <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#EA580C] font-bold">
                          <ShieldCheck size={14} className="shrink-0" />
                          <span>Was this helpful? Contact 24/7 Rider Support for direct resolution.</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Channels Grid */}
        <section className="pt-6 border-t border-slate-200 space-y-4 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#17231A]">Direct Rider Assistance Channels</h3>
              <p className="text-[11px] text-slate-500 font-medium">Connect with our dedicated rider operations team</p>
            </div>
            <span className="text-[10px] font-bold text-[#EA580C] bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-full">24/7 Active Desk</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
            {/* SOS Emergency */}
            <div className="bg-[#18181B] border border-red-900/60 rounded-2xl p-5 text-center space-y-2.5 shadow-md hover:border-red-600 transition-all min-w-0">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 text-red-400 flex items-center justify-center mx-auto border border-red-800/40">
                <ShieldAlert size={20} />
              </div>
              <div className="font-extrabold text-sm text-white truncate">Rider Emergency SOS</div>
              <p className="text-[11px] text-slate-400 font-medium truncate">24/7 Road Accident & Breakdown</p>
              <a
                href="tel:1800999888"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-colors block text-center shadow-xs truncate px-2"
              >
                📞 Call 1800-999-888
              </a>
            </div>

            {/* Rider Live Chat */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 text-center space-y-2.5 shadow-md hover:border-[#F97316]/60 transition-all min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#FFF7ED]/10 text-[#F97316] flex items-center justify-center mx-auto border border-[#F97316]/20">
                <MessageCircle size={20} />
              </div>
              <div className="font-extrabold text-sm text-white truncate">Rider Live Chat</div>
              <p className="text-[11px] text-slate-400 font-medium truncate">Instant Shift & Order AI Agent</p>
              <button
                onClick={() => setShowLiveChatDrawer(true)}
                className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 truncate px-2"
              >
                <MessageCircle size={14} className="shrink-0" /> <span>Chat Now</span>
              </button>
            </div>

            {/* Email Support */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 text-center space-y-2.5 shadow-md hover:border-amber-500/50 transition-all min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#27272A] text-amber-400 flex items-center justify-center mx-auto border border-amber-400/20">
                <Mail size={20} />
              </div>
              <div className="font-extrabold text-sm text-white truncate">Rider Help Email</div>
              <p className="text-[11px] text-slate-400 font-medium truncate">Payout discrepancies & documents</p>
              <a
                href="mailto:rider-support@fillcarts.com"
                className="w-full bg-[#27272A] hover:bg-[#3F3F46] text-[#F4F4F5] border border-[#3F3F46] font-extrabold text-xs py-2.5 rounded-xl transition-colors block text-center shadow-xs truncate px-2"
              >
                ✉️ Email Partner Support
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Raise Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-left">
            <button
              onClick={() => setShowTicketModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X size={18} />
            </button>

            {ticketSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-[#F97316] border border-orange-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-lg font-extrabold text-[#17231A]">Ticket Submitted Successfully!</h3>
                <p className="text-xs text-slate-500">Reference ID: <strong className="text-[#EA580C]">#RDR-{Math.floor(100000 + Math.random() * 900000)}</strong></p>
                <p className="text-xs text-slate-500">Our Rider Desk will inspect your query and update you via SMS within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-[#17231A] flex items-center gap-2">
                    <LifeBuoy size={20} className="text-[#F97316]" /> Raise Rider Ticket
                  </h3>
                  <p className="text-xs text-slate-500">Submit details for swift resolution from Rider Ops.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Issue Category</label>
                    <select
                      value={ticketData.category}
                      onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2.5 text-[#17231A] font-medium focus:outline-none focus:border-[#F97316]"
                    >
                      <option value="payouts">Weekly Payout / Earnings Discrepancy</option>
                      <option value="deliveries">Active Order / Customer Issue</option>
                      <option value="account">Driving License / Bank Document Update</option>
                      <option value="insurance">Insurance Claim / Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Order ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. ORD-984201"
                      value={ticketData.orderId}
                      onChange={(e) => setTicketData({ ...ticketData, orderId: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2.5 text-[#17231A] font-medium focus:outline-none focus:border-[#F97316]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Describe Issue *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe what went wrong or what assistance you need..."
                      value={ticketData.message}
                      onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2.5 text-[#17231A] font-medium focus:outline-none focus:border-[#F97316]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs shadow-2xs cursor-pointer"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Live Chat Drawer */}
      {showLiveChatDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white border-l border-slate-200 max-w-md w-full h-full flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-orange-100 flex items-center justify-between bg-[#FFF7ED]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-bold">
                  <Bike size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#17231A]">Rider Assistant AI</h4>
                  <span className="text-[10px] text-[#EA580C] font-bold block flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" /> 24/7 Active Desk
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowLiveChatDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#FFFCF5]">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl font-medium leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#F97316] text-white rounded-br-none"
                        : "bg-white text-[#17231A] rounded-bl-none border border-slate-200 shadow-2xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#17231A] placeholder:text-slate-400 focus:outline-none focus:border-[#F97316]"
              />
              <button
                type="submit"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white p-2 rounded-xl shadow-2xs cursor-pointer shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rider Footer */}
      <Footer />
    </div>
  );
}
