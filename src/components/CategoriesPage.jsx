import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  Carrot, Apple, Milk, Croissant, Pill, UtensilsCrossed, PawPrint, Home,
  Sparkles, Smartphone, Star, Plus, Minus, SlidersHorizontal,
  ChevronDown, ArrowUpDown, X, ArrowRight, RefreshCw, AlertCircle, ShoppingBag, Repeat
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { getProductImage, CATEGORY_IMAGE_MAP } from "../utils/productImages";

// Default Category Data
const initialCategories = [
  { id: "cat-grocery", key: "grocery", name: "Grocery", sub: "Atta, Dal, Oils & Rice", count: 420, icon: Carrot, isPopular: true, img: CATEGORY_IMAGE_MAP.grocery },
  { id: "cat-fruits", key: "fruits", name: "Fruits & Vegetables", sub: "Fresh Daily Farm Produce", count: 180, icon: Apple, isPopular: true, img: CATEGORY_IMAGE_MAP.fruits },
  { id: "cat-dairy", key: "dairy", name: "Dairy", sub: "Milk, Paneer & Curd", count: 96, icon: Milk, isPopular: true, img: CATEGORY_IMAGE_MAP.dairy },
  { id: "cat-bakery", key: "bakery", name: "Bakery", sub: "Breads, Buns & Pastries", count: 74, icon: Croissant, isPopular: true, img: CATEGORY_IMAGE_MAP.bakery },
  { id: "cat-pharmacy", key: "pharmacy", name: "Pharmacy", sub: "Medicines & Wellness", count: 260, icon: Pill, isPopular: false, img: CATEGORY_IMAGE_MAP.pharmacy },
  { id: "cat-food", key: "food", name: "Food", sub: "Local Kitchens & Snacks", count: 340, icon: UtensilsCrossed, isPopular: false, img: CATEGORY_IMAGE_MAP.food },
  { id: "cat-pet", key: "pet", name: "Pet Care", sub: "Pet Food & Supplies", count: 58, icon: PawPrint, isPopular: false, img: CATEGORY_IMAGE_MAP.pet },
  { id: "cat-home", key: "home", name: "Home Essentials", sub: "Cleaning & Daily Needs", count: 132, icon: Home, isPopular: false, img: CATEGORY_IMAGE_MAP.home },
  { id: "cat-personal", key: "personal", name: "Personal Care", sub: "Skincare & Hygiene", count: 210, icon: Sparkles, isPopular: false, img: CATEGORY_IMAGE_MAP.personal },
  { id: "cat-electronics", key: "electronics", name: "Electronics", sub: "Cables, Chargers & Gadgets", count: 64, icon: Smartphone, isPopular: false, img: CATEGORY_IMAGE_MAP.electronics },
];

const productNames = {
  grocery: ["Basmati Rice 5kg", "Toor Dal 1kg", "Sunflower Oil 1L", "Sugar 1kg", "Atta 5kg", "Salt 1kg", "Tea Leaves 250g", "Poha 500g"],
  fruits: ["Fresh Bananas 1dz", "Red Apples 1kg", "Onions 1kg", "Tomatoes 1kg", "Potatoes 1kg", "Green Grapes 500g", "Spinach Bunch", "Carrots 500g"],
  dairy: ["Toned Milk 1L", "Curd 400g", "Paneer 200g", "Butter 100g", "Cheese Slices", "Ghee 500ml", "Buttermilk 200ml", "Flavoured Yogurt"],
  bakery: ["Brown Bread", "Butter Croissant", "Chocolate Muffin", "Multigrain Bread", "Bun Pack", "Cookies 200g", "Cup Cakes 4pc", "Rusk 200g"],
  pharmacy: ["Paracetamol Strip", "Vitamin C Tablets", "Hand Sanitizer", "Digital Thermometer", "Face Masks 10pc", "Cough Syrup", "Antiseptic Cream", "First Aid Kit"],
  food: ["Veg Burger", "Paneer Roll", "Margherita Pizza", "Chicken Biryani", "Masala Dosa", "Veg Thali", "Cold Coffee", "Chowmein"],
  pet: ["Dog Food 3kg", "Cat Litter 5kg", "Pet Shampoo", "Chew Toy", "Bird Seed 1kg", "Pet Bowl Set", "Puppy Treats", "Fish Food"],
  home: ["Dish Wash Liquid", "Floor Cleaner 1L", "Laundry Detergent", "Air Freshener", "Trash Bags 30pc", "Tissue Box", "Broom Set", "Toilet Cleaner"],
  personal: ["Face Wash 100ml", "Shampoo 340ml", "Toothpaste 150g", "Body Lotion", "Hair Oil 200ml", "Deodorant Spray", "Razor Pack", "Lip Balm"],
  electronics: ["USB Cable 1m", "Earphones", "Power Bank 10000mAh", "LED Bulb 9W", "Extension Board", "Phone Stand", "Bluetooth Speaker", "Wall Charger"],
};

