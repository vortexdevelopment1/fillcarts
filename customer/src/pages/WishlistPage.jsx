import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  Eye,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Store,
  CheckCircle2,
  Search,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Loader2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getProductImage } from "../utils/productImages";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { user, loadingUser, addToCart, cart, setShowLoginModal } = useCart();
  const { wishlist, removeFromWishlist, fetchWishlist, loading } = useWishlist();

  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toastMsg, setToastMsg] = useState("");

  // Always fetch fresh wishlist from MongoDB on page load
  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg("");
    }, 3000);
  };

  const handleAddToCart = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product);
    triggerToast(`Added ${product.name} to Cart! 🛒`);
  };

  const handleRemove = async (productId, productName, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await removeFromWishlist(productId);
    triggerToast(`Removed ${productName || "item"} from Wishlist`);
  };

  // Filter items by category & search term
  const filteredWishlist = wishlist.filter((item) => {
    if (!item) return false;
    const matchesSearch =
      !searchFilter.trim() ||
      item.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.store?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      (item.categoryKey || "").toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Extract unique categories in wishlist
  const availableCategories = Array.from(
    new Set(wishlist.map((item) => item.categoryKey || "grocery"))
  );

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans antialiased text-slate-800">
      <Navbar searchPlaceholder="Search products in your wishlist..." />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#17231A] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/30 animate-bounce">
          <CheckCircle2 size={18} className="text-[#16A34A]" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link to="/" className="hover:text-[#16A34A] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-slate-800 font-bold">My Wishlist</span>
        </nav>

        {/* Page Hero Header */}
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 z-10">
            <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1 rounded-full text-xs font-black">
              <Heart size={14} className="fill-rose-500 text-rose-500" />
              <span>SAVED COLLECTION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#17231A] tracking-tight">
              My Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xl">
              All your favorite groceries, daily essentials, and fresh staples saved for instant re-ordering.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10 self-start md:self-auto">
            <div className="bg-[#ECFDF3] border border-emerald-200 rounded-2xl px-4 py-3 text-center">
              <span className="block text-xl font-black text-[#166534]">
                {wishlist.length}
              </span>
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
                {wishlist.length === 1 ? "Item" : "Items"} Saved
              </span>
            </div>

            {wishlist.length > 0 && (
              <button
                onClick={() => {
                  wishlist.forEach((prod) => addToCart(prod));
                  triggerToast(`Added all ${wishlist.length} items to your cart! 🛒`);
                }}
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-black text-xs px-4 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <ShoppingCart size={15} />
                <span>Move All to Cart</span>
              </button>
            )}
          </div>

          {/* Decorative background circle */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-rose-50/70 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Loading Spinner / Skeleton State */}
        {loadingUser || (loading && wishlist.length === 0) ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center max-w-md mx-auto shadow-xs space-y-4 my-8">
            <Loader2 size={36} className="animate-spin text-[#16A34A] mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading your saved wishlist items from MongoDB...</p>
          </div>
        ) : !user ? (
          /* Unauthenticated View */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm space-y-4 my-8">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
              <Heart size={32} className="fill-rose-500" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#17231A]">
                Login to View Your Wishlist
              </h2>
              <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
                Save items across your devices, get notified on price drops, and quickly order your staples.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/login"
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-6 py-3 rounded-xl text-xs transition-all shadow-md inline-flex items-center justify-center gap-2"
              >
                <span>Login to Your Account</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/categories"
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold px-6 py-3 rounded-xl text-xs transition-all inline-flex items-center justify-center"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : wishlist.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-dashed border-emerald-200 rounded-3xl p-10 sm:p-16 text-center max-w-md mx-auto space-y-4 shadow-xs my-8">
            <div className="w-16 h-16 bg-[#ECFDF3] text-[#16A34A] rounded-3xl flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
              <ShoppingBag size={32} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-black text-[#17231A]">
                Your Wishlist is Empty
              </h2>
              <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                You haven't saved any items yet. Explore fresh daily farm produce, dairy, bakery, and snacks to bookmark them!
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/categories"
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles size={15} />
                <span>Explore Products Now</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Populated Wishlist View */
          <div className="space-y-5">
            {/* Filter & Search Bar */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="relative w-full sm:w-72">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by name, store..."
                  className="w-full pl-9 pr-3.5 py-2 bg-[#F8FAF8] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#16A34A] transition-colors"
                />
              </div>

              {availableCategories.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-[#16A34A] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    All ({wishlist.length})
                  </button>
                  {availableCategories.map((catKey) => {
                    const count = wishlist.filter(
                      (item) => (item.categoryKey || "grocery") === catKey
                    ).length;
                    return (
                      <button
                        key={catKey}
                        onClick={() => setSelectedCategory(catKey)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors capitalize cursor-pointer ${
                          selectedCategory === catKey
                            ? "bg-[#16A34A] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {catKey} ({count})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product Cards Grid */}
            {filteredWishlist.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 font-semibold">
                No wishlist products match your filter "{searchFilter}".
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {filteredWishlist.map((item) => {
                  const targetId = item.productId || item.id || String(item._id);
                  const prodImage =
                    item.img ||
                    item.image ||
                    getProductImage(item.name, item.categoryKey || "grocery");
                  const inCart = cart.find(
                    (c) =>
                      c &&
                      (c.id === targetId ||
                        c.productId === targetId ||
                        c._id === targetId)
                  );
                  const discountPct =
                    item.mrp && item.mrp > item.price
                      ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
                      : 0;

                  return (
                    <div
                      key={targetId}
                      className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative"
                    >
                      {/* Top Badges & Remove Button */}
                      <div className="relative aspect-square bg-slate-50 overflow-hidden flex items-center justify-center p-3">
                        <img
                          src={prodImage}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />

                        {/* Discount Offer Pill */}
                        {discountPct > 0 ? (
                          <span className="absolute top-2 left-2 bg-[#F59E0B] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                            {discountPct}% OFF
                          </span>
                        ) : (
                          <span className="absolute top-2 left-2 bg-emerald-700 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
                            Fresh
                          </span>
                        )}

                        {/* Rating Pill */}
                        <span className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5">
                          <Star
                            size={10}
                            className="fill-amber-400 text-amber-400"
                          />
                          {item.rating || "4.8"}
                        </span>

                        {/* Remove from Wishlist Trash Button */}
                        <button
                          type="button"
                          onClick={(e) => handleRemove(targetId, item.name, e)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs z-10"
                          title="Remove from Wishlist"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Product Content Details */}
                      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between text-left">
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-0.5">
                            <span className="truncate flex items-center gap-1">
                              <Store size={10} className="text-[#16A34A]" />
                              {item.store || "Fresh Mart"}
                            </span>
                            <span>{item.unit || "1 Pack"}</span>
                          </div>

                          <h3 className="font-extrabold text-xs sm:text-sm text-[#17231A] line-clamp-2 leading-snug group-hover:text-[#16A34A] transition-colors">
                            {item.name}
                          </h3>
                        </div>

                        {/* Pricing and Action Buttons */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-base sm:text-lg font-black text-[#166534]">
                                ₹{item.price}
                              </span>
                              {item.mrp && item.mrp > item.price && (
                                <span className="text-xs text-slate-400 line-through font-semibold ml-1.5">
                                  ₹{item.mrp}
                                </span>
                              )}
                            </div>
                            {item.inStock === false && (
                              <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                                Out of Stock
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            {/* View Product Button */}
                            <Link
                              to={`/product/${targetId}`}
                              className="w-full py-2 px-2 rounded-xl text-[11px] font-extrabold bg-[#FFFCF5] hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#166534] transition-all flex items-center justify-center gap-1 text-center"
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </Link>

                            {/* Add/Move to Cart Button */}
                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(item, e)}
                              className="w-full py-2 px-2 rounded-xl text-[11px] font-extrabold bg-[#16A34A] hover:bg-[#15803D] text-white shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <ShoppingCart size={12} />
                              <span>{inCart ? "In Cart" : "Add"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Value Props Footer Banner */}
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-2xs text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center shrink-0">
              <Zap size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#17231A]">
                15-Minute Local Delivery
              </h4>
              <p className="text-[11px] text-slate-500 font-semibold">
                Delivered straight from nearest verified stores
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#17231A]">
                100% Quality Guaranteed
              </h4>
              <p className="text-[11px] text-slate-500 font-semibold">
                Daily fresh checks on every grocery item
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#17231A]">
                Best Local Deals
              </h4>
              <p className="text-[11px] text-slate-500 font-semibold">
                Verified fair local supermarket pricing
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
