import React, { useState } from "react";
import VendorNavbar from "../components/VendorNavbar";
import Footer from "../components/Footer";
import { FileText, ShieldCheck, CheckCircle2, ChevronRight, Lock, Scale, HelpCircle } from "lucide-react";

export default function VendorTermsPrivacyPage() {
  const [activeTab, setActiveTab] = useState("terms");

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#17231A] flex flex-col font-sans antialiased">
      {/* Navbar */}
      <VendorNavbar />

      {/* Hero Banner Header */}
      <section className="relative bg-white border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#ECFDF3] border border-emerald-200 text-[#166534] text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
            <Scale size={14} className="text-[#16A34A]" />
            <span>Merchant Legal Documentation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17231A] leading-tight tracking-tight">
            Terms & Conditions <span className="text-[#16A34A]">&</span> Privacy Policy
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-3xl">
            Everything you need to know about partnering with Filcarts, store operation guidelines, merchant terms, commission structures, and how we protect your business data.
          </p>

          <div className="pt-2 text-xs text-slate-400 font-medium">
            Last updated: August 24, 2026 • Applicable to all registered Filcarts Merchants & Partners
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full text-left">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${
              activeTab === "terms"
                ? "bg-[#16A34A] text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <FileText size={16} />
            <span>Terms & Conditions</span>
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${
              activeTab === "privacy"
                ? "bg-[#16A34A] text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <ShieldCheck size={16} />
            <span>Privacy Policy</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick Jump Sidebar */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs sticky top-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Quick Navigation
              </h3>
              <nav className="space-y-1.5 text-xs sm:text-sm font-medium">
                {activeTab === "terms" ? (
                  <>
                    <a href="#terms-1" className="block text-slate-700 hover:text-[#16A34A] py-1 transition-colors">1. Eligibility & Registration</a>
                    <a href="#terms-2" className="block text-slate-700 hover:text-[#16A34A] py-1 transition-colors">2. Catalog & Pricing Rules</a>
                    <a href="#terms-3" className="block text-slate-700 hover:text-[#16A34A] py-1 transition-colors">3. Order Preparation & Fulfillment</a>
                    <a href="#terms-4" className="block text-slate-700 hover:text-[#16A34A] py-1 transition-colors">4. Commission & Bank Settlements</a>
                    <a href="#terms-5" className="block text-slate-700 hover:text-[#16A34A] py-1 transition-colors">5. Merchant Code of Conduct</a>
                    <a href="#terms-6" className="block text-slate-700 hover:text-[#16A34A] py-1 transition-colors">6. Account Termination & Pause</a>
                  </>
                ) : (
                  <>
                    <a href="#privacy-1" className="block text-slate-700 hover:text-[#16A34A] py-1 transition-colors">1. Merchant Data We Collect</a>
                    <a href="#privacy-2" className="block text-slate-700 hover:text-[#16A34A] py-1 transition-colors">2. How Data Is Used</a>
                    <a href="#privacy-3" className="block text-slate-700 hover:text-[#16A34A] py-1 transition-colors">3. Sharing with Delivery Partners</a>
                    <a href="#privacy-4" className="block text-slate-700 hover:text-[#16A34A] py-1 transition-colors">4. Data Security & Storage</a>
                    <a href="#privacy-5" className="block text-slate-700 hover:text-[#16A34A] py-1 transition-colors">5. Merchant Privacy Rights</a>
                    <a href="#privacy-6" className="block text-slate-700 hover:text-[#16A34A] py-1 transition-colors">6. Legal & Privacy Contacts</a>
                  </>
                )}
              </nav>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="bg-[#ECFDF3] rounded-lg p-3 text-xs text-[#166534] space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <HelpCircle size={14} />
                    Need Legal Support?
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Contact merchant support for agreement queries.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Detailed Content Column */}
          <div className="lg:col-span-9 space-y-8">
            {/* SECTION 1: TERMS & CONDITIONS */}
            <div className={`space-y-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs ${activeTab === "terms" ? "block" : "hidden"}`}>
              <div className="border-b border-slate-200 pb-5">
                <div className="inline-flex items-center gap-2 text-[#16A34A] text-xs font-bold uppercase tracking-wider mb-1">
                  <FileText size={16} />
                  Part 1
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
                  Merchant Terms & Conditions
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  By registering your store on Filcarts, you agree to adhere to these operating guidelines.
                </p>
              </div>

              {/* Terms Sub-sections */}
              <div id="terms-1" className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-extrabold flex items-center justify-center">1</span>
                  Eligibility & Store Registration
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  To register as a merchant on Filcarts, you must own or legally represent a physical store, retail shop, or commercial business entity operating within supported delivery zones. All details provided during registration (Store Name, Address, Owner Contact, GST/PAN) must be authentic and verifiable.
                </p>
              </div>

              <div id="terms-2" className="space-y-2 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-extrabold flex items-center justify-center">2</span>
                  Catalog, Pricing & Stock Availability
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Merchants are responsible for maintaining accurate product listings, selling prices, MRP, and stock availability via the Filcarts Merchant App. Prices listed on the app must not exceed the maximum retail price (MRP) set by manufacturers. Out-of-stock items must be updated immediately to prevent order cancellations.
                </p>
              </div>

              <div id="terms-3" className="space-y-2 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-extrabold flex items-center justify-center">3</span>
                  Order Preparation & Packaging
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Once an order is accepted via the Merchant App, the store must pack items securely and mark the order ready within the estimated preparation timeframe. Products must meet fresh quality, safety, and hygiene standards. Filcarts delivery partners will collect packed orders directly from your store.
                </p>
              </div>

              <div id="terms-4" className="space-y-2 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-extrabold flex items-center justify-center">4</span>
                  Commission & Settlement Payouts
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Filcarts charges a transparent platform commission per completed customer order as agreed during onboarding. Accumulated earnings after commission deduction are deposited directly into your verified business bank account according to the standard settlement cycle (daily/weekly).
                </p>
              </div>

              <div id="terms-5" className="space-y-2 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-extrabold flex items-center justify-center">5</span>
                  Merchant Code of Conduct
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Merchants must treat delivery partners and customers with respect. Selling expired goods, counterfeit items, prohibited substances, or engaging in fraudulent activity will result in immediate store suspension and legal compliance action.
                </p>
              </div>

              <div id="terms-6" className="space-y-2 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-extrabold flex items-center justify-center">6</span>
                  Store Pause & Account Termination
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Merchants may temporarily pause receiving orders at any time through the Merchant App toggle. Either party may terminate the merchant partnership by providing 7 days prior notice, subject to settlement of outstanding orders and payouts.
                </p>
              </div>
            </div>

            {/* SECTION 2: PRIVACY POLICY */}
            <div className={`space-y-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs ${activeTab === "privacy" ? "block" : "hidden"}`}>
              <div className="border-b border-slate-200 pb-5">
                <div className="inline-flex items-center gap-2 text-[#16A34A] text-xs font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck size={16} />
                  Part 2
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
                  Merchant Privacy Policy
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  How Filcarts collects, uses, and safeguards your store information and personal details.
                </p>
              </div>

              {/* Privacy Sub-sections */}
              <div id="privacy-1" className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-extrabold flex items-center justify-center">1</span>
                  Merchant Data We Collect
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We collect information necessary to onboard and operate your store on Filcarts. This includes store name, category, store address, owner full name, phone number, email address, bank account details for payouts, and business verification documents (GSTIN/PAN).
                </p>
              </div>

              <div id="privacy-2" className="space-y-2 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-extrabold flex items-center justify-center">2</span>
                  How We Use Merchant Data
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your data is used exclusively for: display of your store catalog to nearby customers, processing order notifications, facilitating delivery pickup, transferring bank settlements, sending critical app updates, and maintaining legal compliance.
                </p>
              </div>

              <div id="privacy-3" className="space-y-2 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-extrabold flex items-center justify-center">3</span>
                  Sharing with Delivery & Logistics Partners
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Store location and packed order details are shared with assigned Filcarts delivery partners solely to enable order pickup and customer delivery. We do not sell or monetize merchant contact details to third-party advertisers.
                </p>
              </div>

              <div id="privacy-4" className="space-y-2 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-extrabold flex items-center justify-center">4</span>
                  Data Protection & Storage Security
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We implement industry-standard encryption protocols, secure servers, and access controls to safeguard your business credentials and payout information against unauthorized access or breaches.
                </p>
              </div>

              <div id="privacy-5" className="space-y-2 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-extrabold flex items-center justify-center">5</span>
                  Merchant Data Rights & Controls
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Merchants can request updates to store details, bank information, or account credentials at any time via the Merchant App support or by contacting our onboarding team.
                </p>
              </div>

              <div id="privacy-6" className="space-y-2 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-extrabold flex items-center justify-center">6</span>
                  Privacy Inquiries & Support
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  If you have questions regarding data privacy or merchant compliance, please reach out to our team at support@filcarts.com or through the Filcarts Merchant App help section.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