function genProducts(catKey) {
  const names = productNames[catKey] || [];
  return names.map((name, i) => ({
    id: `${catKey}-${i}`,
    name,
    price: 39 + ((i * 37) % 260),
    mrp: 39 + ((i * 37) % 260) + 20 + (i % 3) * 10,
    rating: (3.8 + ((i * 7) % 12) / 10).toFixed(1),
    img: getProductImage(name, catKey),
    store: i % 2 === 0 ? "Fresh Mart" : "Daily Needs Express"
  }));
}

const sortOptions = ["Popularity", "Price: Low to High", "Price: High to Low", "Rating"];

// --- REUSABLE COMPONENTS ---

/** Skeleton card for loading state */
export function CategorySkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 animate-pulse space-y-3">
      <div className="w-full aspect-square bg-slate-100 rounded-xl" />
      <div className="h-4 bg-slate-200 rounded-md w-3/4" />
      <div className="h-3 bg-slate-100 rounded-md w-1/2" />
    </div>
  );
}

/** Empty state component */
export function CategoryEmptyState({ onReset }) {
  return (
    <div className="bg-white border border-emerald-100 rounded-3xl p-10 sm:p-14 text-center max-w-md mx-auto my-8 space-y-4">
      <div className="w-16 h-16 bg-[#ECFDF3] text-[#16A34A] rounded-full flex items-center justify-center mx-auto shadow-xs">
        <ShoppingBag size={28} />
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-[#17231A]">No categories available</h3>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          We couldn't find any category matching your search. Please check back soon or try another keyword.
        </p>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
        >
          Reset Search
        </button>
      )}
    </div>
  );
}

/** Error state component */
export function CategoryErrorState({ onRetry }) {
  return (
    <div className="bg-white border border-rose-100 rounded-3xl p-10 sm:p-14 text-center max-w-md mx-auto my-8 space-y-4 shadow-xs">
      <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle size={28} />
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-[#17231A]">We couldn't load categories</h3>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Something went wrong while connecting to the store server. Please try again.
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
        >
          <RefreshCw size={14} /> Retry Loading
        </button>
      )}
    </div>
  );
}

