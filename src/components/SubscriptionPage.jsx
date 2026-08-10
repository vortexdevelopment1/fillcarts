import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight, Repeat, Clock, Milk, ShoppingBasket,
  Sparkles, Star, Plus, Trash2,
  X, Search, SlidersHorizontal, ShieldCheck, Download, Smartphone, QrCode,
  ArrowRight, ArrowLeft, Carrot, Apple, Croissant, Pill, UtensilsCrossed, Home, FileText, CheckCircle2, Info,
  Filter, Calendar, MapPin, ExternalLink, PauseCircle, PlayCircle, Edit3, AlertCircle
} from "lucide-react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useCart } from "../context/CartContext";
import api from "../api";

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

const initialSeedOrders = [
  {
    orderId: "SUB-ORD-9021",
    name: "Daily Fresh Dairy Routine",
    items: [
      { name: "Toned Milk 1L", qty: 2, price: 54 },
      { name: "Curd 400g", qty: 1, price: 42 }
    ],
    frequency: "Daily",
    timeSlot: "6:30 AM - 7:30 AM",
    duration: "10 Aug 2026 to 10 Sep 2026 (1 Month)",
    status: "Active Schedule",
    nextDate: "Tomorrow (7:00 AM Slot)",
    orderDate: "Created on 6 Aug 2026",
    address: "Flat 402, Green Valley Apartments, Bengaluru",
    total: 135
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
    duration: "10 Aug 2026 to 10 Nov 2026 (3 Months)",
    status: "App Setup Pending",
    nextDate: "Sunday (8:30 AM Slot)",
    orderDate: "Created on 4 Aug 2026",
    address: "Flat 402, Green Valley Apartments, Bengaluru",
    total: 278
  }
];

const STORAGE_KEY = "fillcarts_subscription_orders";

