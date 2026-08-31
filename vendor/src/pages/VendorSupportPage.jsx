import React, { useState } from "react";
import { Link } from "react-router-dom";
import VendorNavbar from "../components/VendorNavbar";
import Footer from "../components/Footer";
import {
  Headphones, PhoneCall, Mail, MessageSquare, HelpCircle,
  FileText, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight,
  PackageCheck, Wallet, Store, Clock, ChevronDown, Send, Sparkles, Smartphone
} from "lucide-react";

const helpCategories = [
  {
    icon: Store,
    title: "Store Registration & Onboarding",
    desc: "Help with store verification, address changes, document submission, and app login credentials."
  },
  {
    icon: PackageCheck,
    title: "Catalog & Product Management",
    desc: "Assistance with adding products, setting MRPs, discounts, stock toggles, and item listing updates."
  },
  {
    icon: Clock,
    title: "Orders & Delivery Pickup",
    desc: "Guidance on order acceptance, preparation timing, and delivery partner pickup coordination."
  },
  {
    icon: Wallet,
    title: "Payouts, Commission & Settlements",
    desc: "Bank account updates, payout cycle status, daily settlement reports, and platform commission queries."
  }
];

const supportFaqs = [
  {
    q: "How can I contact Filcarts Merchant Support?",
    a: "You can call our dedicated merchant helpline at 1800-FILCARTS (9 AM - 9 PM), email merchant-support@filcarts.com, or submit a support ticket right on this page."
  },
  {
    q: "What should I do if my bank payout is delayed?",
    a: "Payouts are transferred automatically on a regular next-day settlement schedule. If a bank holiday occurs or your payout is pending past 24 hours, check your bank details or submit a ticket under 'Payouts & Settlements'."
  },
  {
    q: "How do I update my store address or registered phone number?",
    a: "To update your physical shop location or primary mobile number, please submit a ticket with your new details and business verification document (GST/PAN or Shop License)."
  },
  {
    q: "A delivery partner didn't arrive for pickup. What to do?",
    a: "You can track the assigned delivery partner directly in the Merchant App. If unassigned for over 10 minutes, tap 'Re-assign Partner' or call our immediate order support helpline."
  },
  {
    q: "How do I temporarily pause orders when my store is busy?",
    a: "Open your Filcarts Merchant App and toggle the 'Store Status' button at the top right to 'Offline / Paused'. Switch it back 'Online' whenever you are ready for new orders."
  }
];

export default function VendorSupportPage() {
  const [openFaq, setOpenFaq] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    storeName: "",
    phone: "",
    email: "",
    category: "General Inquiry",
    message: ""
  });
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const validatePhone = (phoneNum) => {
    const cleaned = String(phoneNum || "").replace(/\D/g, "");
    if (!cleaned) {
      return "Mobile number is required";
    }
    if (cleaned.length !== 10) {
      return "Enter a valid 10-digit mobile number";
    }
    if (!/^[6-9]/.test(cleaned)) {
      return "Mobile number must start with 6, 7, 8, or 9";
    }
    return "";
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: val }));
    if (phoneError) {
      setPhoneError(validatePhone(val));
    }
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    const err = validatePhone(formData.phone);
    if (err) {
      setPhoneError(err);
      return;
    }
    setPhoneError("");

    if (!formData.storeName || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = "TKT-" + Math.floor(100000 + Math.random() * 900000);
      setTicketId(generatedId);
      setTicketSubmitted(true);
    }, 900);
  };

  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition";

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 flex flex-col font-sans antialiased">
      {/* Navbar */}
      <VendorNavbar />

      {/* Hero Header Section */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
            <Headphones size={14} className="text-emerald-600" />
            <span>Dedicated Merchant Helpdesk</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Filcarts merchant <span className="text-emerald-600">support & help center</span>
          </h1>

          <p className="text-sm leading-relaxed text-slate-600 max-w-2xl">
            Need help with store registration, app navigation, daily bank payouts, or order management? Our dedicated merchant support team is here to assist you.
          </p>

          {/* Quick Contact Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="tel:1800FILCARTS"
              className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
            >
              <PhoneCall size={16} className="text-emerald-600" />
              <span>Toll Free: 1800-FILCARTS</span>
            </a>
            <a
              href="mailto:merchant-support@filcarts.com"
              className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
            >
              <Mail size={16} className="text-slate-500" />
              <span>merchant-support@filcarts.com</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 flex-1 w-full text-left">
        
        {/* Support Topics Grid */}
        <section className="space-y-6">
          <div className="text-left space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Browse by topic
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Select a category to quickly get support for your query.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((cat, idx) => {
              const IconC = cat.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs hover:border-emerald-300 transition">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <IconC size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{cat.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Support Ticket Form & Cleaned Priority Support Card */}
        <section className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Ticket Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Submit a support ticket
              </h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Fill out the details below. Our merchant executive will contact you within 2 business hours.
              </p>
            </div>

            {ticketSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-semibold text-emerald-900">
                  Support Ticket Created!
                </h3>
                <p className="text-sm text-slate-600">
                  Your reference ID is <strong className="text-slate-900">{ticketId}</strong>. Our executive will call or email you shortly.
                </p>
                <button
                  onClick={() => {
                    setTicketSubmitted(false);
                    setFormData({ storeName: "", phone: "", email: "", category: "General Inquiry", message: "" });
                  }}
                  className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gupta General Store"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400 select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        onBlur={() => setPhoneError(validatePhone(formData.phone))}
                        className={`${inputStyle} pl-11 ${
                          phoneError ? "border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-red-500/20" : ""
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                        ⚠️ {phoneError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="merchant@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Issue Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={inputStyle}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Registration & Onboarding">Registration & Onboarding</option>
                      <option value="Catalog & Products">Catalog & Products</option>
                      <option value="Order & Delivery Issue">Order & Delivery Issue</option>
                      <option value="Payouts & Commission">Payouts & Commission</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Describe Your Issue or Request *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details about your query..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={inputStyle}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-3 rounded-lg transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Submitting Ticket...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Support Ticket</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Clean Bordered Card for In-App Priority Support (Replaces Jarring Black Box) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Smartphone size={20} />
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                  In-App Priority
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Merchant App Priority Support
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Already an onboarded Filcarts merchant? Raise real-time order queries directly inside the Merchant Android App for instant response from nearby operations managers.
              </p>

              <div className="pt-2">
                <a
                  href="/#register"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition shadow-xs"
                >
                  <span>Register Store on Filcarts</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>

        </section>

        {/* FAQs Section */}
        <section className="space-y-6">
          <div className="text-left space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Frequently asked support questions
            </h2>
          </div>

          <div className="space-y-3">
            {supportFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full px-6 py-4 text-left font-semibold text-sm md:text-base text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform ${isOpen ? "rotate-180 text-emerald-600" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
