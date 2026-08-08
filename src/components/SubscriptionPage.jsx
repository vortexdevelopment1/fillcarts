import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight, Repeat, Clock, Milk, ShoppingBasket,
  Sparkles, Star, Plus, Trash2,
  X, Search, SlidersHorizontal, ShieldCheck, Download, Smartphone, QrCode,
  ArrowRight, Carrot, Apple, Croissant, Pill, UtensilsCrossed, Home, FileText, CheckCircle2, Info,
  Filter, Calendar, MapPin, ExternalLink
} from "lucide-react";
import Footer from "./Footer";
import Navbar from "./Navbar";

// Sourced directly from CategoriesPage for 100% category consistency
const categories = [
  { key: "grocery", name: "Grocery", icon: Carrot, color: "text-blue-600", bg: "bg-blue-50" },
  { key: "fruits", name: "Fruits & Veg", icon: Apple, color: "text-teal-600", bg: "bg-teal-50" },
  { key: "dairy", name: "Dairy", icon: Milk, color: "text-blue-600", bg: "bg-blue-50" },
  { key: "bakery", name: "Bakery", icon: Croissant, color: "text-amber-700", bg: "bg-amber-50" },
  { key: "pharmacy", name: "Pharmacy", icon: Pill, color: "text-teal-600", bg: "bg-teal-50" },
  { key: "food", name: "Food", icon: UtensilsCrossed, color: "text-violet-600", bg: "bg-violet-50" },
  { key: "home", name: "Home Essentials", icon: Home, color: "text-slate-700", bg: "bg-slate-100" },
  { key: "personal", name: "Personal Care", icon: Sparkles, color: "text-teal-500", bg: "bg-teal-50" },
];

const productNames = {
  grocery: ["Basmati Rice 5kg", "Toor Dal 1kg", "Sunflower Oil 1L", "Sugar 1kg", "Atta 5kg", "Salt 1kg", "Tea Leaves 250g", "Poha 500g"],
  fruits: ["Fresh Bananas 1dz", "Red Apples 1kg", "Onions 1kg", "Tomatoes 1kg", "Potatoes 1kg", "Green Grapes 500g", "Spinach Bunch", "Carrots 500g"],
  dairy: ["Toned Milk 1L", "Curd 400g", "Paneer 200g", "Butter 100g", "Cheese Slices", "Ghee 500ml", "Buttermilk 200ml", "Flavoured Yogurt"],
  bakery: ["Brown Bread", "Butter Croissant", "Chocolate Muffin", "Multigrain Bread", "Bun Pack", "Cookies 200g", "Cup Cakes 4pc", "Rusk 200g"],
  pharmacy: ["Paracetamol Strip", "Vitamin C Tablets", "Hand Sanitizer", "Digital Thermometer", "Face Masks 10pc", "Cough Syrup", "Antiseptic Cream", "First Aid Kit"],
  food: ["Veg Burger", "Paneer Roll", "Margherita Pizza", "Chicken Biryani", "Masala Dosa", "Veg Thali", "Cold Coffee", "Chowmein"],
  home: ["Dish Wash Liquid", "Floor Cleaner 1L", "Laundry Detergent", "Air Freshener", "Trash Bags 30pc", "Tissue Box", "Broom Set", "Toilet Cleaner"],
  personal: ["Face Wash 100ml", "Shampoo 340ml", "Toothpaste 150g", "Body Lotion", "Hair Oil 200ml", "Deodorant Spray", "Razor Pack", "Lip Balm"],
};

function genProducts(catKey) {
  const names = productNames[catKey] || [];
  return names.map((name, i) => ({
    id: `${catKey}-${i}`,
    name,
    categoryKey: catKey,
    price: 39 + ((i * 37) % 260),
    mrp: 39 + ((i * 37) % 260) + 20 + (i % 3) * 10,
    rating: (3.8 + ((i * 7) % 12) / 10).toFixed(1),
    img: `${catKey}-item-${i}`,
  }));
}

