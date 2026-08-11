import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  ChevronRight, ChevronDown, Package, CreditCard, RotateCcw, UserCog,
  Truck, Store, Bike, Phone, Mail, MessageCircle, Clock, Search, Plus,
  AlertCircle, CheckCircle2, ArrowRight, Sparkles, HelpCircle, X, ShieldAlert,
  LifeBuoy, Send, ShieldCheck, Zap
} from "lucide-react";

// 7 Help Categories
const helpCategories = [
  { key: "orders", icon: Package, title: "Orders", desc: "Placing, tracking & cancelling orders" },
  { key: "payments", icon: CreditCard, title: "Payments & Refunds", desc: "UPI, cards, wallet & refund status" },
  { key: "returns", icon: RotateCcw, title: "Returns", desc: "Return & replacement process" },
  { key: "delivery", icon: Truck, title: "Delivery", desc: "Delivery SLA, slots & rider tracking" },
  { key: "account", icon: UserCog, title: "Account", desc: "Login, addresses & profile settings" },
  { key: "vendor", icon: Store, title: "Vendor Support", desc: "For registered store partners" },
  { key: "rider", icon: Bike, title: "Rider Support", desc: "For delivery partners" },
];

// 3 to 5 Most Common Questions Per Category (Accordion Format)
const faqsByCategory = {
  orders: [
    { q: "How do I track my active order in real time?", a: "Go to 'My Orders' in your profile or click 'Track Order' in Quick Actions. You will see live rider movement on an interactive map with updated delivery ETA." },
    { q: "Can I cancel an order after placing it?", a: "Yes, you can cancel an order free of cost before the local store accepts it. Once accepted, cancellation fees equal to the order amount may apply." },
    { q: "What should I do if my order is delayed?", a: "Delays can occur during heavy rainfall or peak traffic hours. Check your live order map for updated ETA or tap 'Delivery Delay' to speak with support." },
    { q: "Can I change my delivery address after placing an order?", a: "Address changes are allowed within 2 minutes of checkout if the rider has not been assigned. Contact live chat support immediately for address updates." }
  ],
  payments: [
    { q: "What payment methods are accepted on FillCarts?", a: "We accept UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, Net Banking, FillCarts Wallet, and Cash on Delivery (COD)." },
    { q: "How long does a refund take to process?", a: "Refunds for cancelled or returned orders are initiated instantly and credited to your original payment method within 3 to 5 business days." },
    { q: "What should I do if my payment failed but money was deducted?", a: "Bank deductions for failed transactions are auto-refunded by your bank within 24 to 48 hours. You can also check 'Refund Status' in Quick Actions." },
    { q: "Are my card and UPI details secure?", a: "Yes, 100%. All transactions are encrypted via PCI-DSS compliant payment gateways. FillCarts never stores your full card credentials." }
  ],
  returns: [
    { q: "How do I request a return or replacement?", a: "Navigate to 'My Orders', select the delivered order, click 'Return/Replacement', select the reason, and attach a photo if damaged. Pickup is arranged within 24 hours." },
    { q: "Which items are eligible for return?", a: "Packaged grocery, household goods, and personal care items are returnable within 3 days. Perishables (fresh milk, bread, vegetables) can be reported for instant refund if spoiled on delivery." },
    { q: "What if I received a wrong or damaged item?", a: "Tap 'Wrong/Damaged Item' in the Order Help section, upload a quick photo, and our support team will issue an instant replacement or store refund." },
    { q: "How does pickup for returned items work?", a: "A local delivery partner will visit your address to verify and collect the returned item. Ensure original packaging and tags are intact." }
  ],
  delivery: [
    { q: "What are FillCarts daily delivery hours?", a: "Express delivery operates from 6:00 AM to 11:00 PM daily. Select urban zones support 24/7 late-night pharmacy and food delivery." },
    { q: "What is the minimum order value for Free Delivery?", a: "Orders above ₹299 qualify for Free Express Delivery. Orders below ₹299 incur a nominal delivery fee shown clearly at checkout." },
    { q: "My rider is not moving on the map, what do I do?", a: "Riders may stop briefly at traffic signals or store pickups. If stationary for more than 5 minutes, tap 'Delivery Delay' to call your rider directly." },
    { q: "Can I schedule a morning delivery slot?", a: "Yes! Use our Subscription feature to schedule daily morning milk, bakery, and produce drops between 6:30 AM and 8:30 AM." }
  ],
  account: [
    { q: "How do I update my profile name or delivery address?", a: "Go to Profile > Account Settings or Saved Addresses to add, edit, or set default delivery addresses for 1-tap checkout." },
    { q: "I am unable to receive OTP for login, what should I do?", a: "Ensure your phone network is active. If OTP is delayed, wait 30 seconds and click 'Resend OTP' or try logging in via WhatsApp OTP." },
    { q: "How do I delete my FillCarts account and data?", a: "Go to Profile > Account Settings > Privacy & Data, or email privacy@fillcarts.com. Account data will be permanently removed within 14 days." }
  ],
  vendor: [
    { q: "How do I onboard my local store on FillCarts?", a: "Visit the 'Become a Vendor' page, fill in your store details, GST/FSSAI info, and our merchant team will verify your store within 24 hours." },
    { q: "How do I update product stock and prices?", a: "Log into the FillCarts Merchant App or Web Dashboard, select 'Manage Products', and toggle item availability or update prices in real time." },
    { q: "When are vendor payouts settled?", a: "Vendor earnings are settled on a regular weekly schedule directly to your registered bank account net of agreed commissions." },
    { q: "Can I temporarily pause my store when away?", a: "Yes! You can toggle your store status to 'Offline' anytime from the merchant app whenever your shop is closed." }
  ],
  rider: [
    { q: "How do I join FillCarts as a delivery partner?", a: "Visit the 'Become a Rider' page or download the FillCarts Rider App, upload your Driving License and Aadhaar, and get verified." },
    { q: "How do rider payouts work?", a: "Earnings per completed order and weekly bonuses are tracked in your Rider App and deposited directly into your bank account every week." },
    { q: "What if I get into a vehicle breakdown during delivery?", a: "Tap 'Rider Emergency Helpline' in your Rider App. Our fleet operations team will dispatch a backup rider to complete the delivery." },
    { q: "Are delivery riders provided medical insurance?", a: "Yes! All active FillCarts delivery partners receive 100% accident and medical hospitalization insurance coverage from Day 1." }
  ]
};

