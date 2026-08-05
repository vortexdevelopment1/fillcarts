import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, UserRound, Phone, Mail, MapPin, Lock, CheckCircle2 } from "lucide-react";
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
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post("/register-customer", form);
      setSuccess(res.data || "Customer profile created successfully.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 flex flex-col" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold" style={{ fontFamily: "'Fraunces', serif" }}>
            App<span className="text-blue-600">Kart</span>
          </Link>
          <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1.5">
            <ArrowLeft size={15} /> Back to Login
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-xl">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <UserRound size={22} />
            </div>

            <h1 className="text-2xl font-bold mb-1.5" style={{ fontFamily: "'Fraunces', serif" }}>Create your customer profile</h1>
            <p className="text-sm text-slate-500 mb-7">Register once and continue ordering with a saved account.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><UserRound size={14} /> Full Name</span>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full px-3.5 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400" placeholder="Aarav Sharma" required />
                </label>

                <label className="block">
                  <span className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><Phone size={14} /> Mobile Number</span>
                  <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3.5 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400" placeholder="9876543210" required />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><Mail size={14} /> Email Address</span>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3.5 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400" placeholder="you@example.com" required />
              </label>

              <label className="block">
                <span className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><Lock size={14} /> Password</span>
                <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-3.5 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400" placeholder="Create a password" required />
              </label>

              <label className="block">
                <span className="text-sm font-bold mb-1.5 flex items-center gap-1.5"><MapPin size={14} /> Delivery Address</span>
                <textarea name="address" value={form.address} onChange={handleChange} className="w-full px-3.5 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 min-h-24" placeholder="House number, street, area, city" />
              </label>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-600 flex items-center gap-2"><CheckCircle2 size={14} /> {success}</p>}

              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold rounded-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                {isSubmitting ? "Creating profile..." : "Register Customer"} <ArrowRight size={15} />
              </button>
            </form>

            <p className="text-sm text-slate-500 mt-5 text-center">
              Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
