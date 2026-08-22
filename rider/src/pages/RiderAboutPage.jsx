import React from "react";
import { Link } from "react-router-dom";
import RiderNavbar from "../components/RiderNavbar";
import Footer from "../components/Footer";
import {
  Bike, Store, User, ArrowRight, ShieldCheck, Clock, Wallet, Headphones, CheckCircle2
} from "lucide-react";

export default function RiderAboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#18181B] font-['Manrope',sans-serif]">
      {/* Navbar */}
      <RiderNavbar />

      <main className="flex-1">
        {/* About Hero Section */}
        <section className="bg-[#18181B] text-white py-16 md:py-24 border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF7ED]/10 border border-[#F97316]/30">
                <Bike size={14} className="text-[#F97316]" />
                <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider">
                  ABOUT FILCARTS DELIVERIES
                </span>
              </div>

              {/* Heading Spec: Desktop 32-48px, Weight 800 */}
              <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-extrabold text-white tracking-tight leading-[1.15]">
                Building better local deliveries with our rider partners
              </h1>

              {/* Supporting Text */}
              <p className="text-[15px] md:text-[17px] text-[#A1A1AA] font-medium leading-[1.6]">
                Filcarts connects local stores, customers and delivery partners to make neighborhood commerce more convenient.
              </p>

              <div className="pt-2">
                <a
                  href="/#register"
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white text-[15px] font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-xs inline-flex items-center gap-2"
                >
                  <span>Become a Delivery Partner</span>
                  <ArrowRight size={17} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Our Mission */}
        <section className="py-16 md:py-20 bg-white border-b border-[#E4E4E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider bg-[#FFF7ED] px-3 py-1 rounded-md border border-[#F97316]/30 inline-block">
                OUR MISSION
              </span>
              <h2 className="text-[26px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
                Connecting neighborhood commerce efficiently
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#52525B] font-normal leading-[1.7]">
                Filcarts is building a local commerce network where nearby stores can serve customers efficiently. By enabling fast, reliable doorstep fulfillment, we support local businesses while creating flexible earning opportunities for delivery partners in their own communities.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Our Rider Philosophy */}
        <section className="py-16 md:py-20 bg-[#FAFAF9] border-b border-[#E4E4E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider bg-[#FFF7ED] px-3 py-1 rounded-md border border-[#F97316]/30 inline-block">
                CORE VALUES
              </span>
              <h2 className="text-[26px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
                Our Rider Philosophy
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#52525B] font-normal leading-[1.6]">
                Three core principles guide how we work with delivery partners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#F97316] flex items-center justify-center border border-[#F97316]/20">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="text-[18px] font-semibold text-[#18181B]">Respect</h3>
                <p className="text-[14px] text-[#52525B] leading-[1.6]">
                  Treating delivery partners with dignity as essential members of neighborhood commerce.
                </p>
              </div>

              <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#F97316] flex items-center justify-center border border-[#F97316]/20">
                  <Wallet size={22} />
                </div>
                <h3 className="text-[18px] font-semibold text-[#18181B]">Transparency</h3>
                <p className="text-[14px] text-[#52525B] leading-[1.6]">
                  Clear trip calculations, earnings visibility, and straightforward platform policies.
                </p>
              </div>

              <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#F97316] flex items-center justify-center border border-[#F97316]/20">
                  <Clock size={22} />
                </div>
                <h3 className="text-[18px] font-semibold text-[#18181B]">Flexibility</h3>
                <p className="text-[14px] text-[#52525B] leading-[1.6]">
                  Giving riders control over when and where they choose to deliver based on availability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: How Riders Fit Into Filcarts (Ecosystem Diagram) */}
        <section className="py-16 md:py-20 bg-white border-b border-[#E4E4E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider bg-[#FFF7ED] px-3 py-1 rounded-md border border-[#F97316]/30 inline-block">
                LOCAL ECOSYSTEM
              </span>
              <h2 className="text-[26px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
                How riders fit into Filcarts
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#52525B] font-normal leading-[1.6]">
                Riders form the vital link between local neighborhood merchants and customers.
              </p>
            </div>

            {/* Ecosystem Flow Diagram */}
            <div className="max-w-5xl mx-auto bg-[#FAFAF9] border border-[#E4E4E7] rounded-2xl p-6 md:p-10 shadow-xs">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                
                {/* Node 1 */}
                <div className="bg-white border border-[#E4E4E7] rounded-xl p-4 w-full md:w-auto flex-1 space-y-1">
                  <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] text-[#F97316] flex items-center justify-center mx-auto mb-2">
                    <Store size={20} />
                  </div>
                  <h4 className="text-[15px] font-bold text-[#18181B]">Local Store</h4>
                  <p className="text-[12px] text-[#52525B]">Prepares items</p>
                </div>

                <ArrowRight size={20} className="text-[#F97316] shrink-0 rotate-90 md:rotate-0" />

                {/* Node 2 */}
                <div className="bg-white border border-[#E4E4E7] rounded-xl p-4 w-full md:w-auto flex-1 space-y-1">
                  <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] text-[#F97316] flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 size={20} />
                  </div>
                  <h4 className="text-[15px] font-bold text-[#18181B]">Customer Order</h4>
                  <p className="text-[12px] text-[#52525B]">Placed online</p>
                </div>

                <ArrowRight size={20} className="text-[#F97316] shrink-0 rotate-90 md:rotate-0" />

                {/* Node 3 */}
                <div className="bg-white border border-[#E4E4E7] rounded-xl p-4 w-full md:w-auto flex-1 space-y-1">
                  <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] text-[#F97316] flex items-center justify-center mx-auto mb-2">
                    <Bike size={20} />
                  </div>
                  <h4 className="text-[15px] font-bold text-[#18181B]">Filcarts Platform</h4>
                  <p className="text-[12px] text-[#52525B]">Assigns task</p>
                </div>

                <ArrowRight size={20} className="text-[#F97316] shrink-0 rotate-90 md:rotate-0" />

                {/* Node 4 */}
                <div className="bg-[#FFF7ED] border border-[#F97316]/30 rounded-xl p-4 w-full md:w-auto flex-1 space-y-1">
                  <div className="w-10 h-10 rounded-lg bg-[#F97316] text-white flex items-center justify-center mx-auto mb-2">
                    <Bike size={20} />
                  </div>
                  <h4 className="text-[15px] font-bold text-[#18181B]">Rider Partner</h4>
                  <p className="text-[12px] text-[#F97316] font-semibold">Delivers task</p>
                </div>

                <ArrowRight size={20} className="text-[#F97316] shrink-0 rotate-90 md:rotate-0" />

                {/* Node 5 */}
                <div className="bg-white border border-[#E4E4E7] rounded-xl p-4 w-full md:w-auto flex-1 space-y-1">
                  <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] text-[#F97316] flex items-center justify-center mx-auto mb-2">
                    <User size={20} />
                  </div>
                  <h4 className="text-[15px] font-bold text-[#18181B]">Customer</h4>
                  <p className="text-[12px] text-[#52525B]">Receives order</p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Section 4: What Riders Can Expect */}
        <section className="py-16 md:py-20 bg-[#FAFAF9] border-b border-[#E4E4E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10 space-y-2">
              <span className="text-[11px] md:text-[12px] font-bold text-[#F97316] uppercase tracking-wider bg-[#FFF7ED] px-3 py-1 rounded-md border border-[#F97316]/30 inline-block">
                EXPECTATIONS
              </span>
              <h2 className="text-[26px] md:text-[32px] font-bold text-[#18181B] tracking-tight">
                What riders can expect
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 flex items-start gap-3.5">
                <CheckCircle2 size={20} className="text-[#F97316] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[16px] font-semibold text-[#18181B]">Flexible Hours</h4>
                  <p className="text-[14px] text-[#52525B]">Choose delivery slots according to your convenience.</p>
                </div>
              </div>

              <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 flex items-start gap-3.5">
                <CheckCircle2 size={20} className="text-[#F97316] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[16px] font-semibold text-[#18181B]">Transparent Trip Earnings</h4>
                  <p className="text-[14px] text-[#52525B]">See earnings breakdown per trip live in the Rider App.</p>
                </div>
              </div>

              <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 flex items-start gap-3.5">
                <CheckCircle2 size={20} className="text-[#F97316] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[16px] font-semibold text-[#18181B]">Dedicated Rider Support</h4>
                  <p className="text-[14px] text-[#52525B]">Assistance available for trip or order questions.</p>
                </div>
              </div>

              <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 flex items-start gap-3.5">
                <CheckCircle2 size={20} className="text-[#F97316] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[16px] font-semibold text-[#18181B]">Local Area Focus</h4>
                  <p className="text-[14px] text-[#52525B]">Deliver within neighborhood radius close to home.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Join Us CTA */}
        <section className="py-16 md:py-20 bg-[#18181B] text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            <h2 className="text-[26px] md:text-[32px] font-extrabold text-white tracking-tight">
              Ready to become a Filcarts Delivery Partner?
            </h2>
            <p className="text-[14px] md:text-[16px] text-[#A1A1AA] max-w-xl mx-auto font-normal">
              Register today and take the first step toward delivering on your own terms.
            </p>
            <div className="pt-2">
              <a
                href="/#register"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white text-[15px] font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-xs inline-flex items-center gap-2"
              >
                <span>Become a Delivery Partner</span>
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
