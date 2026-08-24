import React, { useState } from "react";
import VendorNavbar from "../components/VendorNavbar";
import Footer from "../components/Footer";
import vendorImg from "../assets/vendor.png";
import {
  Store, Users, LayoutDashboard, Wallet, Bell, PackageCheck,
  ClipboardList, CheckCircle2, ArrowRight, ChevronDown, Smartphone,
  ShieldCheck, HelpCircle, FileText, Building2, MapPin, Check,
  AlertCircle, ArrowLeft, Download, ShoppingBag, Truck, Layers
} from "lucide-react";

// 1. Why Partner Cards Data
const whyPartnerCards = [
  {
    icon: Users,
    title: "Reach Nearby Customers",
    desc: "Help nearby customers discover your store, catalog, and daily products online."
  },
  {
    icon: LayoutDashboard,
    title: "Manage Your Store",
    desc: "Update product lists, pricing, and item availability seamlessly from the Merchant App."
  },
  {
    icon: Wallet,
    title: "Track Your Earnings",
    desc: "Clear visibility into daily sales, transparent commissions, and bank settlements."
  },
  {
    icon: Truck,
    title: "Get Delivery Support",
    desc: "Filcarts delivery partners handle doorstep delivery from your shop to customer homes."
  }
];

// 2. How It Works 4-Step Process
const howItWorksSteps = [
  {
    step: "01",
    title: "Register Your Store",
    desc: "Submit your basic store, category, and owner details through our online registration form."
  },
  {
    step: "02",
    title: "Get Verified",
    desc: "Our merchant onboarding team reviews your store information and business details."
  },
  {
    step: "03",
    title: "Set Up Your Store",
    desc: "Download the Merchant App to add your catalog, set pricing, and mark initial inventory."
  },
  {
    step: "04",
    title: "Start Receiving Orders",
    desc: "Accept incoming customer orders on the Merchant App and prepare them for quick delivery."
  }
];

// 3. Merchant Tools in App
const merchantTools = [
  {
    icon: PackageCheck,
    title: "Products & Inventory",
    desc: "Add items, edit prices, and pause out-of-stock products instantly."
  },
  {
    icon: ClipboardList,
    title: "Order Management",
    desc: "Accept orders, view item lists, and mark order preparation status."
  },
  {
    icon: Wallet,
    title: "Earnings & Settlement",
    desc: "Track completed orders, total sales, and periodic bank payouts."
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    desc: "Instant sound alerts and notifications for every new customer order."
  }
];

// 4. Realistic Merchant FAQs
const merchantFaqs = [
  {
    q: "What documents are required to join Filcarts?",
    a: "Basic store registration requires your store name, category, address, owner details, and mobile number. GST number and PAN or business proof may be requested during document verification depending on your business type."
  },
  {
    q: "How does merchant onboarding work?",
    a: "After submitting the registration form, our merchant onboarding team reviews your information. Once verified, you receive your login credentials to set up your store on the Filcarts Merchant App."
  },
  {
    q: "Is there a registration fee to join?",
    a: "Store registration on the website is completely free. Details regarding commission structures or service charges are communicated transparently during onboarding."
  },
  {
    q: "How does commission work?",
    a: "Filcarts operates on a transparent commission model based on product categories. You will receive a clear commission agreement prior to store activation."
  },
  {
    q: "When do I receive my payouts?",
    a: "Earnings from completed orders are processed directly into your registered business bank account on a regular settlement schedule."
  },
  {
    q: "Who delivers customer orders?",
    a: "Filcarts delivery partners collect packed orders directly from your shop and deliver them to customers nearby."
  },
  {
    q: "How do I add my products?",
    a: "You can add products, set MRP, discounts, and upload catalog items easily through the Filcarts Merchant App on your smartphone."
  },
  {
    q: "Can I pause products when they are out of stock?",
    a: "Yes. The Merchant App provides a 1-tap stock toggle so you can pause items immediately when inventory runs out."
  },
  {
    q: "Is the Merchant App required?",
    a: "Yes. The website is for registering your store. The Merchant App is required for day-to-day order management, inventory updates, and receiving instant order notifications."
  },
  {
    q: "How can I contact merchant support?",
    a: "Registered merchants can access merchant support directly through the Merchant App or contact our support team via phone or email."
  }
];

