import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VendorNavbar from "../components/VendorNavbar";
import Footer from "../components/Footer";

export default function VendorTermsPrivacyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Sync tab state with current URL pathname
  const [activeTab, setActiveTab] = useState(() => {
    return location.pathname.includes("privacy") ? "privacy" : "terms";
  });

  useEffect(() => {
    if (location.pathname.includes("privacy")) {
      setActiveTab("privacy");
    } else if (location.pathname.includes("terms")) {
      setActiveTab("terms");
    }
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "terms") {
      navigate("/terms");
    } else {
      navigate("/privacy");
    }
  };

  return (
    <div
      className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans"
      style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}
    >
      {/* Navbar */}
      <VendorNavbar />

      {/* Dark Green Header Strip (Zepto Style) */}
      <div className="bg-[#166534] text-white py-8 sm:py-12 px-4 text-center space-y-4 shadow-md">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight underline underline-offset-8 decoration-emerald-400">
          {activeTab === "terms"
            ? "Filcarts Merchant Terms of Use"
            : "Filcarts Merchant Privacy Policy"}
        </h1>

        {/* Quick Switcher */}
        <div className="pt-2 flex justify-center items-center gap-2">
          <button
            onClick={() => handleTabChange("terms")}
            className={
              activeTab === "terms"
                ? "bg-white/20 text-white font-extrabold text-xs px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-xs cursor-default"
                : "bg-emerald-950/60 hover:bg-emerald-950 text-emerald-100 font-extrabold text-xs px-4 py-1.5 rounded-full transition-all cursor-pointer"
            }
          >
            Terms of Use
          </button>
          <button
            onClick={() => handleTabChange("privacy")}
            className={
              activeTab === "privacy"
                ? "bg-white/20 text-white font-extrabold text-xs px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-xs cursor-default"
                : "bg-emerald-950/60 hover:bg-emerald-950 text-emerald-100 font-extrabold text-xs px-4 py-1.5 rounded-full transition-all cursor-pointer"
            }
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Clean Zepto-Style Document Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-10 space-y-6 flex-1 w-full text-left">
        {/* Meta Version & Last Updated */}
        <div className="space-y-1 text-xs text-slate-500 italic font-semibold border-b border-slate-200/80 pb-4">
          <p>Version 1.0</p>
          <p>Last updated: 24 August 2026</p>
        </div>

        {activeTab === "terms" ? (
          <>
            {/* Legal Electronic Record Statement */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              This document is an electronic record published in accordance with the provisions of the Information Technology Act, 2000 and rules thereunder. This agreement governs the onboarding, store operations, catalog listing, order fulfillment, platform commission, and business relationship between Filcarts Technologies Pvt Ltd ("Filcarts", "We", "Platform") and registered merchant partners ("Merchant", "You", "Store Partner").
            </p>

            {/* Section 1 */}
            <div className="space-y-2 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
                1. Merchant Eligibility & Store Registration
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                To register as a merchant on Filcarts, you must legally own or represent a physical retail store, dark store, or commercial business entity operating within supported delivery zones in India. All details provided during registration (Store Name, Physical Address, GSTIN, PAN, FSSAI License, Bank Details) must be authentic and verifiable.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Filcarts reserves the right to verify submitted business credentials and reject onboarding if documentation is found to be fraudulent, invalid, or incomplete.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-2 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
                2. Store Catalog, Pricing & MRP Compliance
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Merchants are responsible for maintaining accurate product listings, selling prices, MRP, and stock availability via the Filcarts Merchant App. Prices listed on the app must not exceed the Maximum Retail Price (MRP) mandated by manufacturers under the Legal Metrology Act.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Out-of-stock items must be updated immediately in the app to prevent order cancellations and customer dissatisfaction.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-2 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
                3. Order Preparation, Packaging & 15-30 Min Delivery
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Upon receiving an order notification, the store agrees to pack items securely within the target 5-10 minute preparation window. Products must meet fresh quality, safety, and hygiene standards.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Assigned Filcarts delivery partners will collect packed orders directly from your store for fast 15–30 minute doorstep delivery to nearby customers.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-2 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
                4. Platform Commission & Bank Settlement Payouts
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Filcarts charges a transparent platform commission per completed customer order as agreed during onboarding. Applicable statutory taxes (including GST and TCS under CGST Act) will be deducted per regulations.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Accumulated merchant earnings after commission deductions are deposited directly into your verified business bank account according to the standard settlement cycle (daily/weekly).
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-2 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
                5. Cancellations, Quality Refunds & Deductions
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Orders cancelled after store acceptance due to stock unavailability may incur operational penalty fees.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Refunds issued to customers for damaged, expired, missing, or incorrect items packed by the store will be deducted from subsequent merchant settlement payouts upon verification.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-2 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
                6. Code of Conduct & Prohibited Products
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Merchants must treat delivery partners and customers with respect. Selling expired goods, counterfeit items, illegal substances, or unauthorized products is strictly prohibited and leads to immediate store suspension and legal action.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-2 pt-2 pb-6">
              <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
                7. Store Pause, Termination & Governing Law
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Merchants can temporarily pause receiving orders at any time using the toggle in the Merchant App. Either party may terminate the merchant partnership with 7 days prior written notice, subject to settlement of outstanding orders.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                These Merchant Terms of Use shall be governed by the laws of India, with exclusive jurisdiction in the courts of Gurgaon / New Delhi.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Privacy Statement */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Filcarts Technologies Pvt Ltd ("Filcarts", "We", "Our", or "Us") is committed to respecting your privacy and protecting your merchant business data and personal information in compliance with the Digital Personal Data Protection (DPDP) Act, 2023 of India.
            </p>

            {/* Section 1 */}
            <div className="space-y-2 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
                1. Collection of Merchant Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                We collect business and personal information necessary to onboard and operate your store on Filcarts. This includes store name, store category, physical shop address, owner full name, contact phone number, email address, GSTIN, PAN, FSSAI certificates, and bank account details for settlement payouts.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Bank account details are verified and stored using bank-grade encrypted financial systems. Filcarts does not store unencrypted sensitive financial credentials.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-2 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
                2. Use of Location & Store Data
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                We use your store's precise geographic location to display your catalog to nearby customers within your delivery radius and to optimize rider route assignment for fast pickup.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-2 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
                3. Sharing with Logistics & Financial Partners
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Packed order details and store pickup addresses are shared with assigned Filcarts delivery partners solely to enable order collection. Bank details are shared securely with PCI-DSS compliant payout gateways for direct settlements.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                We NEVER sell, rent, or trade merchant contact phone numbers or business information to third-party telemarketers or advertisers.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-2 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
                4. Data Security & Storage Standards
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                We employ industry-standard SSL/TLS encryption for data in transit and AES-256 encryption at rest to safeguard merchant information against unauthorized access, loss, or data breaches.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-2 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
                5. Merchant Data Rights & Controls
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Merchants can review and request updates to store details, contact numbers, or bank account information at any time through Merchant App settings or by contacting merchant support at <strong>merchant-support@filcarts.com</strong>.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-2 pt-2 pb-6">
              <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
                6. Grievance Redressal & Contact Officer
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                In accordance with Information Technology Rules and the DPDP Act 2023, you may write to our Data Protection Officer at <strong>privacy@filcarts.com</strong> for any data protection or privacy concerns regarding your merchant account.
              </p>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

