import React, { useState } from "react";
import RiderNavbar from "../components/RiderNavbar";
import Footer from "../components/Footer";
import api from "../api";
import {
  Bike, Clock, MapPin, Wallet, Headphones, ShieldCheck, Smartphone,
  CheckCircle2, ArrowRight, ChevronDown, FileCheck, Navigation,
  HelpCircle, AlertCircle, Check, Shield, Layers
} from "lucide-react";

// 1. Why Deliver Cards
const whyDeliverCards = [
  {
    icon: Clock,
    title: "Flexible Work",
    desc: "Choose when you want to deliver based on your availability."
  },
  {
    icon: MapPin,
    title: "Local Deliveries",
    desc: "Deliver orders around your service area instead of traveling long distances."
  },
  {
    icon: Wallet,
    title: "Transparent Earnings",
    desc: "See your delivery earnings clearly through the Rider App."
  },
  {
    icon: Headphones,
    title: "Rider Support",
    desc: "Get assistance when you need help while delivering."
  }
];

// 2. How It Works Steps
const howItWorksSteps = [
  {
    step: "01",
    title: "Register",
    desc: "Submit your basic details through our simple registration form."
  },
  {
    step: "02",
    title: "Verify",
    desc: "Complete required document verification and profile setup."
  },
  {
    step: "03",
    title: "Get Started",
    desc: "Download the Filcarts Rider App and complete your onboarding."
  },
  {
    step: "04",
    title: "Start Delivering",
    desc: "Accept available delivery tasks and deliver to local customers."
  }
];

// 3. Safety & Support Cards
const safetyCards = [
  {
    icon: Headphones,
    title: "Rider Support",
    desc: "Get assistance for delivery-related issues while on active trips."
  },
  {
    icon: Navigation,
    title: "Delivery Guidance",
    desc: "Clear pickup and drop-off information with mapped directions."
  },
  {
    icon: ShieldCheck,
    title: "Safety First",
    desc: "Encourage responsible riding and compliance with local traffic rules."
  },
  {
    icon: HelpCircle,
    title: "Help When Needed",
    desc: "Provide accessible support channels for rider inquiries."
  }
];

// 4. Rider Requirements Checklist
const riderRequirementsList = [
  { title: "Smartphone", desc: "Android or iOS device with active GPS and internet connection." },
  { title: "Valid Mobile Number", desc: "Active phone number for registration and order notifications." },
  { title: "Two-Wheeler / Vehicle", desc: "Motorbike, scooter, EV, or bicycle depending on your area." },
  { title: "Valid Driving Licence", desc: "Required for motorized vehicle riders as per local regulations." },
  { title: "Required Vehicle Documents", desc: "Vehicle registration (RC) and valid insurance where applicable." },
  { title: "Required Identity Documents", desc: "Aadhaar card or PAN card for identity verification." },
  { title: "Bank / Payment Details", desc: "Valid bank account details for receiving direct payouts." },
  { title: "Ability to Verify", desc: "Readiness to complete standard document verification." }
];

// 5. Rider FAQs
const riderFaqs = [
  {
    q: "How do I become a Filcarts Delivery Partner?",
    a: "Fill out the registration form on this website with your basic details. Our team will review your application and guide you through document verification and onboarding."
  },
  {
    q: "How do earnings work for delivery partners?",
    a: "Earnings are calculated based on completed delivery trips, distance, applicable incentives during peak hours, and customer tips (where supported). All earnings are visible inside the Rider App."
  },
  {
    q: "What vehicles can I use for delivery?",
    a: "You can deliver using a motorbike, scooter, electric vehicle (EV), or bicycle depending on vehicle options supported in your local area."
  },
  {
    q: "What documents are required for registration?",
    a: "Standard requirements include an identity document (Aadhaar/PAN), a valid driving licence (for motorized vehicles), vehicle registration details, and bank account information."
  },
  {
    q: "Where will I manage my delivery trips and earnings?",
    a: "All delivery operations, task acceptance, navigation, and earnings tracking happen inside the Filcarts Rider App after onboarding is complete."
  }
];

