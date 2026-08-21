import React from "react";
import { Link } from "react-router-dom";

const footerColumns = [
  {
    h: "Shopping",
    links: [
      { l: "Browse Categories", to: "/categories" },
      { l: "Today's Offers", to: "/#offers" },
      { l: "Daily Subscriptions ", to: "/subscriptions" },
      { l: "Platform Features", to: "/features" },
    ],
  },
  {
    h: "Company",
    links: [
      { l: "About FillCarts", to: "/about" },
      { l: "Careers", to: "/careers" },
      { l: "Blog & News", to: "/blog" },
      { l: "Customer Support", to: "/support" },
    ],
  },
  {
    h: "Partner With Us",
    links: [
      { l: "Become a Local Vendor", to: "/vendor" },
      { l: "Become a Delivery Rider", to: "/rider" },
    ],
  },
  {
    h: "Legal & Policies",
    links: [
      { l: "Terms & Conditions", to: "/terms" },
      { l: "Privacy Policy", to: "/privacy" },
      { l: "Help & FAQ", to: "/support" },
      { l: "Refund & Cancellations", to: "/terms#refunds-cancellations" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#17231A] text-slate-200 pt-16 pb-8 border-t border-emerald-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand info column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-2xl font-black mb-3 block" style={{ fontFamily: "'Manrope', sans-serif" }}>
              <span className="text-white">Fill</span>
              <span className="text-[#16A34A]">Carts</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-[220px]">
              Local vendor marketplace & fast delivery. Get fresh groceries, bakery, dairy and everyday essentials delivered from nearby stores.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>Delivering in 20+ Cities</span>
            </div>
          </div>

          {/* Links columns */}
          {footerColumns.map((col) => (
            <div key={col.h}>
              <h4 className="text-xs font-extrabold mb-4 text-white uppercase tracking-wider">{col.h}</h4>
              <ul className="space-y-2.5">
                {col.links.map((item) => (
                  <li key={item.l}>
                    <Link
                      to={item.to}
                      className="text-xs text-slate-300 hover:text-[#16A34A] transition-colors font-medium block"
                    >
                      {item.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-emerald-950 pt-6 text-xs text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} FillCarts Technologies Pvt. Ltd. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link to="/support" className="hover:text-emerald-400 transition-colors">Support Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

