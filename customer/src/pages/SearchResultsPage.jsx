import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Star, Plus, Minus, ChevronRight, Sparkles, ShoppingBag, Layers, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import productService, { CATEGORIES } from "../services/productService";
import { searchCatalog, filterAndSortProducts, getSimilarProducts } from "../utils/searchUtils";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("cat") || "all";

  const { cart, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch search products from backend MongoDB API
  useEffect(() => {
    let isMounted = true;
    const fetchSearchData = async () => {
      setLoading(true);
      try {
        const [searchRes, generalRes] = await Promise.all([
          productService.getProducts({
            search: query,
            category: categoryFilter,
            limit: 100
          }),
          productService.getProducts({ limit: 50 })
        ]);

        if (isMounted) {
          const matched = searchRes.data || [];
          setMatchingProducts(matched);
          setAllProducts(generalRes.data || []);
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSearchData();
    return () => { isMounted = false; };
  }, [query, categoryFilter]);

  // Perform instant fuzzy catalog search for category suggestions
  const searchResults = useMemo(() => {
    return searchCatalog(query, allProducts);
  }, [query, allProducts]);

  // Similar Products Recommendations
  const similarProducts = useMemo(() => {
    return getSimilarProducts(matchingProducts, allProducts, query);
  }, [matchingProducts, allProducts, query]);

  // Matching or Similar Categories for search query
  const relatedCategories = useMemo(() => {
    if (!query) return CATEGORIES.slice(0, 5);
    if (searchResults.categories && searchResults.categories.length > 0) {
      return searchResults.categories;
    }
    return CATEGORIES.slice(0, 5);
  }, [query, searchResults]);

  return (
    <div className="bg-[#F8FAF7] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Universal Sticky Top Header Navbar */}
      <Navbar searchPlaceholder="Search for items (e.g. Tomato, Milk, Paneer, Atta)..." />


      {/* BLINKIT STYLE MINIMAL HEADER */}
      <section className="bg-white border-b border-slate-100 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#17231A] tracking-tight">
                {query ? `Search Results for "${query}"` : "Explore Catalog"}
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {matchingProducts.length} product{matchingProducts.length === 1 ? "" : "s"} ready for instant 15-30 min delivery
              </p>
            </div>

            {searchResults.didYouMean && query && (
              <div className="flex items-center gap-1.5 bg-[#ECFDF3] border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold text-[#166534]">
                <Sparkles size={14} className="text-[#16A34A]" />
                <span>Did you mean <button onClick={() => navigate(`/search?q=${encodeURIComponent(searchResults.didYouMean)}`)} className="underline cursor-pointer">"{searchResults.didYouMean}"</button>?</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MAIN PRODUCTS & SIMILAR CATEGORIES PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 flex-1 w-full">

        {/* 1. EXACT MATCHING PRODUCTS GRID (TOP SECTION) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-[#17231A] flex items-center gap-2">
              <Sparkles size={18} className="text-[#16A34A]" />
              Exact Product Matches ({matchingProducts.length})
            </h2>
            {query && (
              <span className="text-xs font-bold text-[#166534] bg-[#ECFDF3] px-2.5 py-0.5 rounded-full border border-emerald-200">
                Direct Matches
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-3 animate-pulse space-y-3">
                  <div className="aspect-square bg-slate-100 rounded-xl" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : matchingProducts.length === 0 ? (
            <div className="bg-white border border-emerald-100 rounded-3xl p-10 text-center max-w-md mx-auto my-6 space-y-3 shadow-xs">
              <div className="w-14 h-14 bg-[#ECFDF3] text-[#16A34A] rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-base font-extrabold text-[#17231A]">No direct products found for "{query}"</h3>
              <p className="text-xs text-slate-500 font-medium">
                Try searching for "Tomatoes", "Milk", "Atta", "Paneer", "Rice", or "Burger".
              </p>
              <Link
                to="/categories"
                className="inline-block bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                Browse All Categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {matchingProducts.map((p) => {
                const inCart = cart.find((item) => item.id === p.id);
                const discountPercent = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

                return (
                  <div
                    key={p.id}
                    className="bg-white border border-slate-200/80 hover:border-emerald-300 rounded-2xl p-3 flex flex-col justify-between group transition-all hover:shadow-md cursor-pointer text-slate-900"
                  >
                    <div>
                      {/* Product Image */}
                      <Link to={`/product/${p.id}`} className="block relative aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2.5">
                        <img
                          src={p.img}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {discountPercent > 0 && (
                          <span className="absolute top-1.5 left-1.5 bg-[#16A34A] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                            {discountPercent}% OFF
                          </span>
                        )}
                        <span className="absolute bottom-1.5 right-1.5 bg-white/90 backdrop-blur-xs text-slate-800 text-[9px] font-bold px-1 py-0.2 rounded shadow-2xs flex items-center gap-0.5">
                          <Star size={9} className="fill-amber-400 text-amber-400" />
                          {p.rating}
                        </span>
                      </Link>

                      {/* Store & Title */}
                      <span className="text-[10px] font-semibold text-slate-400 block truncate mb-0.5">{p.store}</span>
                      <Link to={`/product/${p.id}`} className="font-extrabold text-xs text-[#17231A] line-clamp-2 leading-snug group-hover:text-[#16A34A] transition-colors block">
                        {p.name}
                      </Link>
                    </div>

                    {/* Price & Add Button */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs sm:text-sm font-black text-[#166534]">₹{p.price}</div>
                        {p.mrp > p.price && (
                          <div className="text-[10px] text-slate-400 line-through font-semibold">₹{p.mrp}</div>
                        )}
                      </div>

                      {/* Blinkit Style Green Add Button */}
                      <div>
                        {inCart ? (
                          <div className="flex items-center gap-1 bg-[#ECFDF3] border border-emerald-300 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => removeFromCart(p.id)}
                              className="w-5 h-5 rounded bg-white text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer shadow-2xs"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-4 text-center text-xs font-black text-[#166534]">{inCart.quantity}</span>
                            <button
                              type="button"
                              onClick={() => addToCart(p)}
                              className="w-5 h-5 rounded bg-[#16A34A] text-white flex items-center justify-center hover:bg-[#15803D] cursor-pointer shadow-2xs"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addToCart(p)}
                            className="bg-[#ECFDF3] hover:bg-[#16A34A] text-[#166534] hover:text-white border border-emerald-300 hover:border-[#16A34A] text-xs font-black px-3 py-1 rounded-lg transition-all flex items-center gap-0.5 cursor-pointer shadow-2xs uppercase"
                          >
                            ADD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 2. SIMILAR CATEGORIES SECTION */}
        {relatedCategories.length > 0 && (
          <section className="bg-white border border-emerald-100 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#17231A] flex items-center gap-2">
                <Layers size={18} className="text-[#16A34A]" />
                Similar Categories You Might Like
              </h3>
              <Link to="/categories" className="text-xs font-extrabold text-[#16A34A] hover:underline flex items-center gap-1">
                View All Categories <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {relatedCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/search?cat=${cat.key}&q=${encodeURIComponent(query)}`)}
                  className="flex items-center gap-2.5 p-2.5 bg-[#FFFCF5] hover:bg-[#ECFDF3] border border-slate-200/80 hover:border-emerald-300 rounded-2xl transition-all group text-left cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-extrabold text-[#17231A] group-hover:text-[#16A34A] block truncate">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{cat.count}+ items</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 3. SIMILAR & RELATED PRODUCTS SECTION */}
        {similarProducts.length > 0 && (
          <section className="pt-4 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-extrabold text-[#17231A] flex items-center gap-2">
                <Sparkles size={16} className="text-[#16A34A]" />
                Similar & Related Products
              </h2>
              <span className="text-xs font-bold text-slate-400">Frequently bought together</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {similarProducts.map((sp) => {
                const inCart = cart.find((item) => item.id === sp.id);
                return (
                  <div
                    key={sp.id}
                    className="bg-white border border-slate-200/70 hover:border-emerald-300 rounded-xl p-2.5 flex flex-col justify-between group transition-all hover:shadow-sm text-slate-900"
                  >
                    <div>
                      <Link to={`/product/${sp.id}`} className="block aspect-square bg-slate-50 rounded-lg overflow-hidden mb-2">
                        <img src={sp.img} alt={sp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </Link>
                      <Link to={`/product/${sp.id}`} className="font-extrabold text-[11px] text-[#17231A] line-clamp-1 group-hover:text-[#16A34A] block">
                        {sp.name}
                      </Link>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-black text-[#166534]">₹{sp.price}</span>
                      {inCart ? (
                        <span className="text-[10px] font-black text-[#166534] bg-[#ECFDF3] px-2 py-0.5 rounded-full border border-emerald-200">
                          {inCart.quantity} in cart
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(sp)}
                          className="bg-[#ECFDF3] hover:bg-[#16A34A] text-[#166534] hover:text-white border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded transition-all cursor-pointer"
                        >
                          + ADD
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
