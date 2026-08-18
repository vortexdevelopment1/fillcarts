import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Shield, FileText, Lock, Eye, MapPin, Smartphone, UserCheck,
  HelpCircle, Printer, ChevronRight, Search, CheckCircle2, Clock, Mail, Phone,
  AlertCircle, ArrowRight, Sparkles
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    { id: "overview", label: "1. Overview & Scope", icon: Eye },
    { id: "data-collection", label: "2. Information We Collect", icon: Smartphone },
    { id: "location-data", label: "3. Location & GPS Usage", icon: MapPin },
    { id: "use-of-info", label: "4. How We Use Data", icon: UserCheck },
    { id: "data-sharing", label: "5. Information Sharing", icon: Shield },
    { id: "security", label: "6. Security & Storage", icon: Lock },
    { id: "user-rights", label: "7. Your Rights & Choice", icon: FileText },
    { id: "contact", label: "8. Contact Privacy Team", icon: Mail },
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
      <Navbar searchPlaceholder="Search privacy policies..." onSearchChange={(val) => setSearchQuery(val)} />

      {/* Navigation Header */}
      <div className="bg-white border-b border-slate-100 sticky top-[69px] z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center justify-end">

          {/* Page Selector Tabs */}
          <div className="flex items-center gap-2 bg-[#ECFDF3] p-1 rounded-full text-xs border border-emerald-200">
            <button
              className="bg-[#16A34A] text-white font-extrabold px-3.5 py-1 rounded-full shadow-xs transition-all cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/terms")}
              className="text-[#166534] font-extrabold px-3.5 py-1 rounded-full hover:bg-white/60 transition-all cursor-pointer"
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
            <Shield size={13} /> Transparent & Secure Data Handling
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17231A] leading-tight tracking-tight">
            Privacy <span className="text-[#16A34A]">Policy</span>
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto text-xs sm:text-sm font-medium leading-relaxed">
            At <strong>FillCarts</strong>, we are committed to protecting the privacy of our customers, registered local vendors, and delivery partners. Learn how we collect, safeguard, and manage your personal data.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#16A34A]" /> Last Updated: August 7, 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#16A34A]" /> Compliant with Indian DPDP Act 2023
            </span>
          </div>

          {/* Action Bar */}
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#FFFCF5] hover:bg-[#ECFDF3] text-[#166534] border border-emerald-200 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <Printer size={15} /> Print Policy
            </button>
            <Link
              to="/support"
              className="flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <HelpCircle size={15} /> Contact Privacy Desk
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
                <Sparkles size={13} /> Policy Contents
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
                <div className="text-xs font-extrabold text-[#17231A]">Need Clarification?</div>
                <p className="text-[11px] text-slate-500 font-medium">Our Data Officer responds within 24 hours.</p>
                <a
                  href="mailto:privacy@fillcarts.com"
                  className="text-xs font-extrabold text-[#166534] hover:underline flex items-center gap-1 pt-1"
                >
                  privacy@fillcarts.com <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>

          {/* Detailed Policy Text Container */}
          <div className="lg:col-span-3 space-y-8">

            {/* Section 1: Overview */}
            <div id="overview" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold shrink-0">
                  <Eye size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  1. Overview & Scope
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Welcome to <strong>FillCarts</strong> ("we", "our", or "us"). This Privacy Policy applies to all services offered through our website, mobile application, customer interface, vendor dashboard, and delivery partner application.
              </p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                By accessing or using our hyper-local marketplace platform, you agree to the collection, processing, and storage of your information as described in this policy. If you do not agree, please discontinue using FillCarts services.
              </p>

              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
                <AlertCircle size={18} className="text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block mb-0.5">Three-Way Ecosystem Protection</span>
                  FillCarts connects End Customers, Local Kirana Stores/Restaurants, and Independent Delivery Partners. Data shared between parties is strictly restricted to order fulfillment and real-time navigation.
                </div>
              </div>
            </div>

            {/* Section 2: Data We Collect */}
            <div id="data-collection" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF3] text-[#166534] flex items-center justify-center font-bold shrink-0">
                  <Smartphone size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  2. Information We Collect
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Depending on how you interact with FillCarts (as a customer, vendor, or rider), we collect different types of personal data:
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-[#FFFCF5] border border-emerald-100 rounded-2xl p-5 space-y-2">
                  <h3 className="font-extrabold text-xs text-[#16A34A] uppercase tracking-wider">For Customers</h3>
                  <ul className="text-xs text-slate-600 font-medium space-y-2 list-disc list-inside">
                    <li>Full Name, Mobile Number, Email Address</li>
                    <li>Delivery Addresses & Pincodes</li>
                    <li>Order History, Cart Items & Favorites</li>
                    <li>Payment tokens (processed securely via PCI-DSS partners)</li>
                  </ul>
                </div>

                <div className="bg-[#FFFCF5] border border-emerald-100 rounded-2xl p-5 space-y-2">
                  <h3 className="font-extrabold text-xs text-[#166534] uppercase tracking-wider">For Vendors</h3>
                  <ul className="text-xs text-slate-600 font-medium space-y-2 list-disc list-inside">
                    <li>Store Name, GSTIN, FSSAI Registration</li>
                    <li>Store Owner Identity & Bank Account details</li>
                    <li>Product Catalog, Inventory Prices</li>
                    <li>Store Operating Hours & Dispatch Address</li>
                  </ul>
                </div>

                <div className="bg-[#FFFCF5] border border-amber-200/80 bg-amber-50/40 rounded-2xl p-5 space-y-2">
                  <h3 className="font-extrabold text-xs text-amber-800 uppercase tracking-wider">For Delivery Partners</h3>
                  <ul className="text-xs text-slate-600 font-medium space-y-2 list-disc list-inside">
                    <li>Driving License, Aadhaar/PAN Verification</li>
                    <li>Vehicle Registration details</li>
                    <li>Live GPS Coordinates during active shifts</li>
                    <li>Weekly Payout Account details</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: Location & GPS Usage */}
            <div id="location-data" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold shrink-0">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  3. Precise Location & GPS Tracking
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Because FillCarts is built for hyper-local quick deliveries (15–30 minutes), location data is central to our platform:
              </p>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3 p-3 bg-[#FFFCF5] border border-slate-100 rounded-2xl">
                  <CheckCircle2 size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#17231A] block font-extrabold">Customer Location:</strong>
                    We collect your location to auto-detect nearby kirana stores, verify delivery availability in your sector, and estimate exact delivery times.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#FFFCF5] border border-slate-100 rounded-2xl">
                  <CheckCircle2 size={16} className="text-[#166534] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#17231A] block font-extrabold">Delivery Partner Background Location:</strong>
                    For active delivery partners, our Rider App collects continuous GPS location data in the foreground and background while on shift to enable live map tracking for customers and optimize order dispatch algorithms.
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: How We Use Information */}
            <div id="use-of-info" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold shrink-0">
                  <UserCheck size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  4. How We Use Your Information
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                We use collected information solely for legitimate operational and platform enhancement purposes:
              </p>
              <ul className="text-xs text-slate-600 space-y-2.5 list-disc list-inside font-semibold bg-[#FFFCF5] p-4 rounded-2xl border border-slate-100">
                <li>Processing, routing, and fulfilling your orders with designated local vendors.</li>
                <li>Facilitating communication between customers and delivery riders regarding order delivery status or address directions.</li>
                <li>Preventing payment fraud, fake accounts, and unauthorized access to your account.</li>
                <li>Sending transactional updates, OTPs, order invoices, and promotional offers (only if opted in).</li>
                <li>Improving our recommendation engines and optimizing delivery routes in your city.</li>
              </ul>
            </div>

            {/* Section 5: Data Sharing */}
            <div id="data-sharing" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF3] text-[#166534] flex items-center justify-center font-bold shrink-0">
                  <Shield size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  5. Information Sharing & Third Parties
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                <strong>We NEVER sell your personal information to third-party advertisers.</strong> We only share relevant data under the following circumstances:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 border border-emerald-100 rounded-2xl bg-[#FFFCF5]">
                  <strong className="text-[#166534] font-extrabold block mb-1">With Local Merchants:</strong>
                  Vendor receives customer first name, delivery items, and special instructions. Full contact info is masked.
                </div>
                <div className="p-4 border border-emerald-100 rounded-2xl bg-[#FFFCF5]">
                  <strong className="text-[#166534] font-extrabold block mb-1">With Delivery Partners:</strong>
                  Rider receives delivery address, pin location, customer phone number (masked or for order confirmation), and order ID.
                </div>
                <div className="p-4 border border-emerald-100 rounded-2xl bg-[#FFFCF5]">
                  <strong className="text-[#166534] font-extrabold block mb-1">Payment Partners:</strong>
                  UPI gateways, bank payment aggregators, and credit card processors handle payment details via encrypted PCI-DSS compliant links.
                </div>
                <div className="p-4 border border-emerald-100 rounded-2xl bg-[#FFFCF5]">
                  <strong className="text-[#166534] font-extrabold block mb-1">Legal Authorities:</strong>
                  When required by law enforcement under valid subpoenas or judicial court orders in India.
                </div>
              </div>
            </div>

            {/* Section 6: Security & Storage */}
            <div id="security" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold shrink-0">
                  <Lock size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  6. Security & Data Retention
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                We employ industry-standard encryption protocols (SSL/TLS for data in transit, AES-256 for data at rest) to safeguard your data.
              </p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                We retain user account data for as long as your account remains active. Transaction logs and invoices are retained as required under Indian tax laws for a period of up to 7 years.
              </p>
            </div>

            {/* Section 7: User Rights */}
            <div id="user-rights" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold shrink-0">
                  <FileText size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  7. Your Privacy Rights & Choices
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                As a FillCarts user, you have complete control over your data:
              </p>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#16A34A] shrink-0 mt-0.5" />
                  <span><strong>Access & Correction:</strong> Edit profile details, addresses, and saved payment methods directly from the mobile app or web portal.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#16A34A] shrink-0 mt-0.5" />
                  <span><strong>Account & Data Deletion:</strong> Submit an account deletion request through app settings or by emailing <a href="mailto:privacy@fillcarts.com" className="text-[#166534] font-bold underline">privacy@fillcarts.com</a>. All personal profile records will be permanently removed within 14 days.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#16A34A] shrink-0 mt-0.5" />
                  <span><strong>Marketing Opt-out:</strong> You can turn off marketing notifications, SMS alerts, and promotional push messages at any time.</span>
                </div>
              </div>
            </div>

            {/* Section 8: Contact */}
            <div id="contact" className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF3] text-[#166534] flex items-center justify-center font-bold shrink-0">
                  <Mail size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-[#17231A]">
                  8. Grievance Redressal & Contact Desk
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                In accordance with Information Technology rules and DPDP Act of India, the contact details of our Data Protection & Grievance Officer are:
              </p>

              <div className="bg-[#166534] text-white rounded-2xl p-6 grid md:grid-cols-2 gap-6 shadow-xs">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-amber-300 mb-1">Data Protection Officer</div>
                  <div className="font-extrabold text-base mb-1">Grievance Desk - FillCarts Technologies Pvt Ltd</div>
                  <p className="text-xs text-emerald-100">Building 4, Sector 14, Cyber City Zone, Gurgaon, HR 122001, India</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-100">
                    <Mail size={15} className="text-amber-300" />
                    <span>Email: <a href="mailto:privacy@fillcarts.com" className="text-white underline font-extrabold">privacy@fillcarts.com</a></span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-100">
                    <Phone size={15} className="text-emerald-300" />
                    <span>Toll Free: 1800-123-456 (Ext. 4)</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-100">
                    <Clock size={15} className="text-amber-300" />
                    <span>Hours: Mon - Sat (9:00 AM - 6:00 PM IST)</span>
                  </div>
                </div>
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