export default function VendorHomePage() {
  // Multi-step Registration Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: "",
    category: "Grocery & Kirana",
    address: "",
    city: "",
    pincode: "",
    ownerName: "",
    phone: "",
    email: "",
    gstNumber: "",
    panNumber: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appId, setAppId] = useState("");

  // FAQ Accordion Toggle
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errors = {};
    if (!formData.storeName.trim()) errors.storeName = "Store name is required";
    if (!formData.address.trim()) errors.address = "Store address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = "Enter a valid 6-digit pincode";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errors = {};
    if (!formData.ownerName.trim()) errors.ownerName = "Owner full name is required";
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))) {
      errors.phone = "Enter a valid 10-digit mobile number";
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Enter a valid email address";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      window.location.hash = "register";
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      window.location.hash = "register";
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    if (currentStep === 3) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        const randomId = "FC-" + Math.floor(100000 + Math.random() * 900000);
        setAppId(randomId);
        setIsSubmitted(true);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#17231A] font-sans antialiased">
      {/* 1. Redesigned Clean Merchant Navbar */}
      <VendorNavbar />

      {/* 2. Hero Section */}
      <section className="relative pt-6 pb-10 md:pt-8 md:pb-12 overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          {/* Pure Hero Section Image */}
          <div className="w-full overflow-hidden rounded-2xl shadow-md border border-slate-100">
            <img
              src={vendorImg}
              alt="Fillcart Merchant Banner"
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>

          {/* Registration Button Underneath */}
          <div className="mt-6 text-center">
            <a
              href="#register"
              className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#166534] text-white text-[13px] sm:text-[14px] font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm text-center"
            >
              <span>Register Your Store</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* 3. Why Partner With Filcarts Section */}
      <section id="why-filcarts" className="py-16 md:py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading Spec: Desktop 32px, Tablet 30px, Mobile 26px, weight 800, line-height 1.2 */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded border border-emerald-200 inline-block">
              Merchant Benefits
            </span>
            <h2 className="text-[26px] sm:text-[30px] md:text-[32px] font-extrabold text-[#17231A] tracking-tight leading-[1.2]">
              Everything you need to grow your store online
            </h2>
            {/* Section Description Spec: Desktop 16px, Tablet 15px, Mobile 14px, weight 400/500, line-height 1.6 */}
            <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#64748B] font-normal leading-[1.6]">
              Filcarts provides the tools and customer reach to help local retailers expand digitally.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyPartnerCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:border-emerald-300 transition-all hover:shadow-xs group space-y-3.5"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
                    <IconComp size={20} />
                  </div>
                  {/* Card Heading Spec: Mobile 16px, Tablet 17px, Desktop 18px, weight 700 */}
                  <h3 className="text-[16px] sm:text-[17px] md:text-[18px] font-bold text-[#17231A]">
                    {card.title}
                  </h3>
                  {/* Card Description Spec: Mobile 13px, Desktop 14px, weight 400/500, line-height 1.5 */}
                  <p className="text-[13px] sm:text-[14px] text-[#64748B] font-normal leading-[1.5]">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded border border-emerald-200 inline-block">
              Simple Onboarding
            </span>
            <h2 className="text-[26px] sm:text-[30px] md:text-[32px] font-extrabold text-[#17231A] tracking-tight leading-[1.2]">
              How Filcarts merchant onboarding works
            </h2>
            <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#64748B] font-normal leading-[1.6]">
              Get your local store registered and receiving orders in four clear steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {howItWorksSteps.map((stepItem, idx) => (
              <div key={idx} className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-6 space-y-3.5 relative">
                <div className="text-2xl font-extrabold text-[#16A34A]">
                  {stepItem.step}
                </div>
                <h3 className="text-[16px] sm:text-[17px] md:text-[18px] font-bold text-[#17231A]">
                  {stepItem.title}
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#64748B] font-normal leading-[1.5]">
                  {stepItem.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#register"
              className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#166534] text-white text-[14px] sm:text-[15px] font-semibold px-6 py-3 rounded-lg transition-colors shadow-xs"
            >
              <span>Start Your Registration</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* 5. Merchant App Section */}
      <section id="merchant-app" className="py-16 md:py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded border border-emerald-200 inline-block">
                Merchant App
              </span>
              <h2 className="text-[26px] sm:text-[30px] md:text-[32px] font-extrabold text-[#17231A] tracking-tight leading-[1.2]">
                Manage your business with the Filcarts Merchant App
              </h2>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#64748B] font-normal leading-[1.6]">
                Your website is for joining Filcarts. Your Merchant App is where you manage your day-to-day store operations, products, and customer orders.
              </p>

              <div className="space-y-3 pt-1">
                {merchantTools.map((tool, idx) => {
                  const IconC = tool.icon;
                  return (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-start gap-3 shadow-2xs">
                      <div className="p-2 rounded-md bg-[#ECFDF3] text-[#16A34A] mt-0.5">
                        <IconC size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-[15px] sm:text-[16px] font-bold text-[#17231A]">{tool.title}</h4>
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            Available in App
                          </span>
                        </div>
                        <p className="text-[13px] sm:text-[14px] text-[#64748B] font-normal leading-[1.5] mt-0.5">{tool.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                <a
                  href="#register"
                  className="bg-[#16A34A] hover:bg-[#166534] text-white text-[14px] sm:text-[15px] font-semibold px-6 py-3 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Smartphone size={16} />
                  <span>Get the Merchant App</span>
                </a>
                <a
                  href="#register"
                  className="border border-slate-300 hover:border-slate-400 text-slate-700 bg-white text-[14px] sm:text-[15px] font-semibold px-5 py-3 rounded-lg transition-colors text-center"
                >
                  Register Your Store
                </a>
              </div>
            </div>

            {/* App Visual Preview */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[14px] font-bold text-slate-900">Filcarts Merchant App</span>
                  <span className="text-[11px] font-bold text-[#166534] bg-[#ECFDF3] px-2 py-0.5 rounded">Mobile Platform</span>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block uppercase">Product Catalog</span>
                    <p className="text-[13px] sm:text-[14px] font-semibold text-slate-900">Add, edit pricing & toggle availability</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block uppercase">Orders & Pickup</span>
                    <p className="text-[13px] sm:text-[14px] font-semibold text-slate-900">Receive order alerts & hand off to delivery partner</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block uppercase">Business Settlements</span>
                    <p className="text-[13px] sm:text-[14px] font-semibold text-slate-900">Clear bank settlement reports and transaction history</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Built for Local Businesses (Trust Section) */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded border border-emerald-200 inline-block">
              Built for Local Businesses
            </span>
            <h2 className="text-[26px] sm:text-[30px] md:text-[32px] font-extrabold text-[#17231A] tracking-tight leading-[1.2]">
              Empowering neighborhood stores with digital tools
            </h2>
            <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#64748B] font-normal leading-[1.6]">
              Filcarts helps local retailers digitize their product catalog, connect with shoppers nearby, and utilize reliable delivery support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <div className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2 text-center">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center mx-auto">
                <Check size={16} />
              </div>
              <h4 className="text-[15px] font-bold text-[#17231A]">Local Reach</h4>
              <p className="text-[13px] text-[#64748B] font-normal">Connect with customers in your neighborhood.</p>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2 text-center">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center mx-auto">
                <Check size={16} />
              </div>
              <h4 className="text-[15px] font-bold text-[#17231A]">Digital Presence</h4>
              <p className="text-[13px] text-[#64748B] font-normal">Display your store products online hassle-free.</p>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2 text-center">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center mx-auto">
                <Check size={16} />
              </div>
              <h4 className="text-[15px] font-bold text-[#17231A]">Order Controls</h4>
              <p className="text-[13px] text-[#64748B] font-normal">Full control over pricing and stock availability.</p>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2 text-center">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center mx-auto">
                <Check size={16} />
              </div>
              <h4 className="text-[15px] font-bold text-[#17231A]">Delivery Network</h4>
              <p className="text-[13px] text-[#64748B] font-normal">Dedicated delivery partners for order doorstep drops.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Multi-step Merchant Registration Form Section */}
      <section id="register" className="py-16 md:py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2.5">
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded border border-emerald-200 inline-block">
              Store Registration
            </span>
            {/* Form Heading Spec: Mobile 22px, Tablet 26px, Desktop 28px, weight 800 */}
            <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-extrabold text-[#17231A] tracking-tight">
              Start selling with Filcarts
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#64748B] font-normal leading-[1.6]">
              Tell us about your store. Our team will review your details and guide you through onboarding.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs">
            {!isSubmitted ? (
              <div>
                {/* Registration Progress Steps Header */}
                <div className="mb-8 border-b border-slate-200 pb-6">
                  <div className="flex items-center justify-between max-w-md mx-auto relative">
                    {/* Step 1 Pill */}
                    <div className="flex items-center gap-2 z-10 bg-white pr-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold ${currentStep >= 1 ? "bg-[#16A34A] text-white" : "bg-slate-200 text-slate-600"}`}>
                        1
                      </div>
                      <span className={`text-[13px] sm:text-[14px] font-semibold hidden sm:inline ${currentStep === 1 ? "text-slate-900" : "text-slate-500"}`}>
                        Business
                      </span>
                    </div>

                    {/* Step 2 Pill */}
                    <div className="flex items-center gap-2 z-10 bg-white px-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold ${currentStep >= 2 ? "bg-[#16A34A] text-white" : "bg-slate-200 text-slate-600"}`}>
                        2
                      </div>
                      <span className={`text-[13px] sm:text-[14px] font-semibold hidden sm:inline ${currentStep === 2 ? "text-slate-900" : "text-slate-500"}`}>
                        Owner
                      </span>
                    </div>

                    {/* Step 3 Pill */}
                    <div className="flex items-center gap-2 z-10 bg-white pl-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold ${currentStep >= 3 ? "bg-[#16A34A] text-white" : "bg-slate-200 text-slate-600"}`}>
                        3
                      </div>
                      <span className={`text-[13px] sm:text-[14px] font-semibold hidden sm:inline ${currentStep === 3 ? "text-slate-900" : "text-slate-500"}`}>
                        Verification
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmitRegistration} className="space-y-5">
                  
                  {/* STEP 1: BUSINESS DETAILS */}
                  {currentStep === 1 && (
                    <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
                      <h3 className="text-[18px] font-bold text-[#17231A] border-b border-slate-100 pb-2">
                        Step 1: Business Details
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                          {/* Form Label Spec: Mobile 13px, Desktop 14px, weight 600 */}
                          <label className="block text-[13px] sm:text-[14px] font-semibold text-slate-700 mb-1.5">
                            Store Name <span className="text-red-500">*</span>
                          </label>
                          {/* Form Input Spec: Mobile 14px, Desktop 15px, weight 400/500 */}
                          <input
                            type="text"
                            name="storeName"
                            value={formData.storeName}
                            onChange={handleInputChange}
                            placeholder="e.g. Gupta General Store"
                            className={`w-full px-3.5 py-2.5 rounded-lg border text-[14px] sm:text-[15px] font-normal focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 ${formErrors.storeName ? "border-red-500 bg-red-50/20" : "border-slate-300"}`}
                          />
                          {formErrors.storeName && (
                            <p className="text-[12px] text-red-500 mt-1 font-medium">{formErrors.storeName}</p>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[13px] sm:text-[14px] font-semibold text-slate-700 mb-1.5">
                            Business Category <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-[14px] sm:text-[15px] font-normal text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                          >
                            <option value="Grocery & Kirana">Grocery & Kirana</option>
                            <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                            <option value="Dairy & Bakery">Dairy & Bakery</option>
                            <option value="Pharmacy & Wellness">Pharmacy & Wellness</option>
                            <option value="Home & Cleaning">Home & Cleaning</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[13px] sm:text-[14px] font-semibold text-slate-700 mb-1.5">
                            Store Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Street address, locality, landmark"
                            className={`w-full px-3.5 py-2.5 rounded-lg border text-[14px] sm:text-[15px] font-normal focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 ${formErrors.address ? "border-red-500 bg-red-50/20" : "border-slate-300"}`}
                          />
                          {formErrors.address && (
                            <p className="text-[12px] text-red-500 mt-1 font-medium">{formErrors.address}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[13px] sm:text-[14px] font-semibold text-slate-700 mb-1.5">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            className={`w-full px-3.5 py-2.5 rounded-lg border text-[14px] sm:text-[15px] font-normal focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 ${formErrors.city ? "border-red-500 bg-red-50/20" : "border-slate-300"}`}
                          />
                          {formErrors.city && (
                            <p className="text-[12px] text-red-500 mt-1 font-medium">{formErrors.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[13px] sm:text-[14px] font-semibold text-slate-700 mb-1.5">
                            Pincode <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="6-digit pincode"
                            maxLength={6}
                            className={`w-full px-3.5 py-2.5 rounded-lg border text-[14px] sm:text-[15px] font-normal focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 ${formErrors.pincode ? "border-red-500 bg-red-50/20" : "border-slate-300"}`}
                          />
                          {formErrors.pincode && (
                            <p className="text-[12px] text-red-500 mt-1 font-medium">{formErrors.pincode}</p>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="bg-[#16A34A] hover:bg-[#166534] text-white text-[14px] sm:text-[15px] font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Continue to Owner Details</span>
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: OWNER DETAILS */}
                  {currentStep === 2 && (
                    <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
                      <h3 className="text-[18px] font-bold text-[#17231A] border-b border-slate-100 pb-2">
                        Step 2: Owner Details
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                          <label className="block text-[13px] sm:text-[14px] font-semibold text-slate-700 mb-1.5">
                            Owner Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleInputChange}
                            placeholder="Full name as per business records"
                            className={`w-full px-3.5 py-2.5 rounded-lg border text-[14px] sm:text-[15px] font-normal focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 ${formErrors.ownerName ? "border-red-500 bg-red-50/20" : "border-slate-300"}`}
                          />
                          {formErrors.ownerName && (
                            <p className="text-[12px] text-red-500 mt-1 font-medium">{formErrors.ownerName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[13px] sm:text-[14px] font-semibold text-slate-700 mb-1.5">
                            Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-[14px] text-slate-500 font-bold">+91</span>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="10-digit mobile number"
                              maxLength={10}
                              className={`w-full pl-12 pr-3.5 py-2.5 rounded-lg border text-[14px] sm:text-[15px] font-normal focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 ${formErrors.phone ? "border-red-500 bg-red-50/20" : "border-slate-300"}`}
                            />
                          </div>
                          {formErrors.phone && (
                            <p className="text-[12px] text-red-500 mt-1 font-medium">{formErrors.phone}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[13px] sm:text-[14px] font-semibold text-slate-700 mb-1.5">
                            Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="merchant@example.com"
                            className={`w-full px-3.5 py-2.5 rounded-lg border text-[14px] sm:text-[15px] font-normal focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 ${formErrors.email ? "border-red-500 bg-red-50/20" : "border-slate-300"}`}
                          />
                          {formErrors.email && (
                            <p className="text-[12px] text-red-500 mt-1 font-medium">{formErrors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="border border-slate-300 text-slate-700 hover:bg-slate-50 text-[14px] font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <ArrowLeft size={15} />
                          <span>Back</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="bg-[#16A34A] hover:bg-[#166534] text-white text-[14px] sm:text-[15px] font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Continue to Verification</span>
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: BUSINESS VERIFICATION */}
                  {currentStep === 3 && (
                    <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
                      <h3 className="text-[18px] font-bold text-[#17231A] border-b border-slate-100 pb-2">
                        Step 3: Business Verification Details
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[13px] sm:text-[14px] font-semibold text-slate-700 mb-1.5">
                            GST Number <span className="text-slate-400 font-normal">(If applicable)</span>
                          </label>
                          <input
                            type="text"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleInputChange}
                            placeholder="e.g. 22AAAAA0000A1Z5"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-[14px] sm:text-[15px] font-normal focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                          />
                        </div>

                        <div>
                          <label className="block text-[13px] sm:text-[14px] font-semibold text-slate-700 mb-1.5">
                            PAN / Business License Number <span className="text-slate-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            name="panNumber"
                            value={formData.panNumber}
                            onChange={handleInputChange}
                            placeholder="e.g. ABCDE1234F"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-[14px] sm:text-[15px] font-normal focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-[13px] sm:text-[14px] text-slate-600 space-y-1 leading-[1.5]">
                        <span className="font-bold text-slate-800 block">Verification Note:</span>
                        <p>
                          Documents may be requested during verification. Your information is used only for merchant onboarding and verification.
                        </p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="border border-slate-300 text-slate-700 hover:bg-slate-50 text-[14px] font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <ArrowLeft size={15} />
                          <span>Back</span>
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-[#16A34A] hover:bg-[#166534] text-white text-[14px] sm:text-[15px] font-semibold px-7 py-2.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <span>Submitting Application...</span>
                          ) : (
                            <>
                              <span>Submit Registration</span>
                              <CheckCircle2 size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                </form>
              </div>
            ) : (
              /* Registration Success Screen */
              <div className="text-center py-6 space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="w-12 h-12 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-[22px] sm:text-[26px] md:text-[28px] font-extrabold text-[#17231A]">
                    Your registration has been submitted
                  </h3>
                  <p className="text-[14px] sm:text-[15px] text-[#64748B] max-w-lg mx-auto leading-[1.6]">
                    Thank you for choosing Filcarts. Our merchant onboarding team will review your details and contact you regarding the next steps.
                  </p>
                </div>

                <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 inline-block text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Application Reference ID</span>
                  <span className="text-[18px] font-extrabold text-[#166534] tracking-wider">{appId}</span>
                </div>

                {/* What Happens Next Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 text-left max-w-md mx-auto space-y-3">
                  <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">What Happens Next?</h4>
                  <ol className="space-y-2 text-[13px] sm:text-[14px] text-slate-600 font-normal">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#16A34A]">1.</span>
                      <span>Details reviewed by Filcarts onboarding team.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#16A34A]">2.</span>
                      <span>Verification call or document validation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#16A34A]">3.</span>
                      <span>Store catalog set up via Merchant App.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#16A34A]">4.</span>
                      <span>Start selling to nearby customers online.</span>
                    </li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href="#merchant-app"
                    className="bg-[#16A34A] hover:bg-[#166534] text-white text-[14px] sm:text-[15px] font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Smartphone size={16} />
                    <span>Get the Filcarts Merchant App</span>
                  </a>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setCurrentStep(1);
                      setFormData({
                        storeName: "",
                        category: "Grocery & Kirana",
                        address: "",
                        city: "",
                        pincode: "",
                        ownerName: "",
                        phone: "",
                        email: "",
                        gstNumber: "",
                        panNumber: ""
                      });
                    }}
                    className="border border-slate-300 text-slate-700 hover:bg-slate-50 text-[14px] font-semibold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Register Another Store
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. Merchant FAQ Section */}
      <section id="faqs" className="py-16 md:py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded border border-emerald-200 inline-block">
              Frequently Asked Questions
            </span>
            <h2 className="text-[26px] sm:text-[30px] md:text-[32px] font-extrabold text-[#17231A] tracking-tight leading-[1.2]">
              Merchant FAQs
            </h2>
            <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#64748B] font-normal leading-[1.6]">
              Common questions about joining and selling on Filcarts.
            </p>
          </div>

          <div className="space-y-3">
            {merchantFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-[#F8FAFC] transition-colors"
                >
                  {/* FAQ Question Spec: Mobile 14px, Desktop 16px, weight 600/700 */}
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full px-5 py-4 text-left font-semibold text-[14px] sm:text-[16px] text-[#17231A] flex items-center justify-between gap-4 cursor-pointer hover:text-[#16A34A]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#16A34A]" : ""}`}
                    />
                  </button>
                  {/* FAQ Answer Spec: Mobile 13px, Desktop 14px, weight 400/500, line-height 1.6 */}
                  {isOpen && (
                    <div className="px-5 pb-4 text-[13px] sm:text-[14px] text-[#64748B] font-normal leading-[1.6] border-t border-slate-200/60 pt-3 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Final CTA Section */}
      <section className="py-16 md:py-20 bg-[#ECFDF3] border-b border-emerald-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-[26px] sm:text-[30px] md:text-[32px] font-extrabold text-[#166534] tracking-tight leading-[1.2]">
            Ready to take your store online?
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#17231A] max-w-xl mx-auto font-normal leading-[1.6]">
            Join Filcarts and start reaching customers in your neighborhood.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a
              href="#register"
              className="bg-[#16A34A] hover:bg-[#166534] text-white text-[14px] sm:text-[15px] font-semibold px-7 py-3.5 rounded-lg transition-colors shadow-xs flex items-center gap-2"
            >
              <span>Register Your Store</span>
              <ArrowRight size={16} />
            </a>
            <a
              href="#how-it-works"
              className="border border-emerald-300 hover:border-emerald-400 text-[#166534] bg-white text-[14px] sm:text-[15px] font-semibold px-6 py-3.5 rounded-lg transition-colors"
            >
              Learn How It Works
            </a>
          </div>
        </div>
      </section>

      {/* 10. Clean B2B Footer */}
      <Footer />
    </div>
  );
}
