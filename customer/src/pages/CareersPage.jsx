import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Users, Heart,
  Zap, ShieldCheck, Search, ChevronRight, X, Sparkles, Building2, Code,
  Megaphone, Navigation, Store, Bike, Layers, Award, ShieldAlert, FileText, Upload
} from "lucide-react";

// Curated Unsplash Department Photos matching FillCarts Hyperlocal Team Roles
const DEPARTMENT_IMAGE_MAP = {
  Engineering: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
  "Merchant Success": "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop&q=80",
  "Fleet Operations": "https://images.unsplash.com/photo-1587560699334-bea93391dcef?w=800&auto=format&fit=crop&q=80",
  "City Logistics": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80"
};

const hyperlocalImpact = [
  {
    icon: Store,
    bg: "bg-[#ECFDF3]",
    color: "text-[#16A34A]",
    title: "Empower Local Kiranas",
    desc: "We bring neighbourhood shopkeepers online without forcing expensive dark-store displacement."
  },
  {
    icon: Navigation,
    bg: "bg-[#ECFDF3]",
    color: "text-[#166534]",
    title: "Deep Geospatial Tech",
    desc: "Build sub-second dispatch algorithms, H3 spatial grid indexing, and real-time GPS tracking."
  },
  {
    icon: Bike,
    bg: "bg-amber-50",
    color: "text-[#F59E0B]",
    title: "Fleet Welfare First",
    desc: "100% medical insurance, transparent earnings, and instant daily payout pipelines for riders."
  },
  {
    icon: Zap,
    bg: "bg-[#ECFDF3]",
    color: "text-[#16A34A]",
    title: "15-Minute Fulfillment",
    desc: "Solve the last-100-meter delivery challenges in hyper-dense urban Indian neighbourhoods."
  }
];

