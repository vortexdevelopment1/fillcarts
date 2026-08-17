import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronRight, Repeat, Clock, Milk, ShoppingBasket,
  Sparkles, Star, Plus, Trash2,
  X, Search, SlidersHorizontal, ShieldCheck, Download, Smartphone, QrCode,
  ArrowRight, ArrowLeft, Carrot, Apple, Croissant, Pill, UtensilsCrossed, Home, FileText, CheckCircle2, Info,
  Filter, Calendar, MapPin, ExternalLink, PauseCircle, PlayCircle, Edit3, AlertCircle, Zap
} from "lucide-react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../utils/productImages";
import api from "../api";

// Sourced directly from CategoriesPage for 100% category consistency
const categories = [
  { key: "grocery", name: "Grocery", icon: Carrot, color: "text-[#16A34A]", bg: "bg-[#ECFDF3]" },
  { key: "fruits", name: "Fruits & Veg", icon: Apple, color: "text-[#16A34A]", bg: "bg-[#ECFDF3]" },
  { key: "dairy", name: "Dairy", icon: Milk, color: "text-[#16A34A]", bg: "bg-[#ECFDF3]" },
  { key: "bakery", name: "Bakery", icon: Croissant, color: "text-[#F59E0B]", bg: "bg-amber-50" },
  { key: "pharmacy", name: "Pharmacy", icon: Pill, color: "text-[#16A34A]", bg: "bg-[#ECFDF3]" },
  { key: "food", name: "Food", icon: UtensilsCrossed, color: "text-[#F59E0B]", bg: "bg-amber-50" },
  { key: "home", name: "Home Essentials", icon: Home, color: "text-slate-700", bg: "bg-slate-100" },
  { key: "personal", name: "Personal Care", icon: Sparkles, color: "text-[#16A34A]", bg: "bg-[#ECFDF3]" },
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

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useCart();

  const initialSubscribeProduct = location.state?.subscribeProduct;

  const [activeCategory, setActiveCategory] = useState(() => {
    if (initialSubscribeProduct?.categoryKey) return initialSubscribeProduct.categoryKey;
    return "dairy";
  });

  const [basket, setBasket] = useState(() => {
    if (initialSubscribeProduct) {
      return [{
        id: initialSubscribeProduct.id || `sub-prod-${Date.now()}`,
        name: initialSubscribeProduct.name,
        qty: 1,
        price: initialSubscribeProduct.price
      }];
    }
    return [
      { id: "dairy-0", name: "Toned Milk 1L", qty: 1, price: 54 }
    ];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [timeSlot, setTimeSlot] = useState("6:30 AM - 7:30 AM");

  const todayDefault = new Date().toISOString().split("T")[0];
  const oneMonthDefault = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(todayDefault);
  const [endDate, setEndDate] = useState(oneMonthDefault);
  const [durationType, setDurationType] = useState("1_month");

  const handleDurationTypeChange = (type) => {
    setDurationType(type);
    const start = new Date(startDate || todayDefault);
    if (type === "7_days") {
      const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
      setEndDate(end.toISOString().split("T")[0]);
    } else if (type === "1_month") {
      const end = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
      setEndDate(end.toISOString().split("T")[0]);
    } else if (type === "3_months") {
      const end = new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000);
      setEndDate(end.toISOString().split("T")[0]);
    } else if (type === "until_cancelled") {
      setEndDate("");
    }
  };

  const [customCardTitle, setCustomCardTitle] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [userAddress, setUserAddress] = useState("Flat 402, Green Valley Apartments, Bengaluru");

  const [showAppInstallModal, setShowAppInstallModal] = useState(false);
  const [selectedCardForAppInstall, setSelectedCardForAppInstall] = useState(null);
  const [viewTab, setViewTab] = useState("create");
  const [orderFilter, setOrderFilter] = useState("All");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  const getStorageKey = (u) => {
    if (!u) return "fillcarts_subscription_orders_guest";
    return `fillcarts_subscription_orders_${u.id || u.phone || u.email || 'user'}`;
  };

  // Persistent Orders State (Guest & User Storage)
  const [myOrders, setMyOrders] = useState(() => {
    try {
      const key = getStorageKey(user);
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Failed to read subscription orders from localStorage", e);
    }
    return [];
  });

  // Handle incoming location state & event listener updates
  useEffect(() => {
    const syncOrders = () => {
      try {
        const key = getStorageKey(user);
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setMyOrders(parsed);
        }
      } catch (e) {}
    };

    syncOrders();

    if (location.state?.tab) {
      setViewTab(location.state.tab);
    }

    if (location.state?.newOrderCard) {
      const newCard = location.state.newOrderCard;
      setMyOrders(prev => {
        if (prev.some(o => o.orderId === newCard.orderId)) return prev;
        return [newCard, ...prev];
      });
    }

    if (location.state?.subscribeProduct) {
      const sp = location.state.subscribeProduct;
      if (sp.categoryKey) setActiveCategory(sp.categoryKey);
      setBasket([{
        id: sp.id || `sub-prod-${Date.now()}`,
        name: sp.name,
        qty: 1,
        price: sp.price
      }]);
    }

    window.addEventListener("fillcarts_subscriptions_updated", syncOrders);
    return () => window.removeEventListener("fillcarts_subscriptions_updated", syncOrders);
  }, [user, location.state]);

  // Save to LocalStorage whenever myOrders changes
  useEffect(() => {
    try {
      const key = getStorageKey(user);
      if (key) {
        localStorage.setItem(key, JSON.stringify(myOrders));
      }
    } catch (e) {
      console.error("Failed to save subscription orders to localStorage", e);
    }
  }, [myOrders, user]);

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

  // Add / Remove / Update Basket Items
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

  // Dynamically Create a Subscription Order Card (Requires Login)
  const handleCreateSubscriptionCard = () => {
    if (!user) {
      alert("Please log in to create a subscription card.");
      navigate("/login");
      return;
    }

    if (basket.length === 0) {
      alert("Please add at least 1 item to your subscription card.");
      return;
    }

    const calculatedTotal = Math.round(basketTotal * 0.9);
    const newOrderId = `SUB-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const categoryName = categories.find(c => c.key === activeCategory)?.name || "Essentials";
    const defaultTitle = customCardTitle.trim() || `${basket[0]?.name || categoryName} Subscription Card`;

    const todayStr = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    let durationFormatted = "Until Cancelled (Flexible)";
    if (durationType !== "until_cancelled") {
      const sStr = new Date(startDate || todayDefault).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      const eStr = endDate ? new Date(endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
      durationFormatted = eStr ? `${sStr} to ${eStr}` : `Starts ${sStr}`;
    }

    const newOrderCard = {
      orderId: newOrderId,
      name: defaultTitle,
      items: basket.map(b => ({ name: b.name, qty: b.qty, price: b.price })),
      frequency,
      timeSlot,
      duration: durationFormatted,
      startDate,
      endDate,
      status: "App Setup Pending",
      nextDate: "Tomorrow (7:00 AM Slot)",
      orderDate: `Created on ${todayStr}`,
      address: typeof userAddress === "object" ? (userAddress?.address_line || "Home Address") : String(userAddress || "Home Address"),
      total: calculatedTotal
    };

    // Prepend to myOrders list dynamically
    setMyOrders(prev => [newOrderCard, ...prev]);

    // Set selected card for app modal & open modal
    setSelectedCardForAppInstall(newOrderCard);
    setShowAppInstallModal(true);

    // Switch to order tracking view tab
    setViewTab("my_subscriptions");
  };

  // Trigger Mobile App Purchase Modal for an existing Card
  const handleSelectCardForApp = (orderCard) => {
    setSelectedCardForAppInstall(orderCard);
    setShowAppInstallModal(true);
  };

  // Toggle Subscription Status (Pause / Activate)
  const handleToggleStatus = (orderId) => {
    setMyOrders(prev => prev.map(ord => {
      if (ord.orderId === orderId) {
        let newStatus = "Active Schedule";
        if (ord.status === "Active Schedule") newStatus = "Paused";
        else if (ord.status === "Paused") newStatus = "Active Schedule";
        else if (ord.status === "App Setup Pending") newStatus = "Active Schedule";
        return { ...ord, status: newStatus };
      }
      return ord;
    }));
  };

  // Delete / Cancel Subscription Card
  const handleDeleteCard = (orderId) => {
    if (window.confirm("Are you sure you want to cancel and remove this subscription card from tracking?")) {
      setMyOrders(prev => prev.filter(ord => ord.orderId !== orderId));
    }
  };

  // Filtered & Searched Orders for Tracking Tab
  const filteredOrders = useMemo(() => {
    return myOrders.filter(ord => {
      // Filter by status
      if (orderFilter !== "All" && ord.status !== orderFilter) return false;

      // Filter by search query
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchesId = ord.orderId.toLowerCase().includes(q);
        const matchesName = ord.name.toLowerCase().includes(q);
        const matchesItem = ord.items.some(i => i.name.toLowerCase().includes(q));
        return matchesId || matchesName || matchesItem;
      }
      return true;
    });
  }, [myOrders, orderFilter, orderSearchQuery]);

  // Metrics
  const activeCount = useMemo(() => myOrders.filter(o => o.status === "Active Schedule").length, [myOrders]);
  const pendingCount = useMemo(() => myOrders.filter(o => o.status === "App Setup Pending").length, [myOrders]);
  const totalWeeklySpend = useMemo(() => myOrders.reduce((sum, o) => sum + o.total, 0), [myOrders]);

  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Shared Navbar */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="hover:text-[#16A34A] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/categories" className="hover:text-[#16A34A] transition-colors">Categories</Link>
            <ChevronRight size={12} />
            <span className="text-[#166534] font-bold">Daily Essentials Subscriptions</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-extrabold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-3 py-1 rounded-full">
            <ShieldCheck size={14} className="text-[#16A34A]" /> 100% Fresh Morning Delivery
          </div>
        </div>
      </div>

      {/* Soft Green Shaded Hero Header with Side-by-side max-w-6xl bounds */}
      <section className="bg-gradient-to-b from-[#ECFDF3] via-[#F0FDF4] to-[#FFFCF5] border-b border-emerald-200/60 py-10 px-4 sm:px-6 relative text-left">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-white px-3.5 py-1.5 rounded-full border border-amber-200/80 mb-1 shadow-2xs">
              <Sparkles size={13} /> Daily & Weekly Auto-Delivery
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17231A] leading-tight tracking-tight">
              Subscribe & Save on <span className="text-[#16A34A]">Essentials</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#166534] font-semibold max-w-xl leading-relaxed">
              Add store items dynamically to your card, select your custom schedule, track your subscription orders in real-time, and complete your purchase via the FillCarts App!
            </p>
          </div>

          {/* Navigation Tab Switcher */}
          <div className="bg-white border border-emerald-200 p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap gap-2 shadow-xs shrink-0 self-start md:self-center">
            <button
              onClick={() => setViewTab("create")}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${viewTab === "create"
                ? "bg-[#16A34A] text-white shadow-md"
                : "text-[#166534] hover:bg-[#ECFDF3]"
                }`}
            >
              <Plus size={14} /> Build Subscription Card
            </button>
            <button
              onClick={() => setViewTab("my_subscriptions")}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${viewTab === "my_subscriptions"
                ? "bg-[#16A34A] text-white shadow-md"
                : "text-[#166534] hover:bg-[#ECFDF3]"
                }`}
            >
              <FileText size={14} /> Dynamic Order Tracking ({myOrders.length})
            </button>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">

        {/* TAB 1: BUILD SUBSCRIPTION CARD */}
        {viewTab === "create" && (
          <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">

            {/* Left Column: Sticky Subscription Summary & Card Checkout Panel */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-md sticky top-6 space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBasket size={18} className="text-[#16A34A]" />
                  <h3 className="text-base font-extrabold text-[#17231A]">Subscription Card</h3>
                </div>
                <span className="bg-[#ECFDF3] text-[#166534] text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {basket.reduce((sum, i) => sum + i.qty, 0)} Items
                </span>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-[11px] font-black text-[#166534] uppercase tracking-wider mb-1">
                  Card Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Daily Milk & Breakfast Routine"
                  value={customCardTitle}
                  onChange={(e) => setCustomCardTitle(e.target.value)}
                  className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              {/* Basket Items List */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {basket.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 bg-[#FFFCF5] rounded-2xl border border-dashed border-slate-200">
                    No items selected yet. Select products from category grid.
                  </div>
                ) : (
                  basket.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-[#FFFCF5] p-3 rounded-2xl text-xs font-semibold border border-slate-100">
                      <div>
                        <div className="font-extrabold text-[#17231A]">{item.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">₹{item.price} × {item.qty}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                          <button
                            onClick={() => updateQty({ id: item.id }, -1)}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs px-1 font-bold">{item.qty}</span>
                          <button
                            onClick={() => updateQty({ id: item.id }, 1)}
                            className="w-5 h-5 rounded bg-[#16A34A] text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-black text-[#166534] font-mono w-12 text-right">₹{item.price * item.qty}</span>
                        <button
                          onClick={() => updateQty({ id: item.id }, -item.qty)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Schedule & Address Configuration */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <label className="block font-extrabold text-[#17231A] mb-1">Delivery Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs focus:outline-none focus:border-[#16A34A] cursor-pointer"
                  >
                    <option value="Daily">Daily Morning Delivery</option>
                    <option value="Every 2 Days">Every 2 Days</option>
                    <option value="Mon / Wed / Fri">Mon / Wed / Fri</option>
                    <option value="Weekly (Sundays)">Weekly (Sundays)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-[#17231A] mb-1">Guaranteed Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs focus:outline-none focus:border-[#16A34A] cursor-pointer"
                  >
                    <option value="6:30 AM - 7:30 AM">6:30 AM - 7:30 AM (Express Morning)</option>
                    <option value="7:30 AM - 8:30 AM">7:30 AM - 8:30 AM</option>
                    <option value="8:30 AM - 9:30 AM">8:30 AM - 9:30 AM</option>
                  </select>
                </div>

                {/* Subscription Duration */}
                <div>
                  <label className="block font-extrabold text-[#17231A] mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-[#16A34A]" /> Subscription Duration
                  </label>
                  <select
                    value={durationType}
                    onChange={(e) => handleDurationTypeChange(e.target.value)}
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs focus:outline-none focus:border-[#16A34A] mb-2 cursor-pointer"
                  >
                    <option value="1_month">1 Month (30 Days Plan)</option>
                    <option value="7_days">7 Days Plan</option>
                    <option value="3_months">3 Months Plan</option>
                    <option value="until_cancelled">Until Cancelled (Flexible)</option>
                    <option value="custom">Custom Date Range (Pick Dates)</option>
                  </select>

                  {/* Start Date & End Date Inputs */}
                  <div className="grid grid-cols-2 gap-2 bg-[#FFFCF5] border border-slate-200 p-2.5 rounded-xl">
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Start Date</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          if (durationType !== "custom" && durationType !== "until_cancelled") {
                            const start = new Date(e.target.value);
                            const days = durationType === "7_days" ? 7 : durationType === "3_months" ? 90 : 30;
                            const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
                            setEndDate(end.toISOString().split("T")[0]);
                          }
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#16A34A] cursor-pointer"
                      />
                    </div>

                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">End Date</span>
                      {durationType === "until_cancelled" ? (
                        <div className="bg-[#ECFDF3] border border-emerald-200 text-[#166534] text-[11px] font-bold py-1 px-2 rounded-lg text-center truncate mt-0.5">
                          Until Cancelled
                        </div>
                      ) : (
                        <input
                          type="date"
                          value={endDate}
                          readOnly={durationType !== "custom"}
                          onChange={(e) => setEndDate(e.target.value)}
                          className={`w-full border rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none ${durationType === "custom" ? "bg-white border-slate-200 focus:border-[#16A34A] cursor-pointer" : "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"}`}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Address Section (Fetched dynamically from Account) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-extrabold text-[#17231A] flex items-center gap-1">
                      <MapPin size={13} className="text-[#16A34A]" /> Delivery Address
                    </label>
                    {user && (
                      <span className="text-[10px] text-[#166534] font-bold bg-[#ECFDF3] px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ Account Synced
                      </span>
                    )}
                  </div>

                  {savedAddresses.length > 0 && (
                    <select
                      onChange={(e) => handleAddressChange(e.target.value)}
                      className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 font-semibold text-xs mb-2 focus:outline-none focus:border-[#16A34A] cursor-pointer"
                    >
                      <option value="">-- Choose Saved Location --</option>
                      {user && user.address && (
                        <option value={`${user.address}${user.pincode ? `, Pincode: ${user.pincode}` : ""}`}>
                          [Profile] {user.address}
                        </option>
                      )}
                      {savedAddresses.map((addr) => {
                        const fullStr = `[${addr.type}] ${addr.address_line}${addr.pincode ? `, Pincode: ${addr.pincode}` : ""}`;
                        return (
                          <option key={addr.id} value={fullStr}>
                            [{addr.type}] {addr.address_line.slice(0, 35)}...
                          </option>
                        );
                      })}
                    </select>
                  )}

                  <input
                    type="text"
                    value={userAddress}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    placeholder="Doorstep delivery address..."
                    className="w-full bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              {/* Basket Total Breakdown in Dark Green Container */}
              <div className="bg-[#166534] text-white p-4 rounded-2xl space-y-2 shadow-xs">
                <div className="flex justify-between text-xs text-emerald-100">
                  <span>Recurring Item Total</span>
                  <span className="font-mono font-bold text-white">₹{basketTotal}</span>
                </div>
                <div className="flex justify-between text-[11px] text-amber-300 font-extrabold">
                  <span>Subscriber Discount</span>
                  <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px]">-10% Applied</span>
                </div>
                <div className="pt-2 border-t border-emerald-700 flex justify-between text-sm font-black text-white">
                  <span>Estimated Total / Cycle</span>
                  <span className="font-mono text-amber-300 text-base">₹{Math.round(basketTotal * 0.9)}</span>
                </div>
              </div>

              {/* DYNAMIC CARD CHECKOUT ACTION */}
              <button
                onClick={handleCreateSubscriptionCard}
                disabled={basket.length === 0}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-40 text-white font-extrabold text-xs rounded-xl py-3.5 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirm Subscription Card</span>
                <ArrowRight size={15} />
              </button>

              <div className="text-[11px] text-slate-400 text-center font-medium leading-tight">
                🔒 Card will be added to <strong>Order Tracking</strong>. Download the mobile app to activate 1-tap AutoPay.
              </div>
            </div>

            {/* Right Column: Categories Selector & Product Grid */}
            <div className="space-y-6 text-left">

              {/* Category Chips Bar */}
              <div className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-xs">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-3">
                  <SlidersHorizontal size={13} /> Select Store Category
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {categories.map((c) => {
                    const IconComp = c.icon;
                    const isActive = activeCategory === c.key;
                    return (
                      <button
                        key={c.key}
                        onClick={() => setActiveCategory(c.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all border cursor-pointer ${isActive
                          ? "bg-[#16A34A] text-white border-[#16A34A] shadow-xs"
                          : "bg-[#FFFCF5] border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-[#ECFDF3]"
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
              <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-1">
                      <Sparkles size={13} /> Select Subscription Products
                    </span>
                    <h2 className="text-xl font-extrabold text-[#17231A]">
                      Fresh items in {categories.find(c => c.key === activeCategory)?.name}
                    </h2>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      placeholder="Search category items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[#FFFCF5] border border-slate-200 text-xs font-semibold rounded-full pl-9 pr-4 py-2 w-full sm:w-56 focus:outline-none focus:border-[#16A34A]"
                    />
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {activeCategoryProducts.map((p) => {
                    const inBasket = basket.find(b => b.id === p.id);
                    const qty = inBasket ? inBasket.qty : 0;

                    return (
                      <div key={p.id} className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between p-3 group">
                        <div>
                          <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-3 relative">
                            <img
                              src={getProductImage(p.name, p.categoryKey || activeCategory)}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-0.5 shadow-xs">
                              <Star size={10} fill="currentColor" /> {p.rating}
                            </div>
                          </div>

                          <div className="font-extrabold text-xs text-[#17231A] mb-1 leading-snug line-clamp-2">{p.name}</div>
                          <div className="flex items-center gap-1.5 mb-3">
                            <span className="font-black text-sm text-[#166534] font-mono">₹{p.price}</span>
                            <span className="text-[11px] text-slate-400 line-through">₹{p.mrp}</span>
                          </div>
                        </div>

                        {/* Add / Quantity Control Button */}
                        {qty === 0 ? (
                          <button
                            onClick={() => updateQty(p, 1)}
                            className="w-full bg-[#ECFDF3] hover:bg-[#16A34A] text-[#166534] hover:text-white border border-emerald-200 font-extrabold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus size={14} /> Add to Card
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-[#16A34A] text-white rounded-xl p-1 shadow-xs">
                            <button
                              onClick={() => updateQty(p, -1)}
                              className="w-7 h-7 rounded-lg bg-[#15803D] hover:bg-[#166534] flex items-center justify-center font-bold text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono font-black text-xs px-2">{qty}</span>
                            <button
                              onClick={() => updateQty(p, 1)}
                              className="w-7 h-7 rounded-lg bg-[#15803D] hover:bg-[#166534] flex items-center justify-center font-bold text-xs cursor-pointer"
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

        {/* TAB 2: DYNAMIC ORDER TRACKING & SUBSCRIPTION RECORDS DASHBOARD */}
        {viewTab === "my_subscriptions" && (
          <div className="max-w-5xl mx-auto space-y-6 text-left">

            {/* Header Metrics Bar in Dark Green Container */}
            <div className="bg-[#166534] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-600 mb-2">
                  <Sparkles size={13} /> Real-time Subscriptions Dashboard
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold">
                  Subscription Order Cards & Delivery Tracking
                </h2>
                <p className="text-xs text-emerald-100 mt-1 font-medium max-w-xl">
                  Track your dynamic subscription cards, view product breakdowns, and download the app to purchase.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-[#15803D] border border-emerald-500 p-3 rounded-2xl">
                <div className="text-center px-3 border-r border-emerald-600">
                  <div className="text-xl font-black font-mono text-white">{activeCount}</div>
                  <div className="text-[10px] text-emerald-100 font-bold uppercase">Active Cards</div>
                </div>
                <div className="text-center px-3 border-r border-emerald-600">
                  <div className="text-xl font-black font-mono text-amber-300">{pendingCount}</div>
                  <div className="text-[10px] text-emerald-100 font-bold uppercase">Pending Setup</div>
                </div>
                <div className="text-center px-3">
                  <div className="text-xl font-black font-mono text-white">₹{totalWeeklySpend}</div>
                  <div className="text-[10px] text-emerald-100 font-bold uppercase">Est. Total</div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                <span className="text-xs font-black text-slate-400 mr-1 uppercase text-[10px]">Filter:</span>
                {["All", "Active Schedule", "App Setup Pending", "Paused"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all border whitespace-nowrap cursor-pointer ${orderFilter === st
                      ? "bg-[#16A34A] text-white border-[#16A34A]"
                      : "bg-[#FFFCF5] text-slate-700 border-slate-200 hover:bg-[#ECFDF3]"
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Order Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Search tracking cards or items..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="bg-[#FFFCF5] border border-slate-200 text-xs font-semibold rounded-full pl-9 pr-4 py-2 w-full focus:outline-none focus:border-[#16A34A]"
                />
              </div>
            </div>

            {/* Subscriptions Order Cards List */}
            <div className="space-y-6">
              {!user ? (
                <div className="bg-white border border-emerald-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs space-y-3">
                  <FileText size={36} className="text-slate-300 mx-auto" />
                  <h3 className="text-base font-extrabold text-[#17231A]">No active subscription cards</h3>
                  <p className="text-xs text-slate-500 font-medium">Please log in to view and create your subscription cards.</p>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs px-6 py-3 rounded-full shadow-md transition-colors cursor-pointer"
                  >
                    Log In to Subscribe
                  </button>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white border border-emerald-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs">
                  <FileText size={36} className="text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-extrabold text-[#17231A]">No matching subscription cards found</h3>
                  <p className="text-xs text-slate-500 mb-6 font-medium">Build a new subscription card or adjust your filter options.</p>
                  <button
                    onClick={() => setViewTab("create")}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs px-6 py-3 rounded-full shadow-md transition-colors cursor-pointer"
                  >
                    Build First Subscription Card
                  </button>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div key={ord.orderId} className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-5 relative overflow-hidden">

                    {/* Header: Order ID, Status & Quick Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold shrink-0">
                          <Repeat size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-black text-[#166534] bg-[#ECFDF3] px-2 py-0.5 rounded border border-emerald-200">
                              {ord.orderId}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">{ord.orderDate}</span>
                          </div>
                          <h3 className="text-base font-extrabold text-[#17231A] mt-0.5">{ord.name}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        {ord.status === "Active Schedule" && (
                          <span className="bg-[#ECFDF3] text-[#166534] border border-emerald-200 text-xs font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-[#16A34A]" /> Active Schedule
                          </span>
                        )}
                        {ord.status === "App Setup Pending" && (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                            <AlertCircle size={14} className="text-[#F59E0B]" /> App Download Needed
                          </span>
                        )}
                        {ord.status === "Paused" && (
                          <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                            <PauseCircle size={14} /> Paused
                          </span>
                        )}

                        {/* Status Toggle Button */}
                        <button
                          onClick={() => handleToggleStatus(ord.orderId)}
                          className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                          title="Toggle Status"
                        >
                          {ord.status === "Active Schedule" ? "Pause" : "Activate"}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteCard(ord.orderId)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Card"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Order Breakdown Grid */}
                    <div className="grid md:grid-cols-3 gap-5 text-xs">
                      {/* Products List */}
                      <div className="space-y-2 bg-[#FFFCF5] p-4 rounded-2xl border border-slate-100">
                        <div className="font-black text-[#166534] uppercase text-[10px] flex items-center gap-1 mb-2">
                          <ShoppingBasket size={13} /> Subscribed Products ({ord.items.length}):
                        </div>
                        {ord.items.map((i, idx) => (
                          <div key={idx} className="flex justify-between font-semibold text-slate-800">
                            <span>{i.qty}x {i.name}</span>
                            <span className="font-mono text-slate-600">₹{i.price * i.qty}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-[#17231A]">
                          <span>Total Per Delivery</span>
                          <span className="font-mono text-[#166534]">₹{ord.total}</span>
                        </div>
                      </div>

                      {/* Schedule Details */}
                      <div className="space-y-2 bg-[#FFFCF5] p-4 rounded-2xl border border-slate-100">
                        <div className="font-black text-[#166534] uppercase text-[10px] flex items-center gap-1 mb-2">
                          <Clock size={13} /> Schedule & Slot:
                        </div>
                        <div className="text-slate-700 font-semibold">Frequency: <strong>{ord.frequency}</strong></div>
                        <div className="text-slate-700 font-semibold">Morning Slot: <strong>{ord.timeSlot}</strong></div>
                        {ord.duration && (
                          <div className="text-[#166534] font-bold text-[11px] bg-[#ECFDF3] border border-emerald-200 px-2.5 py-1 rounded-xl">
                            📅 Period: <strong>{ord.duration}</strong>
                          </div>
                        )}
                        <div className="text-[#166534] font-extrabold bg-[#ECFDF3] border border-emerald-200 p-2 rounded-xl mt-1">
                          Next Scheduled: {ord.nextDate}
                        </div>
                      </div>

                      {/* Location & Payment Info */}
                      <div className="space-y-2 bg-[#FFFCF5] p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                        <div>
                          <div className="font-black text-[#166534] uppercase text-[10px] flex items-center gap-1 mb-2">
                            <MapPin size={13} strokeWidth={2.5} /> Address & Payment Mode:
                          </div>
                          <div className="text-slate-700 font-semibold truncate mb-1">
                            📍 {ord.address}
                          </div>
                          <div className="text-xs text-[#166534] font-extrabold">
                            💳 UPI AutoPay Mandate
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 italic">
                          Automatic doorstep drop by morning time slot.
                        </div>
                      </div>
                    </div>

                    {/* Action Footer -> Select Card for Subscription Purchase via Mobile App */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-[#ECFDF3]/60 p-3.5 rounded-2xl">
                      <div className="text-[#166534] font-extrabold text-xs flex items-center gap-1.5">
                        <Info size={15} className="text-[#16A34A] shrink-0" />
                        <span>Select this subscription card to complete your purchase after app download.</span>
                      </div>

                      <button
                        onClick={() => handleSelectCardForApp(ord)}
                        className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                      >
                        <Smartphone size={14} /> Select Card to Purchase ({ord.orderId}) <ArrowRight size={14} />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* FULL-SCREEN SUBSCRIPTION CONFIRMATION OVERLAY */}
      {showAppInstallModal && (
        <div className="fixed inset-0 z-50 bg-[#FFFCF5] text-[#17231A] overflow-hidden flex flex-col justify-between p-4 sm:p-8 md:p-12">

          {/* Top Bar */}
          <div className="max-w-6xl w-full mx-auto flex items-center justify-between shrink-0 pb-2 border-b border-slate-200">
            <button
              onClick={() => setShowAppInstallModal(false)}
              className="flex items-center gap-2 text-xs font-extrabold text-slate-700 hover:text-[#16A34A] transition-colors cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-full shadow-xs"
            >
              <ArrowLeft size={16} /> Back to Subscription Builder
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-3.5 py-1.5 rounded-full">
              <CheckCircle2 size={15} className="text-[#16A34A]" /> Card Added to Order Tracking
            </span>

            <button
              onClick={() => setShowAppInstallModal(false)}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Center Main View (2-Column Spacious Grid) */}
          <div className="max-w-6xl w-full mx-auto my-auto py-4 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center text-left">

            {/* LEFT COLUMN: Confirmation Info & Card Details */}
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-1">
                  <Smartphone size={14} /> FillCarts App Purchase
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17231A] leading-tight">
                  Complete Purchase via FillCarts App
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Aapka subscription card successfully order tracking mein add ho gaya hai! Mobile App download karke 1-tap AutoPay complete karein aur apni regular delivery start karein.
                </p>
              </div>

              {/* Card Summary Box */}
              {selectedCardForAppInstall && (
                <div className="bg-white border border-emerald-100 rounded-3xl p-5 md:p-6 shadow-sm space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="font-extrabold text-sm text-[#17231A]">{selectedCardForAppInstall.name || "Subscription Card"}</span>
                    <span className="font-mono text-xs font-black text-[#166534] bg-[#ECFDF3] px-2.5 py-1 rounded-lg border border-emerald-200">
                      {selectedCardForAppInstall.orderId || "SUB-ORD"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Selected Products</span>
                      <span className="text-slate-900 font-bold">{selectedCardForAppInstall.items?.length || 0} Items Subscribed</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Delivery Frequency</span>
                      <span className="text-[#16A34A] font-bold">{selectedCardForAppInstall.frequency || "Daily"}</span>
                    </div>
                  </div>

                  {selectedCardForAppInstall.duration && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-400 font-semibold block text-[11px]">Subscription Validity</span>
                      <span className="text-[#166534] font-bold block">
                        📅 {selectedCardForAppInstall.duration}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-semibold block text-[11px]">Slot & Address</span>
                    <span className="text-slate-800 font-bold truncate block">
                      {selectedCardForAppInstall.timeSlot || "Morning Slot"} • {typeof selectedCardForAppInstall.address === "object" ? (selectedCardForAppInstall.address?.address_line || "Home Address") : String(selectedCardForAppInstall.address || "Home Address")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-slate-900 font-extrabold text-sm">
                    <span>Recurring Total per Cycle</span>
                    <span className="text-[#166534] font-mono text-lg font-black">₹{selectedCardForAppInstall.total || 0}</span>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: QR Code Card & App Install Action */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-lg text-center space-y-6">

              <div className="space-y-3">
                <div className="w-32 h-32 bg-[#FFFCF5] p-2.5 rounded-3xl border border-slate-200 shadow-inner flex items-center justify-center mx-auto">
                  <QrCode size={110} className="text-slate-900" />
                </div>

                <div>
                  <div className="font-extrabold text-slate-900 text-base">Scan QR to Install App</div>
                  <div className="text-slate-500 text-xs mt-1 font-medium">Point phone camera to install FillCarts directly on Android & iOS.</div>
                  <div className="text-[#166534] font-bold text-xs mt-2 inline-flex items-center gap-1 bg-[#ECFDF3] border border-emerald-200 px-3 py-1 rounded-full">
                    <CheckCircle2 size={14} className="text-[#16A34A]" /> Instant Account Sync Enabled
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="#download-playstore"
                    onClick={() => alert("Downloading FillCarts for Android...")}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white py-3.5 px-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Download size={16} /> Google Play
                  </a>
                  <a
                    href="#download-appstore"
                    onClick={() => alert("Downloading FillCarts for iOS...")}
                    className="bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Smartphone size={16} /> App Store
                  </a>
                </div>

                <p className="text-[11px] text-slate-400 font-semibold">
                  Available for Android & iOS · Log in with your registered phone number to view active cards.
                </p>
              </div>

            </div>

          </div>

          {/* Bottom Notice */}
          <div className="max-w-6xl w-full mx-auto text-center shrink-0 pt-2 border-t border-slate-200">
            <p className="text-[11px] text-slate-400 font-semibold">
              🔒 AutoPay setup required in Mobile App to start scheduled deliveries. Card saved in your Order Tracking tab.
            </p>
          </div>

        </div>
      )}

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
