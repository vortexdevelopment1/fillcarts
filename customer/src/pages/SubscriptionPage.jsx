import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronRight, Repeat, Clock, Milk, ShoppingBasket, ShoppingBag,
  Sparkles, Star, Plus, Minus, Trash2,
  X, Search, SlidersHorizontal, ShieldCheck, Download, Smartphone, QrCode,
  ArrowRight, ArrowLeft, Carrot, Apple, Croissant, CheckCircle2, Info,
  Calendar, MapPin, PauseCircle, PlayCircle, Edit3, AlertCircle, Zap,
  ChevronDown, HelpCircle, Check, Send, Layers, CheckCircle, Package, ArrowUpRight, ShoppingCart, Lock
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../utils/productImages";
import api from "../api";

// Subscription Categories
const categories = [
  { key: "dairy", name: "Dairy & Milk", icon: Milk, color: "text-[#16A34A]", bg: "bg-[#ECFDF3]" },
  { key: "bakery", name: "Bakery & Breads", icon: Croissant, color: "text-[#F59E0B]", bg: "bg-amber-50" },
  { key: "fruits", name: "Fresh Fruits & Veg", icon: Apple, color: "text-[#16A34A]", bg: "bg-[#ECFDF3]" },
  { key: "grocery", name: "Daily Groceries", icon: Carrot, color: "text-[#16A34A]", bg: "bg-[#ECFDF3]" },
];

const productNames = {
  dairy: ["Amul Toned Milk 1L", "Fresh Curd 400g", "Paneer 200g", "Amul Butter 100g", "Cheese Slices 200g", "Pure Cow Ghee 500ml", "Masala Buttermilk 200ml", "Flavoured Greek Yogurt"],
  bakery: ["Whole Wheat Brown Bread", "Butter Croissant 2pc", "Chocolate Muffin 2pc", "Multigrain Bread 400g", "Fresh Burger Buns 4pc", "Butter Cookies 200g", "Cup Cakes 4pc", "Crispy Toast Rusk 200g"],
  fruits: ["Fresh Robusta Bananas 1dz", "Red Royal Apples 1kg", "Fresh Onions 1kg", "Hybrid Red Tomatoes 1kg", "Fresh Potatoes 1kg", "Green Seedless Grapes 500g", "Organic Spinach Bunch", "Fresh Carrots 500g"],
  grocery: ["Basmati Rice 5kg", "Unpolished Toor Dal 1kg", "Sunflower Cooking Oil 1L", "Refined Sugar 1kg", "Chakki Fresh Atta 5kg", "Iodized Salt 1kg", "Premium Tea Leaves 250g", "Thick Poha 500g"],
};

const ALL_WEEKDAYS = [
  "Every Monday", "Every Tuesday", "Every Wednesday",
  "Every Thursday", "Every Friday", "Every Saturday", "Every Sunday"
];

function genProducts(catKey) {
  const names = productNames[catKey] || [];
  return names.map((name, i) => {
    const basePrice = 39 + ((i * 37) % 260);
    const mrp = basePrice + 20 + (i % 3) * 10;
    const subPrice = Math.round(basePrice * 0.9);
    return {
      id: `${catKey}-${i}`,
      name,
      categoryKey: catKey,
      price: basePrice,
      subPrice: subPrice,
      mrp: mrp,
      rating: (4.2 + ((i * 3) % 8) / 10).toFixed(1),
      unit: catKey === "dairy" ? "1 Litre" : catKey === "fruits" || catKey === "grocery" ? "1 Kg" : "1 Pack",
    };
  });
}

// 4 Core Subscription Benefits
const subscriptionBenefits = [
  {
    icon: Zap,
    title: "Express Morning Slots",
    desc: "Guaranteed doorstep drop before 8:00 AM every morning.",
    bg: "bg-[#ECFDF3]",
    color: "text-[#16A34A]"
  },
  {
    icon: ShieldCheck,
    title: "10% Member Savings",
    desc: "Flat 10% subscriber discount applied automatically on every order.",
    bg: "bg-amber-50",
    color: "text-[#F59E0B]"
  },
  {
    icon: PauseCircle,
    title: "Pause or Skip Anytime",
    desc: "Going on holiday? Pause deliveries with 1-tap in your dashboard.",
    bg: "bg-blue-50",
    color: "text-blue-600"
  },
  {
    icon: Repeat,
    title: "Flexible Schedules",
    desc: "Choose daily, weekly, alternate days, or custom weekly delivery days.",
    bg: "bg-purple-50",
    color: "text-purple-600"
  }
];

// Steps Metadata for Visual Wizard Stepper
const STEPS = [
  { id: 1, key: "product", title: "Select Product", subtitle: "Choose item for subscription" },
  { id: 2, key: "purchase_type", title: "Product Details & Choice", subtitle: "View details & subscription option" },
  { id: 3, key: "frequency", title: "Select Frequency", subtitle: "Daily, Weekly or Monthly" },
  { id: 4, key: "delivery_days", title: "Delivery Day & Start", subtitle: "Pick days & start date" },
  { id: 5, key: "quantity_time", title: "Quantity & Time", subtitle: "Quantity & morning slot" },
  { id: 6, key: "review", title: "Review Subscription", subtitle: "Verify & confirm details" }
];

// Subscription FAQ List
const subscriptionFaqs = [
  {
    q: "How does FillCarts Subscription work on the website?",
    a: "Select your daily essential product, open the full details, click 'Subscribe & Save 10%' to start scheduling your preferred delivery frequency and morning time slot, and confirm your plan summary!"
  },
  {
    q: "Why is payment done in the Mobile App instead of website?",
    a: "Recurring subscriptions require 1-tap UPI AutoPay or wallet mandates supported securely inside our Mobile App. On the website, you configure your plan and seamlessly activate payment in the App."
  },
  {
    q: "Can I pause or skip my subscription when I travel?",
    a: "Yes! You can pause or resume active subscriptions anytime from your 'My Subscriptions' dashboard with 1 click. You won't be charged for paused days."
  },
  {
    q: "Is there any extra delivery charge for subscriptions?",
    a: "No! All subscription plans enjoy 100% free delivery on scheduled morning shifts."
  }
];

// Dummy Presets for Visual Flow Simulator & Testing
const DUMMY_PRESETS = {
  daily_milk: {
    key: "daily_milk",
    title: "Daily Milk Pack",
    productName: "Amul Toned Milk 1L Pack",
    categoryKey: "dairy",
    price: 56,
    subPrice: 50,
    mrp: 62,
    unit: "1 Litre",
    rating: "4.9",
    frequency: "Daily",
    selectedDays: ["Every Monday", "Every Tuesday", "Every Wednesday", "Every Thursday", "Every Friday", "Every Saturday", "Every Sunday"],
    quantity: 1,
    timeSlot: "Morning (6 AM - 12 PM)",
    duration: "Until Cancelled",
    estimatedMonthlySavings: 360,
    badge: "Most Popular Daily Essential",
    tagline: "Fresh milk at your doorstep every morning before 8:00 AM"
  },
  weekly_bakery: {
    key: "weekly_bakery",
    title: "Weekly Bakery Drop",
    productName: "Whole Wheat Brown Bread + Butter Croissants",
    categoryKey: "bakery",
    price: 135,
    subPrice: 120,
    mrp: 150,
    unit: "1 Breakfast Pack",
    rating: "4.8",
    frequency: "Weekly",
    selectedDays: ["Every Tuesday", "Every Friday"],
    quantity: 1,
    timeSlot: "Morning (6 AM - 12 PM)",
    duration: "1 Month (30 Days Plan)",
    estimatedMonthlySavings: 180,
    badge: "Bakery & Breakfast Combo",
    tagline: "Oven fresh bread & muffins delivered twice a week"
  },
  alternate_fruits: {
    key: "alternate_fruits",
    title: "Alternate Fruits Basket",
    productName: "Robusta Bananas 1dz & Red Apples 1kg",
    categoryKey: "fruits",
    price: 210,
    subPrice: 189,
    mrp: 240,
    unit: "1 Fresh Basket",
    rating: "4.7",
    frequency: "Alternate Days",
    selectedDays: ["Every 2 Days (Mon, Wed, Fri, Sun)"],
    quantity: 1,
    timeSlot: "Morning (6 AM - 12 PM)",
    duration: "Until Cancelled",
    estimatedMonthlySavings: 315,
    badge: "Organic Farm Harvest",
    tagline: "Hand-picked fresh fruits delivered every 2 days"
  },
  monthly_grocery: {
    key: "monthly_grocery",
    title: "Monthly Pantry Staples",
    productName: "Basmati Rice 5kg & Chakki Fresh Atta 5kg",
    categoryKey: "grocery",
    price: 950,
    subPrice: 855,
    mrp: 1050,
    unit: "1 Staples Bundle",
    rating: "4.9",
    frequency: "Monthly",
    selectedDays: ["1st of every month"],
    quantity: 1,
    timeSlot: "Morning (6 AM - 12 PM)",
    duration: "3 Months Plan",
    estimatedMonthlySavings: 285,
    badge: "Bulk Monthly Savings",
    tagline: "Heavy grocery items auto-delivered on the 1st of every month"
  }
};