// Order Records Dataset for Tracking User Subscription Orders
const initialSubscriptionOrders = [
  {
    orderId: "SUB-ORD-9021",
    name: "Daily Fresh Dairy Routine",
    items: [
      { name: "Toned Milk 1L", qty: 2, price: 54 },
      { name: "Curd 400g", qty: 1, price: 42 }
    ],
    frequency: "Daily",
    timeSlot: "6:30 AM - 7:30 AM",
    status: "Active Schedule",
    nextDate: "Tomorrow (7:00 AM Slot)",
    orderDate: "Created on 6 Aug 2026",
    address: "Flat 402, Green Valley Apartments, Bengaluru",
    total: 150
  },
  {
    orderId: "SUB-ORD-4410",
    name: "Weekly Mandi Produce & Atta",
    items: [
      { name: "Fresh Local Tomatoes (1 kg)", qty: 2, price: 32 },
      { name: "Aashirvaad Whole Wheat Atta (5 kg)", qty: 1, price: 245 }
    ],
    frequency: "Weekly (Sundays)",
    timeSlot: "8:00 AM - 9:00 AM",
    status: "Active Schedule",
    nextDate: "Sunday (8:30 AM Slot)",
    orderDate: "Created on 4 Aug 2026",
    address: "Flat 402, Green Valley Apartments, Bengaluru",
    total: 309
  }
];