// 7 Order-related Important Help Items
const orderHelpCards = [
  { id: "track-order", title: "Track Order", desc: "View live rider map & delivery ETA", icon: Truck, color: "text-[#16A34A]", bg: "bg-[#ECFDF3]" },
  { id: "cancel-order", title: "Cancel Order", desc: "Cancel before store acceptance", icon: X, color: "text-rose-600", bg: "bg-rose-50" },
  { id: "delivery-delay", title: "Delivery Delay", desc: "Report delayed rider arrival", icon: Clock, color: "text-[#F59E0B]", bg: "bg-amber-50" },
  { id: "payment-failed", title: "Payment Failed", desc: "Troubleshoot failed transactions", icon: CreditCard, color: "text-[#166534]", bg: "bg-[#ECFDF3]" },
  { id: "refund-status", title: "Refund Status", desc: "Track refund credit to bank", icon: RotateCcw, color: "text-[#16A34A]", bg: "bg-[#ECFDF3]" },
  { id: "damaged-item", title: "Wrong / Damaged Item", desc: "Report missing or spoiled goods", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
  { id: "return-replace", title: "Return / Replacement", desc: "Request 24-hr item pickup", icon: Package, color: "text-[#166534]", bg: "bg-[#ECFDF3]" }
];

export function SupportContent() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Modals & Drawers
  const [selectedOrderHelp, setSelectedOrderHelp] = useState(null);
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
    { sender: "bot", text: "Hello! Welcome to FillCarts Support. How can we help you with your order today?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      let botReply = "Thank you for reaching out. A FillCarts support specialist is reviewing your account details and will connect in 30 seconds.";
      if (userText.toLowerCase().includes("track") || userText.toLowerCase().includes("order")) {
        botReply = "You can track your order live under 'My Orders'. Your rider is currently en-route to your location!";
      } else if (userText.toLowerCase().includes("refund")) {
        botReply = "Refunds are processed within 3-5 business days. You can view refund reference numbers under Quick Actions > Refund Status.";
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

  // Filtered FAQs across search query
  const displayedFaqs = useMemo(() => {
    if (!searchQuery.trim()) {
      return faqsByCategory[activeCategory] || [];
    }

    const q = searchQuery.toLowerCase();
    const results = [];
    Object.keys(faqsByCategory).forEach((catKey) => {
      faqsByCategory[catKey].forEach((faq) => {
        if (faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q)) {
          results.push({ ...faq, catKey });
        }
      });
    });
    return results;
  }, [activeCategory, searchQuery]);

  const ModalIcon = selectedOrderHelp ? selectedOrderHelp.icon : null;

  return (
    <>
      {/* 1. HERO / SEARCH HELP SECTION */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 px-4 sm:px-6 relative text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80 mb-1">
            <HelpCircle size={13} /> 24/7 Customer Help Center
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17231A] leading-tight tracking-tight">
            How can we <span className="text-[#16A34A]">help you today?</span>
          </h1>

          <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm font-medium leading-relaxed">
            Search your order problem, track refunds, manage account settings, or raise a support ticket.
          </p>

          {/* Search Help Input */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search problem (e.g. track order, refund status, damaged item)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FFFCF5] border-2 border-emerald-200 focus:border-[#16A34A] text-xs sm:text-sm font-semibold rounded-2xl pl-11 pr-10 py-3.5 outline-none shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT BODY */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-14 flex-1 w-full text-left">

        {/* 2. QUICK ACTIONS BAR */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80">
              <Zap size={13} className="text-[#16A34A]" /> Quick Actions
            </span>
            <span className="text-xs font-semibold text-slate-400">Instant Shortcuts</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <Link
              to="/profile?tab=orders"
              className="bg-white border border-emerald-100 hover:border-[#16A34A] rounded-2xl p-4 text-center space-y-2 hover:-translate-y-0.5 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <Package size={20} />
              </div>
              <div className="font-extrabold text-xs text-[#17231A]">My Orders</div>
              <div className="text-[10px] text-slate-400 font-semibold">View History</div>
            </Link>

            <button
              onClick={() => setSelectedOrderHelp(orderHelpCards[0])}
              className="bg-white border border-emerald-100 hover:border-[#16A34A] rounded-2xl p-4 text-center space-y-2 hover:-translate-y-0.5 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF3] text-[#166534] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <Truck size={20} />
              </div>
              <div className="font-extrabold text-xs text-[#17231A]">Track Order</div>
              <div className="text-[10px] text-slate-400 font-semibold">Live ETA</div>
            </button>

            <button
              onClick={() => setSelectedOrderHelp(orderHelpCards[4])}
              className="bg-white border border-emerald-100 hover:border-[#16A34A] rounded-2xl p-4 text-center space-y-2 hover:-translate-y-0.5 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <RotateCcw size={20} />
              </div>
              <div className="font-extrabold text-xs text-[#17231A]">Refund Status</div>
              <div className="text-[10px] text-slate-400 font-semibold">Bank Credits</div>
            </button>

            <Link
              to="/profile"
              className="bg-white border border-emerald-100 hover:border-[#16A34A] rounded-2xl p-4 text-center space-y-2 hover:-translate-y-0.5 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <UserCog size={20} />
              </div>
              <div className="font-extrabold text-xs text-[#17231A]">Account Settings</div>
              <div className="text-[10px] text-slate-400 font-semibold">Edit Addresses</div>
            </Link>

            <button
              onClick={() => { setShowTicketModal(true); setTicketSubmitted(false); }}
              className="col-span-2 sm:col-span-1 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-2xl p-4 text-center space-y-2 shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <LifeBuoy size={20} />
              </div>
              <div className="font-extrabold text-xs text-white">Raise Support Ticket</div>
              <div className="text-[10px] text-emerald-100 font-semibold">Priority Help</div>
            </button>
          </div>
        </section>

        {/* 3. ORDER-RELATED IMPORTANT HELP */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-1">
                <Sparkles size={13} /> Order Resolution
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#17231A]">
                Order-related Important Help
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Tap any card for immediate guidance</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {orderHelpCards.map((card) => {
              const CardIcon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedOrderHelp(card)}
                  className="bg-white border border-emerald-100 hover:border-[#16A34A] rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer text-left space-y-2 group"
                >
                  <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center font-bold group-hover:scale-110 transition-transform`}>
                    <CardIcon size={18} />
                  </div>
                  <h3 className="font-extrabold text-xs text-[#17231A] group-hover:text-[#166534] transition-colors">{card.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-snug">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. HELP CATEGORIES & ACCORDION FAQS */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-1">
                <Sparkles size={13} /> Help Categories
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#17231A]">
                Frequently Asked Questions
              </h2>
            </div>
            {searchQuery && (
              <span className="text-xs font-bold text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200">
                Searching for "{searchQuery}" ({displayedFaqs.length} results)
              </span>
            )}
          </div>

          {/* Category Chips Bar */}
          {!searchQuery && (
            <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                {helpCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => { setActiveCategory(cat.key); setOpenFaqIndex(0); }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all border cursor-pointer ${
                        isActive
                          ? "bg-[#16A34A] text-white border-[#16A34A] shadow-xs"
                          : "bg-[#FFFCF5] border-slate-200 text-slate-700 hover:bg-[#ECFDF3] hover:border-emerald-300"
                      }`}
                    >
                      <Icon size={14} className={isActive ? "text-white" : "text-[#16A34A]"} />
                      <span>{cat.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Accordion FAQ Container */}
          <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
            {displayedFaqs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-3">
                <AlertCircle size={32} className="mx-auto text-slate-300" />
                <div>No help articles found matching "{searchQuery}".</div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="bg-[#16A34A] text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              displayedFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="border-b border-slate-100 last:border-b-0 pb-3 pt-1">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#17231A] hover:text-[#16A34A] transition-colors py-2 text-left cursor-pointer"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 transition-transform ${isOpen ? "bg-[#16A34A] text-white rotate-180" : "bg-[#ECFDF3] text-[#166534]"}`}>
                        <ChevronDown size={14} />
                      </div>
                    </button>
                    {isOpen && (
                      <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2 pt-2 border-t border-slate-50">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* 5. CONTACT SUPPORT (CHAT, PHONE, EMAIL) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-1">
                <Sparkles size={13} /> Direct Connect
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#17231A]">
                Contact Support Channels
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">24/7 Customer Care</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Live Chat */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 text-center space-y-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center mx-auto shadow-2xs">
                <MessageCircle size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#17231A]">Live Chat Support</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Connect with our 24/7 AI & live resolution assistant.</p>
              </div>
              <button
                onClick={() => setShowLiveChatDrawer(true)}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle size={15} /> Start Live Chat
              </button>
            </div>

            {/* Phone Support */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 text-center space-y-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF3] text-[#166534] flex items-center justify-center mx-auto shadow-2xs">
                <Phone size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#17231A]">Toll-Free Phone Support</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Call us toll-free for urgent active order issues.</p>
              </div>
              <a
                href="tel:1800123456"
                className="w-full bg-[#FFFCF5] hover:bg-[#ECFDF3] text-[#166534] border border-emerald-200 font-extrabold text-xs py-3 rounded-xl transition-colors block text-center shadow-2xs"
              >
                📞 Call 1800-123-456
              </a>
            </div>

            {/* Email Support */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 text-center space-y-4 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#F59E0B] flex items-center justify-center mx-auto shadow-2xs">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#17231A]">Email Desk</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Send us detailed queries or business inquiries.</p>
              </div>
              <a
                href="mailto:support@fillcarts.com"
                className="w-full bg-[#FFFCF5] hover:bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-xs py-3 rounded-xl transition-colors block text-center shadow-2xs"
              >
                ✉️ support@fillcarts.com
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ORDER HELP GUIDANCE MODAL */}
      {selectedOrderHelp && ModalIcon && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-emerald-100 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl ${selectedOrderHelp.bg} ${selectedOrderHelp.color} flex items-center justify-center font-bold`}>
                  <ModalIcon size={16} />
                </div>
                <h3 className="font-extrabold text-base text-[#17231A]">{selectedOrderHelp.title}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderHelp(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-medium">
              <p className="leading-relaxed">
                {selectedOrderHelp.id === "track-order" && "You can track your active order live on an interactive map under 'My Orders'. Live rider location and updated arrival ETA are refreshed every 10 seconds."}
                {selectedOrderHelp.id === "cancel-order" && "Orders can be cancelled free of cost from your order details screen before the local vendor accepts the items. After store acceptance, cancellation fees apply."}
                {selectedOrderHelp.id === "delivery-delay" && "If your delivery rider is delayed due to weather or traffic, you can view real-time rider GPS telemetry or tap 'Live Chat' to request instant priority dispatch."}
                {selectedOrderHelp.id === "payment-failed" && "If money was debited for a failed transaction, your bank will auto-refund the full amount within 24 to 48 hours. Keep your bank UTR number handy."}
                {selectedOrderHelp.id === "refund-status" && "Refunds are processed within 3-5 business days to your original payment account. You can view ARN reference numbers in your transaction summary."}
                {selectedOrderHelp.id === "damaged-item" && "If an item arrives damaged or missing, tap 'Raise Support Ticket' or upload a photo via Live Chat to receive instant replacement or store credit."}
                {selectedOrderHelp.id === "return-replace" && "Item pickup for returnable goods is scheduled within 24 hours. Ensure original packaging and tags are kept intact for pickup."}
              </p>

              <div className="bg-[#ECFDF3] border border-emerald-200 p-3 rounded-2xl text-[11px] text-[#166534] font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
                <span>FillCarts 100% Satisfaction Guarantee</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrderHelp(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => { setSelectedOrderHelp(null); navigate("/profile?tab=orders"); }}
                className="bg-[#16A34A] text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Go to My Orders
              </button>
            </div>
          </div>
        </div>
      )}

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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4">
          <div className="bg-white border border-emerald-100 rounded-t-3xl sm:rounded-3xl max-w-md w-full h-[520px] shadow-2xl flex flex-col justify-between overflow-hidden text-left">
            
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

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="hover:text-[#16A34A]">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#166534] font-bold">Support & Help Center</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-extrabold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-3 py-1 rounded-full">
            <LifeBuoy size={14} className="text-[#16A34A]" /> 24/7 Resolution Desk
          </div>
        </div>
      </div>

      <SupportContent />

      {/* Footer */}
      <Footer />
    </div>
  );
}