export default function SubscriptionPage() {
  const { user } = useCart();
  const [activeCategory, setActiveCategory] = useState("dairy");
  const [basket, setBasket] = useState([
    { id: "dairy-0", name: "Toned Milk 1L", qty: 1, price: 54 }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [timeSlot, setTimeSlot] = useState("6:30 AM - 7:30 AM");

  // Subscription Date Range (Kab se Kab tak)
  const todayDefault = new Date().toISOString().split("T")[0];
  const oneMonthDefault = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(todayDefault);
  const [endDate, setEndDate] = useState(oneMonthDefault);
  const [durationType, setDurationType] = useState("1_month"); // 7_days | 1_month | 3_months | until_cancelled | custom

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

  // Modals & Navigation state
  const [showAppInstallModal, setShowAppInstallModal] = useState(false);
  const [selectedCardForAppInstall, setSelectedCardForAppInstall] = useState(null);
  const [viewTab, setViewTab] = useState("create"); // create | my_subscriptions
  const [orderFilter, setOrderFilter] = useState("All"); // All | Active Schedule | App Setup Pending | Paused
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Dynamically fetch logged-in user profile address and saved addresses
  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (user) {
        let addrStr = "";
        if (user.address) {
          addrStr = user.address;
          if (user.pincode) addrStr += `, Pincode: ${user.pincode}`;
        }
        if (addrStr) {
          setUserAddress(addrStr);
        }

        try {
          const res = await api.get("/addresses");
          if (res.data && res.data.addresses && res.data.addresses.length > 0) {
            setSavedAddresses(res.data.addresses);
            const first = res.data.addresses[0];
            const firstStr = `[${first.type}] ${first.address_line}${first.pincode ? `, Pincode: ${first.pincode}` : ""}`;
            if (!user.address) {
              setUserAddress(firstStr);
            }
          }
        } catch (e) {
          console.error("Failed to fetch saved addresses", e);
        }
      } else {
        const guestAddress = localStorage.getItem("fillcarts_user_address");
        if (guestAddress) {
          setUserAddress(guestAddress);
        }
      }
    };

    fetchUserAddresses();
  }, [user]);

  const handleAddressChange = (val) => {
    setUserAddress(val);
    localStorage.setItem("fillcarts_user_address", val);
  };

  // Persistent Orders State
  const [myOrders, setMyOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to read subscription orders from localStorage", e);
    }
    return initialSeedOrders;
  });

  // Save to LocalStorage whenever myOrders changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(myOrders));
    } catch (e) {
      console.error("Failed to save subscription orders to localStorage", e);
    }
  }, [myOrders]);

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

  // Dynamically Create a Subscription Order Card
  const handleCreateSubscriptionCard = () => {
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
              Add store items dynamically to your card, select your custom schedule, track your subscription orders in real-time, and complete your purchase via the FillCarts App!
            </p>
          </div>

          {/* Navigation Tab Switcher */}
          <div className="bg-slate-800/90 border border-slate-700 p-1.5 rounded-2xl flex gap-2 shadow-xl backdrop-blur-md shrink-0">
            <button
              onClick={() => setViewTab("create")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${viewTab === "create" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:text-white"
                }`}
            >
              <Plus size={14} /> Build Subscription Card
            </button>
            <button
              onClick={() => setViewTab("my_subscriptions")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${viewTab === "my_subscriptions" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:text-white"
                }`}
            >
              <FileText size={14} /> Dynamic Order Tracking ({myOrders.length})
            </button>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* TAB 1: BUILD SUBSCRIPTION CARD */}
        {viewTab === "create" && (
          <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">

            {/* Left Column: Sticky Subscription Summary & Card Checkout Panel */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg sticky top-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBasket size={18} className="text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Subscription Card</h3>
                </div>
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {basket.reduce((sum, i) => sum + i.qty, 0)} Items
                </span>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Card Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Daily Milk & Breakfast Routine"
                  value={customCardTitle}
                  onChange={(e) => setCustomCardTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Basket Items List */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {basket.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No items selected yet. Select products from category grid.
                  </div>
                ) : (
                  basket.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl text-xs font-semibold border border-slate-100">
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">₹{item.price} × {item.qty}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                          <button
                            onClick={() => updateQty({ id: item.id }, -1)}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs px-1 font-bold">{item.qty}</span>
                          <button
                            onClick={() => updateQty({ id: item.id }, 1)}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-blue-600 font-mono w-12 text-right">₹{item.price * item.qty}</span>
                        <button
                          onClick={() => updateQty({ id: item.id }, -item.qty)}
                          className="text-slate-400 hover:text-red-600 p-1"
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
                  <label className="block font-bold text-slate-700 mb-1">Delivery Frequency</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Guaranteed Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="6:30 AM - 7:30 AM">6:30 AM - 7:30 AM (Express Morning)</option>
                    <option value="7:30 AM - 8:30 AM">7:30 AM - 8:30 AM</option>
                    <option value="8:30 AM - 9:30 AM">8:30 AM - 9:30 AM</option>
                  </select>
                </div>

                {/* Subscription Duration */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-blue-600" /> Subscription Duration
                  </label>
                  <select
                    value={durationType}
                    onChange={(e) => handleDurationTypeChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs focus:outline-none focus:border-blue-500 mb-2 cursor-pointer"
                  >
                    <option value="1_month">1 Month (30 Days Plan)</option>
                    <option value="7_days">7 Days Plan</option>
                    <option value="3_months">3 Months Plan</option>
                    <option value="until_cancelled">Until Cancelled (Flexible)</option>
                    <option value="custom">Custom Date Range (Pick Dates)</option>
                  </select>

                  {/* Start Date & End Date Inputs */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200/90 p-2.5 rounded-xl">
                    <div>
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Start Date</span>
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
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">End Date</span>
                      {durationType === "until_cancelled" ? (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold py-1 px-2 rounded-lg text-center truncate mt-0.5">
                          Until Cancelled
                        </div>
                      ) : (
                        <input
                          type="date"
                          value={endDate}
                          readOnly={durationType !== "custom"}
                          onChange={(e) => setEndDate(e.target.value)}
                          className={`w-full border rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none ${durationType === "custom" ? "bg-white border-slate-200 focus:border-blue-500 cursor-pointer" : "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"}`}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Address Section (Fetched dynamically from Account) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <MapPin size={13} className="text-blue-600" /> Delivery Address
                    </label>
                    {user && (
                      <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        ✓ Fetched from Account
                      </span>
                    )}
                  </div>

                  {savedAddresses.length > 0 && (
                    <select
                      onChange={(e) => handleAddressChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-xs mb-2 focus:outline-none focus:border-blue-500"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Basket Total Breakdown */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Recurring Item Total</span>
                  <span className="font-mono font-bold text-white">₹{basketTotal}</span>
                </div>
                <div className="flex justify-between text-[11px] text-teal-400 font-bold">
                  <span>Subscriber Discount</span>
                  <span>-10% Applied</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-extrabold text-teal-300">
                  <span>Estimated Total / Cycle</span>
                  <span className="font-mono">₹{Math.round(basketTotal * 0.9)}</span>
                </div>
              </div>

              {/* DYNAMIC CARD CHECKOUT ACTION */}
              <button
                onClick={handleCreateSubscriptionCard}
                disabled={basket.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-full py-3.5 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Confirm Subscription Card <ArrowRight size={15} />
              </button>

              <div className="text-[11px] text-slate-400 text-center font-medium leading-tight">
                🔒 Card will be added to <strong>Order Tracking</strong>. Download the mobile app to activate 1-tap AutoPay.
              </div>
            </div>

            {/* Right Column: Categories Selector & Product Grid */}
            <div className="space-y-6">

              {/* Category Chips Bar */}
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
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${isActive
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
                      <span>Select Products for Subscription Card</span>
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
                            className="w-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus size={14} /> Add to Card
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-blue-600 text-white rounded-xl p-1 shadow-sm">
                            <button
                              onClick={() => updateQty(p, -1)}
                              className="w-7 h-7 rounded-lg bg-blue-700 hover:bg-blue-800 flex items-center justify-center font-bold text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-xs px-2">{qty}</span>
                            <button
                              onClick={() => updateQty(p, 1)}
                              className="w-7 h-7 rounded-lg bg-blue-700 hover:bg-blue-800 flex items-center justify-center font-bold text-xs cursor-pointer"
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
          <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">

            {/* Header Metrics Bar */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-300 uppercase tracking-widest block mb-1">
                  Real-time Subscriptions Dashboard
                </span>
                <h2 className="text-2xl font-extrabold" style={{ fontFamily: "'Fraunces', serif" }}>
                  Subscription Order Cards & Delivery Tracking
                </h2>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Track your dynamic subscription cards, view product breakdowns, and download the app to purchase.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl">
                <div className="text-center px-3 border-r border-slate-700">
                  <div className="text-xl font-bold font-mono text-teal-400">{activeCount}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Active Cards</div>
                </div>
                <div className="text-center px-3 border-r border-slate-700">
                  <div className="text-xl font-bold font-mono text-amber-400">{pendingCount}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Pending Setup</div>
                </div>
                <div className="text-center px-3">
                  <div className="text-xl font-bold font-mono text-blue-400">₹{totalWeeklySpend}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Est. Total</div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-400 mr-1 uppercase text-[10px]">Filter:</span>
                {["All", "Active Schedule", "App Setup Pending", "Paused"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${orderFilter === st
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
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
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-full pl-9 pr-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Subscriptions Order Cards List */}
            <div className="space-y-6">
              {filteredOrders.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
                  <FileText size={36} className="text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900">No matching subscription cards found</h3>
                  <p className="text-xs text-slate-500 mb-6">Build a new subscription card or adjust your filter options.</p>
                  <button
                    onClick={() => setViewTab("create")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-colors cursor-pointer"
                  >
                    Build First Subscription Card
                  </button>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div key={ord.orderId} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-5 relative overflow-hidden">

                    {/* Header: Order ID, Status & Quick Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
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

                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        {ord.status === "Active Schedule" && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                            <CheckCircle2 size={14} /> Active Schedule
                          </span>
                        )}
                        {ord.status === "App Setup Pending" && (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                            <AlertCircle size={14} /> App Download Needed
                          </span>
                        )}
                        {ord.status === "Paused" && (
                          <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
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
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Card"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Order Breakdown Grid */}
                    <div className="grid md:grid-cols-3 gap-5 text-xs">
                      {/* Products List */}
                      <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1 mb-2">
                          <ShoppingBasket size={13} /> Subscribed Products ({ord.items.length}):
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
                        {ord.duration && (
                          <div className="text-blue-700 font-semibold text-[11px] bg-blue-50/90 border border-blue-200/90 px-2.5 py-1 rounded-xl">
                            📅 Period: <strong>{ord.duration}</strong>
                          </div>
                        )}
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
                            💳 UPI AutoPay Mandate
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 italic">
                          Automatic doorstep drop by morning time slot.
                        </div>
                      </div>
                    </div>

                    {/* Action Footer -> Select Card for Subscription Purchase via Mobile App */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-blue-50/50 p-3.5 rounded-2xl">
                      <div className="text-blue-900 font-semibold text-xs flex items-center gap-1.5">
                        <Info size={15} className="text-blue-600 shrink-0" />
                        <span>Select this subscription card to complete your purchase after app download.</span>
                      </div>

                      <button
                        onClick={() => handleSelectCardForApp(ord)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
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

      {/* FULL-SCREEN BEAUTIFUL & SPACIOUS SUBSCRIPTION CONFIRMATION OVERLAY (NO SCROLLBAR) */}
      {showAppInstallModal && (
        <div className="fixed inset-0 z-50 bg-[#FAF8F5] text-slate-900 overflow-hidden flex flex-col justify-between p-4 sm:p-8 md:p-12 animate-fade-in">
          
          {/* Top Bar */}
          <div className="max-w-6xl w-full mx-auto flex items-center justify-between shrink-0 pb-2 border-b border-slate-200/80">
            <button
              onClick={() => setShowAppInstallModal(false)}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-full shadow-xs"
            >
              <ArrowLeft size={16} /> Back to Subscription Builder
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
              <CheckCircle2 size={15} /> Card Added to Order Tracking
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
          <div className="max-w-6xl w-full mx-auto my-auto py-4 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            
            {/* LEFT COLUMN: Confirmation Info & Card Details */}
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-3.5 py-1 rounded-full text-xs font-extrabold">
                  <Smartphone size={15} /> FillCarts App Purchase
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                  Complete Purchase via FillCarts App
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Aapka subscription card successfully order tracking mein add ho gaya hai! Mobile App download karke 1-tap AutoPay complete karein aur apni regular delivery start karein.
                </p>
              </div>

              {/* Card Summary Box */}
              {selectedCardForAppInstall && (
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-sm space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="font-extrabold text-sm text-slate-900">{selectedCardForAppInstall.name || "Subscription Card"}</span>
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
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
                      <span className="text-blue-600 font-bold">{selectedCardForAppInstall.frequency || "Daily"}</span>
                    </div>
                  </div>

                  {selectedCardForAppInstall.duration && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-400 font-semibold block text-[11px]">Subscription Validity</span>
                      <span className="text-blue-700 font-bold block">
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
                    <span className="text-blue-600 font-mono text-lg">₹{selectedCardForAppInstall.total || 0}</span>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: QR Code Card & App Install Action */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
              
              <div className="space-y-3">
                <div className="w-32 h-32 bg-slate-50 p-2.5 rounded-3xl border border-slate-200 shadow-inner flex items-center justify-center mx-auto">
                  <QrCode size={110} className="text-slate-900" />
                </div>

                <div>
                  <div className="font-extrabold text-slate-900 text-base">Scan QR to Install App</div>
                  <div className="text-slate-500 text-xs mt-1">Point phone camera to install FillCarts directly on Android & iOS.</div>
                  <div className="text-emerald-600 font-bold text-xs mt-2 inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    <CheckCircle2 size={14} /> Instant Account Sync Enabled
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="#download-playstore"
                    onClick={() => alert("Downloading FillCarts for Android...")}
                    className="bg-slate-900 hover:bg-slate-950 text-white py-3.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Download size={16} /> Google Play
                  </a>
                  <a
                    href="#download-appstore"
                    onClick={() => alert("Downloading FillCarts for iOS...")}
                    className="bg-slate-900 hover:bg-slate-950 text-white py-3.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
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
          <div className="max-w-6xl w-full mx-auto text-center shrink-0 pt-2 border-t border-slate-200/80">
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

