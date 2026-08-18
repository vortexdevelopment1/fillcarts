import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Star, Plus, Minus, ChevronRight, ChevronDown, ChevronUp, ShoppingCart,
  Smartphone, ArrowLeft, Heart, Share2, CheckCircle2, QrCode, Download, X,
  ShieldCheck, Truck, Clock, Sparkles, MapPin, Store, Check, ThumbsUp, RefreshCw, AlertCircle, Repeat
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../utils/productImages";
import { getProductById, getVariantsForProduct, getRelatedProducts, PRODUCTS } from "../utils/catalogData";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useCart();

  // Find selected product dynamically by ID
  const product = useMemo(() => {
    return getProductById(id);
  }, [id]);

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeThumbIdx, setActiveThumbIdx] = useState(0);
  const [showDetails, setShowDetails] = useState(true);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [pincode, setPincode] = useState("452001");
  const [pincodeStatus, setPincodeStatus] = useState("⚡ Delivery in 15-20 mins by Fresh Mart Kirana");
  const [toastMessage, setToastMessage] = useState("");
  const { user } = useCart();

  const isSubscriptionEligible = useMemo(() => {
    if (!product) return false;
    const cat = (product.categoryKey || product.categoryName || product.category || "").toLowerCase();
    const pid = String(product.id || "").toLowerCase();
    return cat.includes("dairy") || cat.includes("bakery") || pid.startsWith("dairy") || pid.startsWith("bakery");
  }, [product]);

  const handleSubscribeAndSave = () => {
    const categoryKey = product?.categoryKey ||
      (product?.category?.toLowerCase().includes("dairy") ? "dairy" :
       product?.category?.toLowerCase().includes("bakery") ? "bakery" : "dairy");

    const currentVariant = variants[selectedVariantIdx] || variants[0] || {};
    const subPrice = Math.round((currentVariant.price || product?.price || 50) * 0.9);

    navigate("/subscriptions", {
      state: {
        tab: "create",
        subscribeProduct: {
          id: product?.id || `sub-${Date.now()}`,
          name: `${product?.name} (${currentVariant.size || "1 Unit"})`,
          categoryKey,
          price: subPrice,
          img: product?.img
        }
      }
    });
  };

  // Dynamically generated quantity/unit variants based on product type
  const variants = useMemo(() => {
    return getVariantsForProduct(product);
  }, [product]);

  useEffect(() => {
    setSelectedVariantIdx(0);
    setActiveThumbIdx(0);
  }, [product?.id]);

  const activeVariant = variants[selectedVariantIdx] || variants[0];
  const inCart = cart.find((item) => item.id === product.id);

  // Gallery thumbnails
  const mainProductImg = getProductImage(product.name, product.category?.toLowerCase() || "grocery");
  const galleryImages = [
    mainProductImg,
    mainProductImg,
    mainProductImg,
    mainProductImg,
  ];

  // Related products (filtered by category)
  const relatedProducts = useMemo(() => {
    return getRelatedProducts(product);
  }, [product]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeStatus(`⚡ Serviceable at ${pincode}! Delivery in 15-20 mins by local partner store.`);
    } else {
      setPincodeStatus("Please enter a valid 6-digit Pincode");
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Shared Common Navbar */}
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl z-50 animate-bounce flex items-center gap-2 border border-slate-700">
          <Sparkles size={14} className="text-amber-400" /> {toastMessage}
        </div>
      )}

      {/* ========================================================================= */}
      {/* WORLD-CLASS E-COMMERCE PRODUCT DETAIL LAYOUT */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-8 md:gap-12 items-start">

          {/* LEFT COLUMN: E-Commerce Multi-Image Gallery & Trust Badges */}
          <div className="space-y-4 lg:sticky lg:top-24">

            {/* Main Product Hero Gallery Display Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm text-center relative flex flex-col items-center justify-center overflow-hidden group">

              {/* Main Image View */}
              <div className="w-full h-72 md:h-96 flex items-center justify-center py-4 relative">
                <img
                  src={galleryImages[activeThumbIdx]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Interactive Thumbnail Selector Bar */}
              <div className="flex items-center justify-center gap-3 pt-3">
                {galleryImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumbIdx(i)}
                    className={`w-14 h-14 rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${activeThumbIdx === i ? "border-amber-500 scale-105 shadow-xs" : "border-slate-200 opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Rich Product Details, Variant Selector, Pincode & Action Buttons */}
          <div className="space-y-6">

            {/* Title & Pricing Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-7 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  {product.brand} Brand
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={14} /> In Stock at Nearby Kirana
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      triggerToast("Product link copied!");
                    }}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                    title="Share Product"
                  >
                    <Share2 size={14} />
                  </button>
                </div>
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews Bar */}
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 pb-2 border-b border-slate-100">
                <span className="flex items-center gap-1 text-amber-500 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                  <Star size={12} fill="currentColor" /> {product.rating}
                </span>
                <span>{product.reviews} customer ratings</span>
                <span>•</span>
                <span className="text-blue-600 font-semibold">12k+ Orders Fulfilled</span>
              </div>

              {/* Price Block */}
              <div className="space-y-1 pt-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-xl md:text-2xl font-bold text-slate-900">₹{activeVariant.price}</span>
                  <span className="text-sm text-slate-400 line-through font-medium">₹{activeVariant.mrp}</span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                    {activeVariant.off}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold">Inclusive of all taxes · Free delivery on orders above ₹199</p>
              </div>
            </div>

            {/* Pincode & Delivery Checker Bar */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-xs space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">
                Check Express Local Delivery
              </label>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter Pincode (e.g. 452001)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 pt-1">
                  <Clock size={13} /> {pincodeStatus}
                </p>
              )}
            </div>

            {/* Quantity Variant Selector Cards (Exact Match with Image 1 & 2) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-7 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-900">Quantity / Pack Size</label>
                <span className="text-xs font-semibold text-slate-400">Select Pack</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {variants.map((v, idx) => {
                  const isSelected = selectedVariantIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariantIdx(idx)}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${isSelected
                        ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/50 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                    >
                      <div className="text-xs font-extrabold text-slate-900">{v.size}</div>
                      <div className="text-[11px] font-bold text-amber-600 mt-0.5">{v.off}</div>
                      <div className="text-xs font-black text-slate-900 mt-1">₹{v.price} <span className="text-[10px] text-slate-400 line-through font-normal">₹{v.mrp}</span></div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Details, Benefits & Nutrition Accordion Cards (Matching Screenshots) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-7 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between font-bold text-sm text-slate-900 cursor-pointer"
                >
                  Product details
                  {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showDetails && (
                  <div className="space-y-3 mt-2.5">
                    <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
                      {product.desc}
                    </p>

                    {/* Manufacturing & Expiry Dates Info */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100/80">
                      <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MFG Date</div>
                        <div className="text-xs font-extrabold text-slate-800 mt-0.5">15 Aug 2026</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expiry Date</div>
                        <div className="text-xs font-extrabold text-emerald-700 mt-0.5">30 Aug 2026</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-b border-slate-100 pb-3">
                <button
                  onClick={() => setShowBenefits(!showBenefits)}
                  className="w-full flex items-center justify-between font-bold text-sm text-slate-900 cursor-pointer"
                >
                  Benefits
                  {showBenefits ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showBenefits && (
                  <ul className="text-xs md:text-sm text-slate-500 font-medium space-y-1.5 mt-2.5 list-disc list-inside">
                    <li>Rich in dietary fiber and essential proteins.</li>
                    <li>100% natural, unpolished grain quality.</li>
                    <li>Directly sourced from trusted local vendors.</li>
                  </ul>
                )}
              </div>

              <div>
                <button
                  onClick={() => setShowNutrition(!showNutrition)}
                  className="w-full flex items-center justify-between font-bold text-sm text-slate-900 cursor-pointer"
                >
                  Nutritional Information (per 100g)
                  {showNutrition ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showNutrition && (
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs font-semibold">
                    <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl">
                      <div className="text-slate-400 text-[10px]">Protein</div>
                      <div className="font-bold text-slate-900">24.5g</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl">
                      <div className="text-slate-400 text-[10px]">Dietary Fiber</div>
                      <div className="font-bold text-slate-900">16.2g</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl">
                      <div className="text-slate-400 text-[10px]">Energy</div>
                      <div className="font-bold text-slate-900">347 kcal</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Details Card (Exact Match with Image 1) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-7 shadow-xs space-y-2">
              <div className="text-sm font-bold text-slate-900">Seller Details</div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span>Seller Name: Fresh Mart Superstore</span>
                <CheckCircle2 size={16} className="text-blue-600 fill-blue-600 text-white" />
              </div>

              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <span>⚡ 15-20 min • Free Delivery on ₹199</span>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                ⭐ 4.8 (2k reviews) • 12k+ Orders
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Download App to Buy */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-7 shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Add to Cart */}
                {inCart ? (
                  <div className="flex items-center justify-between bg-slate-100 border border-slate-300 rounded-2xl p-2 px-4">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="w-9 h-9 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 shadow-xs cursor-pointer"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="font-bold text-sm text-slate-900">{inCart.quantity} in Cart</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-9 h-9 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 shadow-xs cursor-pointer"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      addToCart({
                        ...product,
                        price: activeVariant.price,
                        mrp: activeVariant.mrp,
                        name: `${product.name} (${activeVariant.size})`,
                      });
                      triggerToast(`Added ${product.name} (${activeVariant.size}) to Cart!`);
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold py-4 px-4 rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <ShoppingCart size={17} /> Add to Cart
                  </button>
                )}

                {/* Download App to Buy */}
                <button
                  onClick={() => setAppModalOpen(true)}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-4 px-4 rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Smartphone size={17} /> Download App to Buy
                </button>
              </div>

              {/* Subscribe and Save 10% Button Link (Only for Subscription Eligible Products) */}
              {isSubscriptionEligible && (
                <button
                  type="button"
                  onClick={handleSubscribeAndSave}
                  className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold py-4 px-4 rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-emerald-600 group"
                >
                  <Repeat size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                  <span>Subscribe & Save 10% (₹{Math.round(activeVariant.price * 0.9)})</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* CUSTOMER REVIEWS & RATINGS BREAKDOWN SECTION */}
        {/* ========================================================================= */}
        <section className="mt-16 pt-10 border-t border-slate-200/90 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-black px-3 py-1 rounded-full mb-2 shadow-2xs">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>CUSTOMER RATINGS & REVIEWS</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Ratings & Feedback
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Real feedback from verified buyers delivered by local Kirana stores
              </p>
            </div>

            <button
              onClick={() => triggerToast("Thank you! Review submission form opened.")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl transition-all cursor-pointer shadow-sm flex items-center gap-2 self-start sm:self-auto"
            >
              <Sparkles size={14} className="text-amber-400" /> Write a Review
            </button>
          </div>

          <div className="grid lg:grid-cols-[320px_1fr] gap-8 bg-white border border-slate-200/90 p-6 md:p-8 rounded-3xl shadow-sm">
            {/* Rating Summary Card */}
            <div className="space-y-6 lg:border-r border-slate-100 lg:pr-8 pb-6 lg:pb-0 border-b lg:border-b-0">
              <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-100/80 rounded-2xl p-5 text-center space-y-2">
                <div className="text-5xl font-black text-slate-900 tracking-tight">{product.rating}</div>
                <div className="flex items-center justify-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-xs font-bold text-slate-600">
                  Based on {product.reviews || "340"} verified ratings
                </div>
                <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-[#166534] text-[11px] font-extrabold px-3 py-1 rounded-full mt-1">
                  <CheckCircle2 size={12} className="text-[#16A34A]" />
                  <span>96% Buyers Recommend</span>
                </div>
              </div>

              {/* Progress Bar Distribution */}
              <div className="space-y-2.5 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 text-right shrink-0">5 ★</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full w-[82%]" />
                  </div>
                  <span className="w-8 text-slate-500 font-semibold">82%</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="w-6 text-right shrink-0">4 ★</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full w-[12%]" />
                  </div>
                  <span className="w-8 text-slate-500 font-semibold">12%</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="w-6 text-right shrink-0">3 ★</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full w-[4%]" />
                  </div>
                  <span className="w-8 text-slate-500 font-semibold">4%</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="w-6 text-right shrink-0">2 ★</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-slate-300 h-full rounded-full w-[1%]" />
                  </div>
                  <span className="w-8 text-slate-500 font-semibold">1%</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="w-6 text-right shrink-0">1 ★</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-slate-300 h-full rounded-full w-[1%]" />
                  </div>
                  <span className="w-8 text-slate-500 font-semibold">1%</span>
                </div>
              </div>
            </div>

            {/* Verified Customer Reviews List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <span>Top Verified Reviews</span>
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">2 Reviews</span>
                </h3>
                <span className="text-xs font-bold text-[#16A34A]">Sort by: Most Recent</span>
              </div>

              <div className="space-y-3.5">
                {/* Review Card 1 */}
                <div className="bg-[#FFFCF5] border border-amber-100/90 hover:border-amber-300 p-4 rounded-2xl space-y-2.5 transition-all shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-black text-xs shadow-2xs">
                        RS
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>Rahul Sharma</span>
                          <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 text-[10px] font-black px-2 py-0.2 rounded-md border border-blue-200">
                            <CheckCircle2 size={10} className="text-blue-600" /> Verified Buyer
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5">2 days ago · Delivered to Vijay Nagar</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-black">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span>5.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    "Super fresh quality! Delivered in just 14 minutes by the local rider. Packaging was totally sealed and authentic."
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-400 font-bold">
                    <span>Verified Purchase</span>
                    <button
                      onClick={() => triggerToast("Feedback recorded: Helpful!")}
                      className="hover:text-[#16A34A] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ThumbsUp size={12} /> Helpful (24)
                    </button>
                  </div>
                </div>

                {/* Review Card 2 */}
                <div className="bg-[#FFFCF5] border border-amber-100/90 hover:border-amber-300 p-4 rounded-2xl space-y-2.5 transition-all shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                        PG
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>Priya Gupta</span>
                          <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 text-[10px] font-black px-2 py-0.2 rounded-md border border-blue-200">
                            <CheckCircle2 size={10} className="text-blue-600" /> Verified Buyer
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5">1 week ago · Delivered to MP Nagar</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-black">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span>5.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    "Very clean unpolished grains. Cooks fast and tastes authentic. Highly recommended for daily household cooking!"
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-400 font-bold">
                    <span>Verified Purchase</span>
                    <button
                      onClick={() => triggerToast("Feedback recorded: Helpful!")}
                      className="hover:text-[#16A34A] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ThumbsUp size={12} /> Helpful (18)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RELATED PRODUCTS GRID SECTION */}
        {/* ========================================================================= */}
        <section className="mt-16 pt-10 border-t border-slate-200/90 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-1">More Essentials</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Related Products
              </h2>
            </div>
            <Link to="/categories" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All Categories <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map((rel) => {
              const inCart = cart.find((item) => item.id === rel.id);
              const catStr = (rel.categoryKey || rel.category || "").toLowerCase();
              const isRelSubEligible = catStr.includes("dairy") || catStr.includes("bakery") || rel.id.startsWith("dairy") || rel.id.startsWith("bakery");

              return (
                <Link
                  key={rel.id}
                  to={`/product/${rel.id}`}
                  className="bg-white border border-emerald-100 hover:border-emerald-300 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer text-slate-900 block"
                >
                  <div className="aspect-square bg-slate-50 relative overflow-hidden">
                    <img
                      src={rel.img || getProductImage(rel.name, rel.categoryKey || "grocery")}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      {rel.rating || "4.8"}
                    </span>
                  </div>

                  <div className="p-3 text-left flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block truncate">{rel.brand || "Fresh Mart"}</span>
                      <h4 className="font-extrabold text-xs text-[#17231A] line-clamp-2 mt-0.5 leading-snug group-hover:text-[#16A34A] transition-colors">
                        {rel.name}
                      </h4>

                      {isRelSubEligible && (
                        <div className="mt-1.5 inline-flex items-center gap-1 bg-[#ECFDF3] border border-emerald-200 text-[#166534] text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          <Repeat size={10} className="text-[#16A34A]" />
                          <span>Save 10% with Subscription</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-black text-[#166534]">₹{rel.price}</div>
                        <div className="text-[10px] text-slate-400 line-through font-semibold">₹{rel.mrp || Math.round(rel.price * 1.2)}</div>
                      </div>

                      {/* Add to Cart Actions with Event Propagation Prevention */}
                      <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        {inCart ? (
                          <div className="flex items-center gap-1 bg-[#ECFDF3] border border-emerald-200 rounded-full p-0.5">
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromCart(rel.id); }}
                              className="w-5 h-5 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer shadow-xs"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-4 text-center text-xs font-black text-[#166534]">{inCart.quantity}</span>
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(rel); }}
                              className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center hover:bg-[#15803D] cursor-pointer shadow-xs"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(rel); triggerToast(`Added ${rel.name} to Cart!`); }}
                            className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-extrabold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Plus size={13} /> Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

      </main>

      {/* APP DOWNLOAD MODAL */}
      {appModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full space-y-5 text-center shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setAppModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Smartphone size={28} />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Complete Purchase on App
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Download FillCarts Mobile App to complete 1-tap checkout, enjoy live GPS rider tracking & exclusive discounts!
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-center gap-3">
              <QrCode size={48} className="text-slate-900" />
              <div className="text-left text-xs">
                <div className="font-extrabold text-slate-900">Scan to Install</div>
                <div className="text-slate-500 font-semibold">Available on Android & iOS</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => alert("Downloading FillCarts for Android...")}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download size={14} /> Google Play
              </button>
              <button
                onClick={() => alert("Downloading FillCarts for iOS...")}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Smartphone size={14} /> App Store
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
