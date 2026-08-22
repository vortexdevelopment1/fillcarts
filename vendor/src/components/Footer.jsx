import React from "react";
import { Link } from "react-router-dom";
import { Store, ExternalLink } from "lucide-react";

const footerColumns = [
  {
    h: "For Merchants",
    links: [
      { l: "Become a Merchant", to: "#register" },
      { l: "Merchant App", to: "#merchant-app" },
      { l: "How It Works", to: "#how-it-works" },
      { l: "Merchant FAQs", to: "#faqs" },
    ],
  },
  {
    h: "Company",
    links: [
      { l: "About Filcarts", to: "/about" },
      { l: "Contact Us", to: "#support" },
      { l: "Careers", to: "#careers" },
    ],
  },
  {
    h: "Support",
    links: [
      { l: "Help Center", to: "#support" },
      { l: "Merchant Support", to: "#support" },
      { l: "Report an Issue", to: "#support" },
      { l: "FAQs", to: "#faqs" },
    ],
  },
  {
    h: "Legal",
    links: [
      { l: "Terms & Conditions", to: "/terms" },
      { l: "Privacy Policy", to: "/privacy" },
      { l: "Merchant Terms", to: "/terms#merchant" },
      { l: "Refund Policy", to: "/terms#refund" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 pr-4 space-y-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#16A34A] text-white flex items-center justify-center font-bold shadow-xs">
                <Store size={18} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] sm:text-[22px] font-extrabold tracking-tight text-white">
                  Filcarts
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 uppercase tracking-wider">
                  Merchant
                </span>
              </div>
            </Link>
            <p className="text-[13px] text-slate-400 leading-[1.6] font-normal">
              Helping local businesses reach nearby customers through digital commerce.
            </p>
            <a
              href="http://localhost:5173"
              className="inline-flex items-center gap-1 text-[13px] sm:text-[14px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <span>Visit Filcarts Customer Website</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Links Columns */}
          {footerColumns.map((col) => (
            <div key={col.h}>
              <h4 className="text-[14px] font-bold mb-4 text-white uppercase tracking-wider">
                {col.h}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((item) => (
                  <li key={item.l}>
                    {item.to.startsWith("#") ? (
                      <a
                        href={item.to}
                        className="text-[13px] sm:text-[14px] text-slate-400 hover:text-white font-normal transition-colors block"
                      >
                        {item.l}
                      </a>
                    ) : (
                      <Link
                        to={item.to}
                        className="text-[13px] sm:text-[14px] text-slate-400 hover:text-white font-normal transition-colors block"
                      >
                        {item.l}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 text-[13px] text-slate-400 font-normal flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} Filcarts. All rights reserved.</div>
          <div className="flex items-center gap-6 text-slate-400">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/terms#merchant" className="hover:text-white transition-colors">Merchant Agreement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
