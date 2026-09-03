import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {
  Search, MapPin, Star, Plus, Minus, ChevronRight, Zap,
  RotateCcw, CreditCard, Sparkles, CheckCircle2, ArrowRight,
  Clock, Compass, Smartphone, Download, QrCode, ShoppingBag, Loader2, Heart,
  PackageOpen
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  getProductImage, CATEGORY_IMAGE_MAP, STORE_IMAGE_MAP, SUBSCRIPTION_IMAGE_MAP
} from "../utils/productImages";
import SearchDropdown from "../components/SearchDropdown";
import productService, { CATEGORIES, STORES } from "../services/productService";

const categoryList = [
  { key: "grocery", name: "Grocery", sub: "Atta, Dal, Oils & Staples", img: CATEGORY_IMAGE_MAP.grocery },
  { key: "fruits", name: "Fruits & Veg", sub: "Fresh Farm Produce", img: CATEGORY_IMAGE_MAP.fruits },
  { key: "dairy", name: "Dairy", sub: "Fresh Milk, Paneer & Curd", img: CATEGORY_IMAGE_MAP.dairy },
  { key: "bakery", name: "Bakery", sub: "Artisan Breads & Buns", img: CATEGORY_IMAGE_MAP.bakery },
  { key: "pharmacy", name: "Pharmacy", sub: "Medicines & Wellness", img: CATEGORY_IMAGE_MAP.pharmacy },
  { key: "food", name: "Food", sub: "Local Kitchens & Snacks", img: CATEGORY_IMAGE_MAP.food },
  { key: "pet", name: "Pet Care", sub: "Food & Pet Supplies", img: CATEGORY_IMAGE_MAP.pet },
  { key: "home", name: "Home Essentials", sub: "Cleaning & Daily Needs", img: CATEGORY_IMAGE_MAP.home }
];

const localStores = STORES;

const whyFillCartsCards = [
  {
    icon: Zap,
    title: "Fast Local Delivery",
    desc: "Directly dispatched from nearby neighborhood stores straight to your doorstep in minutes."
  },
  {
    icon: Compass,
    title: "Live Order Tracking",
    desc: "Track your delivery rider on an interactive real-time map from checkout to your door."
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    desc: "Flexible checkout options including instant UPI, credit/debit cards, wallet and Cash on Delivery."
  },
  {
    icon: RotateCcw,
    title: "Hassle-Free Returns",
    desc: "Simple, immediate returns on eligible items with instant replacement or store refund."
  }
];

