import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  Carrot, Apple, Milk, Croissant, Pill, UtensilsCrossed, PawPrint, Home,
  Sparkles, Smartphone, Search, SlidersHorizontal, Star, Plus, Minus, ChevronRight,
  ChevronDown, MapPin, ShoppingCart, User, ArrowUpDown, X
} from "lucide-react";
import { useCart } from "../context/CartContext";

const categories = [
  { key: "grocery", name: "Grocery", icon: Carrot, color: "text-blue-600", bg: "bg-blue-50", count: 420 },
  { key: "fruits", name: "Fruits & Veg", icon: Apple, color: "text-teal-600", bg: "bg-teal-50", count: 180 },
  { key: "dairy", name: "Dairy", icon: Milk, color: "text-blue-600", bg: "bg-blue-50", count: 96 },
  { key: "bakery", name: "Bakery", icon: Croissant, color: "text-amber-700", bg: "bg-amber-50", count: 74 },
  { key: "pharmacy", name: "Pharmacy", icon: Pill, color: "text-teal-600", bg: "bg-teal-50", count: 260 },
  { key: "food", name: "Food", icon: UtensilsCrossed, color: "text-violet-600", bg: "bg-violet-50", count: 340 },
  { key: "pet", name: "Pet Care", icon: PawPrint, color: "text-amber-800", bg: "bg-amber-50", count: 58 },
  { key: "home", name: "Home Essentials", icon: Home, color: "text-slate-700", bg: "bg-slate-100", count: 132 },
  { key: "personal", name: "Personal Care", icon: Sparkles, color: "text-teal-500", bg: "bg-teal-50", count: 210 },
  { key: "electronics", name: "Electronics", icon: Smartphone, color: "text-violet-600", bg: "bg-violet-50", count: 64 },
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
    img: `${catKey}-item-${i}`,
  }));
}

const sortOptions = ["Popularity", "Price: Low to High", "Price: High to Low", "Rating"];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get("cat");
  const { cart, addToCart, removeFromCart } = useCart();
  const [active, setActive] = useState(catParam || "grocery");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("Popularity");
  const [sortOpen, setSortOpen] = useState(false);
  const [priceMax, setPriceMax] = useState(300);

  useEffect(() => {
    if (catParam && categories.some((c) => c.key === catParam)) {
      setActive(catParam);
    }
  }, [catParam]);

  const activeCat = categories.find((c) => c.key === active);

  const products = useMemo(() => {
    let list = genProducts(active).filter((p) => p.price <= priceMax);
    if (query.trim()) {
      list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    }
    if (sortBy === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "Rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [active, query, sortBy, priceMax]);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Shared Common Navbar */}
      <Navbar searchPlaceholder="Search products in categories..." onSearchChange={(val) => setQuery(val)} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center gap-1.5">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={13} />
          <span className="text-slate-900 font-bold">Categories</span>
        </div>
      </div>

      {/* Category chip strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto">
          {categories.map((c) => {
            const isActive = active === c.key;
            return (
              <button
                key={c.key}
                onClick={() => {
                  setActive(c.key);
                  setSearchParams({ cat: c.key });
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border transition-colors flex-shrink-0 cursor-pointer ${isActive ? "bg-slate-900 text-white border-slate-900 shadow-xs" : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
              >
                <c.icon size={15} className={isActive ? "text-white" : c.color} />
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* Header & Sort Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2.5 text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
              <span className={`w-10 h-10 rounded-2xl ${activeCat.bg} ${activeCat.color} flex items-center justify-center shadow-xs`}>
                <activeCat.icon size={20} />
              </span>
              {activeCat.name}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Showing {products.length} fresh products</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full px-4 py-2.5 text-xs font-bold cursor-pointer transition-colors"
              >
                <ArrowUpDown size={14} /> Sort: {sortBy} <ChevronDown size={14} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-2xl shadow-xl w-52 p-2 z-30 space-y-1">
                  {sortOptions.map((o) => (
                    <button
                      key={o}
                      onClick={() => { setSortBy(o); setSortOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer ${sortBy === o ? "text-amber-600 bg-amber-50" : "text-slate-700"}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {query && (
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-3.5 py-1.5 rounded-full border border-blue-200">
            "{query}" <X size={13} className="cursor-pointer hover:text-blue-900" onClick={() => setQuery("")} />
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-14 text-center text-slate-500 font-semibold shadow-xs">
            No products match your search. Try searching for something else.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
              {products.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group block text-slate-900"
                >
                  <div className="aspect-square bg-slate-100 relative overflow-hidden">
                    <img src={`https://picsum.photos/seed/${p.img}/300/300`} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      View Details →
                    </span>
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center gap-1 text-sm text-blue-600 font-bold mb-1">
                      <Star size={12} fill="currentColor" /> {p.rating}
                    </div>
                    <div className="font-bold text-sm mb-2 leading-snug">{p.name}</div>
                    <div className="flex items-center justify-between" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                      <div>
                        <span className="font-extrabold text-base">₹{p.price}</span>
                        <span className="text-xs text-slate-400 line-through ml-1.5">₹{p.mrp}</span>
                      </div>
                      {(() => {
                        const inCart = cart.find((item) => item.id === p.id);
                        return inCart ? (
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full p-0.5">
                            <button
                              onClick={() => removeFromCart(p.id)}
                              className="w-6 h-6 rounded-full bg-white text-slate-600 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-4 text-center text-xs font-bold text-slate-900">{inCart.quantity}</span>
                            <button
                              onClick={() => addToCart(p)}
                              className="w-6 h-6 rounded-full bg-white text-slate-600 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(p)}
                            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors active:scale-95"
                          >
                            <Plus size={15} />
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
      </div>

      <Footer />
    </div>
  );
}