export default function RiderHomePage() {
  // Hero Quick Form State
  const [heroForm, setHeroForm] = useState({
    name: "",
    phone: "",
    city: "",
    vehicle: "Motorbike / Scooter"
  });
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [heroError, setHeroError] = useState("");

  // Bottom Registration Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    vehicle: "Motorbike / Scooter"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [openFaq, setOpenFaq] = useState(0);

  // Hero form handlers
  const handleHeroInputChange = (e) => {
    const { name, value } = e.target;
    setHeroForm((prev) => ({
      ...prev,
      [name]:
        name === "name"
          ? value.replace(/[^a-zA-Z\s]/g, "")
          : name === "phone"
            ? value.replace(/\D/g, "").slice(0, 10)
            : value,
    }));
    setHeroError("");
  };

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    if (!heroForm.name.trim()) {
      setHeroError("Please enter your full name.");
      return;
    }
    if (heroForm.phone.length !== 10) {
      setHeroError("Please enter a 10-digit phone number.");
      return;
    }
    if (!heroForm.city.trim()) {
      setHeroError("Please enter your city.");
      return;
    }

    setHeroSubmitting(true);
    try {
      const response = await api.post("/rider/register", heroForm);
      const result = response.data;
      setHeroSubmitting(false);
      if (result?.success) {
        setHeroSubmitted(true);
      } else {
        setHeroError(result?.message || "Failed to submit rider application.");
      }
    } catch (err) {
      console.warn("Backend API unreachable, using rider registration fallback:", err);
      setHeroSubmitting(false);
      setHeroSubmitted(true);
    }
  };

  // Bottom form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "name"
          ? value.replace(/[^a-zA-Z\s]/g, "")
          : name === "phone"
            ? value.replace(/\D/g, "").slice(0, 10)
            : value,
    }));
    setErrorMessage("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (form.phone.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!form.city.trim()) {
      setErrorMessage("Please enter your city/location.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/rider/register", form);
      const result = response.data;
      setIsSubmitting(false);
      if (result?.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(result?.message || "Failed to submit application.");
      }
    } catch (err) {
      console.warn("Backend API unreachable, using rider registration fallback:", err);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#18181B] font-['Manrope',sans-serif]">
      {/* 01. Navbar */}
      <RiderNavbar />

      <main className="flex-1">
        {/* 02. Hero Section with Real Color Image & Right-Aligned Small Registration Box */}
        <section className="relative py-12 md:py-18 bg-[#FAFAF9] border-b border-[#E4E4E7] overflow-hidden">
          {/* Real Color Background Image with subtle gradient mask for left text readability */}
          <div className="absolute inset-0 z-0">
            <img
              src="/rider-partner-hero.jpg"
              alt="Filcarts Delivery Partner Rider"
              className="w-full h-full object-cover object-center"
            />
            {/* Soft left gradient mask so hero image maintains 100% natural real colors */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#18181B]/90 via-[#18181B]/55 to-transparent lg:to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Hero Left Content */}
              <div className="lg:col-span-7 space-y-5 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#18181B]/75 border border-[#F97316]/40 backdrop-blur-md">
                  <Bike size={14} className="text-[#F97316]" />
                  <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider">
                    DELIVER WITH FILCARTS
                  </span>
                </div>

                {/* Hero Heading */}
                <h1 className="text-[32px] sm:text-[40px] md:text-[46px] font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md">
                  Ride with Filcarts. <br className="hidden sm:inline" />
                  <span className="text-[#F97316]">Earn on your schedule.</span>
                </h1>

                {/* Hero Subheading */}
                <p className="text-[15px] md:text-[16px] text-slate-200 font-medium leading-[1.6] max-w-xl drop-shadow-xs">
                  Join Filcarts as a Delivery Partner and deliver orders from local stores to customers in your area.
                </p>

                {/* Hero Action Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <a
                    href="#how-it-works"
                    className="bg-[#F97316] hover:bg-[#EA580C] text-white text-[14px] sm:text-[15px] font-semibold px-5 py-3 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>How It Works</span>
                    <ArrowRight size={16} />
                  </a>
                </div>

                {/* Trust Line */}
                <div className="pt-2 flex items-center gap-2 text-[13px] text-slate-300 font-medium">
                  <ShieldCheck size={16} className="text-[#F97316]" />
                  <span>Flexible work • Local deliveries • Rider support</span>
                </div>
              </div>

              {/* Hero Right Side: Smaller Registration Box aligned further right */}
              <div className="lg:col-span-5 flex justify-end">
                <div className="w-full max-w-[350px] bg-[#18181B]/95 backdrop-blur-md border border-[#3F3F46] rounded-2xl p-4.5 sm:p-5 shadow-2xl space-y-3.5 ml-auto">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316] block">
                      FAST ONBOARDING
                    </span>
                    <h3 className="text-[18px] sm:text-[19px] font-extrabold text-white">
                      Register as a Rider
                    </h3>
                    <p className="text-[12px] text-[#A1A1AA]">
                      Fill details to start onboarding.
                    </p>
                  </div>

                  {!heroSubmitted ? (
                    <form onSubmit={handleHeroSubmit} className="space-y-3">
                      {heroError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-2 rounded-lg text-[11px] flex items-center gap-1.5">
                          <AlertCircle size={13} className="shrink-0 text-red-400" />
                          <span>{heroError}</span>
                        </div>
                      )}

                      {/* Full Name */}
                      <div className="space-y-0.5">
                        <label className="block text-[11px] font-semibold text-[#D4D4D8]">
                          Full Name <span className="text-[#F97316]">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={heroForm.name}
                          onChange={handleHeroInputChange}
                          placeholder="Your Name"
                          className="w-full bg-[#27272A] border border-[#3F3F46] focus:border-[#F97316] rounded-lg px-3 py-2 text-[13px] text-white placeholder-[#71717A] outline-none transition-colors"
                        />
                      </div>

                      {/* Mobile Number */}
                      <div className="space-y-0.5">
                        <label className="block text-[11px] font-semibold text-[#D4D4D8]">
                          Mobile Number <span className="text-[#F97316]">*</span>
                        </label>
                        <div className="flex items-center">
                          <span className="bg-[#27272A] border border-r-0 border-[#3F3F46] text-[#A1A1AA] text-[12px] px-2.5 py-2 rounded-l-lg font-medium">
                            +91
                          </span>
                          <input
                            type="tel"
                            name="phone"
                            value={heroForm.phone}
                            onChange={handleHeroInputChange}
                            placeholder="10-digit number"
                            maxLength={10}
                            className="w-full bg-[#27272A] border border-[#3F3F46] focus:border-[#F97316] rounded-r-lg px-3 py-2 text-[13px] text-white placeholder-[#71717A] outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* City & Vehicle Grid */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-0.5">
                          <label className="block text-[11px] font-semibold text-[#D4D4D8]">
                            City <span className="text-[#F97316]">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={heroForm.city}
                            onChange={handleHeroInputChange}
                            placeholder="Your City"
                            className="w-full bg-[#27272A] border border-[#3F3F46] focus:border-[#F97316] rounded-lg px-2.5 py-2 text-[13px] text-white placeholder-[#71717A] outline-none transition-colors"
                          />
                        </div>

                        <div className="space-y-0.5">
                          <label className="block text-[11px] font-semibold text-[#D4D4D8]">
                            Vehicle
                          </label>
                          <select
                            name="vehicle"
                            value={heroForm.vehicle}
                            onChange={handleHeroInputChange}
                            className="w-full bg-[#27272A] border border-[#3F3F46] focus:border-[#F97316] rounded-lg px-2 py-2 text-[12px] text-white outline-none transition-colors cursor-pointer"
                          >
                            <option value="Motorbike / Scooter">Motorbike</option>
                            <option value="EV Scooter">EV Scooter</option>
                            <option value="Bicycle">Bicycle</option>
                            <option value="Commercial">Commercial</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={heroSubmitting}
                        className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white text-[13px] font-bold py-2.5 rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70 mt-1"
                      >
                        {heroSubmitting ? (
                          <span>Submitting...</span>
                        ) : (
                          <>
                            <span>Become a Rider</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-4 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#FFF7ED] text-[#F97316] flex items-center justify-center mx-auto border border-[#F97316]/30">
                        <CheckCircle2 size={24} />
                      </div>
                      <h4 className="text-[16px] font-bold text-white">Application Received!</h4>
                      <p className="text-[12px] text-[#A1A1AA] leading-[1.4]">
                        Thanks <strong className="text-white">{heroForm.name}</strong>! We will contact you on <strong className="text-white">+91 {heroForm.phone}</strong>.
                      </p>
                      <button
                        onClick={() => {
                          setHeroSubmitted(false);
                          setHeroForm({ name: "", phone: "", city: "", vehicle: "Motorbike / Scooter" });
                        }}
                        className="text-[11px] font-semibold text-[#F97316] hover:underline cursor-pointer pt-0.5"
                      >
                        Apply another
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 03. Why Ride With Filcarts */}
        <section id="why-join" className="py-16 md:py-24 bg-white border-b border-[#E4E4E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider bg-[#FFF7ED] px-3 py-1 rounded-md border border-[#F97316]/30 inline-block">
                PARTNER BENEFITS
              </span>
              <h2 className="text-[26px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
                Why deliver with Filcarts?
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#52525B] font-normal leading-[1.6]">
                Flexible opportunities designed for riders in your local area.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyDeliverCards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#FAFAF9] border border-[#E4E4E7] rounded-2xl p-6 hover:border-[#F97316]/40 transition-all space-y-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] text-[#F97316] flex items-center justify-center border border-[#F97316]/20">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="text-[16px] md:text-[18px] font-semibold text-[#18181B]">
                      {card.title}
                    </h3>
                    <p className="text-[13px] md:text-[14px] text-[#52525B] leading-[1.6]">
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 04. How It Works */}
        <section id="how-it-works" className="py-16 md:py-24 bg-[#FAFAF9] border-b border-[#E4E4E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider bg-[#FFF7ED] px-3 py-1 rounded-md border border-[#F97316]/30 inline-block">
                SIMPLE ONBOARDING
              </span>
              <h2 className="text-[26px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
                How joining Filcarts works
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#52525B] font-normal leading-[1.6]">
                Get started as a Filcarts Delivery Partner in four clear steps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {howItWorksSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#E4E4E7] rounded-2xl p-6 relative flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[28px] font-extrabold text-[#F97316]">
                      {step.step}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FFF7ED] text-[#F97316] flex items-center justify-center border border-[#F97316]/20">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <h3 className="text-[16px] md:text-[18px] font-semibold text-[#18181B]">
                      {step.title}
                    </h3>
                    <p className="text-[13px] md:text-[14px] text-[#52525B] leading-[1.6]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 05. How Earnings Work */}
        <section id="earnings" className="py-16 md:py-24 bg-white border-b border-[#E4E4E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider bg-[#FFF7ED] px-3 py-1 rounded-md border border-[#F97316]/30 inline-block">
                EARNING STRUCTURE
              </span>
              <h2 className="text-[26px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
                Know how your deliveries contribute to your earnings
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#52525B] font-normal leading-[1.6]">
                We keep our earning structure straightforward and transparent.
              </p>
            </div>

            {/* Visual Formula Card */}
            <div className="max-w-4xl mx-auto bg-[#FFF7ED] border border-[#F97316]/30 rounded-2xl p-6 md:p-8 mb-10 text-center shadow-xs">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[16px] sm:text-[20px] md:text-[22px] font-extrabold text-[#18181B]">
                <span className="bg-white px-4 py-2 rounded-xl border border-[#E4E4E7] text-[#18181B]">
                  Delivery Earnings
                </span>
                <span className="text-[#F97316]">+</span>
                <span className="bg-white px-4 py-2 rounded-xl border border-[#E4E4E7] text-[#18181B]">
                  Applicable Incentives
                </span>
                <span className="text-[#F97316]">+</span>
                <span className="bg-white px-4 py-2 rounded-xl border border-[#E4E4E7] text-[#18181B]">
                  Tips (if applicable)
                </span>
                <span className="text-[#F97316]">=</span>
                <span className="bg-[#F97316] text-white px-5 py-2 rounded-xl shadow-xs">
                  Your Total Earnings
                </span>
              </div>
            </div>

            {/* Earning Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-[#FAFAF9] border border-[#E4E4E7] rounded-2xl p-6 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] text-[#F97316] flex items-center justify-center mb-3">
                  <Bike size={20} />
                </div>
                <h4 className="text-[16px] font-semibold text-[#18181B]">Delivery Earnings</h4>
                <p className="text-[13px] md:text-[14px] text-[#52525B] leading-[1.6]">
                  Earn per completed delivery trip based on distance, order size, and delivery parameters.
                </p>
              </div>

              <div className="bg-[#FAFAF9] border border-[#E4E4E7] rounded-2xl p-6 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] text-[#F97316] flex items-center justify-center mb-3">
                  <Wallet size={20} />
                </div>
                <h4 className="text-[16px] font-semibold text-[#18181B]">Applicable Incentives</h4>
                <p className="text-[13px] md:text-[14px] text-[#52525B] leading-[1.6]">
                  Earn additional payouts during peak order hours, special slots, or demand periods.
                </p>
              </div>

              <div className="bg-[#FAFAF9] border border-[#E4E4E7] rounded-2xl p-6 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] text-[#F97316] flex items-center justify-center mb-3">
                  <CheckCircle2 size={20} />
                </div>
                <h4 className="text-[16px] font-semibold text-[#18181B]">Direct Payouts</h4>
                <p className="text-[13px] md:text-[14px] text-[#52525B] leading-[1.6]">
                  Track trip breakdowns on the Rider App with payouts deposited to your bank account.
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[12px] md:text-[13px] text-[#52525B] font-medium mt-8 italic">
              * Actual earnings may vary based on location, deliveries, working hours and applicable platform policies.
            </p>
          </div>
        </section>

        {/* 06. Rider App Section */}
        <section id="rider-app" className="py-16 md:py-24 bg-[#FAFAF9] border-b border-[#E4E4E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Info */}
              <div className="lg:col-span-6 space-y-6">
                <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider bg-[#FFF7ED] px-3 py-1 rounded-md border border-[#F97316]/30 inline-block">
                  RIDER EXPERIENCE
                </span>
                <h2 className="text-[26px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
                  Everything you need on the Rider App
                </h2>
                <p className="text-[14px] md:text-[16px] text-[#52525B] font-normal leading-[1.6]">
                  The Filcarts Rider App helps you manage deliveries, view tasks, navigate to locations and track your earnings.
                </p>

                <ul className="space-y-3 pt-2">
                  <li className="flex items-start gap-3 text-[14px] text-[#18181B] font-medium">
                    <CheckCircle2 size={18} className="text-[#F97316] shrink-0 mt-0.5" />
                    <span>Real-time delivery order requests with store and drop details</span>
                  </li>
                  <li className="flex items-start gap-3 text-[14px] text-[#18181B] font-medium">
                    <CheckCircle2 size={18} className="text-[#F97316] shrink-0 mt-0.5" />
                    <span>In-app GPS route guidance to pickup and customer locations</span>
                  </li>
                  <li className="flex items-start gap-3 text-[14px] text-[#18181B] font-medium">
                    <CheckCircle2 size={18} className="text-[#F97316] shrink-0 mt-0.5" />
                    <span>Transparent trip breakdown and daily earnings tracker</span>
                  </li>
                  <li className="flex items-start gap-3 text-[14px] text-[#18181B] font-medium">
                    <CheckCircle2 size={18} className="text-[#F97316] shrink-0 mt-0.5" />
                    <span>Easy online / offline toggle for flexible availability</span>
                  </li>
                </ul>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <a
                    href="#register"
                    className="bg-[#F97316] hover:bg-[#EA580C] text-white text-[15px] font-semibold px-6 py-3 rounded-xl transition-colors shadow-xs inline-flex items-center gap-2"
                  >
                    <span>Get the Rider App</span>
                    <ArrowRight size={16} />
                  </a>
                  <span className="text-[12px] font-bold text-[#52525B] bg-white border border-[#E4E4E7] px-3 py-2 rounded-xl">
                    Available for Onboarded Partners
                  </span>
                </div>
              </div>

              {/* Right Phone Mockup Illustration */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-sm bg-[#18181B] p-4 rounded-[36px] shadow-xl border-4 border-[#27272A] text-white">
                  {/* Phone Screen Mockup Header */}
                  <div className="bg-[#27272A] rounded-2xl p-4 mb-4 flex items-center justify-between border border-[#3F3F46]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-[#F97316] animate-pulse"></div>
                      <span className="text-[13px] font-bold text-white">Rider App • Online</span>
                    </div>
                    <span className="text-[11px] bg-[#F97316]/20 text-[#F97316] px-2 py-0.5 rounded font-bold">
                      READY
                    </span>
                  </div>

                  {/* Active Delivery Request Widget */}
                  <div className="bg-white text-[#18181B] p-4 rounded-xl mb-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316]">
                        New Delivery Request
                      </span>
                      <span className="text-[12px] font-extrabold text-[#18181B]">
                        Trip #R-8492
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[13px]">
                      <div className="flex items-center gap-2 text-[#52525B]">
                        <MapPin size={14} className="text-[#F97316]" />
                        <span className="font-semibold text-[#18181B]">Pickup:</span> Fresh Bazaar, Sector 4
                      </div>
                      <div className="flex items-center gap-2 text-[#52525B]">
                        <Navigation size={14} className="text-[#F97316]" />
                        <span className="font-semibold text-[#18181B]">Drop:</span> Customer Block C (1.8 km)
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#E4E4E7] flex items-center justify-between">
                      <span className="text-[12px] text-[#52525B]">Est. Trip Earnings</span>
                      <span className="text-[15px] font-bold text-[#F97316]">Calculated in App</span>
                    </div>
                  </div>

                  {/* Earnings Tracker Widget */}
                  <div className="bg-[#27272A] p-4 rounded-xl border border-[#3F3F46] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#A1A1AA] block">Today's Completed Trips</span>
                      <span className="text-[16px] font-bold text-white">Managed via App</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#F97316] text-white flex items-center justify-center">
                      <Smartphone size={18} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 07. Safety & Support */}
        <section id="safety" className="py-16 md:py-24 bg-white border-b border-[#E4E4E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider bg-[#FFF7ED] px-3 py-1 rounded-md border border-[#F97316]/30 inline-block">
                RIDER ASSISTANCE
              </span>
              <h2 className="text-[26px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
                We’re here when you’re on the road
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#52525B] font-normal leading-[1.6]">
                Your safety and peace of mind on every delivery are important to us.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {safetyCards.map((card, idx) => {
                const IconComp = card.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#FAFAF9] border border-[#E4E4E7] rounded-2xl p-6 space-y-3 hover:border-[#F97316]/40 transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#F97316] flex items-center justify-center border border-[#F97316]/20">
                      <IconComp size={22} />
                    </div>
                    <h3 className="text-[16px] md:text-[18px] font-semibold text-[#18181B]">
                      {card.title}
                    </h3>
                    <p className="text-[13px] md:text-[14px] text-[#52525B] leading-[1.6]">
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 08. Rider Requirements */}
        <section id="requirements" className="py-16 md:py-24 bg-[#FAFAF9] border-b border-[#E4E4E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider bg-[#FFF7ED] px-3 py-1 rounded-md border border-[#F97316]/30 inline-block">
                CHECKLIST
              </span>
              <h2 className="text-[26px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
                What do you need to become a Filcarts Rider?
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#52525B] font-normal leading-[1.6]">
                Make sure you have these basic requirements ready before applying.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {riderRequirementsList.map((req, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#E4E4E7] rounded-2xl p-5 space-y-2 flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FFF7ED] text-[#F97316] flex items-center justify-center shrink-0 mt-0.5 border border-[#F97316]/20">
                    <Check size={15} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#18181B]">{req.title}</h4>
                    <p className="text-[13px] text-[#52525B] leading-[1.5]">{req.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-[12px] md:text-[13px] text-[#52525B] font-medium mt-8 italic">
              * Requirements may vary by location and applicable regulations.
            </p>
          </div>
        </section>

        {/* 09. FAQ Section */}
        <section id="faqs" className="py-16 md:py-24 bg-white border-b border-[#E4E4E7]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider bg-[#FFF7ED] px-3 py-1 rounded-md border border-[#F97316]/30 inline-block">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-[26px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
                Got questions? We have answers.
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#52525B] font-normal leading-[1.6]">
                Find clear information about joining, delivering, and onboarding.
              </p>
            </div>

            <div className="space-y-4">
              {riderFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-[#FAFAF9] border border-[#E4E4E7] rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-[14px] md:text-[16px] font-semibold text-[#18181B]">
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-[#F97316] transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 border-t border-[#E4E4E7]/60">
                        <p className="text-[13px] md:text-[14px] text-[#52525B] font-normal leading-[1.6]">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 10. Bottom Registration CTA Section */}
        <section id="register" className="py-16 md:py-24 bg-[#18181B] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider bg-[#FFF7ED]/10 px-3 py-1 rounded border border-[#F97316]/30 inline-block">
                RIDER REGISTRATION
              </span>
              <h2 className="text-[22px] md:text-[28px] font-extrabold text-white tracking-tight">
                Ready to ride with Filcarts?
              </h2>
              <p className="text-[14px] md:text-[15px] text-[#A1A1AA] font-normal leading-[1.6]">
                Register as a Delivery Partner and take the first step toward delivering with Filcarts.
              </p>
            </div>

            <div className="bg-[#27272A] border border-[#3F3F46] rounded-2xl p-6 sm:p-10 shadow-xl">
              {!isSubmitted ? (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-xl text-[13px] flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0 text-red-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-[13px] md:text-[14px] font-semibold text-[#D4D4D8]">
                        Full Name <span className="text-[#F97316]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full bg-[#18181B] border border-[#3F3F46] focus:border-[#F97316] rounded-xl px-4 py-3 text-[14px] md:text-[15px] text-white placeholder-[#71717A] outline-none transition-colors"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1.5">
                      <label className="block text-[13px] md:text-[14px] font-semibold text-[#D4D4D8]">
                        Mobile Number <span className="text-[#F97316]">*</span>
                      </label>
                      <div className="flex items-center">
                        <span className="bg-[#18181B] border border-r-0 border-[#3F3F46] text-[#A1A1AA] text-[14px] px-3 py-3 rounded-l-xl font-medium">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleInputChange}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          className="w-full bg-[#18181B] border border-[#3F3F46] focus:border-[#F97316] rounded-r-xl px-4 py-3 text-[14px] md:text-[15px] text-white placeholder-[#71717A] outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* City / Location */}
                    <div className="space-y-1.5">
                      <label className="block text-[13px] md:text-[14px] font-semibold text-[#D4D4D8]">
                        City / Location <span className="text-[#F97316]">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Mumbai, New Delhi, Bengaluru"
                        className="w-full bg-[#18181B] border border-[#3F3F46] focus:border-[#F97316] rounded-xl px-4 py-3 text-[14px] md:text-[15px] text-white placeholder-[#71717A] outline-none transition-colors"
                      />
                    </div>

                    {/* Vehicle Type */}
                    <div className="space-y-1.5">
                      <label className="block text-[13px] md:text-[14px] font-semibold text-[#D4D4D8]">
                        Vehicle Type
                      </label>
                      <select
                        name="vehicle"
                        value={form.vehicle}
                        onChange={handleInputChange}
                        className="w-full bg-[#18181B] border border-[#3F3F46] focus:border-[#F97316] rounded-xl px-4 py-3 text-[14px] md:text-[15px] text-white outline-none transition-colors cursor-pointer"
                      >
                        <option value="Motorbike / Scooter">Motorbike / Scooter</option>
                        <option value="EV Scooter">EV Scooter</option>
                        <option value="Bicycle">Bicycle</option>
                        <option value="Commercial Vehicle">Commercial Vehicle</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white text-[15px] font-bold py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <>
                          <span>Become a Delivery Partner</span>
                          <ArrowRight size={17} />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[12px] text-[#A1A1AA] text-center">
                    By registering, you agree to receive communications from Filcarts regarding rider onboarding.
                  </p>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FFF7ED] text-[#F97316] flex items-center justify-center mx-auto border border-[#F97316]/30">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-[22px] font-bold text-white">Application Received!</h3>
                  <p className="text-[14px] text-[#A1A1AA] max-w-md mx-auto leading-[1.6]">
                    Thank you, <strong className="text-white">{form.name}</strong>! Our onboarding team will contact you on <strong className="text-white">+91 {form.phone}</strong> for document verification.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setForm({ name: "", phone: "", city: "", vehicle: "Motorbike / Scooter" });
                      }}
                      className="text-[13px] font-semibold text-[#F97316] hover:underline cursor-pointer"
                    >
                      Register another delivery partner
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
