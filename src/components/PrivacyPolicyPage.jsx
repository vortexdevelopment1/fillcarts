import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Shield, FileText, Lock, Eye, MapPin, Smartphone, UserCheck,
  HelpCircle, Printer, ChevronRight, Search, CheckCircle2, Clock, Mail, Phone,
  AlertCircle, ArrowRight
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
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <Navbar searchPlaceholder="Search privacy policies..." onSearchChange={(val) => setSearchQuery(val)} />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-[69px] z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight size={13} />
            <span className="text-slate-900 font-bold">Privacy Policy</span>
          </div>

          {/* Page Selector Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full text-xs">
            <button
              className="bg-blue-600 text-white font-extrabold px-3.5 py-1 rounded-full shadow-xs transition-all"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/terms")}
              className="text-slate-600 font-bold px-3.5 py-1 rounded-full hover:text-slate-900 transition-all"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white py-14 px-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-4">
            <Shield size={14} className="text-blue-400" /> Transparent & Secure Data Handling
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            Privacy Policy
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            At <strong>FillCarts</strong>, we are committed to protecting the privacy of our customers, registered local vendors, and delivery partners. Learn how we collect, safeguard, and manage your personal data.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-teal-400" /> Last Updated: August 7, 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-teal-400" /> Compliant with Indian DPDP Act 2023
            </span>
          </div>

          {/* Action Bar */}
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-full transition-all"
            >
              <Printer size={15} /> Print Policy
            </button>
            <Link
              to="/support"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-lg shadow-blue-600/30 transition-all"
            >
              <HelpCircle size={15} /> Contact Privacy Desk
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* Sticky Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sticky top-28 shadow-xs">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 px-3">
                Contents
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
                <div className="text-xs font-bold text-slate-900 mb-1">Need Clarification?</div>
                <p className="text-[11px] text-slate-500 mb-3">Our Data Officer responds within 24 hours.</p>
                <a
                  href="mailto:privacy@fillcarts.com"
                  className="text-xs font-extrabold text-blue-600 hover:underline flex items-center gap-1"
                >
                  privacy@fillcarts.com <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>

          {/* Detailed Policy Text Container */}
          <div className="lg:col-span-3 space-y-10">

            {/* Section 1: Overview */}
            <div id="overview" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Eye size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  1. Overview & Scope
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Welcome to <strong>FillCarts</strong> ("we", "our", or "us"). This Privacy Policy applies to all services offered through our website, mobile application, customer interface, vendor dashboard, and delivery partner application.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                By accessing or using our hyper-local marketplace platform, you agree to the collection, processing, and storage of your information as described in this policy. If you do not agree, please discontinue using FillCarts services.
              </p>

              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
                <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block mb-0.5">Three-Way Ecosystem Protection</span>
                  FillCarts connects End Customers, Local Kirana Stores/Restaurants, and Independent Delivery Partners. Data shared between parties is strictly restricted to order fulfillment and real-time navigation.
                </div>
              </div>
            </div>

            {/* Section 2: Data We Collect */}
            <div id="data-collection" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Smartphone size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  2. Information We Collect
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Depending on how you interact with FillCarts (as a customer, vendor, or rider), we collect different types of personal data:
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2 text-blue-600">For Customers</h3>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                    <li>Full Name, Mobile Number, Email Address</li>
                    <li>Delivery Addresses & Pincodes</li>
                    <li>Order History, Cart Items & Favorites</li>
                    <li>Payment tokens (processed securely via PCI-DSS partners)</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2 text-teal-600">For Vendors</h3>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                    <li>Store Name, GSTIN, FSSAI Registration</li>
                    <li>Store Owner Identity & Bank Account details</li>
                    <li>Product Catalog, Inventory Prices</li>
                    <li>Store Operating Hours & Dispatch Address</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h3 className="font-extrabold text-sm text-slate-900 mb-2 text-violet-600">For Delivery Partners</h3>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                    <li>Driving License, Aadhaar/PAN Verification</li>
                    <li>Vehicle Registration details</li>
                    <li>Live GPS Coordinates during active shifts</li>
                    <li>Weekly Payout Account details</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: Location & GPS Usage */}
            <div id="location-data" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                  <MapPin size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  3. Precise Location & GPS Tracking
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Because FillCarts is built for hyper-local quick deliveries (15–30 minutes), location data is central to our platform:
              </p>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Customer Location:</strong>
                    We collect your location to auto-detect nearby kirana stores, verify delivery availability in your sector, and estimate exact delivery times.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Delivery Partner Background Location:</strong>
                    For active delivery partners, our Rider App collects continuous GPS location data in the foreground and background while on shift to enable live map tracking for customers and optimize order dispatch algorithms.
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: How We Use Information */}
            <div id="use-of-info" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <UserCheck size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  4. How We Use Your Information
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                We use collected information solely for legitimate operational and platform enhancement purposes:
              </p>
              <ul className="text-xs text-slate-600 space-y-2.5 list-disc list-inside font-medium">
                <li>Processing, routing, and fulfilling your orders with designated local vendors.</li>
                <li>Facilitating communication between customers and delivery riders regarding order delivery status or address directions.</li>
                <li>Preventing payment fraud, fake accounts, and unauthorized access to your account.</li>
                <li>Sending transactional updates, OTPs, order invoices, and promotional offers (only if opted in).</li>
                <li>Improving our recommendation engines and optimizing delivery routes in your city.</li>
              </ul>
            </div>

            {/* Section 5: Data Sharing */}
            <div id="data-sharing" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Shield size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  5. Information Sharing & Third Parties
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                <strong>We NEVER sell your personal information to third-party advertisers.</strong> We only share relevant data under the following circumstances:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50">
                  <strong className="text-slate-900 font-bold block mb-1">With Local Merchants:</strong>
                  Vendor receives customer first name, delivery items, and special instructions. Full contact info is masked.
                </div>
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50">
                  <strong className="text-slate-900 font-bold block mb-1">With Delivery Partners:</strong>
                  Rider receives delivery address, pin location, customer phone number (masked or for order confirmation), and order ID.
                </div>
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50">
                  <strong className="text-slate-900 font-bold block mb-1">Payment Partners:</strong>
                  UPI gateways, bank payment aggregators, and credit card processors handle payment details via encrypted PCI-DSS compliant links.
                </div>
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50">
                  <strong className="text-slate-900 font-bold block mb-1">Legal Authorities:</strong>
                  When required by law enforcement under valid subpoenas or judicial court orders in India.
                </div>
              </div>
            </div>

            {/* Section 6: Security & Storage */}
            <div id="security" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Lock size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  6. Security & Data Retention
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                We employ industry-standard encryption protocols (SSL/TLS for data in transit, AES-256 for data at rest) to safeguard your data.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                We retain user account data for as long as your account remains active. Transaction logs and invoices are retained as required under Indian tax laws for a period of up to 7 years.
              </p>
            </div>

            {/* Section 7: User Rights */}
            <div id="user-rights" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  7. Your Privacy Rights & Choices
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                As a FillCarts user, you have complete control over your data:
              </p>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Access & Correction:</strong> Edit profile details, addresses, and saved payment methods directly from the mobile app or web portal.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Account & Data Deletion:</strong> Submit an account deletion request through app settings or by emailing <a href="mailto:privacy@fillcarts.com" className="text-blue-600 underline">privacy@fillcarts.com</a>. All personal profile records will be permanently removed within 14 days.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Marketing Opt-out:</strong> You can turn off marketing notifications, SMS alerts, and promotional push messages at any time.</span>
                </div>
              </div>
            </div>

            {/* Section 8: Contact */}
            <div id="contact" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Mail size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  8. Grievance Redressal & Contact Desk
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                In accordance with Information Technology rules and DPDP Act of India, the contact details of our Data Protection & Grievance Officer are:
              </p>

              <div className="bg-slate-900 text-white rounded-2xl p-6 grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">Data Protection Officer</div>
                  <div className="font-extrabold text-base mb-1">Grievance Desk - FillCarts Technologies Pvt Ltd</div>
                  <p className="text-xs text-slate-300">Building 4, Sector 14, Cyber City Zone, Gurgaon, HR 122001, India</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail size={15} className="text-blue-400" />
                    <span>Email: <a href="mailto:privacy@fillcarts.com" className="text-white underline font-bold">privacy@fillcarts.com</a></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone size={15} className="text-teal-400" />
                    <span>Toll Free: 1800-123-456 (Ext. 4)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock size={15} className="text-amber-400" />
                    <span>Hours: Mon - Sat (9:00 AM - 6:00 PM IST)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
