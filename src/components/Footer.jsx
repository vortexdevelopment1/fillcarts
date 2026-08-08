import React from "react";
import { Link } from "react-router-dom";

const footerColumns = [
  {
    h: "Company",
    links: [
      { l: "About Us", to: "/about" },
      { l: "Careers", to: "/careers" },
      { l: "Blog", to: "/blog" },
      { l: "Contact Support", to: "/support" },
    ],
  },
  {
    h: "Partner",
    links: [
      { l: "Become a Vendor", to: "/become-vendor" },
      { l: "Deliver with FillCarts", to: "/become-rider" },
    ],
  },
  {
    h: "Legal & Support",
    links: [
      { l: "Terms & Conditions", to: "/terms" },
      { l: "Privacy Policy", to: "/privacy" },
      { l: "Help Center", to: "/support" },
      { l: "Refund Policy", to: "/terms#refunds-cancellations" },
    ],
  },
  {
    h: "Download App",
    links: [
      { l: "Google Play", to: null },
      { l: "App Store", to: null },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="about" className="bg-slate-900 text-slate-50 pt-14 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-8 mb-10">
          <div className="md:col-span-1">
            <Link to="/" className="text-lg font-extrabold mb-2.5 block" style={{ fontFamily: "'Fraunces', serif" }}>
              Fill<span className="text-blue-400">Carts</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-[200px]">Connecting local vendors, customers and delivery riders — one neighbourhood at a time.</p>
          </div>
          {footerColumns.map((col) => (
            <div key={col.h}>
              <h4 className="text-sm font-extrabold mb-3.5 text-slate-300">{col.h}</h4>
              {col.links.map((item) =>
                item.to ? (
                  <Link key={item.l} to={item.to} className="block text-sm text-slate-400 mb-2.5 hover:text-white transition-colors">
                    {item.l}
                  </Link>
                ) : (
                  <a key={item.l} href="#" className="block text-sm text-slate-400 mb-2.5 hover:text-white transition-colors">
                    {item.l}
                  </a>
                )
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-slate-700 pt-5 text-sm font-medium text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© 2026 FillCarts. All rights reserved.</div>
          <div className="flex flex-wrap gap-6 text-xs text-slate-400">
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms#refunds-cancellations" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