export default function AppKartHome() {
  const { cart, addToCart, removeFromCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [offerProducts, setOfferProducts] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadOffers = async () => {
      try {
        const offers = await productService.getOffers(6);
        if (isMounted) {
          setOfferProducts(offers);
        }
      } catch (err) {
        console.error("Failed to load offers from MongoDB:", err);
      } finally {
        if (isMounted) setLoadingOffers(false);
      }
    };
    loadOffers();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="bg-[#FFFCF5] text-[#17231A] min-h-screen flex flex-col font-sans overflow-x-hidden" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Navbar */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#ECFDF3]/90 via-[#FFFCF5] to-[#FFFCF5] pt-8 sm:pt-12 pb-12 sm:pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
              {/* Trust Badge Pill */}
              <div className="inline-flex items-center gap-2 bg-white border border-emerald-200/90 rounded-full px-3.5 py-1 shadow-2xs text-[11px] sm:text-xs font-bold text-[#166534]">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
                <span>Express Neighborhood Fulfillment</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-[32px] sm:text-[44px] lg:text-[54px] font-extrabold tracking-[-0.025em] leading-[1.12] text-[#17231A]">
                Everything you need, <br className="hidden sm:inline" />
                <span className="text-[#16A34A] relative inline-block">
                  delivered from your neighborhood.
                  <svg className="absolute -bottom-1 left-0 w-full h-2 text-[#F59E0B]/30" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0 15 Q 50 0, 100 15" stroke="currentColor" strokeWidth="6" fill="none" />
                  </svg>
                </span>
              </h1>

              {/* Supporting Subtext */}
              <p className="text-sm sm:text-base lg:text-lg text-[#475569] font-medium max-w-xl leading-relaxed">
                Shop groceries, bakery, dairy, food and everyday essentials from trusted local stores with 15-minute doorstep delivery.
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 sm:gap-4 pt-1 sm:pt-2 flex-wrap">
                <a
                  href="#offers"
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-900/10 hover:shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={17} />
                  <span>Shop Deals</span>
                </a>
                <Link
                  to="/categories"
                  className="bg-white hover:bg-emerald-50 text-[#166534] font-extrabold px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm transition-all border border-emerald-200 shadow-2xs flex items-center gap-1.5"
                >
                  <span>Explore Categories</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right Product Collage Visual */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md">
                {/* Background decorative glow */}
                <div className="absolute inset-0 bg-emerald-400/20 rounded-3xl blur-2xl -z-10" />

                {/* Main Product Visual Grid */}
                <div className="bg-white/95 backdrop-blur-md border border-emerald-100 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3.5">
                  {/* Top Collage Bar */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                      <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#166534]">Neighborhood Basket</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">Fresh & Local</span>
                  </div>

                  {/* Collage Grid Cards */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="relative rounded-2xl overflow-hidden aspect-4/3 group">
                      <img src={CATEGORY_IMAGE_MAP.fruits} alt="Fresh Fruits" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2 sm:p-2.5">
                        <span className="text-white text-[11px] sm:text-xs font-extrabold">Fresh Organic Produce</span>
                      </div>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden aspect-4/3 group">
                      <img src={CATEGORY_IMAGE_MAP.dairy} alt="Milk & Bakery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2 sm:p-2.5">
                        <span className="text-white text-[11px] sm:text-xs font-extrabold">Dairy & Bakery Staples</span>
                      </div>
                    </div>
                  </div>

                  {/* Rider Fast Delivery Pill Badge */}
                  <div className="bg-[#ECFDF3] border border-emerald-200/90 rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
                      <Zap size={18} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-extrabold text-[#166534]">Local Rider On The Way</div>
                      <div className="text-[11px] font-semibold text-[#475569]">Fast 15–20 minute doorstep dropoff</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY SECTION */}
      <section className="py-12 sm:py-14 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#16A34A] block mb-1">
                Explore Marketplace
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#17231A] leading-[1.2]">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/categories"
              className="text-xs sm:text-sm font-extrabold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>View All Categories</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
            {categoryList.map((cat) => (
              <Link
                key={cat.key}
                to={`/categories?cat=${cat.key}`}
                className="group bg-[#FFFCF5] hover:bg-white border border-emerald-100 hover:border-emerald-300 rounded-2xl p-2.5 sm:p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex items-center gap-2.5 sm:gap-3.5 cursor-pointer"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden flex-shrink-0 relative bg-emerald-50">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h3 className="font-extrabold text-xs sm:text-sm lg:text-base text-[#17231A] truncate group-hover:text-[#16A34A] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#475569] font-medium truncate mt-0.5">{cat.sub}</p>
                  <span className="text-[10px] sm:text-xs font-bold text-[#166534] inline-flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop <ChevronRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TODAY'S OFFERS SECTION */}
      <section id="offers" className="py-12 sm:py-16 bg-[#FFFCF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-1.5">
                <Sparkles size={12} /> Exclusive Neighborhood Deals
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#17231A] leading-[1.2]">
                Today's Best Offers 🔥
              </h2>
            </div>
            <Link
              to="/categories?offers=true"
              className="text-xs sm:text-sm font-extrabold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1 self-start sm:self-auto"
            >
              <span>See All Deals ({offerProducts.length})</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          {/* Product Cards Grid with Shimmer Skeleton Loader */}
          {loadingOffers ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-3 animate-pulse space-y-2.5">
                  <div className="aspect-square bg-slate-100 rounded-xl" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-7 bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : offerProducts.length === 0 ? (
            <div className="bg-white border border-emerald-100 rounded-3xl p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 text-[#16A34A] rounded-2xl flex items-center justify-center mx-auto">
                <PackageOpen size={24} />
              </div>
              <h3 className="text-base font-extrabold text-[#17231A]">Deals Refreshing</h3>
              <p className="text-xs text-slate-500 font-medium">New fresh discounts from nearby stores are on the way.</p>
              <Link
                to="/categories"
                className="inline-block bg-[#16A34A] text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-xs"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {offerProducts.map((prod) => {
                const inCart = cart.find((item) => item.id === prod.id);
                const imgUrl = prod.img || getProductImage(prod.name, prod.categoryKey);
                const isWishlisted = isInWishlist(prod.id || prod.productId || prod._id);

                return (
                  <Link
                    key={prod.id}
                    to={`/product/${prod.id}`}
                    className="bg-white border border-emerald-100 hover:border-emerald-300 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer text-slate-900 block relative"
                  >
                    <div className="relative aspect-square bg-slate-50 overflow-hidden">
                      <img src={imgUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      
                      {/* Orange Offer Badge */}
                      <span className="absolute top-2 left-2 bg-[#F59E0B] text-white text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                        {prod.off}
                      </span>
                      
                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(prod);
                        }}
                        className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs z-10 ${
                          isWishlisted
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 border border-slate-200/80"
                        }`}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        aria-label="Toggle Wishlist"
                      >
                        <Heart size={13} className={isWishlisted ? "fill-rose-600 text-rose-600" : ""} />
                      </button>

                      {/* Rating Badge */}
                      <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        {prod.rating}
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 text-left flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] sm:text-xs font-semibold text-[#475569] truncate block">{prod.store}</span>
                        <h4 className="font-bold text-xs sm:text-sm text-[#17231A] line-clamp-2 mt-0.5 leading-snug group-hover:text-[#16A34A] transition-colors">
                          {prod.name}
                        </h4>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        <div>
                          <div className="text-sm sm:text-base font-extrabold text-[#166534]">₹{prod.price}</div>
                          {prod.mrp && prod.mrp > prod.price && (
                            <div className="text-[10px] sm:text-xs text-slate-400 line-through font-semibold">₹{prod.mrp}</div>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                          {inCart ? (
                            <div className="flex items-center gap-1 bg-[#ECFDF3] border border-emerald-200 rounded-full p-0.5">
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromCart(prod.id); }}
                                className="w-5 h-5 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer shadow-xs"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="w-4 text-center text-xs font-black text-[#166534]">{inCart.quantity}</span>
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(prod); }}
                                className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center hover:bg-[#15803D] cursor-pointer shadow-xs"
                                aria-label="Increase quantity"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(prod); }}
                              className="bg-[#16A34A] hover:bg-[#15803D] text-white text-[11px] sm:text-xs font-extrabold px-2.5 sm:px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                              aria-label="Add to cart"
                            >
                              <Plus size={12} />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* LOCAL STORES NEAR YOU SECTION */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#166534] block mb-1">
                Verified Neighborhood Vendors
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#17231A] leading-[1.2]">
                Shop from Local Stores Near You
              </h2>
            </div>
            <Link
              to="/categories"
              className="text-xs sm:text-sm font-extrabold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>Explore Local Stores</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Store Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {localStores.map((store) => (
              <div
                key={store.id}
                className="bg-[#FFFCF5] border border-emerald-100 hover:border-emerald-300 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between text-left group"
              >
                <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                  <img
                    src={store.img}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-[#16A34A] text-white text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs">
                    {store.tag}
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    {store.rating} ({store.reviews})
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#17231A] group-hover:text-[#16A34A] transition-colors">
                      {store.name}
                    </h3>
                    <p className="text-xs text-[#475569] font-semibold mt-0.5">{store.category}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#475569] font-semibold bg-white p-2.5 rounded-xl border border-emerald-100/80">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-[#16A34A]" /> {store.distance}
                    </span>
                    <span className="flex items-center gap-1 text-[#166534]">
                      <Clock size={13} /> {store.deliveryTime}
                    </span>
                  </div>

                  <Link
                    to={`/categories?store=${encodeURIComponent(store.name)}`}
                    className="w-full bg-white hover:bg-[#ECFDF3] text-[#166534] border border-emerald-200 font-extrabold py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View Store</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION USP SECTION */}
      <section className="py-12 sm:py-16 bg-[#ECFDF3] border-y border-emerald-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-emerald-300 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-100/60 rounded-full blur-3xl -z-10" />

            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
                <div className="inline-flex items-center gap-1.5 bg-[#ECFDF3] text-[#166534] border border-emerald-300 px-3 py-1 rounded-full text-xs font-black">
                  <span>⭐</span>
                  <span>MAIN FILLCARTS USP</span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#17231A] leading-tight">
                  Never run out of your everyday essentials.
                </h2>

                <p className="text-xs sm:text-sm lg:text-base text-[#475569] font-medium leading-relaxed max-w-xl">
                  Subscribe to Milk, Water, Bakery items and other daily staples. Get them delivered automatically on your preferred schedule.
                </p>

                {/* Benefits Bullet Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                  {[
                    "Automatic scheduled doorstep delivery",
                    "Pause anytime when traveling",
                    "Resume instantly with one tap",
                    "Easy subscription wallet management"
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#166534]">
                      <CheckCircle2 size={15} className="text-[#16A34A] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-2 sm:pt-4 flex items-center gap-3 sm:gap-4 flex-wrap">
                  <Link
                    to="/subscriptions"
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-900/10 hover:shadow-lg flex items-center gap-2"
                  >
                    <span>Start Subscription →</span>
                  </Link>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 bg-emerald-50 px-3 py-2 rounded-xl">
                    🔄 Daily | Weekly Schedule Options
                  </span>
                </div>
              </div>

              {/* Right Visual Product Collage */}
              <div className="lg:col-span-5 relative">
                <div className="bg-[#FFFCF5] border border-emerald-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="text-xs font-extrabold text-[#166534] flex items-center justify-between border-b border-emerald-100 pb-2">
                    <span>Essential Daily Bundle</span>
                    <span className="bg-[#16A34A] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">Auto-Delivered</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-center">
                      <img src={SUBSCRIPTION_IMAGE_MAP.milk} alt="Daily Milk" className="w-full h-16 sm:h-20 object-cover rounded-lg mb-1" />
                      <div className="text-xs font-extrabold text-[#17231A]">Fresh Milk 1L</div>
                      <div className="text-[10px] sm:text-xs text-[#475569] font-semibold">Everyday 7:00 AM</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-center">
                      <img src={SUBSCRIPTION_IMAGE_MAP.bread} alt="Fresh Bread" className="w-full h-16 sm:h-20 object-cover rounded-lg mb-1" />
                      <div className="text-xs font-extrabold text-[#17231A]">Wheat Bread</div>
                      <div className="text-[10px] sm:text-xs text-[#475569] font-semibold">Alternate Days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY FILLCARTS SECTION */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-[#16A34A] block mb-1">
            Trust & Simplicity
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#17231A] mb-8 sm:mb-10 leading-[1.2]">
            Why FillCarts?
          </h2>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
            {whyFillCartsCards.map((card, i) => (
              <div
                key={i}
                className="bg-[#FFFCF5] border border-emerald-100 hover:border-emerald-300 rounded-2xl p-5 sm:p-6 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center mb-3.5 sm:mb-4">
                  <card.icon size={20} />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#17231A] mb-1.5">{card.title}</h3>
                <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD APP BANNER */}
      <section className="py-12 sm:py-16 bg-[#FFFCF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#17231A] text-white rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-3 sm:space-y-4 max-w-xl text-left">
              <span className="bg-[#16A34A] text-white text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Mobile Shopping
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight">
                Your everyday shopping, now in your pocket.
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-medium leading-relaxed">
                Order faster, track your rider live and manage your subscriptions from the FillCarts app.
              </p>

              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
                >
                  <Download size={15} /> Google Play
                </a>
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all border border-white/20"
                >
                  <Smartphone size={15} /> App Store
                </a>
              </div>
            </div>

            {/* QR Code Widget */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl flex items-center gap-3.5 sm:gap-4 text-left flex-shrink-0">
              <div className="bg-white p-2 rounded-xl shadow-xs">
                <QrCode size={60} className="text-[#17231A]" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-white">Scan QR Code</div>
                <div className="text-[11px] text-emerald-300 font-medium mt-0.5">Instant Mobile App Download</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
