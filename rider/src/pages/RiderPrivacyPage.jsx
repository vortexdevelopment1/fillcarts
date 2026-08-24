import React from "react";
import { Link, useNavigate } from "react-router-dom";
import RiderNavbar from "../components/RiderNavbar";
import Footer from "../components/Footer";

export default function RiderPrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#09090B] min-h-screen text-[#F4F4F5] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Rider Navbar */}
      <RiderNavbar />

      {/* Dark Orange Header Strip (Zepto Style matching Rider App Theme) */}
      <div className="bg-[#18181B] border-b border-[#27272A] text-white py-8 sm:py-12 px-4 text-center space-y-4 shadow-md">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight underline underline-offset-8 decoration-[#F97316]">
          Filcarts Delivery Partner Privacy Policy
        </h1>

        {/* Quick Switcher */}
        <div className="pt-2 flex justify-center items-center gap-2">
          <button
            onClick={() => navigate("/terms")}
            className="bg-[#27272A] hover:bg-[#3F3F46] text-[#D4D4D8] font-extrabold text-xs px-4 py-1.5 rounded-full transition-all cursor-pointer"
          >
            Terms of Use
          </button>
          <button
            className="bg-[#F97316] text-white font-extrabold text-xs px-4 py-1.5 rounded-full shadow-xs cursor-default"
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Clean Zepto-Style Document Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-10 space-y-6 flex-1 w-full text-left">
        
        {/* Meta Version & Last Updated */}
        <div className="space-y-1 text-xs text-[#A1A1AA] italic font-semibold border-b border-[#27272A] pb-4">
          <p>Version 1.0</p>
          <p>Last updated: 20 August 2026</p>
        </div>

        {/* Privacy Statement */}
        <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed font-medium">
          Filcarts Technologies Pvt Ltd ("Filcarts", "We", "Our", or "Us") respects the privacy of our delivery partners and is committed to protecting your personal data in accordance with the Digital Personal Data Protection (DPDP) Act, 2023 of India.
        </p>

        {/* Section 1 */}
        <div className="space-y-2 pt-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-[#F97316]">1.</span> Information We Collect From Delivery Partners
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-medium">
            To register and activate your rider profile, we collect identity verification documents including driving license, Aadhaar card, PAN card, vehicle registration numbers, and bank account payout details.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-2 pt-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-[#F97316]">2.</span> Foreground & Background GPS Location Tracking
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-medium">
            While you are on active delivery duty (logged online in the Rider App), our application collects real-time GPS location data in the foreground and background to assign nearby store orders, calculate accurate delivery trip distances, and show live order tracking to customers.
          </p>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-medium">
            Location tracking automatically stops when you switch your app status to Offline.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-2 pt-2">
          <h2 className="text-base sm:text-lg font-bold text-[#F97316]">
            <span className="text-[#F97316]">3.</span> How Your Information Is Used
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-medium">
            Rider data is used strictly for calculating weekly payout earnings, dispatching nearby orders, providing 24/7 rider emergency support, and ensuring medical insurance coverage during active delivery shifts.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-2 pt-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-[#F97316]">4.</span> Data Security & Protection
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-medium">
            We use SSL/TLS encryption for data transmission and AES-256 encrypted cloud servers at rest. Rider contact phone numbers are masked when communicating with customers for order directions.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-2 pt-2 pb-6">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-[#F97316]">5.</span> Contact Partner Desk
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-medium">
            For queries regarding rider data privacy or account deactivation, write to our Data Protection Desk at <strong>rider-privacy@fillcarts.com</strong>.
          </p>
        </div>

      </main>

      {/* Rider Footer */}
      <Footer />
    </div>
  );
}
