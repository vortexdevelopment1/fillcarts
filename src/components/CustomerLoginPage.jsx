import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone, ShieldCheck, ArrowRight, ArrowLeft, Smartphone, QrCode,
  RotateCcw, CheckCircle2
} from "lucide-react";
import api from "../api";

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

  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    if (!contact.trim()) {
      setError("Enter a valid mobile number or email address");
      return;
    }

    const isEmail = contact.includes("@");
    if (!isEmail && contact.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    if (!password.trim()) {
      setError("Enter your account password");
      return;
    }

    try {
      await api.post("/login-customer", {
        phone: isEmail ? "" : contact,
        email: isEmail ? contact : "",
        password,
      });

      const profileRes = await api.get("/profile");
      setError("");
      setCustomerProfile(profileRes.data.customer || null);
      setStep("success");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!contact.trim()) {
      setError("Enter a valid mobile number or email address");
      return;
    }

    const isEmail = contact.includes("@");
    if (!isEmail && contact.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      const res = await api.post("/send-otp", {
        contact,
        type: isEmail ? "email" : "sms",
      });

      console.log(res.data);
      setError("");
      setStep("otp");
      setTimer(30);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    }
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
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
      setError("");
      setCustomerProfile(profileRes.data.customer || null);
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
            App<span className="text-blue-600">Kart</span>
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
                        <span className="px-3.5 py-3 text-sm font-semibold text-slate-500 bg-slate-50 border-r border-slate-200">+</span>
                        <input
                          value={contact}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const normalized = raw.includes("@") ? raw : raw.replace(/\D/g, "").slice(0, 10);
                            setContact(normalized);
                          }}
                          placeholder="9876543210 or you@example.com"
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
                          onChange={(e) => setContact(e.target.value)}
                          placeholder="9876543210 or you@example.com"
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

                <p className="text-sm text-slate-500 text-center mt-5">
                  New customer? <Link to="/register" className="text-blue-600 font-semibold">Create profile</Link>
                </p>
                <p className="text-xs text-slate-400 text-center mt-2">
                  By continuing, you agree to AppKart's Terms & Privacy Policy.
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
                    onClick={() => { setStep("phone"); setOtp(["", "", "", "", "", ""]); }}
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
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <QrCode size={22} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-sm">Get the full experience</div>
              <div className="text-sm text-slate-500">Download the AppKart app for faster ordering.</div>
            </div>
          </div>

          <p className="text-center text-sm text-slate-400 mt-6">
         Own a shop or want to deliver?{" "}
       <Link
    to="/become-vendor"
    className="text-blue-600 font-semibold"
    >
    Become a Vendor
  </Link>
  {" "}·{" "}
  <Link
    to="/become-rider"
    className="text-blue-600 font-semibold"
  >
    Become a Rider
  </Link>
</p>
        </div>
      </div>
    </div>
  );
}
