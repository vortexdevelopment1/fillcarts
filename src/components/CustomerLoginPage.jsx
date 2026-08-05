import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Phone, ShieldCheck, ArrowRight, ArrowLeft, Smartphone, QrCode,
  RotateCcw, CheckCircle2
} from "lucide-react";
import api from "../api";
export default function CustomerLoginPage() {
  const [step, setStep] = useState("phone"); // phone -> otp -> success
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);


  const handleSendOtp = async (e) => {
    e.preventDefault();
    alert("Button Clicked");
    console.log("Button Clicked");

    if (phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      const res = await api.post("/send-otp", {
        contact: phone,
        type: "sms",
      });

      console.log(res.data);
      setError("");
      setStep("otp");
      setTimer(30);
    } catch (err) {
      setError("Failed to send OTP");
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

  const handleVerify = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Enter the complete 6-digit OTP");
      return;
    }

    try {
      const res = await api.post("/verify-otp", {
        contact: phone,
        otp: enteredOtp,
      });

      console.log(res.data);
      setError("");
      setStep("success");
    } catch (err) {
      setError(err.response?.data || "Invalid OTP");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 flex flex-col" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Minimal header */}
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

      {/* Login card */}
      <div className="flex-1 flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <Smartphone size={22} />
            </div>

            {step === "phone" && (
              <>
                <h1 className="text-2xl font-bold mb-1.5" style={{ fontFamily: "'Fraunces', serif" }}>Log in to order</h1>
                <p className="text-sm text-slate-500 mb-7">Enter your mobile number to continue as a customer.</p>
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><Phone size={14} /> Mobile Number</label>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-400">
                      <span className="px-3.5 py-3 text-sm font-semibold text-slate-500 bg-slate-50 border-r border-slate-200">+91</span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="9876543210"
                        className="w-full px-3.5 py-3 text-sm outline-none"
                      />
                    </div>
                    {error && <p className="text-sm text-red-500 mt-1.5">{error}</p>}
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold rounded-full py-3 text-sm flex items-center justify-center gap-2">
                    Send OTP <ArrowRight size={15} />
                  </button>
                </form>
                <p className="text-xs text-slate-400 text-center mt-5">
                  By continuing, you agree to FillCarts' Terms & Privacy Policy.
                </p>
              </>
            )}

            {step === "otp" && (
              <>
                <h1 className="text-2xl font-bold mb-1.5" style={{ fontFamily: "'Fraunces', serif" }}>Verify OTP</h1>
                <p className="text-sm text-slate-500 mb-7">Enter the 6-digit code sent to +91 {phone}</p>
                <form onSubmit={handleVerify} className="space-y-5">
                  <div className="flex gap-3 justify-center">
                    {otp.map((val, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        value={val}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
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
                        onClick={() => setTimer(30)}
                        className="text-blue-600 font-bold flex items-center gap-1.5 mx-auto"
                      >
                        <RotateCcw size={13} /> Resend OTP
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setStep("phone"); setOtp(["", "", "", ""]); }}
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
                <p className="text-sm text-slate-500 mb-6">For the full experience — live tracking, saved addresses, faster checkout — continue on the FillCarts app.</p>
                <Link to="/" className="inline-block bg-slate-900 text-white font-bold rounded-full px-6 py-3 text-sm mb-6">Continue to Website</Link>
              </div>
            )}
          </div>

          {/* App download suggestion */}
          <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <QrCode size={22} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-sm">Get the full experience</div>
              <div className="text-sm text-slate-500">Download the FillCarts app for faster ordering.</div>
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
