import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Star, Plus, Minus, ArrowRight, Store, Sparkles, ChevronRight, Tag, Loader2 } from "lucide-react";
import { searchCatalog } from "../utils/searchUtils";
import { useCart } from "../context/CartContext";
import productService from "../services/productService";

export default function SearchDropdown({
  placeholder = "Search products, categories, stores...",
  defaultValue = "",
  onSearchSubmit,
  className = "",
  inputClassName = "",
  showSubmitButton = false,
  autoFocus = false
}) {
  const [query, setQuery] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState({
    categories: [],
    products: [],
    stores: [],
    topCategoryMatch: null,
    didYouMean: null
  });

  const { cart, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== query) {
      setQuery(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    let isMounted = true;
    const handler = setTimeout(async () => {
      const q = query.trim();
      if (q.length >= 1) {
        setLoading(true);
        try {
          const res = await productService.getProducts({ search: q, limit: 12 });
          if (isMounted) {
            const apiProducts = res.data || [];
            const searchRes = searchCatalog(q, apiProducts);
            setSearchResult(searchRes);
            setIsOpen(true);
          }
        } catch (err) {
          console.error("Live search dropdown error:", err);
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        setSearchResult({ categories: [], products: [], stores: [], topCategoryMatch: null, didYouMean: null });
        setIsOpen(false);
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(query.trim());
    } else {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCategoryClick = (catKey) => {
    setIsOpen(false);
    navigate(`/categories?cat=${catKey}&q=${encodeURIComponent(query.trim())}`);
  };

  const handleProductClick = (productId) => {
    setIsOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const hasResults =
    searchResult.categories.length > 0 ||
    searchResult.products.length > 0 ||
    searchResult.stores.length > 0;

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <div className="absolute left-2 sm:left-3 text-[#16A34A] pointer-events-none flex items-center justify-center">
          <Search size={14} className="sm:w-4 sm:h-4" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 1) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full pl-7 sm:pl-9 pr-6 sm:pr-9 py-1 sm:py-2 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 placeholder:truncate ${inputClassName}`}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 sm:right-2.5 text-slate-400 hover:text-slate-700 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X size={12} className="sm:w-3.5 sm:h-3.5" />
          </button>
        )}

        {showSubmitButton && (
          <button
            type="submit"
            className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ml-2 flex-shrink-0"
          >
            <span>Search</span>
            <ArrowRight size={14} />
          </button>
        )}
      </form>

      {/* Instant Suggestions Dropdown */}
      {isOpen && query.trim().length >= 1 && (
        <div className="absolute top-full -left-12 sm:left-0 sm:right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-full bg-white/95 backdrop-blur-xl border border-emerald-200/80 rounded-2xl shadow-2xl z-[999] overflow-hidden max-h-[75vh] overflow-y-auto divide-y divide-slate-100 text-left transition-all animate-fade-in">
          {/* Typo Correction Banner */}
          {searchResult.didYouMean && (
            <div className="bg-[#ECFDF3] px-4 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs text-[#166534] font-bold">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#16A34A]" />
                <span>
                  Showing results for <strong className="underline cursor-pointer" onClick={() => handleCategoryClick(searchResult.topCategoryMatch?.key)}>{searchResult.didYouMean}</strong>
                </span>
              </div>
            </div>
          )}

          {!hasResults ? (
            <div className="p-6 text-center text-slate-500 space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search size={20} />
              </div>
              <div className="text-sm font-extrabold text-slate-700">No matches found for "{query}"</div>
              <p className="text-xs text-slate-400">Try searching for "Tomatoes", "Atta", "Milk", "Fruits", "Pizza", or "Sabji"</p>
            </div>
          ) : (
            <>
              {/* 1. MATCHED PRODUCTS FIRST (Top Priority) */}
              {searchResult.products.length > 0 && (
                <div className="p-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#166534] mb-2 px-2 flex items-center justify-between">
                    <span>Products ({searchResult.products.length})</span>
                    <span className="text-slate-400 font-medium">Click to open</span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResult.products.slice(0, 6).map((prod) => {
                      const inCart = cart.find((item) => item.id === prod.id);
                      return (
                        <div
                          key={prod.id}
                          onClick={() => handleProductClick(prod.id)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#ECFDF3] transition-colors cursor-pointer group border border-transparent hover:border-emerald-200"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                              <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-extrabold text-[#17231A] group-hover:text-[#16A34A] truncate">
                                {prod.name}
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-0.5">
                                <span className="text-emerald-700 font-bold bg-[#ECFDF3] px-1.5 py-0.2 rounded">{prod.categoryName}</span>
                                <span>• {prod.store}</span>
                                <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                                  <Star size={9} className="fill-amber-400 text-amber-400" />
                                  {prod.rating}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                            <div className="text-right">
                              <div className="text-xs font-black text-[#166534]">₹{prod.price}</div>
                              {prod.mrp > prod.price && (
                                <div className="text-[10px] text-slate-400 line-through">₹{prod.mrp}</div>
                              )}
                            </div>

                            {inCart ? (
                              <div className="flex items-center gap-1 bg-[#ECFDF3] border border-emerald-200 rounded-full p-0.5">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeFromCart(prod.id); }}
                                  className="w-5 h-5 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer shadow-xs"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="w-4 text-center text-xs font-black text-[#166534]">{inCart.quantity}</span>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); addToCart(prod); }}
                                  className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center hover:bg-[#15803D] cursor-pointer shadow-xs"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); addToCart(prod); }}
                                className="bg-[#16A34A] hover:bg-[#15803D] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                              >
                                <Plus size={12} /> Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. MATCHED CATEGORIES SECTION */}
              {searchResult.categories.length > 0 && (
                <div className="p-3 bg-[#FFFCF5]">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center justify-between">
                    <span>Matching Categories</span>
                    <span className="text-emerald-700 font-bold">{searchResult.categories.length} categories</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchResult.categories.slice(0, 5).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.key)}
                        className="flex items-center gap-2 bg-white border border-emerald-200/80 hover:border-[#16A34A] hover:bg-[#ECFDF3] px-3 py-1.5 rounded-xl transition-all group text-left cursor-pointer shadow-2xs"
                      >
                        <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="leading-tight">
                          <span className="text-xs font-black text-[#17231A] group-hover:text-[#16A34A] block">
                            {cat.name}
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold">{cat.count}+ items</span>
                        </div>
                        <ChevronRight size={12} className="text-slate-300 group-hover:text-[#16A34A] ml-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. MATCHED STORES SECTION */}
              {searchResult.stores.length > 0 && (
                <div className="p-3 bg-slate-50/60">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-2">
                    Verified Stores
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchResult.stores.map((store) => (
                      <div
                        key={store.id}
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/categories?q=${encodeURIComponent(store.name)}`);
                        }}
                        className="flex items-center gap-2.5 p-2 bg-white border border-slate-200/80 rounded-xl hover:border-emerald-300 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <img src={store.img} alt={store.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#17231A] group-hover:text-[#16A34A] truncate">
                            {store.name}
                          </div>
                          <div className="text-[9px] text-slate-400 font-semibold truncate">
                            ★ {store.rating} • {store.deliveryTime}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW ALL SEARCH RESULTS FOOTER */}
              <div className="p-2.5 bg-[#ECFDF3]/40 text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-extrabold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>See all products for "{query}"</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
