import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, UserRound, Phone, Mail, MapPin, Lock, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import api from "../api";

const getErrorMessage = (err) => {
  const responseData = err?.response?.data;
  if (typeof responseData === "string") return responseData;
  if (responseData && typeof responseData === "object") {
    return responseData.message || "Something went wrong on the server.";
  }
  return err?.message || "Failed to create customer profile.";
};

export default function CustomerRegistrationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "name"
          ? value.replace(/[^a-zA-Z\s]/g, "")
          : name === "phone"
            ? value.replace(/\D/g, "").slice(0, 10)
            : name === "email"
              ? value.replace(/[^a-zA-Z0-9._%+-@]/g, "")
              : name === "pincode"
                ? value.replace(/\D/g, "").slice(0, 6)
                : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.address.trim() ||
      !form.pincode.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.name.trim().length < 2) {
      setError("Full Name must contain at least 2 letters.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Mobile Number must be exactly 10 digits (no letters or symbols).");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email format (e.g. name@gmail.com).");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError("Pincode must be exactly 6 digits.");
      return;
    }

    if (form.address.trim().length < 5) {
      setError("Please enter a complete delivery address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post("/register-customer", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        password: form.password,
        address: form.address.trim(),
        pincode: form.pincode.trim(),
      });

      setSuccess(res.data.message || "Account registered successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col justify-between font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#16A34A] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm">
              F
            </div>
            <span className="font-extrabold text-xl text-[#17231A] tracking-tight">
              Fill<span className="text-[#16A34A]">Carts</span>
            </span>
          </Link>

          <Link
            to="/login"
            className="text-xs font-extrabold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-4 py-2 rounded-full hover:bg-emerald-100 transition-colors"
          >
            Already Have Account? Login
          </Link>
        </div>
      </header>

      {/* CENTER REGISTRATION CONTAINER */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-10">
        <div className="max-w-lg w-full bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-left relative">
          
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80 mb-1">
              <Sparkles size={13} /> Create Account
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
              Join the FillCarts Ecosystem
            </h1>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              Get instant 15-minute delivery from your favourite local kiranas & morning daily subscriptions.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-2xl flex items-center gap-2">
              <span className="shrink-0 font-black">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-[#ECFDF3] border border-emerald-200 text-[#166534] text-xs font-extrabold p-3.5 rounded-2xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-extrabold text-[#17231A] mb-1">Full Name *</label>
              <div className="relative flex items-center">
                <UserRound size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="e.g. Ramesh Patel"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-[#FFFCF5] border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                />
              </div>
            </div>

            {/* Mobile & Email Grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-extrabold text-[#17231A] mb-1">Mobile Number *</label>
                <div className="relative flex items-center">
                  <Phone size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-[#17231A] mb-1">Email Address *</label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-extrabold text-[#17231A] mb-1">Account Password *</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  required
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-[#FFFCF5] border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                />
              </div>
            </div>

            {/* Address & Pincode */}
            <div className="space-y-3">
              <div>
                <label className="block font-extrabold text-[#17231A] mb-1">Primary Delivery Address *</label>
                <div className="relative flex items-start">
                  <MapPin size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <textarea
                    required
                    rows={2}
                    name="address"
                    placeholder="Flat/House No, Building Name, Street, Area..."
                    value={form.address}
                    onChange={handleChange}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-[#17231A] mb-1">Pincode *</label>
                <input
                  required
                  type="text"
                  name="pincode"
                  placeholder="6-digit pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full bg-[#FFFCF5] border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 mt-2"
            >
              <span>{isSubmitting ? "Creating Account..." : "Register Customer Account"}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* GOOGLE SIGN-IN BUTTON */}
          <div className="space-y-4">
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Or register with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            <button
              type="button"
              onClick={() => alert("Google Sign-In functionality will be implemented soon!")}
              className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-[#17231A] font-extrabold text-xs py-3 rounded-2xl border border-slate-200 shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-xs font-semibold text-slate-500">
            Already registered?{" "}
            <Link to="/login" className="font-extrabold text-[#16A34A] hover:underline">
              Log in to your account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-4 px-6 text-center text-xs text-slate-400 font-semibold">
        © 2026 FillCarts Technologies Pvt Ltd. All rights reserved.
      </footer>
    </div>
  );
}
