import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  FileText, Shield, Scale, AlertTriangle, ShoppingBag, Truck, Store,
  RotateCcw, Printer, ChevronRight, HelpCircle, ArrowRight, CheckCircle2, Clock, Mail, Phone
} from "lucide-react";

export default function TermsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("acceptance");
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    { id: "acceptance", label: "1. Acceptance & Eligibility", icon: Scale },
    { id: "accounts", label: "2. User Accounts & Security", icon: FileText },
    { id: "orders-delivery", label: "3. Ordering & Instant Delivery", icon: ShoppingBag },
    { id: "vendor-terms", label: "4. Vendor Marketplace Rules", icon: Store },
    { id: "rider-terms", label: "5. Delivery Partner Terms", icon: Truck },
    { id: "refunds-cancellations", label: "6. Returns & Refund Policy", icon: RotateCcw },
    { id: "intellectual-property", label: "7. Intellectual Property", icon: Shield },
    { id: "liability-disputes", label: "8. Liability & Governing Law", icon: AlertTriangle },
  ];

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <Navbar searchPlaceholder="Search terms & conditions..." onSearchChange={(val) => setSearchQuery(val)} />

      {/* Breadcrumb & Tab Header */}
      <div className="bg-white border-b border-slate-200 sticky top-[69px] z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight size={13} />
            <span className="text-slate-900 font-bold">Terms & Conditions</span>
          </div>

          {/* Page Selector Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full text-xs">
            <button
              onClick={() => navigate("/privacy")}
              className="text-slate-600 font-bold px-3.5 py-1 rounded-full hover:text-slate-900 transition-all"
            >
              Privacy Policy
            </button>
            <button
              className="bg-blue-600 text-white font-extrabold px-3.5 py-1 rounded-full shadow-xs transition-all"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white py-14 px-6 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold mb-4">
            <Scale size={14} className="text-teal-400" /> Platform User Agreement
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            Terms & Conditions
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Please read these Terms of Service carefully before using <strong>FillCarts</strong> platform, mobile app, vendor dashboard, or delivery network.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-teal-400" /> Effective Date: August 7, 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-teal-400" /> Governed by Laws of India
            </span>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-full transition-all"
            >
              <Printer size={15} /> Print Terms
            </button>
            <Link
              to="/support"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-lg shadow-blue-600/30 transition-all"
            >
              <HelpCircle size={15} /> Customer Support
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sticky top-28 shadow-xs">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 px-3">
                Terms Index
              </div>
              <nav className="space-y-1">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-extrabold shadow-2xs"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon size={15} className={isActive ? "text-blue-600" : "text-slate-400"} />
                      <span>{sec.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-4 border-t border-slate-100 px-3">
                <div className="text-xs font-bold text-slate-900 mb-1">Legal Inquiries</div>
                <p className="text-[11px] text-slate-500 mb-3">Questions regarding platform contracts?</p>
                <a
                  href="mailto:legal@fillcarts.com"
                  className="text-xs font-extrabold text-blue-600 hover:underline flex items-center gap-1"
                >
                  legal@fillcarts.com <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>

          {/* Detailed Clauses */}
          <div className="lg:col-span-3 space-y-10">

            {/* Section 1 */}
            <div id="acceptance" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Scale size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  1. Acceptance of Terms & Eligibility
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                By downloading, accessing, browsing, or placing orders on the <strong>FillCarts</strong> website or mobile application, you represent that you are at least 18 years of age and legally competent to enter into a binding contract under the Indian Contract Act, 1872.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                If you are using FillCarts on behalf of a business entity (such as a Kirana store or restaurant vendor), you represent that you have full legal authority to bind that entity to these terms.
              </p>
            </div>

            {/* Section 2 */}
            <div id="accounts" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  2. User Registration & Account Security
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Users must register an account using a valid mobile phone number and OTP verification. You are solely responsible for maintaining the confidentiality of your account credentials and OTP logins.
              </p>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li>You agree to provide accurate, current, and complete information during registration.</li>
                <li>FillCarts reserves the right to suspend or terminate accounts that provide fraudulent or misleading information.</li>
                <li>Each phone number can be linked to only one active Customer Account.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="orders-delivery" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  3. Ordering, Pricing & Express Delivery
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                FillCarts operates as a hyper-local marketplace platform connecting consumers with independent local merchants and delivery partners.
              </p>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50">
                  <strong className="text-slate-900 font-bold block mb-1">Pricing & Taxes:</strong>
                  Product prices are listed directly by participating vendors. Prices include applicable GST unless explicitly stated otherwise. Delivery fees, handling charges, or platform fees are itemized clearly on the checkout page before payment.
                </div>
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50">
                  <strong className="text-slate-900 font-bold block mb-1">Delivery SLA & Delays:</strong>
                  Estimated delivery times (e.g. 15-30 mins) are targets based on distance and traffic. Delivery times may vary during peak hours, bad weather, or high traffic.
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div id="vendor-terms" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Store size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  4. Vendor Partner Marketplace Rules
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Local merchants (vendors) listing products on FillCarts agree to comply with statutory regulations:
              </p>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li>Vendors must maintain valid GSTIN, FSSAI licenses (for food items), and trade permits.</li>
                <li>Vendors guarantee that all sold items are authentic, within expiration dates, and properly packaged.</li>
                <li>Merchant payouts are settled weekly net of agreed platform commission fees.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div id="rider-terms" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Truck size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  5. Delivery Partner / Rider Rules
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Independent delivery partners operating on the FillCarts network are self-employed gig contractors and not direct employees of FillCarts.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Riders must maintain valid motor vehicle licenses, insurance, and follow local traffic regulations while fulfilling delivery orders.
              </p>
            </div>

            {/* Section 6 */}
            <div id="refunds-cancellations" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <RotateCcw size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  6. Order Cancellations & Refund Policy
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50">
                  <strong className="text-slate-900 font-bold block mb-1">Customer Cancellations:</strong>
                  Orders can be cancelled free of cost before the store accepts the order. If cancelled after store acceptance, cancellation fees equal to order value may apply.
                </div>
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50">
                  <strong className="text-slate-900 font-bold block mb-1">Refund Timelines:</strong>
                  Eligible refunds for damaged or missing items are credited to your original payment method within 3–5 business days.
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div id="intellectual-property" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                  <Shield size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  7. Intellectual Property
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                All trademarks, logos, brand names, software code, UI design layouts, and graphics displayed on FillCarts are the exclusive property of FillCarts Technologies Pvt Ltd. Unauthorized copying or redistribution is strictly prohibited.
              </p>
            </div>

            {/* Section 8 */}
            <div id="liability-disputes" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <AlertTriangle size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  8. Limitation of Liability & Jurisdiction
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                FillCarts shall not be liable for indirect, incidental, or consequential damages resulting from the use of third-party vendor products or delivery delays beyond reasonable control.
              </p>
              <div className="p-4 bg-slate-900 text-white rounded-2xl text-xs space-y-2">
                <div><strong className="text-blue-400">Governing Law:</strong> These terms are governed by and construed under the laws of India.</div>
                <div><strong className="text-teal-400">Jurisdiction:</strong> Courts located in New Delhi / Gurgaon, Haryana shall have exclusive jurisdiction over any legal disputes.</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
