import React, { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Star, Plus, Minus, ChevronRight, ChevronDown, ChevronUp, ShoppingCart,
  Smartphone, ArrowLeft, Heart, Share2, CheckCircle2, QrCode, Download, X,
  ShieldCheck, Truck, Clock, Sparkles, MapPin, Store, Check, ThumbsUp, RefreshCw, AlertCircle
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../utils/productImages";

const productDatabase = [
  { id: "grocery-0", name: "Basmati Rice 5kg", category: "Grocery", brand: "India Gate", price: 299, mrp: 349, rating: "4.8", reviews: "1,840", img: "grocery-item-0", desc: "Premium long-grain aromatic Basmati rice, aged to perfection for non-sticky fluffy cooking." },
  { id: "grocery-1", name: "Fortune Moong dal", category: "Grocery", brand: "Fortune", price: 129, mrp: 160, rating: "4.7", reviews: "2,410", img: "grocery-item-1", desc: "Choose wholesome nutrition with fortune Unpolished Moong Dal, naturally processed to retain essential nutrients and deliver authentic taste in every bite." },
  { id: "grocery-2", name: "Sunflower Oil 1L", category: "Grocery", brand: "Fortune", price: 145, mrp: 175, rating: "4.6", reviews: "980", img: "grocery-item-2", desc: "100% pure refined sunflower oil enriched with Vitamin A & D for healthy everyday cooking." },
  { id: "grocery-3", name: "Sugar 1kg", category: "Grocery", brand: "Madhur", price: 48, mrp: 55, rating: "4.5", reviews: "1,200", img: "grocery-item-3", desc: "Pure sulfur-free refined white sugar crystals, ideal for tea, coffee, and sweets." },
  { id: "grocery-4", name: "Fortune Atta 5kg", category: "Grocery", brand: "Fortune", price: 210, mrp: 245, rating: "4.8", reviews: "3,150", img: "grocery-item-4", desc: "100% pure MP Sharbati whole wheat atta for soft, fluffy and nutritious rotis." },
  { id: "grocery-5", name: "Tata Salt 1kg", category: "Grocery", brand: "Tata", price: 28, mrp: 32, rating: "4.9", reviews: "5,400", img: "grocery-item-5", desc: "Vacuum evaporated iodized salt ensuring purity and essential iodine for health." },
  { id: "grocery-6", name: "Tea Leaves 250g", category: "Grocery", brand: "Red Label", price: 115, mrp: 130, rating: "4.6", reviews: "850", img: "grocery-item-6", desc: "Rich Assam CTC black tea blend for strong aroma and refreshing taste." },
  { id: "grocery-7", name: "Poha 500g", category: "Grocery", brand: "Local Fresh", price: 42, mrp: 50, rating: "4.5", reviews: "620", img: "grocery-item-7", desc: "Thick beaten rice flakes for quick, light and healthy breakfast poha." },
  
  { id: "fruits-0", name: "Fresh Bananas 1dz", category: "Fruits & Veg", brand: "Farm Fresh", price: 59, mrp: 70, rating: "4.6", reviews: "1,100", img: "fruits-item-0", desc: "Naturally ripened sweet Robusta bananas sourced fresh daily from local orchards." },
  { id: "fruits-1", name: "Red Apples 1kg", category: "Fruits & Veg", brand: "Shimla Fresh", price: 149, mrp: 180, rating: "4.8", reviews: "2,100", img: "fruits-item-1", desc: "Crisp and juicy Shimla red apples packed with natural vitamins." },
  { id: "fruits-2", name: "Onions 1kg", category: "Fruits & Veg", brand: "Nasik Fresh", price: 35, mrp: 45, rating: "4.4", reviews: "4,200", img: "fruits-item-2", desc: "Fresh Nasik red onions, crisp and essential for everyday Indian cooking." },
  { id: "fruits-3", name: "Tomatoes 1kg", category: "Fruits & Veg", brand: "Farm Fresh", price: 40, mrp: 50, rating: "4.5", reviews: "3,800", img: "fruits-item-3", desc: "Farm-fresh ripe red tomatoes ideal for curries and salads." },

  { id: "dairy-0", name: "Toned Milk 1L", category: "Dairy", brand: "Amul", price: 66, mrp: 70, rating: "4.9", reviews: "6,200", img: "dairy-item-0", desc: "Pasteurized homogenized toned milk delivered fresh every morning at 7 AM." },
  { id: "dairy-1", name: "Fresh Paneer 200g", category: "Dairy", brand: "Amul", price: 95, mrp: 110, rating: "4.8", reviews: "1,900", img: "dairy-item-1", desc: "Soft and creamy fresh cottage cheese rich in milk proteins." },

  { id: "bakery-0", name: "Brown Bread", category: "Bakery", brand: "Britannia", price: 45, mrp: 50, rating: "4.7", reviews: "1,400", img: "bakery-item-0", desc: "Whole wheat freshly baked brown bread slices for healthy breakfasts." },
  { id: "bakery-1", name: "Butter Croissant", category: "Bakery", brand: "Artisan Bakers", price: 65, mrp: 75, rating: "4.8", reviews: "720", img: "bakery-item-1", desc: "Flaky artisan butter croissant baked fresh daily by local bakeries." },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useCart();

  // Find selected product or fallback
  const product = useMemo(() => {
    return productDatabase.find((p) => p.id === id) || {
      id: id || "grocery-1",
      name: "Fortune Moong dal",
      category: "Grocery",
      brand: "Fortune",
      price: 129,
      mrp: 160,
      rating: "4.7",
      reviews: "2,410",
      img: "grocery-item-1",
      desc: "Choose wholesome nutrition with fortune Unpolished Moong Dal, naturally processed to retain essential nutrients and deliver authentic taste in every bite."
    };
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

  // Quantity Variants (Matching exact uploaded design)
  const variants = useMemo(() => {
    return [
      { size: "1 kg", off: "19% Off", price: product.price, mrp: product.mrp },
      { size: "250 g", off: "19% Off", price: Math.max(25, Math.round(product.price * 0.3)), mrp: Math.max(30, Math.round(product.mrp * 0.3)) },
      { size: "500 g", off: "19% Off", price: Math.max(45, Math.round(product.price * 0.55)), mrp: Math.max(55, Math.round(product.mrp * 0.55)) },
      { size: "2 kg", off: "20% Off", price: Math.round(product.price * 1.8), mrp: Math.round(product.mrp * 1.8) },
    ];
  }, [product]);

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

  // Related products
  const relatedProducts = useMemo(() => {
    return productDatabase.filter((p) => p.id !== product.id).slice(0, 4);
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

      {/* Breadcrumb Navigation Bar */}
      <div className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 text-xs text-slate-500 font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => navigate("/categories")}
              className="flex items-center gap-1.5 text-slate-700 hover:text-amber-600 font-bold mr-2 cursor-pointer transition-colors"
            >
              <ArrowLeft size={15} /> Back to Categories
            </button>
            <span className="text-slate-300">|</span>
            <Link to="/" className="hover:text-amber-600">Home</Link>
            <ChevronRight size={12} />
            <Link to="/categories" className="hover:text-amber-600">{product.category}</Link>
            <ChevronRight size={12} />
            <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setIsWishlisted(!isWishlisted);
                triggerToast(isWishlisted ? "Removed from Wishlist" : "Saved to Wishlist ❤");
              }}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Save to Wishlist"
            >
              <Heart size={16} className={isWishlisted ? "text-red-500 fill-red-500" : "text-slate-600"} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                triggerToast("Product link copied!");
              }}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Share Product"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

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
              
              {/* Top Image Overlay Badges */}
              <div className="w-full flex items-center justify-between absolute top-4 left-0 px-6 z-10">
                <span className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> {product.rating} (Bestseller)
                </span>
                
                <span className="bg-slate-900/85 backdrop-blur-md text-white font-bold text-[11px] px-3 py-1 rounded-full border border-white/20">
                  Expiry : 30 Aug 2026
                </span>
              </div>

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
                    className={`w-14 h-14 rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${
                      activeThumbIdx === i ? "border-amber-500 scale-105 shadow-xs" : "border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* E-Commerce Trust Badges Grid */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-semibold">
              <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-slate-900 font-bold">100% Quality</span>
                <span className="text-[10px] text-slate-400">Checked daily</span>
              </div>

              <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Truck size={18} />
                </div>
                <span className="text-slate-900 font-bold">15-Min Delivery</span>
                <span className="text-[10px] text-slate-400">Local Kirana Store</span>
              </div>

              <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <RefreshCw size={18} />
                </div>
                <span className="text-slate-900 font-bold">Instant Return</span>
                <span className="text-[10px] text-slate-400">Hassle-free refund</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Rich Product Details, Variant Selector, Pincode & Action Buttons */}
          <div className="space-y-6">
            
            {/* Title & Pricing Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-7 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  {product.brand} Brand
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={14} /> In Stock at Nearby Kirana
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
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
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-black text-slate-900">₹{activeVariant.price}</span>
                  <span className="text-lg text-slate-400 line-through font-semibold">₹{activeVariant.mrp}</span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
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
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
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
                  <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed mt-2.5">
                    {product.desc}
                  </p>
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
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* CUSTOMER REVIEWS & RATINGS BREAKDOWN SECTION */}
        {/* ========================================================================= */}
        <section className="mt-16 pt-10 border-t border-slate-200/90 space-y-8">
          <div>
            <span className="block text-xs font-extrabold tracking-widest uppercase text-amber-600 mb-1">Customer Reviews</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
              Ratings & Feedback
            </h2>
          </div>

          <div className="grid md:grid-cols-[300px_1fr] gap-8 bg-white border border-slate-200/90 p-6 md:p-8 rounded-3xl shadow-xs">
            {/* Rating Summary */}
            <div className="space-y-4 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 md:pr-8 pb-6 md:pb-0">
              <div className="text-5xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>{product.rating}</div>
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <div className="text-xs font-bold text-slate-500">Based on {product.reviews} verified purchases</div>

              <div className="space-y-2 pt-2 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <span>5★</span>
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[82%]" />
                  </div>
                  <span>82%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>4★</span>
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[12%]" />
                  </div>
                  <span>12%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>3★</span>
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[4%]" />
                  </div>
                  <span>4%</span>
                </div>
              </div>
            </div>

            {/* Sample Verified Reviews */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Top Verified Reviews</h3>
              <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      Rahul Sharma <CheckCircle2 size={13} className="text-blue-600" />
                    </span>
                    <span className="text-amber-500 font-bold flex items-center gap-0.5"><Star size={11} fill="currentColor" /> 5.0</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    "Super fresh moong dal! Delivered in 14 minutes by the local rider. Packaging was totally sealed."
                  </p>
                  <div className="text-[10px] text-slate-400 font-semibold">Verified Purchase · 2 days ago</div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      Priya Gupta <CheckCircle2 size={13} className="text-blue-600" />
                    </span>
                    <span className="text-amber-500 font-bold flex items-center gap-0.5"><Star size={11} fill="currentColor" /> 5.0</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    "Very clean unpolished grains. Cooks fast and tastes authentic. Highly recommended for daily cooking!"
                  </p>
                  <div className="text-[10px] text-slate-400 font-semibold">Verified Purchase · 1 week ago</div>
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
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                Related Products
              </h2>
            </div>
            <Link to="/categories" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All Categories <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/product/${rel.id}`)}
                className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden p-3.5 md:p-4 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group shadow-xs relative"
              >
                <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden mb-3 relative">
                  <img
                    src={getProductImage(rel.name, rel.category?.toLowerCase() || "grocery")}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Yellow Plus Cart Button matching uploaded Image 1 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(rel);
                      triggerToast(`Added ${rel.name} to Cart!`);
                    }}
                    className="absolute bottom-2 right-2 w-7 h-7 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center shadow-md font-bold transition-all cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mb-1">
                  <Star size={11} fill="currentColor" /> {rel.rating}
                </div>

                <div className="font-bold text-xs md:text-sm text-slate-900 truncate mb-1">{rel.name}</div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-sm md:text-base text-slate-900">₹{rel.price}</span>
                    <span className="text-[11px] text-slate-400 line-through ml-1.5">₹{rel.mrp}</span>
                  </div>
                </div>
              </div>
            ))}
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
              <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
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