// 4-Stage Daily Delivery Lifecycle Timeline
const DELIVERY_TIMELINE = [
  {
    step: "01",
    time: "08:00 PM (Night Before)",
    title: "Automated Batch Generation",
    desc: "System compiles active subscriptions, updates inventory & assigns nearest rider batch.",
    status: "Auto-Scheduled",
    color: "bg-[#ECFDF3] text-[#166534] border-emerald-200"
  },
  {
    step: "02",
    time: "02:00 AM (Overnight)",
    title: "Farm & Dairy Sourcing",
    desc: "Fresh milk & produce received directly from local dairy farms and temperature-checked.",
    status: "Quality Checked",
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    step: "03",
    time: "06:15 AM (Early Morning)",
    title: "Cold-Chain Express Dispatch",
    desc: "Insulated rider bags loaded; optimized morning route active for doorstep delivery.",
    status: "Out for Delivery",
    color: "bg-amber-50 text-amber-800 border-amber-200"
  },
  {
    step: "04",
    time: "Before 07:30 AM",
    title: "Silent Doorstep Drop",
    desc: "Package left silently at doorstep. Instant App notification & WhatsApp receipt dispatched.",
    status: "Delivered Guaranteed",
    color: "bg-emerald-50 text-[#166534] border-emerald-300"
  }
];

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userLocation, addToCart } = useCart();

  const getCustomerAddress = (u, loc) => {
    if (u) {
      if (typeof u.address === "string" && u.address.trim()) {
        return u.address + (u.pincode ? `, Pincode: ${u.pincode}` : "");
      }
      if (u.address_line) {
        return `${u.address_line}${u.city ? `, ${u.city}` : ""}${u.pincode ? `, Pincode: ${u.pincode}` : ""}`;
      }
      if (u.city || u.pincode || u.area) {
        return `${u.area || ""}, ${u.city || ""} (${u.pincode || ""})`.trim();
      }
    }
    if (loc && (loc.formatted || loc.area || loc.city)) {
      return loc.formatted || `${loc.area || ""}, ${loc.city || ""} (${loc.pincode || ""})`.trim();
    }
    return "Vijay Nagar, Indore (452010)";
  };

  const initialSubscribeProduct = location.state?.subscribeProduct;

  // Primary Navigation View Tab: "wizard" (Step-by-step builder), "visual_flow" (Reference Diagram Map), "my_subscriptions" (Dashboard)
  const [viewTab, setViewTab] = useState(() => {
    if (location.state?.tab === "my_subscriptions") return "my_subscriptions";
    return "wizard";
  });

  // Current Active Step in the 6-Step Wizard (1 to 6)
  const [currentStep, setCurrentStep] = useState(1);

  // Track completed steps explicitly
  const [completedSteps, setCompletedSteps] = useState(() => {
    if (initialSubscribeProduct) return [1];
    return [];
  });

  // Selected Product for Subscription Flow
  const [activeCategory, setActiveCategory] = useState(() => {
    if (initialSubscribeProduct?.categoryKey) return initialSubscribeProduct.categoryKey;
    return "dairy";
  });

  const [selectedProduct, setSelectedProduct] = useState(() => {
    if (initialSubscribeProduct) {
      return {
        id: initialSubscribeProduct.id || `sub-prod-${Date.now()}`,
        name: initialSubscribeProduct.name,
        categoryKey: initialSubscribeProduct.categoryKey || "dairy",
        price: initialSubscribeProduct.price || 56,
        subPrice: Math.round((initialSubscribeProduct.price || 56) * 0.9),
        mrp: initialSubscribeProduct.mrp || 62,
        rating: "4.8",
        unit: "1 Litre"
      };
    }
    return null; // Start with NO pre-selected product!
  });

  // Flow State Inputs
  const [purchaseType, setPurchaseType] = useState("subscribe"); // "one_time" | "subscribe"
  const [frequency, setFrequency] = useState("Weekly"); // "Daily", "Weekly", "Monthly", "Alternate Days"
  const [selectedDays, setSelectedDays] = useState(["Every Tuesday"]); // ["Every Tuesday"] by default for weekly

  const todayStrDate = new Date().toISOString().split("T")[0];
  const tomorrowStrDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [monthlyCustomDate, setMonthlyCustomDate] = useState(() => todayStrDate);
  const [startDateOption, setStartDateOption] = useState("tomorrow"); // "tomorrow" | "custom"
  const [startDate, setStartDate] = useState(tomorrowStrDate);
  const [durationType, setDurationType] = useState("until_cancelled"); // "until_cancelled", "1_month", "7_days", "3_months"

  const [quantity, setQuantity] = useState(1);
  const [timeSlot, setTimeSlot] = useState("Morning (6 AM - 12 PM)"); // "Morning (6 AM - 12 PM)", "Afternoon (12 PM - 4 PM)", "Evening (4 PM - 8 PM)"

  const [customCardTitle, setCustomCardTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [userAddress, setUserAddress] = useState(() => getCustomerAddress(user, userLocation));
  const [openFaq, setOpenFaq] = useState(null);

  // App Checkout Modal Handoff State
  const [showAppCheckoutModal, setShowAppCheckoutModal] = useState(false);
  const [activeCardForAppCheckout, setActiveCardForAppCheckout] = useState(null);
  const [smsPhone, setSmsPhone] = useState("");
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  // Filter & Search for My Subscriptions Tab
  const [orderFilter, setOrderFilter] = useState("All");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Interactive Visual Flow Inspector & Preset Dummy Data State
  const [inspectStep, setInspectStep] = useState(1);
  const [activePresetKey, setActivePresetKey] = useState("daily_milk");

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Frequency Selection Handler - Auto sets delivery days according to user requirements!
  const handleFrequencyChange = (newFreq) => {
    setFrequency(newFreq);
    if (newFreq === "Daily") {
      // Daily: All 7 days automatically selected & ticked!
      setSelectedDays(ALL_WEEKDAYS);
    } else if (newFreq === "Weekly") {
      // Weekly: Default to 1 day, user can click to select day
      setSelectedDays(["Every Tuesday"]);
    } else if (newFreq === "Monthly") {
      // Monthly: Date selection (e.g. 1st of every month)
      setSelectedDays(["1st of every month"]);
    } else if (newFreq === "Alternate Days") {
      // Alternate Days: Every 2 days or 3 days
      setSelectedDays(["Every 2 Days (Mon, Wed, Fri, Sun)"]);
    }
  };

  useEffect(() => {
    const fetched = getCustomerAddress(user, userLocation);
    if (fetched) {
      setUserAddress(fetched);
    }
  }, [user, userLocation]);

  const getStorageKey = (u) => {
    if (!u) return "fillcarts_subscription_orders_guest";
    return `fillcarts_subscription_orders_${u.id || u.phone || u.email || 'user'}`;
  };

  // Persistent Subscription Cards State
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
    return [
      {
        orderId: "SUB-ORD-8492",
        name: "Amul Toned Milk Subscription",
        productName: "Amul Toned Milk",
        unit: "1 Litre",
        items: [{ name: "Amul Toned Milk", qty: 2, price: 50.40 }],
        frequency: "Weekly",
        deliveryDay: "Every Tuesday",
        timeSlot: "Morning (6 AM - 12 PM)",
        duration: "Until Cancelled",
        startDate: "30 Jul 2024",
        status: "App Setup Pending",
        orderDate: "Created recently",
        address: "Vijay Nagar, Indore (452010)",
        total: 100.80,
        monthlySavings: 120
      }
    ];
  });

  // Sync localStorage
  useEffect(() => {
    try {
      const key = getStorageKey(user);
      if (key) {
        localStorage.setItem(key, JSON.stringify(myOrders));
      }
    } catch (e) {}
  }, [myOrders, user]);

  // Handle incoming location state & event listener updates
  useEffect(() => {
    if (location.state?.tab) {
      setViewTab(location.state.tab);
    }
    if (location.state?.subscribeProduct) {
      const sp = location.state.subscribeProduct;
      setSelectedProduct({
        id: sp.id || `sub-prod-${Date.now()}`,
        name: sp.name,
        categoryKey: sp.categoryKey || "dairy",
        price: sp.price || 56,
        subPrice: Math.round((sp.price || 56) * 0.9),
        mrp: sp.mrp || 62,
        rating: "4.8",
        unit: "1 Litre"
      });
      setViewTab("wizard");
      setCompletedSteps([1]);
      setCurrentStep(2); // Jump directly to Choose Purchase Type when coming from Product Detail!
    }
  }, [location.state]);

  // Fetch saved addresses if available
  useEffect(() => {
    if (user) {
      api.get("/addresses")
        .then((res) => {
          setSavedAddresses(res.data.addresses || []);
        })
        .catch(() => {});
    }
  }, [user]);

  // Active Category Products List
  const activeCategoryProducts = useMemo(() => {
    let list = genProducts(activeCategory);
    if (searchQuery.trim()) {
      list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  }, [activeCategory, searchQuery]);

  // Price calculations for currently selected product & quantity
  const unitRegularPrice = selectedProduct?.price || 56;
  const unitSubscriberPrice = selectedProduct?.subPrice || Math.round(unitRegularPrice * 0.9);
  const currentUnitPrice = purchaseType === "subscribe" ? unitSubscriberPrice : unitRegularPrice;
  const totalPricePerDelivery = Math.round(currentUnitPrice * quantity);
  const estimatedMonthlySavings = Math.round((unitRegularPrice - unitSubscriberPrice) * quantity * (frequency === "Daily" ? 30 : frequency === "Weekly" ? 4 : 15));

  // Toggle delivery days selection for Weekly mode
  const handleToggleDay = (dayName) => {
    if (frequency === "Weekly") {
      if (selectedDays.includes(dayName)) {
        if (selectedDays.length === 1) return; // keep at least 1
        setSelectedDays(prev => prev.filter(d => d !== dayName));
      } else {
        setSelectedDays(prev => [...prev, dayName]);
      }
    }
  };

  // Select Product in Step 1 -> Opens Full Product Details (Step 2)
  const handleSelectProductToDetail = (prod) => {
    setSelectedProduct(prod);
    setCompletedSteps(prev => Array.from(new Set([...prev, 1])));
    setCurrentStep(2);
  };

  // Step Navigation Handlers
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedProduct) {
        alert("Please select a product from the list to continue.");
        return;
      }
      setCompletedSteps(prev => Array.from(new Set([...prev, 1])));
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2 && purchaseType === "one_time") {
      // One-time purchase: Add to Cart and navigate to Cart Page directly!
      if (addToCart && selectedProduct) {
        addToCart({
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: unitRegularPrice,
          mrp: selectedProduct.mrp,
          unit: selectedProduct.unit,
          categoryKey: selectedProduct.categoryKey,
          quantity: quantity || 1
        });
      }
      navigate("/cart");
      return;
    }

    // MANDATORY LOGIN CHECK FOR SUBSCRIPTION FLOW!
    if (purchaseType === "subscribe" && !user) {
      alert("Subscription create karne ke liye Log In hona mandatory hai. Kripya pehle Log In karein.");
      navigate("/login", { state: { from: "/subscription" } });
      return;
    }

    if (currentStep < 6) {
      setCompletedSteps(prev => Array.from(new Set([...prev, currentStep])));
      setCurrentStep(prev => prev + 1);
    } else {
      setCompletedSteps(prev => Array.from(new Set([...prev, 6])));
      handleCompleteWebFlow();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Stepper Header Node Click Handler
  const handleStepperNodeClick = (targetStepId) => {
    if (targetStepId > 2 && purchaseType === "subscribe" && !user) {
      alert("Subscription scheduling ke liye Log In hona zaroori hai. Kripya Login karein.");
      navigate("/login", { state: { from: "/subscription" } });
      return;
    }
    if (targetStepId === 1 || completedSteps.includes(targetStepId - 1) || targetStepId === currentStep) {
      setCurrentStep(targetStepId);
    }
  };

  // Complete Web Flow -> Save Card to Dashboard & Open Mobile App Handoff Modal (NO PAYMENT ON WEB)
  const handleCompleteWebFlow = () => {
    if (!user) {
      alert("Subscription card save & checkout karne ke liye Log In hona mandatory hai.");
      navigate("/login", { state: { from: "/subscription" } });
      return;
    }

    if (!selectedProduct) return;

    const newOrderId = `SUB-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const cardTitle = customCardTitle.trim() || `${selectedProduct.name} Subscription`;

    const formattedStartDate = new Date(startDate || tomorrowStrDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    let formattedDuration = "Until Cancelled";
    if (durationType === "1_month") formattedDuration = "1 Month Plan (30 Days)";
    else if (durationType === "7_days") formattedDuration = "7 Days Trial Plan";
    else if (durationType === "3_months") formattedDuration = "3 Months Plan";

    const newCard = {
      orderId: newOrderId,
      name: cardTitle,
      productName: selectedProduct.name,
      unit: selectedProduct.unit,
      items: [{ name: selectedProduct.name, qty: quantity, price: currentUnitPrice }],
      frequency: frequency,
      deliveryDay: selectedDays.join(", "),
      timeSlot: timeSlot,
      duration: formattedDuration,
      startDate: formattedStartDate,
      status: "App Setup Pending",
      orderDate: `Created on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`,
      address: typeof userAddress === "object" ? (userAddress?.address_line || "Home Address") : String(userAddress || "Vijay Nagar, Indore"),
      total: totalPricePerDelivery,
      monthlySavings: Math.max(20, estimatedMonthlySavings)
    };

    setMyOrders(prev => [newCard, ...prev]);
    setActiveCardForAppCheckout(newCard);
    setShowAppCheckoutModal(true);
    setViewTab("my_subscriptions");
  };

  // Toggle Subscription Status (Pause / Activate)
  const handleToggleStatus = (ord) => {
    if (!ord) return;
    if (ord.status === "Active Schedule") {
      setMyOrders(prev => prev.map(item => {
        if (item.orderId === ord.orderId) {
          return { ...item, status: "Paused" };
        }
        return item;
      }));
    } else {
      // Must download/checkout in App for subscription activation!
      setActiveCardForAppCheckout(ord);
      setShowAppCheckoutModal(true);
    }
  };

  // Delete / Cancel Subscription Card
  const handleDeleteCard = (orderId) => {
    if (window.confirm("Are you sure you want to cancel and remove this subscription card?")) {
      setMyOrders(prev => prev.filter(ord => ord.orderId !== orderId));
    }
  };

  // Send SMS Download Link Handler
  const handleSendSmsLink = (e) => {
    e.preventDefault();
    if (!smsPhone.trim() || smsPhone.trim().length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setSmsSentNotice(true);
    setTimeout(() => setSmsSentNotice(false), 5000);
  };

  // Filtered & Searched Orders for Tracking Tab
  const filteredOrders = useMemo(() => {
    return myOrders.filter(ord => {
      if (orderFilter !== "All" && ord.status !== orderFilter) return false;
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

  const activeCount = useMemo(() => myOrders.filter(o => o.status === "Active Schedule").length, [myOrders]);
  const pendingCount = useMemo(() => myOrders.filter(o => o.status === "App Setup Pending").length, [myOrders]);
  const totalMonthlySavingsSum = useMemo(() => myOrders.reduce((sum, o) => sum + (o.monthlySavings || 120), 0), [myOrders]);

  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Shared Navbar */}
      <Navbar />

      {/* HERO SECTION WITH VIEW SWITCHER */}
      <section className="bg-gradient-to-b from-[#ECFDF3] via-[#F0FDF4]/80 to-[#FFFCF5] border-b border-emerald-200/50 py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl pl-2 sm:pl-6 md:pl-8 lg:pl-10">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#166534] bg-white px-3.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
              <Sparkles size={13} className="text-[#16A34A]" /> FILLCARTS SUBSCRIPTION FLOW
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#17231A] tracking-tight leading-tight">
              Seamless. Flexible. Hassle-free.
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
              Select product, open full details, click 'Subscribe & Save 10%' to configure your morning schedule, and complete checkout in the Fillcart App!
            </p>
          </div>

          {/* Navigation View Switcher */}
          <div className="bg-white border border-emerald-200 p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap gap-2 shadow-2xs shrink-0">
            <button
              onClick={() => setViewTab("wizard")}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                viewTab === "wizard"
                  ? "bg-[#16A34A] text-white shadow-sm"
                  : "text-[#166534] hover:bg-[#ECFDF3]"
              }`}
            >
              <Repeat size={14} /> Step-by-Step Flow Wizard
            </button>
            <button
              onClick={() => {
                if (!user) {
                  alert("My Subscriptions dashboard view karne ke liye Log In hona zaroori hai.");
                  navigate("/login", { state: { from: "/subscriptions" } });
                  return;
                }
                setViewTab("my_subscriptions");
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                viewTab === "my_subscriptions"
                  ? "bg-[#16A34A] text-white shadow-sm"
                  : "text-[#166534] hover:bg-[#ECFDF3]"
              }`}
            >
              <FileTextIcon size={14} /> My Subscriptions ({myOrders.length})
            </button>
          </div>
        </div>
      </section>

      {/* MAIN BODY CONTENT (Expanded Full Screen Width) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-10 flex-1 w-full text-left">

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: STEP-BY-STEP INTERACTIVE SUBSCRIPTION FLOW WIZARD     */}
        {/* ------------------------------------------------------------- */}
        {viewTab === "wizard" && (
          <div className="space-y-8 w-full">

            {/* MANDATORY LOGIN WARNING BANNER FOR NON-LOGGED-IN USERS */}
            {!user && (
              <div className="bg-amber-50 border border-amber-300 rounded-3xl p-4 sm:p-5 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-200/70 text-amber-800 flex items-center justify-center font-bold shrink-0">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-amber-950">Log In Required for Subscription</h4>
                    <p className="text-amber-800 text-xs font-semibold mt-0.5">
                      Subscription scheduling & member discount benefits rely on your account. Please Log In to configure subscription plans.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/login", { state: { from: "/subscription" } })}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                >
                  Log In Now ➔
                </button>
              </div>
            )}

            {/* STEP PROGRESS BAR INDICATOR (Steps 1 to 6) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase text-[#166534] tracking-wider block">
                    Step {currentStep} of 6
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#17231A]">
                    {STEPS.find(s => s.id === currentStep)?.title}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400">Progress</span>
                  <div className="text-sm font-black font-mono text-[#16A34A]">
                    {Math.round((currentStep / 6) * 100)}%
                  </div>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#16A34A] h-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                />
              </div>

              {/* Stepper Node Chips */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                {STEPS.map((s) => {
                  const isCompleted = completedSteps.includes(s.id);
                  const isCurrent = s.id === currentStep;
                  const isNavigable = s.id === 1 || completedSteps.includes(s.id - 1) || isCurrent;

                  return (
                    <button
                      key={s.id}
                      onClick={() => isNavigable && handleStepperNodeClick(s.id)}
                      disabled={!isNavigable}
                      className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between ${
                        isCurrent
                          ? "bg-[#ECFDF3] border-[#16A34A] ring-2 ring-[#16A34A]/20 shadow-2xs cursor-pointer"
                          : isCompleted
                          ? "bg-emerald-50/70 border-emerald-300 text-slate-800 cursor-pointer"
                          : "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center ${
                          isCompleted
                            ? "bg-[#16A34A] text-white"
                            : isCurrent
                            ? "bg-[#166534] text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}>
                          {isCompleted ? "✓" : s.id}
                        </span>
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />}
                      </div>
                      <div className="text-[11px] font-bold mt-1 line-clamp-1 text-[#17231A]">
                        {s.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* WIZARD CONTENT CONTAINER (Full screen width; Live Summary panel appears ONLY at Step 6 Review!) */}
            <div className={currentStep === 6 ? "grid lg:grid-cols-[1fr_380px] gap-8 items-start w-full" : "w-full space-y-6"}>

              {/* MAIN STEP FORM CARD */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-2xs space-y-6 w-full">

                {/* STEP 1: COMPACT PRODUCT CARDS GRID (NO PRE-SELECTION!) */}
                {currentStep === 1 && (
                  <div className="space-y-6 w-full">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-lg font-extrabold text-[#17231A]">1. Select Product for Subscription</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Click any product to view its full details and start your subscription.</p>
                    </div>

                    {/* Category Selector Chips */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold text-[#166534] uppercase tracking-wider">Choose Category</label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((c) => {
                          const IconComp = c.icon;
                          const isActive = activeCategory === c.key;
                          return (
                            <button
                              key={c.key}
                              onClick={() => setActiveCategory(c.key)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all border cursor-pointer ${
                                isActive
                                  ? "bg-[#16A34A] text-white border-[#16A34A] shadow-2xs"
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

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input
                        type="text"
                        placeholder="Search milk, curd, bread, apples, rice..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#FFFCF5] border border-slate-200 text-xs font-semibold rounded-2xl pl-9 pr-4 py-2.5 w-full focus:outline-none focus:border-[#16A34A]"
                      />
                    </div>

                    {/* Sleek & Compact Products Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 pt-2">
                      {activeCategoryProducts.map((p) => {
                        const isSelected = selectedProduct?.id === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => handleSelectProductToDetail(p)}
                            className={`border rounded-2xl p-2.5 sm:p-3 transition-all cursor-pointer relative flex flex-col justify-between space-y-2 hover:shadow-md group ${
                              isSelected
                                ? "bg-[#ECFDF3] border-[#16A34A] ring-2 ring-[#16A34A]/30 shadow-sm"
                                : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-[#FFFCF5]"
                            }`}
                          >
                            <div>
                              <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2 relative h-28 sm:h-36 w-full">
                                <img
                                  src={getProductImage(p.name, p.categoryKey || activeCategory)}
                                  alt={p.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                />
                                <div className="absolute top-1.5 left-1.5 bg-[#16A34A] text-white px-1.5 py-0.5 rounded-full text-[9px] font-black shadow-2xs leading-none">
                                  10% OFF
                                </div>
                                {isSelected && (
                                  <div className="absolute top-1.5 right-1.5 bg-[#16A34A] text-white w-5 h-5 rounded-full flex items-center justify-center shadow-2xs">
                                    <Check size={12} />
                                  </div>
                                )}
                              </div>

                              <div className="font-bold text-xs text-[#17231A] line-clamp-1 group-hover:text-[#16A34A] transition-colors">{p.name}</div>
                              <div className="text-[11px] text-slate-400 font-semibold">{p.unit} • ⭐ {p.rating}</div>

                              <div className="flex items-baseline gap-1.5 mt-1.5">
                                <span className="font-mono text-xs sm:text-sm font-black text-[#166534]">₹{p.subPrice}</span>
                                <span className="font-mono text-[10px] text-slate-400 line-through">₹{p.mrp}</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectProductToDetail(p);
                              }}
                              className="w-full py-1.5 px-2 rounded-xl text-[11px] font-extrabold bg-[#ECFDF3] hover:bg-[#16A34A] text-[#166534] hover:text-white border border-emerald-200 transition-all flex items-center justify-center gap-1 cursor-pointer mt-1"
                            >
                              <span>View Details</span> <ArrowRight size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: FULL PRODUCT DETAIL & PURCHASE CHOICE */}
                {currentStep === 2 && selectedProduct && (
                  <div className="space-y-6 w-full">
                    <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-extrabold text-[#17231A]">2. Product Details & Purchase Choice</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Click 'Subscribe & Save 10%' to start configuring your morning subscription schedule.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-xs font-bold text-[#166534] hover:underline flex items-center gap-1 bg-[#ECFDF3] px-3 py-1.5 rounded-full border border-emerald-200 cursor-pointer"
                      >
                        <ArrowLeft size={13} /> Change Product
                      </button>
                    </div>

                    {/* Rich Full Product Showcase Screen */}
                    <div className="grid md:grid-cols-12 gap-6 bg-[#FFFCF5] p-5 sm:p-8 rounded-3xl border border-slate-200 items-center w-full">
                      <div className="md:col-span-5 aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-2xs max-h-80 mx-auto w-full">
                        <img
                          src={getProductImage(selectedProduct.name, selectedProduct.categoryKey || activeCategory)}
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-7 space-y-4">
                        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 size={13} className="text-[#16A34A]" /> Daily Essential Available for Subscription
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17231A]">{selectedProduct.name}</h2>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                          <span>Pack Size: <strong>{selectedProduct.unit}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 font-bold">
                            <Star size={12} className="fill-amber-400 text-amber-400" /> {selectedProduct.rating} (1,200+ Subscriber Orders)
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                          Freshly sourced daily essential item. Subscribe to get guaranteed doorstep drops before 8:00 AM every morning with flat 10% member savings.
                        </p>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Regular Price</span>
                            <span className="text-lg font-mono font-black text-slate-900">₹{unitRegularPrice}</span>
                          </div>
                          <div className="bg-[#ECFDF3] p-3 rounded-2xl border border-emerald-300 space-y-0.5">
                            <span className="text-[10px] font-bold text-[#166534] uppercase block">Subscriber Price (-10%)</span>
                            <span className="text-lg font-mono font-black text-[#166534]">₹{unitSubscriberPrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Purchase Choice Radio Cards */}
                    <div className="space-y-3 pt-2">
                      <label className="block text-xs font-extrabold text-[#17231A] uppercase tracking-wider">Choose Purchase Option</label>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* One Time Purchase Card */}
                        <div
                          onClick={() => setPurchaseType("one_time")}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                            purchaseType === "one_time"
                              ? "bg-[#ECFDF3] border-[#16A34A] ring-2 ring-[#16A34A]/20 shadow-sm"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-700 uppercase">One-time Purchase</span>
                            <input
                              type="radio"
                              name="purchase_type"
                              checked={purchaseType === "one_time"}
                              onChange={() => setPurchaseType("one_time")}
                              className="accent-[#16A34A] w-4 h-4"
                            />
                          </div>
                          <div>
                            <div className="text-2xl font-black text-[#17231A] font-mono">₹{unitRegularPrice}</div>
                            <div className="text-xs text-slate-500 font-medium mt-1">Single delivery to your doorstep today or tomorrow.</div>
                          </div>
                        </div>

                        {/* Subscribe & Save 10% Card (Recommended) */}
                        <div
                          onClick={() => setPurchaseType("subscribe")}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                            purchaseType === "subscribe"
                              ? "bg-[#ECFDF3] border-[#16A34A] ring-2 ring-[#16A34A]/20 shadow-md"
                              : "bg-white border-slate-200 hover:border-emerald-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-[#166534] uppercase flex items-center gap-1">
                              <Sparkles size={13} className="text-[#16A34A]" /> Subscribe & Save 10%
                            </span>
                            <input
                              type="radio"
                              name="purchase_type"
                              checked={purchaseType === "subscribe"}
                              onChange={() => setPurchaseType("subscribe")}
                              className="accent-[#16A34A] w-4 h-4"
                            />
                          </div>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-[#166534] font-mono">₹{unitSubscriberPrice}</span>
                              <span className="text-xs text-slate-400 line-through font-mono">₹{unitRegularPrice}</span>
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Save 10%</span>
                            </div>
                            <div className="text-xs text-[#166534] font-semibold mt-1">
                              Deliver automatically on preferred morning slot. Cancel anytime.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: SELECT SUBSCRIPTION FREQUENCY */}
                {currentStep === 3 && (
                  <div className="space-y-6 w-full">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-lg font-extrabold text-[#17231A]">3. Select Subscription Frequency</h3>
                      <p className="text-xs text-slate-500 mt-0.5">How often do you want {selectedProduct?.name} delivered to your door?</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { key: "Daily", title: "Daily / Every Day", sub: "Deliver every single day (Mon-Sun)", desc: "All 7 days auto-ticked ✓" },
                        { key: "Weekly", title: "Weekly / Every Week", sub: "Deliver on specific day of week", desc: "Select preferred day" },
                        { key: "Monthly", title: "Monthly / Once a Month", sub: "Deliver on specific monthly date", desc: "Pick date from compact Calendar" },
                        { key: "Alternate Days", title: "Alternate Days", sub: "Deliver after 2 or 3 days interval", desc: "Every 2 Days / 3 Days" }
                      ].map((freq) => {
                        const isSelected = frequency === freq.key;
                        return (
                          <div
                            key={freq.key}
                            onClick={() => handleFrequencyChange(freq.key)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 relative ${
                              isSelected
                                ? "bg-[#ECFDF3] border-[#16A34A] ring-2 ring-[#16A34A]/20 shadow-sm"
                                : "bg-white border-slate-200 hover:border-emerald-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-xs sm:text-sm text-[#17231A]">{freq.title}</span>
                              <input
                                type="radio"
                                name="frequency_radio"
                                checked={isSelected}
                                onChange={() => handleFrequencyChange(freq.key)}
                                className="accent-[#16A34A] w-4 h-4"
                              />
                            </div>
                            <div className="text-xs font-semibold text-[#166534]">{freq.sub}</div>
                            <div className="text-[11px] text-slate-400 font-medium">{freq.desc}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Member Savings Banner */}
                    <div className="bg-[#ECFDF3] border border-emerald-200 p-4 rounded-2xl text-xs text-[#166534] font-semibold flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white text-[#16A34A] flex items-center justify-center font-bold shrink-0 border border-emerald-200 shadow-2xs">
                        ₹
                      </div>
                      <div>
                        <strong>You'll save ~₹{estimatedMonthlySavings} every month!</strong>
                        <div className="text-[11px] text-slate-500 font-medium">Click "Continue" below to confirm frequency & proceed to Step 4.</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: CHOOSE DELIVERY DAY / DATE DEPENDING ON FREQUENCY */}
                {currentStep === 4 && (
                  <div className="space-y-6 w-full">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-lg font-extrabold text-[#17231A]">4. Choose Delivery Day & Duration</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {frequency === "Daily" && "Daily Mode: Deliveries occur every day (Mon-Sun). All 7 days are auto-selected ✓"}
                        {frequency === "Weekly" && "Weekly Mode: Select your preferred delivery day of the week."}
                        {frequency === "Monthly" && "Monthly Mode: Pick a date from the compact monthly date picker."}
                        {frequency === "Alternate Days" && "Alternate Days Mode: Select delivery interval (After 2 days or 3 days)."}
                      </p>
                    </div>

                    {/* FREQUENCY 1: DAILY -> All 7 days automatically selected & ticked! */}
                    {frequency === "Daily" && (
                      <div className="space-y-3">
                        <div className="bg-[#ECFDF3] border border-emerald-200 p-4 rounded-2xl text-xs text-[#166534] font-semibold flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-[#16A34A]" />
                            <span><strong>Daily Frequency Active:</strong> Deliveries scheduled for all 7 days every week.</span>
                          </span>
                          <span className="bg-[#16A34A] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                            7 / 7 Days Active ✓
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {ALL_WEEKDAYS.map((dName) => {
                            const shortName = dName.replace("Every ", "").slice(0, 3).toUpperCase();
                            return (
                              <div
                                key={dName}
                                className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-[#16A34A] text-white shadow-2xs flex items-center gap-1.5 cursor-default"
                              >
                                <Check size={13} />
                                <span>{shortName} (Active)</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* FREQUENCY 2: WEEKLY -> Select specific day of week */}
                    {frequency === "Weekly" && (
                      <div className="space-y-3">
                        <label className="block text-xs font-extrabold text-[#17231A]">Select Weekly Delivery Day(s)</label>
                        <div className="flex flex-wrap gap-2">
                          {ALL_WEEKDAYS.map((dName) => {
                            const isSelected = selectedDays.includes(dName);
                            return (
                              <button
                                key={dName}
                                type="button"
                                onClick={() => handleToggleDay(dName)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border cursor-pointer flex items-center gap-1.5 ${
                                  isSelected
                                    ? "bg-[#16A34A] text-white border-[#16A34A] shadow-xs"
                                    : "bg-[#FFFCF5] text-slate-700 border-slate-200 hover:border-emerald-300"
                                }`}
                              >
                                {isSelected && <Check size={13} />}
                                <span>{dName}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* FREQUENCY 3: MONTHLY -> Sleek & Compact Date Picker Widget (Matches Custom Start Date style!) */}
                    {frequency === "Monthly" && (
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          {/* Sleek Compact Native Date Picker Box */}
                          <div className="bg-[#FFFCF5] p-4 rounded-2xl border border-slate-200 space-y-2">
                            <label className="block text-xs font-extrabold text-[#17231A] uppercase tracking-wider flex items-center gap-1.5">
                              <Calendar size={15} className="text-[#16A34A]" /> Pick Monthly Delivery Date
                            </label>
                            <input
                              type="date"
                              value={monthlyCustomDate}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMonthlyCustomDate(val);
                                if (val) {
                                  const d = new Date(val);
                                  const dayNum = d.getDate();
                                  const suffix = (dayNum === 1 || dayNum === 21 || dayNum === 31) ? "st"
                                    : (dayNum === 2 || dayNum === 22) ? "nd"
                                    : (dayNum === 3 || dayNum === 23) ? "rd"
                                    : "th";
                                  setSelectedDays([`Day ${dayNum}${suffix} of every month`]);
                                }
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-[#17231A] focus:outline-none focus:border-[#16A34A] cursor-pointer"
                            />
                            <p className="text-[11px] text-[#166534] font-bold">
                              Active Date: <strong>{selectedDays[0] || "1st of every month"}</strong>
                            </p>
                          </div>

                          {/* Or Quick Day Dropdown Selector */}
                          <div className="bg-[#FFFCF5] p-4 rounded-2xl border border-slate-200 space-y-2">
                            <label className="block text-xs font-extrabold text-[#17231A] uppercase tracking-wider">
                              Or Select Day of Month
                            </label>
                            <select
                              value={selectedDays[0] || "1st of every month"}
                              onChange={(e) => setSelectedDays([e.target.value])}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-[#17231A] focus:outline-none focus:border-[#16A34A] cursor-pointer"
                            >
                              <option value="1st of every month">1st of every month</option>
                              <option value="5th of every month">5th of every month</option>
                              <option value="10th of every month">10th of every month</option>
                              <option value="15th of every month">15th of every month</option>
                              <option value="20th of every month">20th of every month</option>
                              <option value="25th of every month">25th of every month</option>
                              <option value="Last day of every month">Last day of every month</option>
                            </select>
                            <p className="text-[11px] text-slate-500 font-medium">
                              Recurring monthly delivery on selected date.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FREQUENCY 4: ALTERNATE DAYS -> Select interval (After 2 days / 3 days) */}
                    {frequency === "Alternate Days" && (
                      <div className="space-y-3">
                        <label className="block text-xs font-extrabold text-[#17231A]">Select Alternate Day Interval</label>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {[
                            {
                              key: "Every 2 Days (Mon, Wed, Fri, Sun)",
                              title: "Every 2 Days (After 2 Days)",
                              desc: "Delivers every second day (e.g. Monday, Wednesday, Friday, Sunday)"
                            },
                            {
                              key: "Every 3 Days (Mon, Thu, Sun, Wed)",
                              title: "Every 3 Days (After 3 Days)",
                              desc: "Delivers every third day (e.g. Monday, Thursday, Sunday, Wednesday)"
                            }
                          ].map((alt) => {
                            const isSelected = selectedDays.includes(alt.key);
                            return (
                              <div
                                key={alt.key}
                                onClick={() => setSelectedDays([alt.key])}
                                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 relative ${
                                  isSelected
                                    ? "bg-[#ECFDF3] border-[#16A34A] ring-2 ring-[#16A34A]/20 shadow-sm"
                                    : "bg-white border-slate-200 hover:border-emerald-300"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-sm text-[#17231A]">{alt.title}</span>
                                  <input
                                    type="radio"
                                    name="alt_radio"
                                    checked={isSelected}
                                    onChange={() => setSelectedDays([alt.key])}
                                    className="accent-[#16A34A] w-4 h-4"
                                  />
                                </div>
                                <p className="text-xs text-[#166534] font-medium leading-relaxed">{alt.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Delivery Starts Date Selection */}
                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div className="space-y-2">
                        <label className="block text-xs font-extrabold text-[#17231A]">First Delivery Starts</label>
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              setStartDateOption("tomorrow");
                              setStartDate(tomorrowStrDate);
                            }}
                            className={`w-full p-3.5 rounded-2xl border text-left text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer ${
                              startDateOption === "tomorrow"
                                ? "bg-[#ECFDF3] border-[#16A34A] text-[#166534]"
                                : "bg-white border-slate-200 text-[#17231A]"
                            }`}
                          >
                            <span>Tomorrow ({new Date(Date.now() + 24*60*60*1000).toLocaleDateString("en-GB", { day: "numeric", month: "short" })})</span>
                            {startDateOption === "tomorrow" && <CheckCircle2 size={16} className="text-[#16A34A]" />}
                          </button>

                          <div className="bg-[#FFFCF5] p-3 rounded-2xl border border-slate-200 space-y-1">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Or Choose Custom Start Date</span>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => {
                                setStartDateOption("custom");
                                setStartDate(e.target.value);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#16A34A]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Subscription Duration Option */}
                      <div className="space-y-2">
                        <label className="block text-xs font-extrabold text-[#17231A]">Subscription Duration</label>
                        <select
                          value={durationType}
                          onChange={(e) => setDurationType(e.target.value)}
                          className="w-full bg-[#FFFCF5] border border-slate-200 rounded-2xl p-3.5 text-xs font-extrabold focus:outline-none focus:border-[#16A34A] cursor-pointer"
                        >
                          <option value="until_cancelled">Until Cancelled (Flexible Plan)</option>
                          <option value="1_month">1 Month (30 Days Plan)</option>
                          <option value="7_days">7 Days Trial Plan</option>
                          <option value="3_months">3 Months Savings Plan</option>
                        </select>
                        <p className="text-[11px] text-slate-400 font-medium">You can pause, skip next delivery, or cancel anytime without penalties.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: SET QUANTITY & TIME SLOT */}
                {currentStep === 5 && (
                  <div className="space-y-6 w-full">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-lg font-extrabold text-[#17231A]">5. Set Quantity & Delivery Time</h3>
                      <p className="text-xs text-slate-500 mt-0.5">How much do you need per delivery and at what morning time?</p>
                    </div>

                    {/* Quantity Control Counter */}
                    <div className="bg-[#FFFCF5] p-5 rounded-2xl border border-slate-200 space-y-3">
                      <label className="block text-xs font-extrabold text-[#17231A]">Delivery Quantity per Shift</label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="w-10 h-10 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center font-bold text-lg cursor-pointer shadow-2xs"
                        >
                          -
                        </button>
                        <span className="font-mono text-2xl font-black text-[#166534] w-12 text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => prev + 1)}
                          className="w-10 h-10 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] flex items-center justify-center font-bold text-lg cursor-pointer shadow-2xs"
                        >
                          +
                        </button>
                        <span className="text-xs font-extrabold text-slate-500">{selectedProduct?.unit}</span>
                      </div>
                    </div>

                    {/* Delivery Time Slot Selector Cards */}
                    <div className="space-y-3">
                      <label className="block text-xs font-extrabold text-[#17231A]">Select Delivery Time Slot</label>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {[
                          { slot: "Morning (6 AM - 12 PM)", label: "Morning Express", time: "6:00 AM - 12:00 PM", badge: "Guaranteed" },
                          { slot: "Afternoon (12 PM - 4 PM)", label: "Afternoon Shift", time: "12:00 PM - 4:00 PM", badge: "Standard" },
                          { slot: "Evening (4 PM - 8 PM)", label: "Evening Shift", time: "4:00 PM - 8:00 PM", badge: "Standard" }
                        ].map((sObj) => {
                          const isSelected = timeSlot === sObj.slot;
                          return (
                            <div
                              key={sObj.slot}
                              onClick={() => setTimeSlot(sObj.slot)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                                isSelected
                                  ? "bg-[#ECFDF3] border-[#16A34A] ring-2 ring-[#16A34A]/20 shadow-xs"
                                  : "bg-white border-slate-200 hover:border-emerald-300"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold text-[#17231A]">{sObj.label}</span>
                                <input
                                  type="radio"
                                  name="timeslot_radio"
                                  checked={isSelected}
                                  onChange={() => setTimeSlot(sObj.slot)}
                                  className="accent-[#16A34A] w-4 h-4"
                                />
                              </div>
                              <div className="text-xs font-mono text-[#166534] font-bold">{sObj.time}</div>
                              <span className="inline-block text-[10px] font-bold bg-emerald-100 text-[#166534] px-2 py-0.5 rounded">
                                {sObj.badge}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: REVIEW & CONFIRM SUBSCRIPTION */}
                {currentStep === 6 && selectedProduct && (
                  <div className="space-y-6 w-full">
                    <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-extrabold text-[#17231A]">6. Review & Confirm Subscription</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Please review your subscription details before generating your card.</p>
                      </div>
                      <span className="bg-[#ECFDF3] text-[#166534] border border-emerald-200 text-xs font-black px-3 py-1 rounded-full">
                        Ready for App Setup
                      </span>
                    </div>

                    {/* Comprehensive Summary Card */}
                    <div className="bg-[#FFFCF5] border border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
                      {/* Product Header */}
                      <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                        <img
                          src={getProductImage(selectedProduct.name, selectedProduct.categoryKey || activeCategory)}
                          alt={selectedProduct.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <h4 className="text-base font-extrabold text-[#17231A]">{selectedProduct.name}</h4>
                          <span className="text-xs text-slate-500 font-semibold">{selectedProduct.unit}</span>
                        </div>
                      </div>

                      {/* Detail Key-Values */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
                        <div>
                          <span className="text-slate-400 font-bold block uppercase text-[10px]">Frequency</span>
                          <span className="font-extrabold text-[#17231A]">{frequency}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block uppercase text-[10px]">Delivery Schedule</span>
                          <span className="font-extrabold text-[#17231A]">{selectedDays.join(", ")}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block uppercase text-[10px]">Starts On</span>
                          <span className="font-extrabold text-[#17231A]">
                            {new Date(startDate || tomorrowStrDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block uppercase text-[10px]">Quantity</span>
                          <span className="font-extrabold text-[#17231A]">{quantity} {selectedProduct.unit}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block uppercase text-[10px]">Delivery Time</span>
                          <span className="font-extrabold text-[#166534]">{timeSlot}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block uppercase text-[10px]">Duration</span>
                          <span className="font-extrabold text-[#17231A]">{durationType === "until_cancelled" ? "Until Cancelled" : durationType}</span>
                        </div>
                      </div>

                      {/* Savings Highlight */}
                      <div className="bg-[#ECFDF3] border border-emerald-200 p-3.5 rounded-2xl text-[#166534] font-extrabold flex items-center justify-between">
                        <span>🎉 Subscriber Savings</span>
                        <span className="bg-[#16A34A] text-white px-2.5 py-0.5 rounded-full text-[11px]">
                          Save ₹{estimatedMonthlySavings}/month (10% OFF)
                        </span>
                      </div>

                      {/* Price Total */}
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-black">
                        <span>Total per Delivery</span>
                        <span className="font-mono text-[#166534] text-xl">₹{totalPricePerDelivery}</span>
                      </div>
                    </div>

                    {/* Pre-checkout Notice Banner */}
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 font-medium space-y-1">
                      <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
                        <Info size={15} className="text-amber-600" /> Website Payment Disabled (App Handoff)
                      </div>
                      <p>
                        Web checkout will save your subscription card to <strong>My Subscriptions</strong>. To activate 1-tap UPI AutoPay and start scheduled morning deliveries, scan the QR code to complete checkout in the Fillcart Mobile App.
                      </p>
                    </div>
                  </div>
                )}

                {/* BOTTOM PREV / NEXT NAVIGATION BUTTONS */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ArrowLeft size={15} /> Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={currentStep === 1 && !selectedProduct}
                    className={`font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer ml-auto text-white ${
                      currentStep === 1 && !selectedProduct
                        ? "bg-slate-300 cursor-not-allowed opacity-80"
                        : currentStep === 2 && purchaseType === "one_time"
                        ? "bg-[#17231A] hover:bg-slate-800"
                        : "bg-[#16A34A] hover:bg-[#15803D]"
                    }`}
                  >
                    <span>
                      {currentStep === 6
                        ? "Proceed to App Checkout"
                        : currentStep === 1 && !selectedProduct
                        ? "Select a Product to View Details"
                        : currentStep === 2 && purchaseType === "one_time"
                        ? "Add One-Time Item to Cart & Checkout"
                        : currentStep === 2 && purchaseType === "subscribe" && !user
                        ? "🔒 Log In to Start Scheduling"
                        : currentStep === 2
                        ? "Subscribe & Save 10% ➔ Start Scheduling"
                        : "Continue"}
                    </span>
                    {currentStep === 2 && purchaseType === "one_time" ? <ShoppingCart size={15} /> : <ArrowRight size={15} />}
                  </button>
                </div>

              </div>

              {/* STICKY LIVE SUBSCRIPTION SUMMARY SIDEBAR (Appears ONLY at Step 6 Checkout Review Stage!) */}
              {currentStep === 6 && selectedProduct && (
                <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-sm sticky top-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <ShoppingBasket size={18} className="text-[#16A34A]" />
                      <h3 className="text-base font-extrabold text-[#17231A]">Checkout Live Summary</h3>
                    </div>
                    <span className="bg-[#ECFDF3] text-[#166534] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Step 6/6
                    </span>
                  </div>

                  {/* Selected Item Preview */}
                  <div className="flex items-center gap-3 bg-[#FFFCF5] p-3 rounded-2xl border border-slate-200">
                    <img
                      src={getProductImage(selectedProduct.name, selectedProduct.categoryKey || activeCategory)}
                      alt={selectedProduct.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="text-xs min-w-0">
                      <div className="font-extrabold text-[#17231A] truncate">{selectedProduct.name}</div>
                      <div className="text-slate-400 font-mono text-[11px]">₹{currentUnitPrice} × {quantity}</div>
                    </div>
                  </div>

                  {/* Live Key Settings Summary */}
                  <div className="space-y-2 text-xs border-b border-slate-100 pb-4">
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Purchase Type:</span>
                      <span className="font-extrabold text-[#17231A]">Subscribe & Save 10%</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Frequency:</span>
                      <span className="font-extrabold text-[#17231A]">{frequency}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Schedule:</span>
                      <span className="font-extrabold text-[#17231A] truncate max-w-[150px]">{selectedDays.join(", ")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Time Slot:</span>
                      <span className="font-extrabold text-[#166534] truncate max-w-[150px]">{timeSlot}</span>
                    </div>
                  </div>

                  {/* Total & Savings Box */}
                  <div className="bg-[#166534] text-white p-4 rounded-2xl space-y-2 shadow-2xs">
                    <div className="flex justify-between text-xs text-emerald-100">
                      <span>Regular Price</span>
                      <span className="font-mono text-slate-300 line-through">₹{unitRegularPrice * quantity}</span>
                    </div>
                    <div className="flex justify-between text-xs text-amber-300 font-extrabold">
                      <span>10% Subscriber Discount</span>
                      <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-bold">-₹{(unitRegularPrice - unitSubscriberPrice) * quantity}</span>
                    </div>
                    <div className="pt-2 border-t border-emerald-700 flex justify-between text-sm font-extrabold text-white">
                      <span>Total Amount</span>
                      <span className="font-mono text-amber-300 text-lg">₹{totalPricePerDelivery}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 text-center font-medium leading-tight">
                    🔒 Card saved to My Subscriptions. Download mobile app for 1-tap AutoPay.
                  </div>
                </div>
              )}

            </div>

          </div>
        )}



        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: MY SUBSCRIPTIONS DASHBOARD & ORDER TRACKING           */}
        {/* ------------------------------------------------------------- */}
        {viewTab === "my_subscriptions" && (
          <div className="space-y-6 w-full">
            {/* Header Metrics Bar */}
            <div className="bg-[#166534] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4 w-full">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-600 mb-2">
                  <Sparkles size={13} /> Real-Time Subscription Dashboard
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold">Active Subscription Cards</h2>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-medium max-w-xl">
                  Manage delivery schedules, pause/resume active plans, or complete checkout via mobile app.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-[#15803D] border border-emerald-500 p-3 rounded-2xl">
                <div className="text-center px-3 border-r border-emerald-600">
                  <div className="text-xl font-black font-mono text-white">{activeCount}</div>
                  <div className="text-[10px] text-emerald-100 font-bold uppercase">Active</div>
                </div>
                <div className="text-center px-3 border-r border-emerald-600">
                  <div className="text-xl font-black font-mono text-amber-300">{pendingCount}</div>
                  <div className="text-[10px] text-emerald-100 font-bold uppercase">Pending Setup</div>
                </div>
                <div className="text-center px-3">
                  <div className="text-xl font-black font-mono text-white">₹{totalMonthlySavingsSum}</div>
                  <div className="text-[10px] text-emerald-100 font-bold uppercase">Est. Savings</div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-400 mr-1 uppercase text-[11px]">Filter:</span>
                {["All", "Active Schedule", "App Setup Pending", "Paused"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all border whitespace-nowrap cursor-pointer ${
                      orderFilter === st
                        ? "bg-[#16A34A] text-white border-[#16A34A]"
                        : "bg-[#FFFCF5] text-slate-700 border-slate-200 hover:bg-[#ECFDF3]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Search tracking cards..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="bg-[#FFFCF5] border border-slate-200 text-xs font-semibold rounded-full pl-9 pr-4 py-2 w-full focus:outline-none focus:border-[#16A34A]"
                />
              </div>
            </div>

            {/* Subscriptions Cards List */}
            <div className="space-y-6 w-full">
              {filteredOrders.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-2xs space-y-3">
                  <Package size={36} className="text-slate-300 mx-auto" />
                  <h3 className="text-base font-extrabold text-[#17231A]">No matching subscription cards</h3>
                  <p className="text-xs text-slate-500 font-medium">Build a new subscription card using our step-by-step flow wizard.</p>
                  <button
                    onClick={() => setViewTab("wizard")}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs px-6 py-3 rounded-full shadow-sm transition-colors cursor-pointer"
                  >
                    Build First Subscription Card
                  </button>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div key={ord.orderId} className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-6 shadow-2xs transition-all space-y-5 relative overflow-hidden w-full">
                    {/* Header: Order ID & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center font-bold shrink-0">
                          <Repeat size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-extrabold text-[#166534] bg-[#ECFDF3] px-2 py-0.5 rounded border border-emerald-200">
                              {ord.orderId}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">{ord.orderDate}</span>
                          </div>
                          <h3 className="text-base font-extrabold text-[#17231A] mt-0.5">{ord.name}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {ord.status === "Active Schedule" && (
                          <span className="bg-[#ECFDF3] text-[#166534] border border-emerald-200 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={13} className="text-[#16A34A]" /> Active Schedule
                          </span>
                        )}
                        {ord.status === "App Setup Pending" && (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                            <AlertCircle size={13} className="text-[#F59E0B]" /> App Setup Pending
                          </span>
                        )}
                        {ord.status === "Paused" && (
                          <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                            <PauseCircle size={13} /> Paused
                          </span>
                        )}

                        <button
                          onClick={() => handleToggleStatus(ord)}
                          className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                            ord.status === "Active Schedule"
                              ? "text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200"
                              : "text-white bg-[#16A34A] hover:bg-[#15803D] shadow-2xs"
                          }`}
                        >
                          {ord.status === "Active Schedule" ? "Pause" : "Activate in App 📱"}
                        </button>

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
                      {/* Products */}
                      <div className="space-y-2 bg-[#FFFCF5] p-4 rounded-2xl border border-slate-100">
                        <div className="font-extrabold text-[#166534] uppercase text-xs flex items-center gap-1 mb-2">
                          <ShoppingBasket size={14} /> Subscribed Item:
                        </div>
                        {ord.items.map((i, idx) => (
                          <div key={idx} className="flex justify-between font-semibold text-slate-800">
                            <span>{i.qty}x {i.name}</span>
                            <span className="font-mono text-slate-600">₹{i.price * i.qty}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-[#17231A]">
                          <span>Total Per Shift</span>
                          <span className="font-mono text-[#166534]">₹{ord.total}</span>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="space-y-2 bg-[#FFFCF5] p-4 rounded-2xl border border-slate-100">
                        <div className="font-extrabold text-[#166534] uppercase text-xs flex items-center gap-1 mb-2">
                          <Clock size={14} /> Schedule & Slot:
                        </div>
                        <div className="text-slate-700 font-semibold">Frequency: <strong>{ord.frequency}</strong></div>
                        <div className="text-slate-700 font-semibold">Day: <strong>{ord.deliveryDay}</strong></div>
                        <div className="text-slate-700 font-semibold">Slot: <strong>{ord.timeSlot}</strong></div>
                      </div>

                      {/* App Checkout Action */}
                      <div className="space-y-2 bg-[#FFFCF5] p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                        <div>
                          <div className="font-extrabold text-[#166534] uppercase text-xs flex items-center gap-1 mb-2">
                            <Smartphone size={14} /> Mobile App Checkout:
                          </div>
                          <p className="text-slate-600 text-xs font-medium">
                            UPI AutoPay & payment setup must be completed in Mobile App.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setActiveCardForAppCheckout(ord);
                            setShowAppCheckoutModal(true);
                          }}
                          className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer w-full mt-2"
                        >
                          <QrCode size={14} /> Open App Checkout QR
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SUBSCRIPTION BENEFITS & FAQ ACCORDION SECTION                 */}
        {/* ------------------------------------------------------------- */}
        <section className="space-y-8 pt-6 w-full">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {subscriptionBenefits.map((b, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 space-y-2.5 transition-all shadow-2xs"
              >
                <div className={`w-10 h-10 rounded-xl ${b.bg} ${b.color} flex items-center justify-center`}>
                  <b.icon size={20} />
                </div>
                <h3 className="font-extrabold text-sm text-[#17231A]">{b.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xs w-full">
            <div className="text-left space-y-1">
              <span className="text-xs font-extrabold text-[#166534] uppercase tracking-wider block">Clarifications</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#17231A]">Subscription FAQ & Mobile App Checkout</h2>
            </div>

            <div className="space-y-3">
              {subscriptionFaqs.map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-[#FFFCF5]/50 transition-all">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left font-extrabold text-xs sm:text-sm text-[#17231A] flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={16} className={`text-[#16A34A] shrink-0 transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE APP HANDOFF PRE-CHECKOUT MODAL (NO WEBSITE PAYMENT)    */}
      {/* ------------------------------------------------------------- */}
      {showAppCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-[#FFFCF5] text-[#17231A] overflow-y-auto flex flex-col justify-between p-4 sm:p-8 md:p-10">
          {/* Modal Header Bar */}
          <div className="max-w-5xl w-full mx-auto flex items-center justify-between shrink-0 pb-4 border-b border-slate-200">
            <button
              onClick={() => setShowAppCheckoutModal(false)}
              className="flex items-center gap-2 text-xs font-extrabold text-slate-700 hover:text-[#16A34A] transition-colors cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-full shadow-2xs"
            >
              <ArrowLeft size={16} /> Back to Web Flow
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-extrabold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-3.5 py-1.5 rounded-full">
              <CheckCircle2 size={15} className="text-[#16A34A]" /> Card Saved in My Subscriptions
            </span>

            <button
              onClick={() => setShowAppCheckoutModal(false)}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Center 2-Column Grid */}
          <div className="max-w-5xl w-full mx-auto my-auto py-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center text-left">
            {/* Left Column: Summary of Configured Card */}
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#F59E0B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Smartphone size={14} /> Fillcart App Hand-off
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#17231A] leading-tight">
                  Complete Checkout in Fillcart App
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Aapka subscription plan Web Flow par successfully complete ho gaya hai! Website par payment disabled rakha gaya hai. 1-tap AutoPay setup activation Mobile App ke andar se karein.
                </p>
              </div>

              {activeCardForAppCheckout && (
                <div className="bg-white border border-emerald-200 rounded-3xl p-5 md:p-6 shadow-2xs space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="font-extrabold text-sm text-[#17231A]">{activeCardForAppCheckout.name}</span>
                    <span className="font-mono text-xs font-black text-[#166534] bg-[#ECFDF3] px-2.5 py-1 rounded-lg border border-emerald-200">
                      {activeCardForAppCheckout.orderId}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Product</span>
                      <span className="text-slate-900 font-extrabold">{activeCardForAppCheckout.productName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Frequency</span>
                      <span className="text-[#16A34A] font-extrabold">{activeCardForAppCheckout.frequency} ({activeCardForAppCheckout.deliveryDay})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Time Slot</span>
                      <span className="text-slate-800 font-semibold">{activeCardForAppCheckout.timeSlot}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Per Delivery Total</span>
                      <span className="text-[#166534] font-black font-mono text-sm">₹{activeCardForAppCheckout.total}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-amber-700 font-bold">
                    <span>Est. Member Savings:</span>
                    <span>Save ₹{activeCardForAppCheckout.monthlySavings || 120}/month</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: QR Code & Download Links */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
              <div className="space-y-3">
                <div className="w-36 h-36 bg-[#FFFCF5] p-3 rounded-3xl border border-slate-200 shadow-inner flex items-center justify-center mx-auto">
                  <QrCode size={120} className="text-slate-900" />
                </div>

                <div>
                  <div className="font-extrabold text-slate-900 text-base">Scan QR to Launch App</div>
                  <div className="text-slate-500 text-xs mt-1 font-medium">Point phone camera to install Fillcart App & complete AutoPay payment.</div>
                </div>
              </div>

              {/* Send SMS Link Input */}
              <form onSubmit={handleSendSmsLink} className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-extrabold text-slate-700 block">Get App Link on Phone</span>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile no..."
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    className="flex-1 bg-[#FFFCF5] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#16A34A]"
                  />
                  <button
                    type="submit"
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <Send size={13} /> Send Link
                  </button>
                </div>
                {smsSentNotice && (
                  <p className="text-xs font-bold text-[#166534] bg-[#ECFDF3] p-2 rounded-xl">
                    ✓ Download link sent to +91 {smsPhone}!
                  </p>
                )}
              </form>

              {/* Direct PlayStore & AppStore Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="#playstore"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Redirecting to Google Play Store...");
                  }}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white py-3 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Download size={15} /> Google Play
                </a>
                <a
                  href="#appstore"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Redirecting to Apple App Store...");
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Smartphone size={15} /> App Store
                </a>
              </div>
            </div>
          </div>

          {/* Modal Bottom Footer */}
          <div className="max-w-5xl w-full mx-auto text-center shrink-0 pt-4 border-t border-slate-200">
            <p className="text-xs text-[#17231A] font-semibold">
              🔒 Payment is handled in Mobile App via UPI AutoPay / NetBanking. Card details synced in your account.
            </p>
          </div>
        </div>
      )}

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}

// Simple Icon wrapper helper
function FileTextIcon({ size = 16 }) {
  return <Package size={size} />;
}
