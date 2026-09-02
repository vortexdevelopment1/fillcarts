import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Star, Plus, Minus, ChevronRight, ChevronDown, ChevronUp, ShoppingCart,
  Smartphone, ArrowLeft, Heart, Share2, CheckCircle2, QrCode, Download, X,
  ShieldCheck, Truck, Clock, Sparkles, MapPin, Store, Check, ThumbsUp, RefreshCw, AlertCircle, Repeat, Loader2
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getProductImage } from "../utils/productImages";
import productService from "../services/productService";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cartContext = useCart() || {};
  const { cart = [], addToCart = () => { }, removeFromCart = () => { }, user, userLocation } = cartContext;
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product and related products from backend MongoDB API
  useEffect(() => {
    let isMounted = true;
    const fetchProductData = async () => {
      setLoadingProduct(true);
      try {
        const fetched = await productService.getProductById(id);
        if (isMounted) {
          if (fetched) {
            setProduct(fetched);
            const related = await productService.getRelatedProducts(fetched, 5);
            if (isMounted) setRelatedProducts(related);
          } else {
            // Clean fallback
            const cleanedName = String(id || "Fresh Item")
              .replace(/^(deal-|cat-|prod-)/, "")
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
            const fallbackProd = {
              id: id || "prod-default",
              name: cleanedName || "Fresh Grocery Item",
              category: "Grocery Essentials",
              categoryKey: "grocery",
              brand: "Fresh Mart",
              price: 99,
              mrp: 120,
              rating: "4.8",
              reviews: "1,150",
              desc: "Wholesome and fresh item delivered straight to your doorstep with 15-minute express local fulfillment."
            };
            setProduct(fallbackProd);
          }
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        if (isMounted) setLoadingProduct(false);
      }
    };

    fetchProductData();
    return () => { isMounted = false; };
  }, [id]);

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeThumbIdx, setActiveThumbIdx] = useState(0);
  const [showDetails, setShowDetails] = useState(true);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);

  const isWishlisted =
    product && isInWishlist
      ? isInWishlist(product.productId || product._id || product.id)
      : false;
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [isProductInfoModalOpen, setIsProductInfoModalOpen] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState(
    userLocation?.formatted || (userLocation?.area ? `${userLocation.area}, ${userLocation.city}` : "Vijay Nagar, Indore")
  );
  const [deliveryStatus, setDeliveryStatus] = useState("⚡ Delivery in 15-20 mins by Fresh Mart Kirana");
  const [toastMsg, setToastMsg] = useState("");
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Dynamic Reviews & Ratings State
  const [reviewsList, setReviewsList] = useState([]);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const [reviewSort, setReviewSort] = useState("recent");
  const [starFilter, setStarFilter] = useState(0);

  // Write Review Form State
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formComment, setFormComment] = useState("");

  // Load or Seed Reviews for Current Product
  useEffect(() => {
    const prodId = product?.id || product?.productId || product?._id;
    if (!prodId) return;

    const storageKey = `fillcart_reviews_${prodId}`;
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
        id: `rev-seed-1-${prodId}`,
        name: "Rahul Sharma",
        rating: 5,
        date: "2 days ago",
        location: "Vijay Nagar, Indore",
        comment: `Super fresh quality ${product?.name || "item"}! Delivered in just 14 minutes by the local rider. Packaging was totally sealed and authentic.`,
        verified: true,
        helpfulCount: 24,
        liked: false
      },
      {
        id: `rev-seed-2-${prodId}`,
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
        id: `rev-seed-3-${prodId}`,
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
  }, [product?.id, product?.productId, product?._id]);

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
    const currentProdId = product?.id || product?.productId || product?._id;
    if (currentProdId) {
      localStorage.setItem(`fillcart_reviews_${currentProdId}`, JSON.stringify(updated));
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
    const currentProdId = product?.id || product?.productId || product?._id;
    if (currentProdId) {
      localStorage.setItem(`fillcart_reviews_${currentProdId}`, JSON.stringify(updated));
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
    const pid = String(product.id || product.productId || product._id || "").toLowerCase();
    return cat.includes("dairy") || cat.includes("bakery") || pid.startsWith("dairy") || pid.startsWith("bakery");
  }, [product]);

  const handleSubscribeAndSave = () => {
    if (!product) return;
    const categoryKey = product.categoryKey ||
      (product.category?.toLowerCase().includes("dairy") ? "dairy" :
        product.category?.toLowerCase().includes("bakery") ? "bakery" : "dairy");

    const currentVariant = variants[selectedVariantIdx] || variants[0] || {};
    const subPrice = Math.round((currentVariant.price || product.price || 50) * 0.9);

    navigate("/subscriptions", {
      state: {
        tab: "create",
        subscribeProduct: {
          id: product.id || product.productId || product._id || `sub-${Date.now()}`,
          name: `${product.name} (${currentVariant.size || "1 Unit"})`,
          categoryKey,
          price: subPrice,
          img: product.img
        }
      }
    });
  };

  // Dynamically generated quantity/unit variants based on product type
  const variants = useMemo(() => {
    const list = productService.getVariantsForProduct(product);
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
  }, [product?.id, product?.productId, product?._id]);

  const activeVariant = variants[selectedVariantIdx] || variants[0] || {
    size: "1 Unit",
    price: product?.price || 99,
    mrp: product?.mrp || 120,
    off: "Best Price"
  };

  const safeCart = Array.isArray(cart) ? cart : [];
  const targetId = product?.id || product?.productId || product?._id;
  const inCart = targetId ? safeCart.find((item) => item?.id === targetId || item?.productId === targetId || item?._id === targetId) : null;

  // Gallery thumbnails
  const mainProductImg = product?.img || (product ? getProductImage(product.name || "Grocery", product.category?.toLowerCase() || "grocery") : "");
  const galleryImages = [
    mainProductImg,
    mainProductImg,
    mainProductImg,
    mainProductImg,
  ];

  const handleAddressCheck = (e) => {
    e.preventDefault();
    if (deliveryAddress && deliveryAddress.trim().length >= 3) {
      setDeliveryStatus(`⚡ Serviceable at ${deliveryAddress.trim()}! Delivery in 15-20 mins by local partner store.`);
    } else {
      setDeliveryStatus("Please enter a valid delivery address or area");
    }
  };

  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Navbar */}
      <Navbar />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 bg-[#17231A] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl z-50 animate-bounce flex items-center gap-2 border border-slate-700">
          <Sparkles size={14} className="text-[#16A34A]" /> {toastMsg}
        </div>
      )}

      {loadingProduct || !product ? (
        <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 size={36} className="text-[#16A34A] animate-spin" />
          <p className="text-sm font-extrabold text-[#17231A]">Loading fresh product details from MongoDB...</p>
        </div>
      ) : (
        <>
          {/* BREADCRUMB / BACK LINK */}
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-4 pb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link to="/" className="hover:text-[#16A34A] transition-colors">Home</Link>
              <ChevronRight size={13} className="text-slate-400" />
              <Link to="/categories" className="hover:text-[#16A34A] transition-colors">{product.category || "Grocery"}</Link>
              <ChevronRight size={13} className="text-slate-400" />
              <span className="text-[#17231A] font-extrabold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
            </div>
          </div>

          {/* MAIN PERFECTLY BALANCED 2-COLUMN HERO CONTAINER */}
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-12 flex-1 w-full text-left">

            {/* 2-COLUMN GRID */}
            <div className="grid lg:grid-cols-12 gap-8 items-start relative">

              {/* LEFT COLUMN: Image Gallery + Product Details & Seller Details Cards */}
              <div className="lg:col-span-5 space-y-4">

                {/* Product Image Gallery Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xs relative flex flex-col items-center justify-center overflow-hidden group">

                  {/* Wishlist Button */}
                  <button
                    onClick={async () => {
                      if (toggleWishlist) {
                        const added = await toggleWishlist(product);
                        if (user) {
                          triggerToast(added ? "Added to Wishlist! ❤️" : "Removed from Wishlist");
                        }
                      }
                    }}
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer z-10 ${isWishlisted
                      ? "bg-rose-50 border-rose-200 text-rose-600 shadow-2xs"
                      : "bg-white border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-500"
                      }`}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart size={18} className={isWishlisted ? "fill-rose-600 text-rose-600" : ""} />
                  </button>

                  {/* Main Product Image */}
                  <div className="w-full h-56 sm:h-64 flex items-center justify-center py-2 relative">
                    <img
                      src={galleryImages[activeThumbIdx]}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Gallery Thumbnail Selector Bar */}
                  <div className="flex items-center justify-center gap-2 pt-2">
                    {galleryImages.map((imgUrl, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveThumbIdx(i)}
                        className={`w-11 h-11 rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${activeThumbIdx === i ? "border-[#16A34A] scale-105 shadow-2xs" : "border-slate-200 opacity-60 hover:opacity-100"
                          }`}
                      >
                        <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* TWO SMALL SIDE-BY-SIDE BOXES ON LEFT SIDE (PRODUCT DETAILS & SELLER DETAILS) */}
                <div className="grid sm:grid-cols-2 gap-3.5">

                  {/* LEFT SMALL BOX: Product Details with Popup Trigger Link */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-4.5 shadow-2xs space-y-2.5">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#17231A] flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <Sparkles size={13} className="text-[#16A34A]" /> Product Details
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                        {product.desc}
                      </p>

                      <button
                        onClick={() => setIsProductInfoModalOpen(true)}
                        className="text-[11px] font-bold text-[#16A34A] hover:underline flex items-center justify-between w-full bg-[#ECFDF3] border border-emerald-200 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer group mt-1"
                      >
                        <span>View Details, Benefits & MFG ➔</span>
                        <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform text-[#16A34A]" />
                      </button>
                    </div>
                  </div>

                  {/* RIGHT SMALL BOX: Seller Details */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-4.5 shadow-2xs space-y-2.5">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#17231A] flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <Store size={13} className="text-blue-600" /> Seller Details
                    </div>

                    <div className="space-y-1.5 text-xs font-medium text-slate-700">
                      <div className="font-extrabold text-[#17231A] flex items-center gap-1">
                        <span>Fresh Mart Superstore</span>
                        <CheckCircle2 size={13} className="text-[#16A34A]" />
                      </div>
                      <div className="text-[11px] text-[#166534] font-bold flex items-center gap-1">
                        <Clock size={12} /> 15-20 min • Free Delivery
                      </div>

                      <button
                        onClick={() => setIsAllReviewsModalOpen(true)}
                        className="text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded-lg w-full mt-1.5 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1">
                          <Star size={11} className="fill-amber-400 text-amber-400" /> {averageRating} ({totalReviewsCount})
                        </span>
                        <span className="underline font-extrabold">View All ➔</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN: Product Information & Purchase Flow (Matches Left Height Perfectly!) */}
              <div className="lg:col-span-7 space-y-4">

                {/* Main Product Card: Title, Price, Pack Selector, Delivery & Action CTAs */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-3.5">

                  {/* Brand Tag & In-Stock Status */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-3 py-0.5 rounded-full">
                      {product.brand || "FillCarts Shop"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#16A34A] flex items-center gap-1">
                        <CheckCircle2 size={13} /> In Stock Nearby
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href);
                          triggerToast("Product link copied!");
                        }}
                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                        title="Share Product"
                      >
                        <Share2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h1 className="text-lg sm:text-xl font-bold text-[#17231A] leading-snug tracking-tight">
                    {product.name}
                  </h1>

                  {/* Rating & Reviews Bar */}
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 pb-2 border-b border-slate-100 flex-wrap">
                    <button
                      onClick={() => setIsAllReviewsModalOpen(true)}
                      className="flex items-center gap-1 text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-lg font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{averageRating}</span>
                      <span className="text-slate-400 font-normal">|</span>
                      <span className="text-slate-800 hover:underline font-semibold">
                        {totalReviewsCount} {totalReviewsCount === 1 ? "review" : "reviews"} ➔
                      </span>
                    </button>
                    <span>•</span>
                    <span className="text-blue-600 font-medium">12,000+ Orders Delivered</span>
                  </div>

                  {/* Pricing Section */}
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-xl sm:text-2xl font-extrabold text-[#17231A]">₹{activeVariant.price}</span>
                      <span className="text-xs sm:text-sm text-slate-400 line-through font-semibold">₹{activeVariant.mrp}</span>
                      <span className="text-xs font-bold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-2.5 py-0.5 rounded-md">
                        {activeVariant.off}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">Inclusive of all taxes · Free local delivery above ₹199</p>
                  </div>

                  {/* Variant / Pack Size Selector */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-[#17231A] uppercase tracking-wider">Select Pack Size</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {variants.map((v, idx) => {
                        const isSelected = selectedVariantIdx === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedVariantIdx(idx)}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${isSelected
                              ? "border-[#16A34A] bg-[#ECFDF3] ring-1 ring-[#16A34A]/30 shadow-2xs"
                              : "border-slate-200 bg-white hover:border-emerald-300"
                              }`}
                          >
                            <div className="text-xs font-bold text-[#17231A]">{v.size}</div>
                            <div className="text-[10px] font-bold text-amber-600">{v.off}</div>
                            <div className="text-xs font-extrabold text-[#17231A] mt-0.5">
                              ₹{v.price} <span className="text-[10px] text-slate-400 line-through font-normal">₹{v.mrp}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Checker Bar */}
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <form onSubmit={handleAddressCheck} className="flex gap-2">
                      <div className="relative flex-1">
                        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Enter Delivery Area..."
                          className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-[#17231A] focus:outline-none focus:border-[#16A34A]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-[#17231A] hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Check
                      </button>
                    </form>
                    {deliveryStatus && (
                      <p className="text-xs font-bold text-[#166534] flex items-center gap-1 pt-0.5">
                        <Clock size={12} className="text-[#16A34A]" /> {deliveryStatus}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Add to Cart */}
                      {inCart ? (
                        <div className="flex items-center justify-between bg-slate-100 border border-slate-300 rounded-xl p-1.5 px-3">
                          <button
                            onClick={() => removeFromCart(targetId)}
                            className="w-8 h-8 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 shadow-2xs cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-extrabold text-xs text-[#17231A]">{inCart.quantity} in Cart</span>
                          <button
                            onClick={() => addToCart(product)}
                            className="w-8 h-8 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 shadow-2xs cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            addToCart({
                              ...product,
                              id: targetId,
                              price: activeVariant.price,
                              mrp: activeVariant.mrp,
                              name: `${product.name} (${activeVariant.size})`,
                            });
                            triggerToast(`Added ${product.name} (${activeVariant.size}) to Cart!`);
                          }}
                          className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                        >
                          <ShoppingCart size={15} /> Add to Cart
                        </button>
                      )}

                      {/* App Download Buy */}
                      <button
                        onClick={() => setAppModalOpen(true)}
                        className="w-full bg-[#17231A] hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                      >
                        <Smartphone size={15} /> Download App to Buy
                      </button>
                    </div>

                    {/* Subscription Button */}
                    {isSubscriptionEligible && (
                      <button
                        type="button"
                        onClick={handleSubscribeAndSave}
                        className="w-full bg-[#ECFDF3] hover:bg-emerald-100 text-[#166534] font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-emerald-200 group"
                      >
                        <Repeat size={15} className="text-[#16A34A] group-hover:rotate-180 transition-transform duration-500" />
                        <span>Subscribe & Save 10% (₹{Math.round(activeVariant.price * 0.9)})</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>

            </div>

            {/* RELATED / SIMILAR PRODUCTS SECTION */}
            <section className="pt-8 border-t border-slate-200 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-black uppercase tracking-widest text-[#16A34A] mb-1">
                    More Essentials
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">
                    Similar Products
                  </h2>
                </div>
                <Link to="/categories" className="text-xs font-extrabold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1">
                  View All Categories <ChevronRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                {relatedProducts.filter(Boolean).map((rel) => {
                  const relId = rel?.id || rel?.productId || rel?._id;
                  const relInCart = safeCart.find((item) => item?.id === relId || item?.productId === relId || item?._id === relId);
                  const catStr = (rel.categoryKey || rel.category || "").toLowerCase();
                  const isRelSubEligible = catStr.includes("dairy") || catStr.includes("bakery") || String(relId || "").startsWith("dairy") || String(relId || "").startsWith("bakery");
                  const isRelWishlisted = isInWishlist ? isInWishlist(relId) : false;

                  return (
                    <Link
                      key={relId || `rel-${Math.random()}`}
                      to={`/product/${relId}`}
                      className="bg-white border border-emerald-100 hover:border-emerald-300 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer text-slate-900 block"
                    >
                      <div className="aspect-square bg-slate-50 relative overflow-hidden">
                        <img
                          src={rel.img || getProductImage(rel.name, rel.categoryKey || "grocery")}
                          alt={rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {/* Wishlist Button */}
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (toggleWishlist) {
                              const added = await toggleWishlist(rel);
                              if (user) {
                                triggerToast(added ? "Added to Wishlist! ❤️" : "Removed from Wishlist");
                              }
                            }
                          }}
                          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs z-10 ${
                            isRelWishlisted
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : "bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 border border-slate-200/80"
                          }`}
                          title={isRelWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          <Heart size={12} className={isRelWishlisted ? "fill-rose-600 text-rose-600" : ""} />
                        </button>
                        {/* Rating Badge */}
                        <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5">
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
                            <div className="mt-1.5 inline-flex items-center gap-1 bg-[#ECFDF3] border border-emerald-200 text-[#166534] text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
                              <Repeat size={9} className="text-[#16A34A]" />
                              <span>Save 10% on Sub</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-black text-[#166534]">₹{rel.price}</div>
                            <div className="text-[10px] text-slate-400 line-through font-semibold">₹{rel.mrp || Math.round(rel.price * 1.2)}</div>
                          </div>

                          {/* Add Button Action */}
                          <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                            {relInCart ? (
                              <div className="flex items-center gap-1 bg-[#ECFDF3] border border-emerald-200 rounded-full p-0.5">
                                <button
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (relId) removeFromCart(relId); }}
                                  className="w-5 h-5 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer shadow-2xs"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="w-4 text-center text-xs font-black text-[#166534]">{relInCart.quantity}</span>
                                <button
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(rel); }}
                                  className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center hover:bg-[#15803D] cursor-pointer shadow-2xs"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(rel); triggerToast(`Added ${rel.name} to Cart!`); }}
                                className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-extrabold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
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

          {/* MOBILE STICKY BOTTOM ACTION BAR */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg flex items-center justify-between gap-3 sm:hidden">
            <div className="text-left leading-none">
              <div className="text-xs text-slate-400 font-semibold">{activeVariant.size}</div>
              <div className="text-lg font-extrabold text-[#17231A] mt-0.5">
                ₹{activeVariant.price} <span className="text-xs text-slate-400 line-through font-normal">₹{activeVariant.mrp}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {inCart ? (
                <div className="flex items-center gap-2 bg-[#ECFDF3] border border-emerald-200 rounded-full px-3 py-1.5">
                  <button
                    onClick={() => removeFromCart(targetId)}
                    className="w-6 h-6 rounded-full bg-white text-slate-700 flex items-center justify-center font-bold text-xs shadow-2xs"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="font-extrabold text-xs text-[#166534] px-1">{inCart.quantity}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-xs shadow-2xs"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    addToCart({
                      ...product,
                      id: targetId,
                      price: activeVariant.price,
                      mrp: activeVariant.mrp,
                      name: `${product.name} (${activeVariant.size})`,
                    });
                    triggerToast(`Added ${product.name} (${activeVariant.size}) to Cart!`);
                  }}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-5 py-2.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <ShoppingCart size={15} /> Add to Cart
                </button>
              )}
            </div>
          </div>

          {/* PRODUCT SPECIFICATIONS, BENEFITS & MFG MODAL */}
          {isProductInfoModalOpen && (
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl p-5 md:p-7 max-w-lg w-full flex flex-col space-y-4 shadow-2xl relative border border-slate-100 animate-[scaleUp_0.2s_ease-out] text-left">

                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-[#ECFDF3] border border-emerald-200 text-[#16A34A] rounded-2xl flex items-center justify-center shrink-0">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-[#17231A] leading-tight">
                        Product Specifications & Info
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold truncate max-w-[220px] sm:max-w-xs">
                        {product.name}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsProductInfoModalOpen(false)}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="overflow-y-auto pr-1 space-y-4 flex-1 text-left text-xs font-medium no-scrollbar">

                  {/* Full Product Description */}
                  <div className="space-y-1.5">
                    <div className="font-extrabold text-[#17231A] text-xs uppercase tracking-wider">Description</div>
                    <p className="text-slate-600 leading-relaxed bg-[#FFFCF5] border border-slate-200/80 p-3 rounded-2xl">
                      {product.desc}
                    </p>
                  </div>

                  {/* Manufacturing & Expiry Dates */}
                  <div className="space-y-1.5">
                    <div className="font-extrabold text-[#17231A] text-xs uppercase tracking-wider">Manufacturing & Shelf Life</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#FFFCF5] border border-slate-200 p-3 rounded-2xl">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">MFG Date</div>
                        <div className="text-xs font-extrabold text-[#17231A] mt-0.5">15 Aug 2026</div>
                      </div>
                      <div className="bg-[#FFFCF5] border border-slate-200 p-3 rounded-2xl">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Expiry Date</div>
                        <div className="text-xs font-extrabold text-[#166534] mt-0.5">30 Aug 2026</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="space-y-1.5">
                    <div className="font-extrabold text-[#17231A] text-xs uppercase tracking-wider">Key Benefits</div>
                    <ul className="bg-[#FFFCF5] border border-slate-200 p-3 rounded-2xl space-y-1.5 text-slate-700 list-disc list-inside">
                      <li>100% natural, handpicked local store quality.</li>
                      <li>Hyperlocal neighborhood dispatch in 15-20 minutes.</li>
                      <li>Sourced directly from verified local Kirana vendors.</li>
                    </ul>
                  </div>

                  {/* Nutritional Information */}
                  <div className="space-y-1.5">
                    <div className="font-extrabold text-[#17231A] text-xs uppercase tracking-wider">Nutritional Info (per 100g)</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-[#FFFCF5] border border-slate-200 p-2.5 rounded-xl">
                        <div className="text-slate-400 text-[10px]">Protein</div>
                        <div className="font-extrabold text-[#17231A]">24.5g</div>
                      </div>
                      <div className="bg-[#FFFCF5] border border-slate-200 p-2.5 rounded-xl">
                        <div className="text-slate-400 text-[10px]">Dietary Fiber</div>
                        <div className="font-extrabold text-[#17231A]">16.2g</div>
                      </div>
                      <div className="bg-[#FFFCF5] border border-slate-200 p-2.5 rounded-xl">
                        <div className="text-slate-400 text-[10px]">Energy</div>
                        <div className="font-extrabold text-[#17231A]">347 kcal</div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="pt-2 border-t border-slate-100 shrink-0 flex items-center justify-end">
                  <button
                    onClick={() => setIsProductInfoModalOpen(false)}
                    className="bg-[#17231A] hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          )}

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
                      <h3 className="text-lg font-extrabold text-[#17231A] leading-tight">
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
                      className="bg-[#17231A] hover:bg-slate-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
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
                <div className="overflow-y-auto pr-1 space-y-5 flex-1 no-scrollbar text-left">
                  {/* Rating Breakdown Banner */}
                  <div className="grid sm:grid-cols-[180px_1fr] gap-4 bg-gradient-to-br from-amber-50/70 to-amber-100/40 border border-amber-200/70 p-4 rounded-2xl">
                    <div className="text-center flex flex-col justify-center items-center border-b sm:border-b-0 sm:border-r border-amber-200/60 pb-3 sm:pb-0 sm:pr-4">
                      <div className="text-4xl font-extrabold text-[#17231A] tracking-tight">{averageRating}</div>
                      <div className="flex items-center justify-center gap-0.5 text-amber-400 my-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < Math.round(Number(averageRating)) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                        ))}
                      </div>
                      <div className="text-xs font-extrabold text-slate-600">
                        {totalReviewsCount} Verified {totalReviewsCount === 1 ? "Buyer" : "Buyers"}
                      </div>
                      <div className="inline-flex items-center gap-1 bg-[#ECFDF3] border border-emerald-200 text-[#166534] text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1.5">
                        <CheckCircle2 size={11} className="text-[#16A34A]" />
                        <span>{recommendPercent}% Recommend</span>
                      </div>
                    </div>

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
                      <span className="text-xs font-extrabold text-[#17231A]">
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
                      <span className="text-slate-400 text-xs">Sort:</span>
                      <select
                        value={reviewSort}
                        onChange={(e) => setReviewSort(e.target.value)}
                        className="bg-white border border-slate-200 text-[#17231A] text-xs font-bold rounded-lg px-2.5 py-1 outline-none focus:border-[#16A34A] cursor-pointer"
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
                                <div className="w-7 h-7 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-black text-[11px]">
                                  {initials}
                                </div>
                                <div>
                                  <div className="font-extrabold text-xs text-[#17231A] flex items-center gap-1.5">
                                    <span>{rev.name}</span>
                                    {rev.verified && (
                                      <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 text-[9px] font-black px-1.5 py-0.2 rounded-md border border-blue-200">
                                        <CheckCircle2 size={9} className="text-blue-600" /> Verified
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-400 font-medium">
                                    {rev.date} {rev.location ? `· ${rev.location}` : ""}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-lg text-xs font-black">
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
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl relative border border-slate-100 animate-[scaleUp_0.2s_ease-out] text-left">
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
                    <h3 className="text-lg font-extrabold text-[#17231A]">
                      Write a Review
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      Share your feedback for {product.name}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddReview} className="space-y-4 pt-1">
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

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-[#16A34A]"
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
                        className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-[#16A34A]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Detailed Review</label>
                    <textarea
                      rows={3}
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      placeholder="How was the product freshness, packaging, and local kirana delivery?"
                      className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl p-3.5 text-xs font-semibold outline-none focus:border-[#16A34A]"
                      required
                    />
                  </div>

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
                      className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
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

                <div className="w-14 h-14 bg-[#ECFDF3] text-[#16A34A] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Smartphone size={28} />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#17231A]">
                    Complete Purchase on App
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    Download FillCarts Mobile App to complete 1-tap checkout, enjoy live GPS rider tracking & exclusive discounts!
                  </p>
                </div>

                <div className="bg-[#FFFCF5] border border-slate-200 rounded-2xl p-4 flex items-center justify-center gap-3">
                  <QrCode size={48} className="text-[#17231A]" />
                  <div className="text-left text-xs">
                    <div className="font-extrabold text-[#17231A]">Scan to Install</div>
                    <div className="text-slate-500 font-semibold">Available on Android & iOS</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => alert("Downloading FillCarts for Android...")}
                    className="bg-[#17231A] hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download size={14} /> Google Play
                  </button>
                  <button
                    onClick={() => alert("Downloading FillCarts for iOS...")}
                    className="bg-[#17231A] hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Smartphone size={14} /> App Store
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

