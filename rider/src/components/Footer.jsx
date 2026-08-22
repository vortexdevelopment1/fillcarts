import React from "react";
import { Link } from "react-router-dom";
import { Bike, ExternalLink } from "lucide-react";

const footerColumns = [
  {
    h: "Rider",
    links: [
      { l: "Become a Rider", to: "#register" },
      { l: "How It Works", to: "#how-it-works" },
      { l: "Why Join", to: "#why-join" },
      { l: "Rider FAQs", to: "#faqs" },
      { l: "Rider Login", to: "#register" },
    ],
  },
  {
    h: "Company",
    links: [
      { l: "About Filcarts", to: "/about" },
      { l: "Contact", to: "#register" },
      { l: "Support", to: "#safety" },
    ],
  },
  {
    h: "Legal",
    links: [
      { l: "Terms & Conditions", to: "/terms" },
      { l: "Privacy Policy", to: "/privacy" },
      { l: "Rider Agreement", to: "/terms#rider" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#18181B] text-[#A1A1AA] pt-16 pb-10 border-t border-[#27272A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 pr-4 space-y-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#F97316] text-white flex items-center justify-center font-bold shadow-xs">
                <Bike size={18} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] sm:text-[22px] font-extrabold tracking-tight text-white">
                  Filcarts
                </span>
                <span className="text-[10px] font-bold text-[#F97316] bg-[#FFF7ED]/10 px-1.5 py-0.5 rounded border border-[#F97316]/30 uppercase tracking-wider">
                  Delivery Partner
                </span>
              </div>
            </Link>
            <p className="text-[13px] sm:text-[14px] text-[#A1A1AA] leading-[1.6] font-normal">
              Connecting local businesses, customers and delivery partners through neighborhood commerce.
            </p>
            <a
              href="http://localhost:5173"
              className="inline-flex items-center gap-1 text-[13px] sm:text-[14px] text-[#F97316] hover:text-[#EA580C] font-medium transition-colors pt-1"
            >
              <span>Visit Filcarts</span>
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
                        className="text-[13px] sm:text-[14px] text-[#A1A1AA] hover:text-white font-normal transition-colors block"
                      >
                        {item.l}
                      </a>
                    ) : (
                      <Link
                        to={item.to}
                        className="text-[13px] sm:text-[14px] text-[#A1A1AA] hover:text-white font-normal transition-colors block"
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
        <div className="border-t border-[#27272A] pt-6 text-[13px] sm:text-[14px] text-[#A1A1AA] font-normal flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} Filcarts. All rights reserved.</div>
          <div className="flex items-center gap-6 text-[#A1A1AA]">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
