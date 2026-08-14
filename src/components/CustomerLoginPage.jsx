import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone, ShieldCheck, ArrowRight, ArrowLeft, Smartphone,
  RotateCcw, CheckCircle2, Lock, Mail, Sparkles, HelpCircle
} from "lucide-react";
import api from "../api";
import { useCart } from "../context/CartContext";

const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
};

const getErrorMessage = (err) => {
  const responseData = err?.response?.data;
  if (typeof responseData === "string") return responseData;
  if (responseData && typeof responseData === "object") {
    return responseData.message || "Something went wrong on the server.";
  }
  return err?.message || "Something went wrong.";
};

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const { setUser, checkUserProfile } = useCart();
  const [step, setStep] = useState("phone");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [customerProfile, setCustomerProfile] = useState(null);
  const [loginMode, setLoginMode] = useState("otp");

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);

  const handleContactChange = (e) => {
    const raw = e.target.value;
    const hasNonDigit = /[^0-9]/.test(raw);

    let normalized = "";
    if (hasNonDigit) {
      normalized = raw.replace(/[^a-zA-Z0-9._%+-@]/g, "");
    } else {
      normalized = raw.slice(0, 10);
    }

    setContact(normalized);
    setError("");
  };

  const validateContactInput = (inputVal) => {
    const trimmed = inputVal.trim();
    if (!trimmed) {
      return "Please enter your mobile number or email address.";
    }

    const isEmail = trimmed.includes("@") || /[a-zA-Z]/.test(trimmed);
    if (isEmail) {
      if (!isValidEmail(trimmed)) {
        return "Please enter a valid email format (e.g. name@gmail.com).";
      }
    } else {
      if (!/^\d{10}$/.test(trimmed)) {
        return "Please enter a valid 10-digit mobile number.";
      }
    }
    return null;
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateContactInput(contact);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!password.trim()) {
      setError("Please enter your account password.");
      return;
    }

    const isEmail = contact.includes("@");

    try {
      const payload = isEmail
        ? { email: contact.trim(), password }
        : { phone: contact.trim(), password };

      let res;
      try {
        res = await api.post("/login-customer", payload);
      } catch (err) {
        if (err?.response?.status === 404) {
          res = await api.post("/customer/login", payload);
        } else {
          throw err;
        }
      }

      if (res.data.customer) {
        setUser(res.data.customer);
      } else if (checkUserProfile) {
        await checkUserProfile();
      }

      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateContactInput(contact);
    if (validationError) {
      setError(validationError);
      return;
    }

    const isEmail = contact.includes("@");

    try {
      const res = await api.post("/send-otp", {
        [isEmail ? "email" : "phone"]: contact.trim(),
      });

      if (res.data.customer) {
        setCustomerProfile(res.data.customer);
      }
      setStep("otp");
      setTimer(30);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleOtpChange = (index, val) => {
    if (val && !/^\d$/.test(val)) return;
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    setError("");

    if (val && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`);
      if (el) el.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    const entered = otp.join("");
    if (entered.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    const isEmail = contact.includes("@");

    try {
      const res = await api.post("/verify-otp", {
        [isEmail ? "email" : "phone"]: contact.trim(),
        otp: entered,
      });

      const customerObj = res.data.customer || customerProfile;
      if (customerObj) {
        setUser(customerObj);
      } else if (checkUserProfile) {
        await checkUserProfile();
      }

      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setError("");
    const isEmail = contact.includes("@");

    try {
      await api.post("/send-otp", {
        [isEmail ? "email" : "phone"]: contact.trim(),
      });
      setTimer(30);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col justify-between font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Top Simple Header */}
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
            to="/categories"
            className="text-xs font-extrabold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-4 py-2 rounded-full hover:bg-emerald-100 transition-colors"
          >
            Explore Marketplace
          </Link>
        </div>
      </header>

      {/* CENTER LOGIN CONTAINER */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="max-w-md w-full bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-left relative overflow-hidden">
          
          {/* Top Pill Badge */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80 mb-1">
              <ShieldCheck size={13} /> Secure Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
              Welcome Back to FillCarts
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Log in to manage orders, daily subscriptions & saved addresses.
            </p>
          </div>

          {/* Login Method Tabs */}
          {step === "phone" && (
            <div className="grid grid-cols-2 bg-[#ECFDF3] border border-emerald-200 p-1 rounded-2xl text-xs font-extrabold text-center">
              <button
                type="button"
                onClick={() => { setLoginMode("otp"); setError(""); }}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  loginMode === "otp"
                    ? "bg-[#16A34A] text-white shadow-xs"
                    : "text-[#166534] hover:bg-white/50"
                }`}
              >
                OTP Login
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode("password"); setError(""); }}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  loginMode === "password"
                    ? "bg-[#16A34A] text-white shadow-xs"
                    : "text-[#166534] hover:bg-white/50"
                }`}
              >
                Password Login
              </button>
            </div>
          )}

          {/* ERROR ALERT */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-2xl flex items-center gap-2">
              <span className="shrink-0 font-black">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: PHONE / EMAIL INPUT */}
          {step === "phone" && loginMode === "otp" && (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-extrabold text-[#17231A] mb-1.5">
                  Mobile Number or Email Address
                </label>
                <div className="relative flex items-center">
                  <Smartphone size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder="Enter 10-digit phone or name@email.com"
                    value={contact}
                    onChange={handleContactChange}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-[#17231A] focus:outline-none focus:border-[#16A34A] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Instant OTP</span>
                <ArrowRight size={15} />
              </button>
            </form>
          )}

          {/* STEP 1: PASSWORD LOGIN */}
          {step === "phone" && loginMode === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-extrabold text-[#17231A] mb-1.5">
                  Mobile Number or Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder="Enter 10-digit phone or name@email.com"
                    value={contact}
                    onChange={handleContactChange}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-[#17231A] focus:outline-none focus:border-[#16A34A] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-[#17231A] mb-1.5">
                  Account Password
                </label>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    required
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-[#17231A] focus:outline-none focus:border-[#16A34A] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Login with Password</span>
                <ArrowRight size={15} />
              </button>
            </form>
          )}

          {/* GOOGLE SIGN-IN BUTTON */}
          {step === "phone" && (
            <div className="space-y-4">
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Or continue with</span>
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
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs">
              <div className="bg-[#ECFDF3] border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#166534] block">OTP Sent To</span>
                  <span className="font-extrabold text-[#17231A]">{contact}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-xs font-bold text-[#16A34A] hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block font-extrabold text-[#17231A] mb-2 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex justify-between gap-2 max-w-xs mx-auto">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-10 h-12 text-center text-base font-black bg-[#FFFCF5] border-2 border-emerald-200 rounded-xl text-[#17231A] focus:border-[#16A34A] focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timer > 0}
                  className={`font-bold ${
                    timer > 0
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-[#16A34A] hover:underline cursor-pointer"
                  }`}
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </button>

                <span className="text-slate-400 text-[11px] font-semibold">Demo OTP: 123456</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify & Login</span>
                <CheckCircle2 size={15} />
              </button>
            </form>
          )}

          {/* Footer Link to Register */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs font-semibold text-slate-500">
            Don't have a FillCarts account?{" "}
            <Link to="/register" className="font-extrabold text-[#16A34A] hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-100 py-4 px-6 text-center text-xs text-slate-400 font-semibold">
        © 2026 FillCarts Technologies Pvt Ltd. All rights reserved.
      </footer>
    </div>
  );
}
