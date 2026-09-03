import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone, ShieldCheck, ArrowRight, ArrowLeft, Smartphone,
  RotateCcw, CheckCircle2, Lock, Mail, Sparkles, HelpCircle
} from "lucide-react";
import api from "../api";
import { useCart } from "../context/CartContext";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

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
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

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
    setIsLoggingIn(true);

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

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      if (res.data.customer) {
        setUser(res.data.customer);
      } else if (checkUserProfile) {
        await checkUserProfile();
      }

      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoggingIn(false);
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

    const isEmail = contact.includes("@") || /[a-zA-Z]/.test(contact);
    setIsSendingOtp(true);

    try {
      const res = await api.post("/send-otp", {
        [isEmail ? "email" : "contact"]: contact.trim(),
        email: isEmail ? contact.trim() : undefined,
        contact: contact.trim(),
        type: "email",
      });

      if (res.data.customer) {
        setCustomerProfile(res.data.customer);
      }
      setStep("otp");
      setTimer(30);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSendingOtp(false);
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

    const isEmail = contact.includes("@") || /[a-zA-Z]/.test(contact);
    setIsVerifyingOtp(true);

    try {
      const res = await api.post("/verify-otp", {
        [isEmail ? "email" : "contact"]: contact.trim(),
        email: isEmail ? contact.trim() : undefined,
        contact: contact.trim(),
        otp: entered,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      const customerObj = res.data.customer || customerProfile;
      if (customerObj) {
        setUser(customerObj);
      } else if (checkUserProfile) {
        await checkUserProfile();
      }

      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isSendingOtp) return;
    setError("");
    const isEmail = contact.includes("@") || /[a-zA-Z]/.test(contact);
    setIsSendingOtp(true);

    try {
      await api.post("/send-otp", {
        [isEmail ? "email" : "contact"]: contact.trim(),
        email: isEmail ? contact.trim() : undefined,
        contact: contact.trim(),
        type: "email",
      });
      setTimer(30);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google-login", {
        token: credentialResponse.credential,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      if (res.data?.user || res.data?.customer) {
        setUser(res.data.user || res.data.customer);
      }

      if (typeof checkUserProfile === "function") {
        await checkUserProfile();
      }

      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR", err.response?.data || err.message);
      setError("Google login failed. Please try again.");
    }
  }, [navigate, setUser, checkUserProfile]);

  const handleGoogleError = useCallback(() => {
    setError("Google login was cancelled or failed.");
  }, []);

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

          {/* STEP 1: EMAIL / PHONE INPUT */}
          {step === "phone" && loginMode === "otp" && (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-extrabold text-[#17231A] mb-1.5">
                  Email Address or Mobile Number
                </label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder="Enter email (e.g. name@gmail.com) or phone"
                    value={contact}
                    onChange={handleContactChange}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-[#17231A] focus:outline-none focus:border-[#16A34A] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] disabled:bg-[#86efac] disabled:cursor-not-allowed text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSendingOtp ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending OTP to your email...</span>
                  </>
                ) : (
                  <>
                    <span>Get Instant Email OTP</span>
                    <ArrowRight size={15} />
                  </>
                )}
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
                disabled={isLoggingIn}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] disabled:bg-[#86efac] disabled:cursor-not-allowed text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Login with Password</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* GOOGLE SIGN-IN BUTTON */}
{step === "phone" && (
  <div className="space-y-4">
    <div className="relative flex py-1 items-center">
      <div className="flex-grow border-t border-slate-200"></div>
      <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
        Or continue with
      </span>
      <div className="flex-grow border-t border-slate-200"></div>
    </div>

    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        shape="pill"
      />
    </div>
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

                <span className="text-slate-400 text-[11px] font-semibold">Check your email inbox / spam</span>
              </div>

              <button
                type="submit"
                disabled={isVerifyingOtp}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] disabled:bg-[#86efac] disabled:cursor-not-allowed text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifyingOtp ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Login</span>
                    <CheckCircle2 size={15} />
                  </>
                )}
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
