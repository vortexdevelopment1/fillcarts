import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Navbar */}
      <Navbar searchPlaceholder="Search privacy policy..." />

      {/* Dark Green Header Strip (Zepto Style) */}
      <div className="bg-[#166534] text-white py-8 sm:py-12 px-4 text-center space-y-4 shadow-md">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight underline underline-offset-8 decoration-emerald-400">
          FillCarts Privacy Policy
        </h1>

        {/* Quick Switcher */}
        <div className="pt-2 flex justify-center items-center gap-2">
          <button
            onClick={() => navigate("/terms")}
            className="bg-emerald-950/60 hover:bg-emerald-950 text-emerald-100 font-extrabold text-xs px-4 py-1.5 rounded-full transition-all cursor-pointer"
          >
            Terms of Use
          </button>
          <button
            className="bg-white/20 text-white font-extrabold text-xs px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-xs cursor-default"
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
          <p>Last updated: 20 August 2026</p>
        </div>

        {/* Privacy Statement */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          FillCarts Technologies Pvt Ltd ("FillCarts", "We", "Our", or "Us") is committed to respecting your privacy and protecting your personal data in compliance with the Digital Personal Data Protection (DPDP) Act, 2023 of India.
        </p>

        {/* Section 1 */}
        <div className="space-y-2 pt-2">
          <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
            1. Collection of Customer Information
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            We collect personal information necessary to deliver your orders, including your name, mobile phone number, login OTP, saved delivery addresses, pincodes, cart items, and order history.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Payment transactions are processed via PCI-DSS compliant payment gateways. FillCarts does not store full credit/debit card numbers or net banking credentials.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-2 pt-2">
          <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
            2. Use of Location Data
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            We collect your device location during active app usage to auto-detect nearby stores in your sector, calculate delivery distance, and estimate accurate 15-30 minute delivery times.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-2 pt-2">
          <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
            3. How We Process & Use Your Data
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Your data is used solely for order processing, sending order updates and invoices, preventing payment fraud, and resolving customer support queries. We NEVER sell your personal information to third-party advertisers.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-2 pt-2">
          <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
            4. Data Security & Storage Standards
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            We employ industry-standard SSL/TLS encryption for data in transit and secure cloud storage with AES-256 encryption at rest to safeguard your personal information against unauthorized access.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-2 pt-2">
          <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
            5. Customer Privacy Rights & Account Deletion
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            You can request complete account deletion anytime through Profile Settings &gt; Account Privacy, or by contacting our privacy desk at <strong>privacy@fillcarts.com</strong>. Personal records are permanently removed within 14 days.
          </p>
        </div>

        {/* Section 6 */}
        <div className="space-y-2 pt-2 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-[#17231A]">
            6. Grievance Redressal & Contact Officer
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            In accordance with Information Technology Rules and the DPDP Act 2023, you may write to our Data Protection Officer at <strong>privacy@fillcarts.com</strong> for any data protection or privacy concerns.
          </p>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
