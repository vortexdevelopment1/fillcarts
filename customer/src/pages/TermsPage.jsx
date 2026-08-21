import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FileText, Shield, Scale, AlertTriangle, ShoppingBag, Truck, Store,
  RotateCcw, Printer, ChevronRight, HelpCircle, ArrowRight, CheckCircle2, Clock, Mail, Phone, Sparkles
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
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Shared Common Navbar */}
      <Navbar searchPlaceholder="Search terms & conditions..." onSearchChange={(val) => setSearchQuery(val)} />

      {/* Navigation Header */}
      <div className="bg-white border-b border-slate-100 sticky top-[69px] z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center justify-end">

          {/* Page Selector Tabs */}
          <div className="flex items-center gap-2 bg-[#ECFDF3] p-1 rounded-full text-xs border border-emerald-200">
            <button
              onClick={() => navigate("/privacy")}
              className="text-[#166534] font-extrabold px-3.5 py-1 rounded-full hover:bg-white/60 transition-all cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              className="bg-[#16A34A] text-white font-extrabold px-3.5 py-1 rounded-full shadow-xs transition-all cursor-pointer"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner in Green Theme */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 px-4 sm:px-6 relative text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80 mb-1">
            <Scale size={13} /> Platform User Agreement
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17231A] leading-tight tracking-tight">
            Terms & <span className="text-[#16A34A]">Conditions</span>
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto text-xs sm:text-sm font-medium leading-relaxed">
            Please read these Terms of Service carefully before using <strong>FillCarts</strong> platform, mobile app, vendor dashboard, or delivery network.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#16A34A]" /> Effective Date: August 7, 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#16A34A]" /> Governed by Laws of India
            </span>
          </div>

          {/* Action Bar */}
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#FFFCF5] hover:bg-[#ECFDF3] text-[#166534] border border-emerald-200 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <Printer size={15} /> Print Terms
            </button>
            <Link
              to="/support"
              className="flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <HelpCircle size={15} /> Customer Support
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full text-left">
        <div className="grid lg:grid-cols-4 gap-8 items-start">

          {/* Sticky Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-emerald-100 rounded-3xl p-4 sticky top-28 shadow-xs space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80">
                <Sparkles size={13} /> Terms Index
              </span>

              <nav className="space-y-1">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#16A34A] text-white shadow-xs"
                          : "text-slate-700 hover:bg-[#ECFDF3] hover:text-[#166534]"
                      }`}
                    >
                      <Icon size={15} className={isActive ? "text-white" : "text-[#16A34A]"} />
                      <span className="line-clamp-1">{sec.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-100 px-2 space-y-1">
                <div className="text-xs font-extrabold text-[#17231A]">Legal Inquiries</div>
                <p className="text-[11px] text-slate-500 font-medium">Questions regarding platform contracts?</p>
                <a
                  href="mailto:legal@fillcarts.com"
                  className="text-xs font-extrabold text-[#166534] hover:underline flex items-center gap-1 pt-1"
                >
                  legal@fillcarts.com <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>

          {/* Detailed Clauses List */}
          <div className="lg:col-span-3 space-y-8">

            {/* Section 1 */}
            <div id="acceptance" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold shrink-0">
                  <Scale size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  1. Acceptance of Terms & Eligibility
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                By downloading, accessing, browsing, or placing orders on the <strong>FillCarts</strong> website or mobile application, you represent that you are at least 18 years of age and legally competent to enter into a binding contract under the Indian Contract Act, 1872.
              </p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                If you are using FillCarts on behalf of a business entity (such as a Kirana store or restaurant vendor), you represent that you have full legal authority to bind that entity to these terms.
              </p>
            </div>

            {/* Section 2 */}
            <div id="accounts" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF3] text-[#166534] flex items-center justify-center font-bold shrink-0">
                  <FileText size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  2. User Registration & Account Security
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Users must register an account using a valid mobile phone number and OTP verification. You are solely responsible for maintaining the confidentiality of your account credentials and OTP logins.
              </p>
              <ul className="text-xs text-slate-600 font-semibold space-y-2 list-disc list-inside bg-[#FFFCF5] p-4 rounded-2xl border border-slate-100">
                <li>You agree to provide accurate, current, and complete information during registration.</li>
                <li>FillCarts reserves the right to suspend or terminate accounts that provide fraudulent or misleading information.</li>
                <li>Each phone number can be linked to only one active Customer Account.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="orders-delivery" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold shrink-0">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  3. Ordering, Pricing & Express Delivery
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                FillCarts operates as a hyper-local marketplace platform connecting consumers with independent local merchants and delivery partners.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-4 border border-emerald-100 rounded-2xl bg-[#FFFCF5]">
                  <strong className="text-[#166534] font-extrabold block mb-1">Pricing & Taxes:</strong>
                  Product prices are listed directly by participating vendors. Prices include applicable GST unless explicitly stated otherwise. Delivery fees, handling charges, or platform fees are itemized clearly on the checkout page before payment.
                </div>
                <div className="p-4 border border-emerald-100 rounded-2xl bg-[#FFFCF5]">
                  <strong className="text-[#166534] font-extrabold block mb-1">Delivery SLA & Delays:</strong>
                  Estimated delivery times (e.g. 15-30 mins) are targets based on distance and traffic. Delivery times may vary during peak hours, bad weather, or high traffic.
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div id="vendor-terms" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold shrink-0">
                  <Store size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  4. Vendor Partner Marketplace Rules
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Local merchants (vendors) listing products on FillCarts agree to comply with statutory regulations:
              </p>
              <ul className="text-xs text-slate-600 font-semibold space-y-2 list-disc list-inside bg-[#FFFCF5] p-4 rounded-2xl border border-slate-100">
                <li>Vendors must maintain valid GSTIN, FSSAI licenses (for food items), and trade permits.</li>
                <li>Vendors guarantee that all sold items are authentic, within expiration dates, and properly packaged.</li>
                <li>Merchant payouts are settled weekly net of agreed platform commission fees.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div id="rider-terms" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold shrink-0">
                  <Truck size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  5. Delivery Partner / Rider Rules
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Independent delivery partners operating on the FillCarts network are self-employed gig contractors and not direct employees of FillCarts.
              </p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Riders must maintain valid motor vehicle licenses, insurance, and follow local traffic regulations while fulfilling delivery orders.
              </p>
            </div>

            {/* Section 6 */}
            <div id="refunds-cancellations" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF3] text-[#166534] flex items-center justify-center font-bold shrink-0">
                  <RotateCcw size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  6. Order Cancellations & Refund Policy
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 border border-emerald-100 rounded-2xl bg-[#FFFCF5]">
                  <strong className="text-[#166534] font-extrabold block mb-1">Customer Cancellations:</strong>
                  Orders can be cancelled free of cost before the store accepts the order. If cancelled after store acceptance, cancellation fees equal to order value may apply.
                </div>
                <div className="p-4 border border-emerald-100 rounded-2xl bg-[#FFFCF5]">
                  <strong className="text-[#166534] font-extrabold block mb-1">Refund Timelines:</strong>
                  Eligible refunds for damaged or missing items are credited to your original payment method within 3–5 business days.
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div id="intellectual-property" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold shrink-0">
                  <Shield size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  7. Intellectual Property
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                All trademarks, logos, brand names, software code, UI design layouts, and graphics displayed on FillCarts are the exclusive property of FillCarts Technologies Pvt Ltd. Unauthorized copying or redistribution is strictly prohibited.
              </p>
            </div>

            {/* Section 8 */}
            <div id="liability-disputes" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF3] text-[#166534] flex items-center justify-center font-bold shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  8. Limitation of Liability & Jurisdiction
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                FillCarts shall not be liable for indirect, incidental, or consequential damages resulting from the use of third-party vendor products or delivery delays beyond reasonable control.
              </p>
              <div className="p-5 bg-[#166534] text-white rounded-2xl text-xs space-y-2 shadow-xs">
                <div><strong className="text-amber-300">Governing Law:</strong> These terms are governed by and construed under the laws of India.</div>
                <div><strong className="text-emerald-200">Jurisdiction:</strong> Courts located in New Delhi / Gurgaon, Haryana shall have exclusive jurisdiction over any legal disputes.</div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
