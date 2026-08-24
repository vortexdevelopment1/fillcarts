import React, { useState } from "react";
import { Link } from "react-router-dom";
import VendorNavbar from "../components/VendorNavbar";
import Footer from "../components/Footer";
import {
  Headphones, PhoneCall, Mail, MessageSquare, HelpCircle,
  FileText, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight,
  PackageCheck, Wallet, Store, Clock, ChevronDown, Send, Sparkles
} from "lucide-react";

const helpCategories = [
  {
    icon: Store,
    title: "Store Registration & Onboarding",
    desc: "Assistance with store verification, document submission, and initial app login.",
  },
  {
    icon: PackageCheck,
    title: "Catalog & Product Management",
    desc: "Help with adding items, setting MRPs, stock toggles, and catalog updates.",
  },
  {
    icon: Clock,
    title: "Orders & Delivery Pickup",
    desc: "Order acceptance issues, preparation timing, and delivery partner pickup guidance.",
  },
  {
    icon: Wallet,
    title: "Payouts, Commission & Earnings",
    desc: "Bank account updates, payout status, daily settlements, and commission queries.",
  },
];

const supportFaqs = [
  {
    q: "How can I contact Filcarts Merchant Support?",
    a: "You can reach us by calling our toll-free merchant helpline at 1800-FILCARTS (9 AM - 9 PM), emailing merchant-support@filcarts.com, or submitting a support ticket on this page or through the Filcarts Merchant App.",
  },
  {
    q: "What should I do if my payout is delayed?",
    a: "Payouts are processed automatically according to your settlement cycle (daily/weekly). If a bank holiday occurs or your payout is delayed past 24 hours, check your registered bank details in the Merchant App or submit a ticket under 'Payouts & Settlements'.",
  },
  {
    q: "How do I update my store address or phone number?",
    a: "To request a store address or primary mobile number change, please submit a ticket with your new details and business verification document (GST/PAN or Shop License).",
  },
  {
    q: "A delivery partner didn't arrive for pickup. What to do?",
    a: "You can track the assigned delivery partner directly in the Merchant App or click 'Call Delivery Partner'. If unassigned for over 15 minutes, tap 'Re-assign Partner' or call our immediate order support helpline.",
  },
  {
    q: "How do I temporarily pause orders when my store is busy?",
    a: "Open your Filcarts Merchant App and toggle the 'Store Status' button at the top right to 'Offline / Paused'. Turn it back 'Online' whenever you are ready to receive new orders.",
  },
];

export default function VendorSupportPage() {
  const [openFaq, setOpenFaq] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    storeName: "",
    phone: "",
    email: "",
    category: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!formData.storeName || !formData.phone || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = "TKT-" + Math.floor(100000 + Math.random() * 900000);
      setTicketId(generatedId);
      setTicketSubmitted(true);
    }, 900);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#17231A] flex flex-col font-sans antialiased">
      {/* Navbar */}
      <VendorNavbar />

      {/* Hero Section */}
      <section className="relative bg-white border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#ECFDF3] border border-emerald-200 text-[#166534] text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
            <Headphones size={14} className="text-[#16A34A]" />
            <span>Dedicated Merchant Helpdesk</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17231A] leading-tight tracking-tight">
            Filcarts Merchant <span className="text-[#16A34A]">Support & Help Center</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-3xl">
            Have a question about onboarding, app features, daily payouts, or order management? Our dedicated merchant support team is available to assist you.
          </p>

          {/* Quick Contact Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="tel:1800FILCARTS"
              className="bg-[#ECFDF3] hover:bg-emerald-100 border border-emerald-200 text-[#166534] px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
            >
              <PhoneCall size={16} className="text-[#16A34A]" />
              <span>Toll Free: 1800-FILCARTS</span>
            </a>
            <a
              href="mailto:merchant-support@filcarts.com"
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Mail size={16} className="text-slate-500" />
              <span>merchant-support@filcarts.com</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 flex-1 w-full text-left">
        {/* Support Channels Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:border-emerald-300 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold">
              <PhoneCall size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Phone Support</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Speak directly with our merchant onboarding and operations helpline.
            </p>
            <div className="pt-1 text-xs font-bold text-[#16A34A]">
              1800-FILCARTS (9 AM - 9 PM)
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:border-emerald-300 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold">
              <Mail size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Email Assistance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Send detailed inquiries, bank updates, or document verification requests.
            </p>
            <div className="pt-1 text-xs font-bold text-[#16A34A]">
              merchant-support@filcarts.com
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:border-emerald-300 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Merchant App Chat</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Live in-app chat support available on the Filcarts Merchant Android app.
            </p>
            <div className="pt-1 text-xs font-bold text-[#16A34A]">
              In-App Support Ticket
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:border-emerald-300 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Onboarding Helpdesk</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              New store registration assistance and store activation status check.
            </p>
            <div className="pt-1 text-xs font-bold text-[#16A34A]">
              Instant Verification
            </div>
          </div>
        </section>

        {/* Issue Categories Overview */}
        <section className="space-y-6">
          <div className="text-left space-y-1">
            <span className="text-xs font-bold text-[#166534] bg-[#ECFDF3] px-2.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
              Help Topics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
              Browse By Topic
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((cat, idx) => {
              const IconC = cat.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <IconC size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{cat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Support Ticket Submission Form */}
        <section className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold text-[#166534] bg-[#ECFDF3] px-2.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                Support Ticket
              </span>
              <h2 className="text-2xl font-extrabold text-[#17231A] mt-2">
                Submit a Support Request
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill out the form below and our merchant support team will contact you within 2 business hours.
              </p>
            </div>

            {ticketSubmitted ? (
              <div className="bg-[#ECFDF3] border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#16A34A] text-white flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#166534]">
                  Support Ticket Created Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Your ticket reference number is <strong className="text-slate-900">{ticketId}</strong>. Our support agent will call or email you shortly.
                </p>
                <button
                  onClick={() => {
                    setTicketSubmitted(false);
                    setFormData({ storeName: "", phone: "", email: "", category: "General Inquiry", message: "" });
                  }}
                  className="mt-2 bg-[#16A34A] hover:bg-[#166534] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gupta General Store"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#16A34A] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#16A34A] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="merchant@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#16A34A] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Issue Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#16A34A] focus:bg-white"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Registration & Onboarding">Registration & Onboarding</option>
                      <option value="Catalog & Products">Catalog & Products</option>
                      <option value="Order & Delivery Issue">Order & Delivery Issue</option>
                      <option value="Payouts & Commission">Payouts & Commission</option>
                      <option value="Technical App Support">Technical App Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Describe Your Issue or Request *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details about your query..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#16A34A] focus:bg-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#16A34A] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm py-3 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Submitting Ticket...</span>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Support Ticket</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-bold">Merchant App Priority Support</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Already a registered Filcarts merchant? You can raise real-time order tickets directly inside the Merchant Android App for instant response from nearby logistics managers.
              </p>
              <div className="pt-2">
                <a
                  href="/#register"
                  className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                >
                  <span>Register Store on Filcarts</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Support FAQs Section */}
        <section className="space-y-6">
          <div className="text-left space-y-1">
            <span className="text-xs font-bold text-[#166534] bg-[#ECFDF3] px-2.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
              Frequently Asked Support Questions
            </h2>
          </div>

          <div className="space-y-3">
            {supportFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full px-6 py-4 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform ${isOpen ? "rotate-180 text-[#16A34A]" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
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
