import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Users, Heart,
  Zap, ShieldCheck, Search, ChevronRight, X, Sparkles, Building2, Code,
  Megaphone, Navigation, Store, Bike, Layers, Award, ShieldAlert
} from "lucide-react";

const hyperlocalImpact = [
  {
    icon: Store,
    bg: "bg-blue-50",
    color: "text-blue-600",
    title: "Empower Local Kiranas",
    desc: "We bring neighbourhood shopkeepers online without forcing expensive dark-store displacement."
  },
  {
    icon: Navigation,
    bg: "bg-teal-50",
    color: "text-teal-600",
    title: "Deep Geospatial Tech",
    desc: "Build sub-second dispatch algorithms, H3 spatial grid indexing, and real-time GPS tracking."
  },
  {
    icon: Bike,
    bg: "bg-amber-50",
    color: "text-amber-700",
    title: "Fleet Welfare First",
    desc: "100% medical insurance, transparent earnings, and instant daily payout pipelines for riders."
  },
  {
    icon: Zap,
    bg: "bg-violet-50",
    color: "text-violet-600",
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
    requirements: ["Expertise in Kotlin / React Native / Flutter", "Offline data synchronization and background GPS tracking", "Optimized UI for low-cost Android devices"]
  },
  {
    id: "growth-mktg",
    title: "Hyperlocal Growth Manager (Pincode Strategy)",
    department: "Marketing & Growth",
    deptIcon: Megaphone,
    location: "Bengaluru, IN (Hybrid)",
    type: "Full-Time",
    exp: "3-5 Years",
    tag: "Growth",
    desc: "Drive hyper-targeted pincode marketing, local shop co-branding, customer acquisition, and subscription trial campaigns.",
    requirements: ["Track record in performance marketing & B2C app growth", "Hyperlocal offline + online campaign management", "A/B testing user funnel conversion"]
  }
];

const departments = ["All", "Engineering", "Merchant Success", "Fleet Operations", "City Logistics", "Marketing & Growth"];

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [applyingJob, setApplyingJob] = useState(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "", experience: "", resume: "", note: "" });
  const [error, setError] = useState("");

  const filteredJobs = hyperlocalJobs.filter((job) => {
    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Full Name must contain at least 2 letters.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address (e.g. name@gmail.com).");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Phone number must be exactly 10 digits (digits only).");
      return;
    }

    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setApplyingJob(null);
      setForm({ name: "", email: "", phone: "", experience: "", resume: "", note: "" });
      setError("");
    }, 2500);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Shared Navbar */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center gap-1.5">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={13} />
          <span className="text-slate-900 font-bold">Hyperlocal Careers</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3.5 py-1.5 text-sm font-bold mb-5">
          <Briefcase size={14} className="text-blue-600" /> Hyperlocal Engineering & Operations
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
          Build the operating system for hyperlocal commerce.
        </h1>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8">
          We are empowering local shopkeepers, optimizing sub-15 minute rider dispatch, and serving daily neighbourhood needs across India. Join our mission.
        </p>

        {/* Quick Search Bar */}
        <div className="max-w-md mx-auto relative flex items-center bg-white border border-slate-200 rounded-full px-4 py-2.5 shadow-sm">
          <Search size={16} className="text-slate-400 mr-2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles e.g. Geospatial, Fleet, Merchant..."
            className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400 font-semibold"
          />
        </div>
      </section>

      {/* Hyperlocal Impact & Mission Pillars */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="mb-9 text-center">
          <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-2">Our Pillars</span>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Why FillCarts is different.</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {hyperlocalImpact.map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className={`w-11 h-11 rounded-full ${item.bg} ${item.color} flex items-center justify-center mb-3.5`}>
                <item.icon size={19} />
              </div>
              <div className="font-extrabold text-base mb-1">{item.title}</div>
              <div className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Hyperlocal Fleet & Merchant Stats */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xl">
          <div>
            <div className="text-3xl font-extrabold text-blue-400" style={{ fontFamily: "'Fraunces', serif" }}>15 Min</div>
            <div className="text-xs font-bold text-slate-400 mt-1">Avg Delivery Window</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-teal-400" style={{ fontFamily: "'Fraunces', serif" }}>420+</div>
            <div className="text-xs font-bold text-slate-400 mt-1">Local Merchant Partners</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-amber-400" style={{ fontFamily: "'Fraunces', serif" }}>1,200+</div>
            <div className="text-xs font-bold text-slate-400 mt-1">Active Fleet Partners</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-violet-400" style={{ fontFamily: "'Fraunces', serif" }}>99.4%</div>
            <div className="text-xs font-bold text-slate-400 mt-1">On-Time Fulfillment</div>
          </div>
        </div>
      </section>

      {/* Hyperlocal Job Openings */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>Hyperlocal Open Roles</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Shape tech & operations for neighbourhood quick-commerce.</p>
          </div>

          {/* Department Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                  selectedDept === dept
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 font-semibold">
            No active roles match your search or filter. Try selecting another department.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filteredJobs.map((job) => {
              const DeptIcon = job.deptIcon;
              return (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200 hover:border-blue-500/50 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                        <DeptIcon size={13} /> {job.department}
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {job.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-2 text-slate-900 leading-snug">{job.title}</h3>
                    <p className="text-xs text-slate-600 font-medium mb-4 leading-relaxed">{job.desc}</p>

                    <div className="space-y-1 mb-4">
                      {job.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                          <CheckCircle2 size={13} className="text-teal-600 flex-shrink-0" /> {req}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-5 border-t border-slate-100 pt-3">
                      <span className="flex items-center gap-1"><MapPin size={13} className="text-blue-600" /> {job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>

                    <button
                      onClick={() => setApplyingJob(job)}
                      className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl py-2.5 text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      Apply For This Role <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Application Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setApplyingJob(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
            >
              <X size={16} />
            </button>

            {appliedSuccess ? (
              <div className="py-8 text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Application Submitted!</h3>
                <p className="text-xs text-slate-500 font-medium">Thank you for applying for <strong>{applyingJob.title}</strong>. Our recruiting team will contact you within 48 hours.</p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Apply For Position</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{applyingJob.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{applyingJob.department} · {applyingJob.location}</p>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value.replace(/[^a-zA-Z\s]/g, "") });
                        setError("");
                      }}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value.replace(/[^a-zA-Z0-9._%+-@]/g, "") });
                          setError("");
                        }}
                        placeholder="vikram@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone (10 Digits)</label>
                      <input
                        required
                        type="text"
                        maxLength={10}
                        value={form.phone}
                        onChange={(e) => {
                          setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) });
                          setError("");
                        }}
                        placeholder="9876543210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 font-semibold"
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">{error}</p>}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Relevant Experience</label>
                    <input
                      required
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                      placeholder="e.g. 4 Years in E-Commerce Logistics"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Resume Link (Drive/Dropbox/LinkedIn)</label>
                    <input
                      required
                      value={form.resume}
                      onChange={(e) => setForm({ ...form, resume: e.target.value })}
                      placeholder="https://drive.google.com/your-resume"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl py-3 text-xs shadow-md shadow-blue-600/20 transition-all mt-2"
                  >
                    Submit Application
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