export default function SubscriptionPage() {
  const [activeCategory, setActiveCategory] = useState("dairy");
  const [basket, setBasket] = useState([
    { id: "dairy-0", name: "Toned Milk 1L", qty: 1, price: 54 }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [timeSlot, setTimeSlot] = useState("6:30 AM - 7:30 AM");
  
  // Modals & Navigation state
  const [showAppInstallModal, setShowAppInstallModal] = useState(false);
  const [viewTab, setViewTab] = useState("create"); // create | my_subscriptions
  const [orderFilter, setOrderFilter] = useState("All");
  const [myOrders, setMyOrders] = useState(initialSubscriptionOrders);

  // Products generated for the active category
  const activeCategoryProducts = useMemo(() => {
    let list = genProducts(activeCategory);
    if (searchQuery.trim()) {
      list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  }, [activeCategory, searchQuery]);

  // Basket total price
  const basketTotal = useMemo(() => {
    return basket.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [basket]);

  // Add / Remove Basket Items
  const updateQty = (product, delta) => {
    setBasket(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        const newQty = existing.qty + delta;
        if (newQty <= 0) return prev.filter(i => i.id !== product.id);
        return prev.map(i => i.id === product.id ? { ...i, qty: newQty } : i);
      } else if (delta > 0) {
        return [...prev, { id: product.id, name: product.name, qty: 1, price: product.price }];
      }
      return prev;
    });
  };

  // Trigger Checkout -> Direct Mobile App Install Modal
  const handleProceedToCheckout = () => {
    if (basket.length === 0) {
      alert("Please add at least 1 item to your subscription basket.");
      return;
    }
    setShowAppInstallModal(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Shared Navbar */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight size={13} />
            <Link to="/categories" className="hover:text-blue-600">Categories</Link>
            <ChevronRight size={13} />
            <span className="text-slate-900 font-bold">Daily Essentials Subscriptions</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            <ShieldCheck size={14} /> 100% Fresh Morning Delivery
          </div>
        </div>
      </div>

      {/* Clean Hero Header */}
      <section className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white py-10 px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full px-3.5 py-1 text-xs font-bold mb-3">
              <Repeat size={14} className="text-blue-400" /> Daily & Weekly Auto-Delivery
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Subscribe & Save on Essentials
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Select items directly from store categories, track your active subscription order records, and manage all plan modifications seamlessly on our Mobile App.
            </p>
          </div>

          {/* Navigation Tab Switcher */}
          <div className="bg-slate-800/90 border border-slate-700 p-1.5 rounded-2xl flex gap-2 shadow-xl backdrop-blur-md shrink-0">
            <button
              onClick={() => setViewTab("create")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewTab === "create" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:text-white"
              }`}
            >
              <Plus size={14} /> Build Subscription
            </button>
            <button
              onClick={() => setViewTab("my_subscriptions")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewTab === "my_subscriptions" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:text-white"
              }`}
            >
              <FileText size={14} /> Order Tracking & Records ({myOrders.length})
            </button>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* TAB 1: BUILD SUBSCRIPTION (Sourced from CategoriesPage) */}
        {viewTab === "create" && (
          <div className="grid lg:grid-cols-[360px_1fr] gap-8 items-start">
            
            {/* Left Column: Sticky Subscription Summary & Checkout Panel */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg sticky top-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBasket size={18} className="text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Subscription Basket</h3>
                </div>
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {basket.reduce((sum, i) => sum + i.qty, 0)} Items
                </span>
              </div>

              {/* Basket Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {basket.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No items selected yet. Choose products from category grid.
                  </div>
                ) : (
                  basket.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl text-xs font-semibold">
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">₹{item.price} × {item.qty}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600 font-mono">₹{item.price * item.qty}</span>
                        <button
                          onClick={() => updateQty({ id: item.id }, -item.qty)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Schedule Configuration */}
              <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Delivery Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Daily">Daily Morning Delivery</option>
                    <option value="Every 2 Days">Every 2 Days</option>
                    <option value="Mon / Wed / Fri">Mon / Wed / Fri</option>
                    <option value="Weekly (Sundays)">Weekly (Sundays)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Guaranteed Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="6:30 AM - 7:30 AM">6:30 AM - 7:30 AM (Express Morning)</option>
                    <option value="7:30 AM - 8:30 AM">7:30 AM - 8:30 AM</option>
                    <option value="8:30 AM - 9:30 AM">8:30 AM - 9:30 AM</option>
                  </select>
                </div>
              </div>

              {/* Basket Total Breakdown */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Recurring Total / Cycle</span>
                  <span className="font-mono font-bold text-white">₹{basketTotal}</span>
                </div>
                <div className="flex justify-between text-[11px] text-teal-400 font-bold">
                  <span>Subscriber Discount</span>
                  <span>-10% Applied</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-extrabold text-teal-300">
                  <span>Estimated Total</span>
                  <span className="font-mono">₹{Math.round(basketTotal * 0.9)}</span>
                </div>
              </div>

              {/* CHECKOUT ACTION -> DIRECT APP INSTALL MODAL */}
              <button
                onClick={handleProceedToCheckout}
                disabled={basket.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-full py-3.5 shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={15} />
              </button>

              <div className="text-[11px] text-slate-400 text-center font-medium">
                🔒 Subscription setup requires mobile app installation for 1-tap AutoPay authorization.
              </div>
            </div>

            {/* Right Column: Categories Selector & Product Grid */}
            <div className="space-y-6">
              
              {/* Category Chips Bar (Flex-wrap to prevent right-edge clipping) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <SlidersHorizontal size={14} /> Select Store Category
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {categories.map((c) => {
                    const IconComp = c.icon;
                    const isActive = activeCategory === c.key;
                    return (
                      <button
                        key={c.key}
                        onClick={() => setActiveCategory(c.key)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all border ${
                          isActive
                            ? "bg-slate-900 text-white border-slate-900 shadow-md"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <IconComp size={14} className={isActive ? "text-white" : c.color} />
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Products Section Header & Search */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Fraunces', serif" }}>
                      <span>Select Products for Subscription</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Showing fresh items in <strong>{categories.find(c => c.key === activeCategory)?.name}</strong></p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search category items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-full pl-9 pr-4 py-2 w-full sm:w-56 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {activeCategoryProducts.map((p) => {
                    const inBasket = basket.find(b => b.id === p.id);
                    const qty = inBasket ? inBasket.qty : 0;

                    return (
                      <div key={p.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between p-3 group">
                        <div>
                          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-3 relative">
                            <img
                              src={`https://picsum.photos/seed/${p.img}/300/300`}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-blue-600 flex items-center gap-0.5 shadow-xs">
                              <Star size={10} fill="currentColor" /> {p.rating}
                            </div>
                          </div>

                          <div className="font-bold text-xs text-slate-900 mb-1 leading-snug line-clamp-2">{p.name}</div>
                          <div className="flex items-center gap-1.5 mb-3">
                            <span className="font-extrabold text-sm text-slate-900 font-mono">₹{p.price}</span>
                            <span className="text-[11px] text-slate-400 line-through">₹{p.mrp}</span>
                          </div>
                        </div>

                        {/* Add / Quantity Control Button */}
                        {qty === 0 ? (
                          <button
                            onClick={() => updateQty(p, 1)}
                            className="w-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1"
                          >
                            <Plus size={14} /> Add to Subscription
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-blue-600 text-white rounded-xl p-1 shadow-sm">
                            <button
                              onClick={() => updateQty(p, -1)}
                              className="w-7 h-7 rounded-lg bg-blue-700 hover:bg-blue-800 flex items-center justify-center font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-xs px-2">{qty}</span>
                            <button
                              onClick={() => updateQty(p, 1)}
                              className="w-7 h-7 rounded-lg bg-blue-700 hover:bg-blue-800 flex items-center justify-center font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEDICATED ORDER TRACKING & SUBSCRIPTION RECORDS DASHBOARD */}
        {viewTab === "my_subscriptions" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            
            {/* Header Metrics Bar */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-300 uppercase tracking-widest block mb-1">
                  Customer Records Hub
                </span>
                <h2 className="text-2xl font-extrabold" style={{ fontFamily: "'Fraunces', serif" }}>
                  Subscription Orders & Delivery Tracking
                </h2>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Review your active subscription records and upcoming delivery schedules.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl">
                <div className="text-center px-3 border-r border-slate-700">
                  <div className="text-xl font-bold font-mono text-teal-400">{myOrders.length}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Active Orders</div>
                </div>
                <div className="text-center px-3">
                  <div className="text-xl font-bold font-mono text-blue-400">₹459</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Est. Weekly</div>
                </div>
              </div>
            </div>

            {/* Subscriptions Order List */}
            <div className="space-y-6">
              {myOrders.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto">
                  <FileText size={36} className="text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900">No active subscription records found</h3>
                  <p className="text-xs text-slate-500 mb-6">Subscribe to fresh morning milk, eggs, bread or vegetables to start tracking your orders.</p>
                  <button
                    onClick={() => setViewTab("create")}
                    className="bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md"
                  >
                    Build First Subscription
                  </button>
                </div>
              ) : (
                myOrders.map((ord) => (
                  <div key={ord.orderId} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-5 relative overflow-hidden">
                    
                    {/* Header: Order ID & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          <Repeat size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {ord.orderId}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{ord.orderDate}</span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 mt-0.5">{ord.name}</h3>
                        </div>
                      </div>

                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                        <CheckCircle2 size={14} /> {ord.status}
                      </span>
                    </div>

                    {/* Order Breakdown Grid */}
                    <div className="grid md:grid-cols-3 gap-5 text-xs">
                      {/* Products List */}
                      <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1 mb-2">
                          <ShoppingBasket size={13} /> Subscribed Products:
                        </div>
                        {ord.items.map((i, idx) => (
                          <div key={idx} className="flex justify-between font-semibold text-slate-800">
                            <span>{i.qty}x {i.name}</span>
                            <span className="font-mono text-slate-600">₹{i.price * i.qty}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-slate-900">
                          <span>Total Per Delivery</span>
                          <span className="font-mono text-blue-600">₹{ord.total}</span>
                        </div>
                      </div>

                      {/* Schedule Details */}
                      <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1 mb-2">
                          <Clock size={13} /> Schedule & Slot:
                        </div>
                        <div className="text-slate-700 font-semibold">Frequency: <strong>{ord.frequency}</strong></div>
                        <div className="text-slate-700 font-semibold">Morning Slot: <strong>{ord.timeSlot}</strong></div>
                        <div className="text-teal-700 font-bold bg-teal-50 border border-teal-200 p-2 rounded-xl mt-1">
                          Next Scheduled: {ord.nextDate}
                        </div>
                      </div>

                      {/* Location & Payment Info */}
                      <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1 mb-2">
                            <MapPin size={13} strokeWidth={2.5} /> Address & Payment Mode:
                          </div>
                          <div className="text-slate-700 font-semibold truncate mb-1">
                            📍 {ord.address}
                          </div>
                          <div className="text-xs text-blue-600 font-bold">
                            💳 UPI AutoPay Mandate Authorized
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 italic">
                          Automatic door drop by 7:00 AM.
                        </div>
                      </div>
                    </div>

                    {/* Action Footer -> Redirect to App for Modifications */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-blue-50/50 p-3 rounded-2xl">
                      <div className="text-blue-900 font-semibold text-xs flex items-center gap-1.5">
                        <Info size={15} className="text-blue-600 shrink-0" />
                        <span>Skip delivery, pause schedule, or cancel order on <strong>FillCarts Mobile App</strong>.</span>
                      </div>

                      <button
                        onClick={() => setShowAppInstallModal(true)}
                        className="bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                      >
                        <Smartphone size={14} /> Open App to Manage Order <ArrowRight size={14} />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* DIRECT MOBILE APP INSTALLATION MODAL (TRIGGERED ON CHECKOUT OR ORDER MANAGEMENT) */}
      {showAppInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center relative shadow-2xl border border-slate-200 animate-scale-up space-y-6">
            
            <button
              onClick={() => setShowAppInstallModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            {/* Header Icon */}
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Smartphone size={32} />
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                FillCarts Mobile App
              </span>
              
              <h3 className="text-2xl font-bold text-slate-900 mt-3" style={{ fontFamily: "'Fraunces', serif" }}>
                Manage Subscription on FillCarts App
              </h3>
              
              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2">
                Order modification, skipping deliveries, pausing schedule, live tracking, or 1-tap AutoPay setup Mobile App par available hai. App install karke apni subscription easily manage karein!
              </p>
            </div>

            {/* Basket Summary inside Modal */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-500 font-bold">
                <span>Selected Basket Items:</span>
                <span className="text-slate-900 font-mono">{basket.length} Products</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold">
                <span>Schedule & Slot:</span>
                <span className="text-blue-600">{frequency} ({timeSlot})</span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                <span>Est. Amount per Cycle:</span>
                <span className="text-blue-600 font-mono">₹{Math.round(basketTotal * 0.9)}</span>
              </div>
            </div>

            {/* QR Code & Direct Install Buttons */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center justify-center gap-4">
                <div className="w-28 h-28 bg-white p-2 rounded-2xl border border-slate-200 shadow-md flex items-center justify-center">
                  <QrCode size={90} className="text-slate-900" />
                </div>
                <div className="text-left text-xs space-y-1">
                  <div className="font-extrabold text-slate-900">Scan QR Code</div>
                  <div className="text-slate-500 text-[11px]">Point phone camera to install FillCarts App immediately.</div>
                  <div className="text-teal-600 font-bold text-[11px]">✓ Instant Sync with Account</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="#download-playstore"
                  className="bg-slate-900 hover:bg-slate-950 text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Download size={15} /> Google Play
                </a>
                <a
                  href="#download-appstore"
                  className="bg-slate-900 hover:bg-slate-950 text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Smartphone size={15} /> App Store
                </a>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              Your selected items will automatically sync when you log in to the App.
            </div>

          </div>
        </div>
      )}

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