/** Individual Category Card Component */
export function CategoryCard({ category, isActive, onClick }) {
  const [imgSrc, setImgSrc] = useState(category.img || CATEGORY_IMAGE_MAP[category.key] || CATEGORY_IMAGE_MAP.grocery);

  return (
    <button
      onClick={() => onClick(category.key)}
      className={`group text-left border rounded-2xl p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between h-full ${isActive
        ? "bg-[#ECFDF3] border-[#16A34A] ring-2 ring-[#16A34A]/20"
        : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-[#FFFCF5]"
        }`}
    >
      <div className="space-y-3 w-full">
        {/* Category Image */}
        <div className="relative aspect-4/3 bg-slate-50 rounded-xl overflow-hidden">
          <img
            src={imgSrc}
            alt={category.name || "Category"}
            onError={() => setImgSrc(CATEGORY_IMAGE_MAP.grocery)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {category.count > 0 && (
            <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-[#166534] text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
              {category.count}+ items
            </span>
          )}
        </div>

        {/* Text Content */}
        <div>
          <h3 className={`font-extrabold text-sm leading-snug break-words ${isActive ? "text-[#166534]" : "text-[#17231A] group-hover:text-[#16A34A]"}`}>
            {category.name}
          </h3>
          {category.sub && (
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{category.sub}</p>
          )}
        </div>
      </div>

      {/* Explore Arrow CTA */}
      <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs font-extrabold text-[#16A34A]">
        <span>Explore</span>
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get("cat");
  const queryParam = searchParams.get("q");
  const { cart, addToCart, removeFromCart } = useCart();
  const productsSectionRef = useRef(null);

  const [categories, setCategories] = useState(initialCategories);
  const [active, setActive] = useState(catParam || "grocery");
  const [searchQuery, setSearchQuery] = useState(queryParam || "");
  const [sortBy, setSortBy] = useState("Popularity");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterMode, setFilterMode] = useState("all");

  // Advanced Filters: Rating & Price Range
  const [ratingFilter, setRatingFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  // State handlers for API simulation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (catParam && categories.some((c) => c.key === catParam)) {
      setActive(catParam);
    }
  }, [catParam, categories]);

  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  // Filter categories by search term
  const filteredCategories = useMemo(() => {
    let list = categories;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.sub?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [categories, searchQuery]);

  // Filter popular categories
  const popularCategories = useMemo(() => {
    return categories.filter((c) => c.isPopular);
  }, [categories]);

  const activeCat = useMemo(() => {
    return categories.find((c) => c.key === active) || categories[0];
  }, [categories, active]);

  // Generate and filter products for active category
  const products = useMemo(() => {
    let list = genProducts(active);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (ratingFilter === "4.5") {
      list = list.filter((p) => Number(p.rating) >= 4.5);
    } else if (ratingFilter === "4.0") {
      list = list.filter((p) => Number(p.rating) >= 4.0);
    }
    if (priceFilter === "under100") {
      list = list.filter((p) => p.price <= 100);
    } else if (priceFilter === "100to300") {
      list = list.filter((p) => p.price >= 100 && p.price <= 300);
    }
    if (sortBy === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "Rating") list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));
    return list;
  }, [active, searchQuery, sortBy, ratingFilter, priceFilter]);

  // Handle Category Selection without unwanted automatic scroll when clicked from sticky filter bar
  const handleSelectCategory = (catKey, shouldScroll = false) => {
    setActive(catKey);
    setSearchParams({ cat: catKey });
    if (shouldScroll) {
      setTimeout(() => {
        if (productsSectionRef.current) {
          productsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Shared Common Navbar */}
      <Navbar searchPlaceholder="Search products or categories..." onSearchChange={(val) => setSearchQuery(val)} />

      {/* 1. STICKY FILTER BAR (Fixed right below Navbar) */}
      <section className="bg-white border-b border-slate-200 sticky top-[96px] sm:top-[100px] z-30 shadow-xs py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-3">
          {/* Row 1: Categories Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 w-full">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 pr-2.5 border-r border-slate-200 shrink-0">
              <SlidersHorizontal size={14} className="text-[#16A34A]" />
              <span>Categories:</span>
            </div>

            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = active === cat.key;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.key, false)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#16A34A] text-white shadow-xs ring-2 ring-[#16A34A]/20 scale-105"
                      : "bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#166534] border border-slate-200/60"
                  }`}
                >
                  {Icon && <Icon size={13} className={isActive ? "text-white" : "text-[#16A34A]"} />}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Row 2: Advanced Filtering by Rating & Price + Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
            {/* Rating & Price Quick Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Filter By:</span>
              
              {/* Rating Filter Chips */}
              <button
                onClick={() => setRatingFilter(ratingFilter === "4.5" ? "all" : "4.5")}
                className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1 border ${
                  ratingFilter === "4.5"
                    ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-amber-300"
                }`}
              >
                <Star size={12} className="fill-amber-400 text-amber-400" /> 4.5+ Rating
              </button>

              <button
                onClick={() => setRatingFilter(ratingFilter === "4.0" ? "all" : "4.0")}
                className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1 border ${
                  ratingFilter === "4.0"
                    ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-amber-300"
                }`}
              >
                <Star size={12} className="fill-amber-400 text-amber-400" /> 4.0+ Rating
              </button>

              {/* Price Range Filter Chips */}
              <button
                onClick={() => setPriceFilter(priceFilter === "under100" ? "all" : "under100")}
                className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer border ${
                  priceFilter === "under100"
                    ? "bg-[#166534] text-white border-[#166534] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                }`}
              >
                Under ₹100
              </button>

              <button
                onClick={() => setPriceFilter(priceFilter === "100to300" ? "all" : "100to300")}
                className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer border ${
                  priceFilter === "100to300"
                    ? "bg-[#166534] text-white border-[#166534] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                }`}
              >
                ₹100 - ₹300
              </button>
            </div>

            {/* Right Side: Sort & Reset Controls */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-[#ECFDF3] border border-slate-200 hover:border-emerald-300 rounded-full px-3.5 py-1 text-xs font-extrabold text-slate-700 cursor-pointer transition-colors"
                >
                  <ArrowUpDown size={13} className="text-[#16A34A]" /> Sort: {sortBy} <ChevronDown size={13} />
                </button>

                {sortOpen && (
                  <div className="absolute right-0 top-9 bg-white border border-slate-100 rounded-2xl shadow-xl w-48 p-2 z-40 space-y-1">
                    {sortOptions.map((o) => (
                      <button
                        key={o}
                        onClick={() => { setSortBy(o); setSortOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          sortBy === o ? "text-[#166534] bg-[#ECFDF3]" : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {(ratingFilter !== "all" || priceFilter !== "all" || searchQuery || sortBy !== "Popularity") && (
                <button
                  onClick={() => {
                    setRatingFilter("all");
                    setPriceFilter("all");
                    setSearchQuery("");
                    setSortBy("Popularity");
                  }}
                  className="text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 px-3 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1"
                >
                  <X size={12} /> Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-12 flex-1 w-full">
        {error ? (
          <CategoryErrorState onRetry={handleRetry} />
        ) : (
          <>
            {/* 1. PRODUCTS LIST ACCORDING TO SELECTED CATEGORY (Directly under Sticky Filter Bar) */}
            <section ref={productsSectionRef} id="products-section" className="space-y-6 scroll-mt-32">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold shadow-2xs">
                    {activeCat.icon ? <activeCat.icon size={22} /> : <ShoppingBag size={22} />}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#17231A]">
                      {activeCat.name} Products
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Showing {products.length} products available for express local fulfillment
                    </p>
                  </div>
                </div>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    Clear Search: "{searchQuery}"
                  </button>
                )}
              </div>

              {/* Product Grid */}
              {products.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 font-semibold shadow-xs">
                  No products match your current filters or search query. Try resetting filters.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {products.map((p) => {
                    const inCart = cart.find((item) => item.id === p.id);
                    return (
                      <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        className="bg-white border border-emerald-100 hover:border-emerald-300 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer text-slate-900 block"
                      >
                        <div className="aspect-square bg-slate-50 relative overflow-hidden">
                          <img
                            src={p.img}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                            {p.rating}
                          </span>
                        </div>

                        <div className="p-3 text-left flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-semibold text-slate-400 block truncate">{p.store}</span>
                            <h4 className="font-extrabold text-xs text-[#17231A] line-clamp-2 mt-0.5 leading-snug group-hover:text-[#16A34A] transition-colors">
                              {p.name}
                            </h4>

                            {(active === "dairy" || active === "bakery" || p.id?.startsWith("dairy") || p.id?.startsWith("bakery") || p.categoryKey === "dairy" || p.categoryKey === "bakery") && (
                              <div className="mt-1.5 inline-flex items-center gap-1 bg-[#ECFDF3] border border-emerald-200 text-[#166534] text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                                <Repeat size={10} className="text-[#16A34A]" />
                                <span>Save 10% with Subscription</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <div className="text-sm font-black text-[#166534]">₹{p.price}</div>
                              <div className="text-[10px] text-slate-400 line-through font-semibold">₹{p.mrp}</div>
                            </div>

                            {/* Add to Cart Actions */}
                            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                              {inCart ? (
                                <div className="flex items-center gap-1 bg-[#ECFDF3] border border-emerald-200 rounded-full p-0.5">
                                  <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromCart(p.id); }}
                                    className="w-5 h-5 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer shadow-xs"
                                  >
                                    <Minus size={10} />
                                  </button>
                                  <span className="w-4 text-center text-xs font-black text-[#166534]">{inCart.quantity}</span>
                                  <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
                                    className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center hover:bg-[#15803D] cursor-pointer shadow-xs"
                                  >
                                    <Plus size={10} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
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
              )}
            </section>

            {/* 2. ALL CATEGORIES OVERVIEW SECTION */}
            <section className="space-y-4 pt-6 border-t border-slate-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[#17231A]">Explore All Categories</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Browse store categories or pick one to view products above
                  </p>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-bold text-[#16A34A] hover:underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* Category Overview Cards */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[...Array(10)].map((_, i) => (
                    <CategorySkeleton key={i} />
                  ))}
                </div>
              ) : filteredCategories.length === 0 ? (
                <CategoryEmptyState onReset={() => setSearchQuery("")} />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredCategories.map((cat) => (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      isActive={active === cat.key}
                      onClick={(key) => handleSelectCategory(key, true)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* 3. TRENDING / POPULAR NEAR YOU SECTION */}
            {!searchQuery && popularCategories.length > 0 && (
              <section className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#16A34A] block">
                      Trending Local Demand
                    </span>
                    <h3 className="text-xl font-extrabold text-[#17231A]">Popular Near You</h3>
                  </div>
                  <span className="text-xs font-bold text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200">
                    Top Demand Picks
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {popularCategories.map((popCat) => (
                    <button
                      key={popCat.id}
                      onClick={() => handleSelectCategory(popCat.key, true)}
                      className="bg-[#FFFCF5] hover:bg-[#ECFDF3] border border-emerald-100 hover:border-emerald-300 rounded-2xl p-3.5 flex items-center gap-3 transition-all text-left cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={popCat.img} alt={popCat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-[#17231A] group-hover:text-[#16A34A] truncate">
                          {popCat.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold">{popCat.count}+ Items</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
