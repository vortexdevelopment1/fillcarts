import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  QrCode,
  RotateCcw,
  CheckCircle2,
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
    // If input contains any non-digit character (letters, @, etc.), treat as email
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
      await api.post("/login-customer", {
        phone: isEmail ? "" : contact.trim(),
        email: isEmail ? contact.trim() : "",
        password,
      });

      const profileRes = await api.get("/profile");
      const loggedInCustomer = profileRes.data.customer || null;
      setError("");
      setCustomerProfile(loggedInCustomer);
      if (loggedInCustomer) {
        setUser(loggedInCustomer);
        if (checkUserProfile) await checkUserProfile();
      }
      setStep("success");
      setTimeout(() => navigate("/"), 900);
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
      await api.post("/send-otp", {
        contact: contact.trim(),
        type: isEmail ? "email" : "sms",
      });

      setError("");
      setOtp(["", "", "", "", "", ""]);
      setStep("otp");
      setTimer(30);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      e.preventDefault();
      const next = [...otp];
      next[i - 1] = "";
      setOtp(next);
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Enter the complete 6-digit OTP");
      return;
    }

    try {
      await api.post("/verify-otp", {
        contact,
        otp: enteredOtp,
      });

      const profileRes = await api.get("/profile");
      const loggedInCustomer = profileRes.data.customer || null;
      setError("");
      setCustomerProfile(loggedInCustomer);
      if (loggedInCustomer) {
        setUser(loggedInCustomer);
        if (checkUserProfile) await checkUserProfile();
      }
      setStep("success");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 flex flex-col" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500,600,700,800&display=swap" rel="stylesheet" />

      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold" style={{ fontFamily: "'Fraunces', serif" }}>
            Fill<span className="text-blue-600">Carts</span>
          </Link>
          <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1.5">
            <ArrowLeft size={15} /> Back to Home
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <Smartphone size={22} />
            </div>

            {step === "phone" && (
              <>
                <h1 className="text-2xl font-bold mb-1.5" style={{ fontFamily: "'Fraunces', serif" }}>Log in to order</h1>

                <p className="text-sm text-slate-500 mb-7">Enter your mobile number or email to continue as a customer.</p>

                <div className="flex gap-2 mb-4 rounded-full bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setLoginMode("otp")}
                    className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold ${loginMode === "otp" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                  >
                    OTP Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMode("password")}
                    className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold ${loginMode === "password" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                  >
                    Password Login
                  </button>
                </div>

                {loginMode === "otp" ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><Phone size={14} /> Mobile Number or Email</label>
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-400">
                        <span className="px-3.5 py-3 text-sm font-semibold text-slate-500 bg-slate-50 border-r border-slate-200">@</span>
                        <input
                          value={contact}
                          onChange={handleContactChange}
                          placeholder="9876543210 or you@gmail.com"
                          className="w-full px-3.5 py-3 text-sm outline-none"
                        />
                      </div>
                      {error && <p className="text-sm text-red-500 mt-1.5">{error}</p>}
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold rounded-full py-3 text-sm flex items-center justify-center gap-2">
                      Send OTP <ArrowRight size={15} />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div>
                      <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><Phone size={14} /> Mobile Number or Email</label>
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-400">
                        <span className="px-3.5 py-3 text-sm font-semibold text-slate-500 bg-slate-50 border-r border-slate-200">@</span>
                        <input
                          value={contact}
                          onChange={handleContactChange}
                          placeholder="9876543210 or you@gmail.com"
                          className="w-full px-3.5 py-3 text-sm outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><ShieldCheck size={14} /> Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-3.5 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                      />
                    </div>
                    {error && <p className="text-sm text-red-500 mt-1.5">{error}</p>}
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold rounded-full py-3 text-sm flex items-center justify-center gap-2">
                      Login with Password <ArrowRight size={15} />
                    </button>
                  </form>
                )}

                {/* Divider Line */}
                <div className="relative my-5 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <span className="relative bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Or</span>
                </div>

                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={() => {
                    setError("Google Sign-In selected. Connect Google Account OAuth to complete.");
                  }}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold rounded-full py-3 text-sm flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Continue with Google
                </button>

                <p className="text-sm text-slate-500 text-center mt-5">
                  New customer? <Link to="/register" className="text-blue-600 font-semibold">Create profile</Link>
                </p>
                <p className="text-xs text-slate-400 text-center mt-2">
                  By continuing, you agree to FillCarts' Terms & Privacy Policy.
                </p>
              </>
            )}

            {step === "otp" && (
              <>
                <h1 className="text-2xl font-bold mb-1.5" style={{ fontFamily: "'Fraunces', serif" }}>Verify OTP</h1>
                <p className="text-sm text-slate-500 mb-7">Enter the 6-digit code sent to {contact}</p>

                <form onSubmit={handleVerify} className="space-y-5">
                  <div className="flex gap-3 justify-center">
                    {otp.map((val, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        value={val}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        maxLength={1}
                        className="w-12 h-14 text-center text-xl font-bold border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                      />
                    ))}
                  </div>
                  {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold rounded-full py-3 text-sm flex items-center justify-center gap-2">
                    <ShieldCheck size={15} /> Verify & Continue
                  </button>
                  <div className="text-center text-sm">
                    {timer > 0 ? (
                      <span className="text-slate-400">Resend OTP in {timer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await api.post("/send-otp", {
                              contact,
                              type: contact.includes("@") ? "email" : "sms",
                            });
                            setError("");
                            setTimer(30);
                            setOtp(["", "", "", "", "", ""]);
                          } catch (err) {
                            setError(getErrorMessage(err));
                          }
                        }}
                        className="text-blue-600 font-bold flex items-center gap-1.5 mx-auto"
                      >
                        <RotateCcw size={13} /> Resend OTP
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("phone");
                      setOtp(["", "", "", "", "", ""]);
                    }}
                    className="w-full text-sm font-semibold text-slate-500 flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft size={13} /> Change number
                  </button>
                </form>
              </>
            )}

            {step === "success" && (
              <div className="text-center py-4">
                <CheckCircle2 size={44} className="text-blue-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-1.5" style={{ fontFamily: "'Fraunces', serif" }}>You're logged in!</h1>

                {customerProfile ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 mb-6">
                    <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Customer profile</div>
                    <div><span className="font-semibold text-slate-700">Name:</span> {customerProfile.name}</div>
                    <div><span className="font-semibold text-slate-700">Phone:</span> +91 {customerProfile.phone}</div>
                    <div><span className="font-semibold text-slate-700">Email:</span> {customerProfile.email}</div>
                    <div><span className="font-semibold text-slate-700">Address:</span> {customerProfile.address || "No address saved"}</div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mb-6">Your session is now active. Continue to the website and your profile will be available securely.</p>
                )}

                <Link to="/" className="inline-block bg-slate-900 text-white font-bold rounded-full px-6 py-3 text-sm mb-6">Continue to Website</Link>
              </div>
            )}
          </div>

          <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <QrCode size={22} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-sm">Get the full experience</div>
              <div className="text-sm text-slate-500">Download the FillCarts app for faster ordering.</div>
            </div>
          </div>

          <p className="text-center text-sm text-slate-400 mt-6">
            Own a shop or want to deliver? <Link to="/become-vendor" className="text-blue-600 font-semibold">Become a Vendor</Link>
            {' '} B7{' '}
            <Link to="/become-rider" className="text-blue-600 font-semibold">Become a Rider</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
