import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
  const cartContext = useCart() || {};
  const { cart = [], addToCart = () => { }, removeFromCart = () => { }, user, userLocation } = cartContext;

  // Find selected product dynamically by ID
  const product = useMemo(() => {
    const found = getProductById(id);
    if (found) return found;

    // Clean fallback product if ID is missing or invalid
    const cleanedName = String(id || "Fresh Item")
      .replace(/^(deal-|cat-|prod-)/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      id: id || "prod-default",
      name: cleanedName || "Fresh Grocery Item",
      category: "Grocery Essentials",
      brand: "FillCarts Verified Store",
      price: 99,
      mrp: 120,
      rating: "4.8",
      reviews: "1,150",
      desc: "Wholesome and fresh item delivered straight to your doorstep with 15-minute express local fulfillment."
    };
  }, [id]);

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeThumbIdx, setActiveThumbIdx] = useState(0);
  const [showDetails, setShowDetails] = useState(true);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [appModalOpen, setAppModalOpen] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState(
    userLocation?.formatted || (userLocation?.area ? `${userLocation.area}, ${userLocation.city}` : "Vijay Nagar, Indore")
  );
  const [deliveryStatus, setDeliveryStatus] = useState("⚡ Delivery in 15-20 mins by Fresh Mart Kirana");
  const [toastMessage, setToastMessage] = useState("");

  // Dynamic Reviews & Ratings State
  const [reviewsList, setReviewsList] = useState([]);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const [reviewSort, setReviewSort] = useState("recent"); // "recent" | "highest" | "lowest" | "helpful"
  const [starFilter, setStarFilter] = useState(0); // 0 = all, 1..5 = star filter

  // Write Review Form State
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formComment, setFormComment] = useState("");

  // Load or Seed Reviews for Current Product
  useEffect(() => {
    if (!product?.id) return;
    const storageKey = `fillcart_reviews_${product.id}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setReviewsList(JSON.parse(stored));
        return;
      } catch (e) {
        console.error("Error parsing reviews from localStorage:", e);
      }
    }

    // Default Seed Reviews for this product if none exist
    const seedReviews = [
      {
        id: `rev-seed-1-${product.id}`,
        name: "Rahul Sharma",
        rating: 5,
        date: "2 days ago",
        location: "Vijay Nagar, Indore",
        comment: `Super fresh quality ${product.name}! Delivered in just 14 minutes by the local rider. Packaging was totally sealed and authentic.`,
        verified: true,
        helpfulCount: 24,
        liked: false
      },
      {
        id: `rev-seed-2-${product.id}`,
        name: "Priya Gupta",
        rating: 5,
        date: "1 week ago",
        location: "MP Nagar, Bhopal",
        comment: `Very clean and top grade quality. Cooks fast and tastes authentic. Highly recommended for daily household cooking!`,
        verified: true,
        helpfulCount: 18,
        liked: false
      },
      {
        id: `rev-seed-3-${product.id}`,
        name: "Ananya Verma",
        rating: 4,
        date: "2 weeks ago",
        location: "Indiranagar, Bengaluru",
        comment: `Good product value for money. On-time express neighborhood fulfillment. Will definitely buy again!`,
        verified: true,
        helpfulCount: 9,
        liked: false
      }
    ];

    setReviewsList(seedReviews);
    localStorage.setItem(storageKey, JSON.stringify(seedReviews));
  }, [product?.id]);

  // Dynamic Rating Calculations
  const totalReviewsCount = reviewsList.length;

  const averageRating = useMemo(() => {
    if (!reviewsList.length) return Number(product?.rating || 4.8).toFixed(1);
    const sum = reviewsList.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    return (sum / reviewsList.length).toFixed(1);
  }, [reviewsList, product?.rating]);

  const ratingDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });

    const total = reviewsList.length || 1;
    return {
      5: { count: counts[5], percent: Math.round((counts[5] / total) * 100) },
      4: { count: counts[4], percent: Math.round((counts[4] / total) * 100) },
      3: { count: counts[3], percent: Math.round((counts[3] / total) * 100) },
      2: { count: counts[2], percent: Math.round((counts[2] / total) * 100) },
      1: { count: counts[1], percent: Math.round((counts[1] / total) * 100) },
    };
  }, [reviewsList]);

  const recommendPercent = useMemo(() => {
    if (!reviewsList.length) return 96;
    const positiveCount = reviewsList.filter((r) => Number(r.rating) >= 4).length;
    return Math.round((positiveCount / reviewsList.length) * 100);
  }, [reviewsList]);

  // Filtered & Sorted Reviews
  const filteredSortedReviews = useMemo(() => {
    let list = [...reviewsList];

    if (starFilter > 0) {
      list = list.filter((r) => Math.round(Number(r.rating)) === starFilter);
    }

    if (reviewSort === "recent") {
      list.sort((a, b) => (b.id > a.id ? 1 : -1));
    } else if (reviewSort === "highest") {
      list.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (reviewSort === "lowest") {
      list.sort((a, b) => Number(a.rating) - Number(b.rating));
    } else if (reviewSort === "helpful") {
      list.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    }

    return list;
  }, [reviewsList, starFilter, reviewSort]);

  // Review Submission & Action Handlers
  const handleOpenWriteReview = () => {
    setFormName(user?.name || user?.phone || "");
    setFormLocation(deliveryAddress || "Indore");
    setFormRating(5);
    setIsWriteReviewOpen(true);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!formComment.trim()) {
      triggerToast("Please enter a review description.");
      return;
    }

    const reviewerName = formName.trim() || user?.name || user?.phone || "Verified Buyer";
    const reviewerLocation = formLocation.trim() || deliveryAddress || "Indore";

    const newRev = {
      id: `rev-${Date.now()}`,
      name: reviewerName,
      rating: Number(formRating),
      date: "Just now",
      location: reviewerLocation,
      comment: formComment.trim(),
      verified: true,
      helpfulCount: 0,
      liked: false
    };

    const updated = [newRev, ...reviewsList];
    setReviewsList(updated);
    if (product?.id) {
      localStorage.setItem(`fillcart_reviews_${product.id}`, JSON.stringify(updated));
    }

    setFormComment("");
    setFormRating(5);
    setIsWriteReviewOpen(false);
    triggerToast("✨ Thank you! Your review has been published.");
  };

  const handleToggleHelpful = (reviewId) => {
    const updated = reviewsList.map((r) => {
      if (r.id === reviewId) {
        const isLiked = !r.liked;
        return {
          ...r,
          liked: isLiked,
          helpfulCount: isLiked ? (r.helpfulCount || 0) + 1 : Math.max(0, (r.helpfulCount || 0) - 1)
        };
      }
      return r;
    });

    setReviewsList(updated);
    if (product?.id) {
      localStorage.setItem(`fillcart_reviews_${product.id}`, JSON.stringify(updated));
    }
    triggerToast("Feedback recorded: Helpful!");
  };

  useEffect(() => {
    if (userLocation) {
      setDeliveryAddress(
        userLocation.formatted || (userLocation.area ? `${userLocation.area}, ${userLocation.city}` : "Vijay Nagar, Indore")
      );
    }
  }, [userLocation]);

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
    const list = getVariantsForProduct(product);
    if (Array.isArray(list) && list.length > 0) return list;
    return [{
      size: "1 Unit",
      price: product?.price || 99,
      mrp: product?.mrp || 120,
      off: "Best Price"
    }];
  }, [product]);

  useEffect(() => {
    setSelectedVariantIdx(0);
    setActiveThumbIdx(0);
  }, [product?.id]);

  const activeVariant = variants[selectedVariantIdx] || variants[0] || {
    size: "1 Unit",
    price: product?.price || 99,
    mrp: product?.mrp || 120,
    off: "Best Price"
  };

  const safeCart = Array.isArray(cart) ? cart : [];
  const inCart = safeCart.find((item) => item?.id === product?.id);

  // Gallery thumbnails
  const mainProductImg = product?.img || getProductImage(product?.name || "Grocery", product?.category?.toLowerCase() || "grocery");
  const galleryImages = [
    mainProductImg,
    mainProductImg,
    mainProductImg,
    mainProductImg,
  ];

  // Related products (filtered by category)
  const relatedProducts = useMemo(() => {
    return getRelatedProducts(product) || [];
  }, [product]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleAddressCheck = (e) => {
    e.preventDefault();
    if (deliveryAddress && deliveryAddress.trim().length >= 3) {
      setDeliveryStatus(`⚡ Serviceable at ${deliveryAddress.trim()}! Delivery in 15-20 mins by local partner store.`);
    } else {
      setDeliveryStatus("Please enter a valid delivery address or area");
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
              {/* Clickable Small Rating Box Pill Overlay */}
              <button
                onClick={() => setIsAllReviewsModalOpen(true)}
                className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-amber-200/90 shadow-sm hover:shadow-md hover:border-amber-400 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-extrabold text-slate-800 transition-all cursor-pointer z-10 group/pill"
                title="Click to view all ratings & reviews"
              >
                <Star size={13} className="fill-amber-400 text-amber-400 group-hover/pill:scale-110 transition-transform" />
                <span>{averageRating}</span>
                <span className="text-slate-400 font-normal text-[11px]">({totalReviewsCount})</span>
                <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full font-extrabold ml-0.5">Reviews ➔</span>
              </button>

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

              {/* Rating & Reviews Bar - Small Box Trigger */}
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 pb-2 border-b border-slate-100">
                <button
                  onClick={() => setIsAllReviewsModalOpen(true)}
                  className="flex items-center gap-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 px-3 py-1 rounded-xl font-extrabold transition-all shadow-2xs cursor-pointer group"
                >
                  <Star size={13} fill="currentColor" className="text-amber-500 group-hover:scale-110 transition-transform" />
                  <span>{averageRating}</span>
                  <span className="text-slate-400 font-normal">|</span>
                  <span className="text-slate-800 hover:text-amber-800 underline font-semibold">
                    {totalReviewsCount} {totalReviewsCount === 1 ? "review" : "reviews"} ➔
                  </span>
                </button>
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

            {/* Quantity Variant Selector Cards */}
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

            {/* Address & Delivery Checker Bar */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-xs space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">
                Check Express Local Delivery
              </label>
              <form onSubmit={handleAddressCheck} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter Delivery Address / Area (e.g. Vijay Nagar, Indore)"
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
              {deliveryStatus && (
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 pt-1">
                  <Clock size={13} /> {deliveryStatus}
                </p>
              )}
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

              <button
                onClick={() => setIsAllReviewsModalOpen(true)}
                className="text-xs font-bold text-slate-600 hover:text-amber-700 transition-colors flex items-center gap-1.5 cursor-pointer bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-xl w-fit mt-1"
              >
                <span className="text-amber-500">⭐ {averageRating}</span>
                <span>({totalReviewsCount} {totalReviewsCount === 1 ? "review" : "reviews"})</span>
                <span className="text-amber-700 font-extrabold text-[11px] underline ml-1">View All ➔</span>
              </button>
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

      {/* ALL RATINGS & REVIEWS POPUP MODAL */}
      {isAllReviewsModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 md:p-7 max-w-2xl w-full max-h-[90vh] flex flex-col space-y-4 shadow-2xl relative border border-slate-100 animate-[scaleUp_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Star size={20} className="fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                    Ratings & Buyer Reviews
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold truncate max-w-[240px] sm:max-w-xs">
                    {product.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenWriteReview}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles size={13} className="text-amber-400" /> Write Review
                </button>
                <button
                  onClick={() => setIsAllReviewsModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-5 flex-1 no-scrollbar">

              {/* Rating Breakdown Banner inside Modal */}
              <div className="grid sm:grid-cols-[180px_1fr] gap-4 bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-100/90 p-4 rounded-2xl">
                {/* Average Rating Score Box */}
                <div className="text-center flex flex-col justify-center items-center border-b sm:border-b-0 sm:border-r border-amber-200/60 pb-3 sm:pb-0 sm:pr-4">
                  <div className="text-4xl font-black text-slate-900 tracking-tight">{averageRating}</div>
                  <div className="flex items-center justify-center gap-0.5 text-amber-400 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < Math.round(Number(averageRating)) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                    ))}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600">
                    {totalReviewsCount} Verified {totalReviewsCount === 1 ? "Buyer" : "Buyers"}
                  </div>
                  <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-[#166534] text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1.5">
                    <CheckCircle2 size={11} className="text-[#16A34A]" />
                    <span>{recommendPercent}% Recommend</span>
                  </div>
                </div>

                {/* Dynamic Rating Progress Bars */}
                <div className="space-y-1.5 text-xs font-bold text-slate-600 justify-center flex flex-col">
                  {[5, 4, 3, 2, 1].map((starNum) => {
                    const item = ratingDistribution[starNum] || { count: 0, percent: 0 };
                    return (
                      <button
                        key={starNum}
                        onClick={() => setStarFilter(starFilter === starNum ? 0 : starNum)}
                        className={`w-full flex items-center gap-2 p-1 rounded-lg transition-colors text-left cursor-pointer ${starFilter === starNum ? "bg-white border border-amber-300 shadow-2xs" : "hover:bg-white/60"}`}
                      >
                        <span className="w-6 text-right shrink-0">{starNum} ★</span>
                        <div className="flex-1 bg-slate-200/80 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                        <span className="w-8 text-slate-500 text-[11px] font-semibold">{item.percent}%</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter & Sort Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-800">
                    Reviews ({filteredSortedReviews.length})
                  </span>
                  {starFilter > 0 && (
                    <button
                      onClick={() => setStarFilter(0)}
                      className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md hover:bg-amber-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>{starFilter}★ Filter</span>
                      <X size={10} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <span className="text-slate-400 text-[11px]">Sort:</span>
                  <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value)}
                    className="bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1 outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {filteredSortedReviews.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-5 space-y-2">
                    <Star size={28} className="mx-auto text-slate-300" />
                    <div className="text-xs font-bold text-slate-700">No reviews found for this rating</div>
                    <button
                      onClick={() => setStarFilter(0)}
                      className="text-xs font-extrabold text-amber-600 hover:underline cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  filteredSortedReviews.map((rev) => {
                    const initials = rev.name
                      ? rev.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                      : "VB";

                    return (
                      <div
                        key={rev.id}
                        className="bg-[#FFFCF5] border border-amber-100 p-3.5 rounded-2xl space-y-2 transition-all shadow-2xs hover:border-amber-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-black text-[11px] shadow-2xs">
                              {initials}
                            </div>
                            <div>
                              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                                <span>{rev.name}</span>
                                {rev.verified && (
                                  <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 text-[9px] font-black px-1.5 py-0.2 rounded-md border border-blue-200">
                                    <CheckCircle2 size={9} className="text-blue-600" /> Verified
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-semibold">
                                {rev.date} {rev.location ? `· ${rev.location}` : ""}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-black">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span>{Number(rev.rating).toFixed(1)}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                          "{rev.comment}"
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
                          <span>Verified Buyer Purchase</span>
                          <button
                            onClick={() => handleToggleHelpful(rev.id)}
                            className={`flex items-center gap-1 transition-colors cursor-pointer ${rev.liked ? "text-[#16A34A] font-extrabold" : "hover:text-[#16A34A]"}`}
                          >
                            <ThumbsUp size={11} className={rev.liked ? "fill-[#16A34A]" : ""} /> Helpful ({rev.helpfulCount || 0})
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 shrink-0 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">100% Genuine Local Customer Reviews</span>
              <button
                onClick={() => setIsAllReviewsModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Close Box
              </button>
            </div>

          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl relative border border-slate-100 animate-[scaleUp_0.2s_ease-out]">
            <button
              onClick={() => setIsWriteReviewOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                <Star size={24} className="fill-amber-400 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Write a Review
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Share your feedback for {product.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4 pt-1">
              {/* Star Rating Picker */}
              <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-2xl text-center space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Rating Score
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = starVal <= (formHoverRating || formRating);
                    return (
                      <button
                        type="button"
                        key={starVal}
                        onMouseEnter={() => setFormHoverRating(starVal)}
                        onMouseLeave={() => setFormHoverRating(0)}
                        onClick={() => setFormRating(starVal)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          size={28}
                          className={isFilled ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs font-extrabold text-amber-800">
                  {formRating === 5 && "🤩 5.0 - Excellent Quality!"}
                  {formRating === 4 && "🙂 4.0 - Very Good Product"}
                  {formRating === 3 && "😐 3.0 - Average Experience"}
                  {formRating === 2 && "🙁 2.0 - Fair, could be better"}
                  {formRating === 1 && "😡 1.0 - Poor Quality"}
                </div>
              </div>

              {/* User Details */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Area / City</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Vijay Nagar, Indore"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Detailed Review</label>
                <textarea
                  rows={3}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="How was the product freshness, packaging, and local kirana delivery?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-semibold outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWriteReviewOpen(false)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} /> Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