const hyperlocalJobs = [
  {
    id: "geo-eng",
    title: "Senior Geospatial & Dispatch Engineer",
    department: "Engineering",
    deptIcon: Code,
    location: "Bengaluru, IN / Remote",
    type: "Full-Time",
    exp: "4-7 Years",
    tag: "Core Tech",
    desc: "Build H3 grid spatial indexes, rider-vendor matching engines, and sub-100ms order dispatch pipelines using Node.js & Go.",
    requirements: ["Deep experience with PostGIS, H3, or Uber H3 spatial indexing", "High-concurrency microservices architecture", "WebSocket & Redis real-time state management"]
  },
  {
    id: "merch-lead",
    title: "Merchant POS & Kirana Onboarding Lead",
    department: "Merchant Success",
    deptIcon: Store,
    location: "Delhi NCR, IN (On-Site)",
    type: "Full-Time",
    exp: "3-5 Years",
    tag: "Field Operations",
    desc: "Lead field teams digitizing local kiranas, pharmacy stores, and fresh fruit vendors with our lightweight POS & inventory app.",
    requirements: ["Proven experience in retail merchant acquisition or SMB sales", "Deep understanding of kirana supply chain dynamics", "Fluency in local market expansion"]
  },
  {
    id: "fleet-ops",
    title: "Delivery Fleet Safety & Operations Manager",
    department: "Fleet Operations",
    deptIcon: Bike,
    location: "Mumbai, IN (Hybrid)",
    type: "Full-Time",
    exp: "3-6 Years",
    tag: "Fleet Welfare",
    desc: "Manage rider onboarding, safety compliance, daily payout infrastructure, and localized rider hub management.",
    requirements: ["Experience managing 1000+ rider fleet operations", "Strong data analytics & rider retention strategies", "Passion for driver safety and fair payout standards"]
  },
  {
    id: "micro-hub",
    title: "Hyperlocal Micro-Fulfillment Manager",
    department: "City Logistics",
    deptIcon: Building2,
    location: "Pune, IN (On-Site)",
    type: "Full-Time",
    exp: "2-5 Years",
    tag: "City Ops",
    desc: "Oversee pincode-level dark hubs, inventory accuracy, and express packing turnarounds under 3 minutes.",
    requirements: ["Experience in quick-commerce or e-commerce dark store management", "Six Sigma or LEAN fulfillment process optimization", "Team leadership over 30+ warehouse associates"]
  },
  {
    id: "mob-android",
    title: "Lead Mobile Engineer (Merchant & Rider Apps)",
    department: "Engineering",
    deptIcon: Code,
    location: "Remote / Hybrid",
    type: "Full-Time",
    exp: "4-6 Years",
    tag: "Mobile",
    desc: "Architect offline-first, low-bandwidth resilient Android apps used by thousands of shopkeepers and delivery partners daily.",
    requirements: ["React Native / Android Kotlin experience", "Offline synchronization & SQLite local caching", "Push notification & background location tracking reliability"]
  }
];

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showAppForm, setShowAppForm] = useState(false);

  // Application Form State
  const [appForm, setAppForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "3-5 Years",
    resumeName: "",
    coverNote: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const departments = ["All", "Engineering", "Merchant Success", "Fleet Operations", "City Logistics"];

  const filteredJobs = hyperlocalJobs.filter((job) => {
    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    const matchesQuery =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQuery;
  });

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowAppForm(true);
    setFormSubmitted(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!appForm.name || !appForm.email || !appForm.phone) {
      alert("Please fill in your name, email, and phone number.");
      return;
    }
    setFormSubmitted(true);
  };

  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Shared Common Navbar */}
      <Navbar searchPlaceholder="Search career opportunities at FillCarts..." />


      {/* 1. HERO SECTION */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 space-y-5 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80 mb-1">
              <Sparkles size={13} /> We Are Hiring
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#17231A] leading-[1.12] tracking-tight">
              Build the future of <br />
              <span className="text-[#16A34A] relative inline-block">
                hyperlocal commerce.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl leading-relaxed">
              Join FillCarts to empower local kiranas, optimize sub-second geospatial dispatch algorithms, and build fair earnings infrastructure for delivery partners.
            </p>

            <div className="flex items-center gap-3 pt-2 flex-wrap justify-center sm:justify-start">
              <a
                href="#open-positions"
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-7 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer group"
              >
                <span>View Open Positions ({hyperlocalJobs.length})</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#our-impact"
                className="bg-[#FFFCF5] hover:bg-[#ECFDF3] text-[#166534] border border-emerald-200 font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <span>Our Engineering Culture</span>
              </a>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="md:col-span-5 relative">
            <div className="bg-white border-2 border-emerald-200 rounded-3xl overflow-hidden shadow-lg group">
              <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                  alt="FillCarts Engineering Team"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white text-left">
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                      🔥 High-Growth Culture
                    </span>
                    <h3 className="text-lg font-extrabold text-white">FillCarts Tech & Ops Teams</h3>
                    <p className="text-xs text-slate-200 font-medium">Building scalable systems for 10M+ neighbourhood customers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN BODY */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-16 flex-1 w-full text-left">

        {/* 2. OUR HYPERLOCAL IMPACT & TECH CULTURE */}
        <section id="our-impact" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-1">
                <Sparkles size={13} /> Our Mission & Tech
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
                Why Work With FillCarts?
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full w-fit">
              ✓ Impacting Millions of Local Lives
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hyperlocalImpact.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-emerald-100 hover:border-[#16A34A] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left space-y-3 group"
              >
                <div className={`w-11 h-11 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center font-bold group-hover:scale-110 transition-transform`}>
                  <item.icon size={22} />
                </div>
                <h3 className="font-extrabold text-base text-[#17231A] group-hover:text-[#166534] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. OPEN POSITIONS & SEARCH */}
        <section id="open-positions" className="space-y-8">
          <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-1">
                  <Briefcase size={13} /> Open Positions
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
                  Explore Job Opportunities
                </h2>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Search role, skill, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#FFFCF5] border border-slate-200 text-xs font-semibold rounded-full pl-9 pr-4 py-2.5 w-full focus:outline-none focus:border-[#16A34A]"
                />
              </div>
            </div>

            {/* Department Chips Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-black text-slate-400 uppercase text-[10px] mr-1">Department:</span>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border cursor-pointer ${
                    selectedDept === dept
                      ? "bg-[#16A34A] text-white border-[#16A34A] shadow-xs"
                      : "bg-[#FFFCF5] border-slate-200 text-slate-700 hover:bg-[#ECFDF3] hover:border-emerald-300"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-white border border-emerald-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs">
                <Briefcase size={36} className="text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-extrabold text-[#17231A]">No matching roles found</h3>
                <p className="text-xs text-slate-500 mb-4 font-medium">Try adjusting your search query or department filter.</p>
                <button
                  onClick={() => { setSelectedDept("All"); setSearchQuery(""); }}
                  className="bg-[#16A34A] text-white font-extrabold text-xs px-5 py-2.5 rounded-full shadow-sm cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const DeptIcon = job.deptIcon || Briefcase;
                const deptImage = DEPARTMENT_IMAGE_MAP[job.department] || DEPARTMENT_IMAGE_MAP.Engineering;

                return (
                  <div
                    key={job.id}
                    className="bg-white border border-emerald-100 hover:border-[#16A34A] rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 space-y-4 group overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                          <DeptIcon size={22} />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black uppercase text-[#166534] bg-[#ECFDF3] px-2.5 py-0.5 rounded-full border border-emerald-200">
                              {job.department}
                            </span>
                            <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                              {job.tag}
                            </span>
                          </div>

                          <h3 className="text-lg font-extrabold text-[#17231A] group-hover:text-[#166534] transition-colors">
                            {job.title}
                          </h3>

                          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1"><MapPin size={13} className="text-[#16A34A]" /> {job.location}</span>
                            <span className="flex items-center gap-1"><Clock size={13} className="text-slate-400" /> {job.type}</span>
                            <span className="flex items-center gap-1"><Briefcase size={13} className="text-slate-400" /> {job.exp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="bg-[#FFFCF5] hover:bg-[#ECFDF3] text-[#166534] border border-emerald-200 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleApplyClick(job)}
                          className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Apply Now</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed pt-2 border-t border-slate-100">
                      {job.desc}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* JOB DETAILS MODAL */}
      {selectedJob && !showAppForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-emerald-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 text-left">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#166534] bg-[#ECFDF3] px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mb-1">
                  {selectedJob.department} • {selectedJob.location}
                </span>
                <h3 className="text-xl font-extrabold text-[#17231A]">{selectedJob.title}</h3>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-extrabold text-[#166534] uppercase text-[11px] mb-1">Role Description</h4>
                <p className="text-slate-600 font-medium leading-relaxed">{selectedJob.desc}</p>
              </div>

              <div>
                <h4 className="font-extrabold text-[#166534] uppercase text-[11px] mb-2">Key Requirements</h4>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 font-semibold">
                      <CheckCircle2 size={15} className="text-[#16A34A] shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleApplyClick(selectedJob)}
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Apply for this Position</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION FORM MODAL */}
      {showAppForm && selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-emerald-100 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 text-left">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#166534] bg-[#ECFDF3] px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mb-1">
                  Application Form
                </span>
                <h3 className="text-xl font-extrabold text-[#17231A]">Apply for {selectedJob.title}</h3>
              </div>
              <button
                onClick={() => { setShowAppForm(false); setSelectedJob(null); }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {formSubmitted ? (
              <div className="bg-[#ECFDF3] border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#16A34A] text-white flex items-center justify-center mx-auto font-bold">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-lg font-extrabold text-[#17231A]">Application Submitted! 🎉</h4>
                <p className="text-xs text-slate-600 font-medium">
                  Thank you <strong>{appForm.name}</strong>. Our talent acquisition team will review your application for <strong>{selectedJob.title}</strong> and reach out shortly.
                </p>
                <button
                  onClick={() => { setShowAppForm(false); setSelectedJob(null); }}
                  className="bg-[#16A34A] text-white font-extrabold text-xs px-5 py-2.5 rounded-full shadow-sm cursor-pointer mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-extrabold text-[#17231A] mb-1">Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ananya Roy"
                    value={appForm.name}
                    onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-extrabold text-[#17231A] mb-1">Email Address *</label>
                    <input
                      required
                      type="email"
                      placeholder="name@example.com"
                      value={appForm.email}
                      onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-[#17231A] mb-1">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      placeholder="9876543210"
                      value={appForm.phone}
                      onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-[#17231A] mb-1">Years of Relevant Experience</label>
                  <select
                    value={appForm.experience}
                    onChange={(e) => setAppForm({ ...appForm, experience: e.target.value })}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs focus:outline-none focus:border-[#16A34A] cursor-pointer"
                  >
                    <option>1-3 Years</option>
                    <option>3-5 Years</option>
                    <option>5-8 Years</option>
                    <option>8+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-[#17231A] mb-1">Attach Resume / CV (PDF / DOCX)</label>
                  <div className="border border-dashed border-slate-300 bg-[#FFFCF5] rounded-xl p-3 text-center cursor-pointer hover:border-[#16A34A]">
                    <Upload size={18} className="text-slate-400 mx-auto mb-1" />
                    <span className="text-[11px] text-slate-500 font-semibold">Click to upload your resume</span>
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-[#17231A] mb-1">Why FillCarts? (Short Cover Note)</label>
                  <textarea
                    rows={2}
                    placeholder="Briefly tell us why you are interested in this role..."
                    value={appForm.coverNote}
                    onChange={(e) => setAppForm({ ...appForm, coverNote: e.target.value })}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAppForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
