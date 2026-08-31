import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  User, ShoppingBag, MapPin, Gift, ShieldAlert,
  ArrowLeft, Edit3, Trash2, Plus, Check, Loader2, Sparkles, AlertCircle, Eye, Repeat, PlayCircle, PauseCircle, LifeBuoy, ExternalLink, Heart, ShoppingCart, MoreVertical, Navigation, Compass
} from "lucide-react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";
import { SupportContent } from "./SupportPage";
import { getProductImage } from "../utils/productImages";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, setUser, logoutUser, addToCart, wishlist = [], removeFromWishlist = () => {} } = useCart();
  const currentTab = searchParams.get("tab") || "profile";

  // Tab change handler
  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // Load profile data from user context or localStorage
  useEffect(() => {
    const savedLocal = localStorage.getItem("fillcarts_user_profile");
    let localData = {};
    if (savedLocal) {
      try { localData = JSON.parse(savedLocal); } catch (e) { }
    }

    setProfileForm({
      name: user?.name || localData.name || "Guest Customer",
      phone: user?.phone || localData.phone || "9876543210",
      email: user?.email || localData.email || "guest@fillcart.com",
      address: user?.address || localData.address || "Flat 402, Green Valley Apartments, Bengaluru",
      pincode: user?.pincode || localData.pincode || "560038"
    });
  }, [user]);

  // Common Notification State
  const [message, setMessage] = useState({ text: "", type: "" }); // type: success | error
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  };

  // ==========================================
  // MODULE 1: PROFILE MANAGEMENT
  // ==========================================
  const [profileForm, setProfileForm] = useState({
    name: "Guest Customer",
    phone: "9876543210",
    email: "guest@fillcart.com",
    address: "Flat 402, Green Valley Apartments, Bengaluru",
    pincode: "560038"
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (profileForm.name.trim().length < 2) {
      showMessage("Name must contain at least 2 letters.", "error");
      return;
    }
    if (!/^\d{6}$/.test(profileForm.pincode.trim())) {
      showMessage("Pincode must be exactly 6 digits.", "error");
      return;
    }
    if (profileForm.address.trim().length < 5) {
      showMessage("Please enter a valid delivery address.", "error");
      return;
    }

    setIsUpdatingProfile(true);
    const updatedData = {
      ...profileForm,
      name: profileForm.name.trim(),
      address: profileForm.address.trim(),
      pincode: profileForm.pincode.trim()
    };

    try {
      if (user) {
        const res = await api.put("/profile", updatedData);
        setUser(res.data.customer);
      } else {
        setUser(prev => ({ ...prev, ...updatedData }));
      }
      localStorage.setItem("fillcarts_user_profile", JSON.stringify(updatedData));
      showMessage("Profile updated successfully!");
    } catch (err) {
      console.warn("Backend update error, saving profile locally:", err);
      setUser(prev => ({ ...prev, ...updatedData }));
      localStorage.setItem("fillcarts_user_profile", JSON.stringify(updatedData));
      showMessage("Profile updated successfully!");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // ==========================================
  // MODULE 2: MY ORDERS HISTORY
  // ==========================================
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await api.get("/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error(err);
      }
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user && currentTab === "orders") {
      fetchOrders();
    }
  }, [user, currentTab]);

  const handleBuyAgain = (item) => {
    addToCart(item);
    showMessage(`Added ${item.name} to cart!`);
  };

  // ==========================================
  // MODULE 3: SAVED ADDRESSES
  // ==========================================
  const [addresses, setAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [openAddressMenuId, setOpenAddressMenuId] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const initialFormState = {
    name: "",
    phone: "",
    pincode: "",
    locality: "",
    street: "",
    city: "",
    state: "",
    landmark: "",
    alt_phone: "",
    type: "HOME"
  };

  const [addressForm, setAddressForm] = useState(initialFormState);

  const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi NCR", "Chandigarh", "Jammu and Kashmir", "Ladakh", "Puducherry"
  ];

  const fetchAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const res = await api.get("/addresses");
      setAddresses(res.data.addresses || []);
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error(err);
      }
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  // Close 3-dots menu on click outside
  useEffect(() => {
    const handleDocumentClick = () => setOpenAddressMenuId(null);
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setModalError("Geolocation is not supported by your browser.");
      return;
    }
    setIsDetectingLocation(true);
    setModalError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingLocation(false);
        const lat = pos.coords.latitude.toFixed(3);
        const lng = pos.coords.longitude.toFixed(3);
        setAddressForm((prev) => ({
          ...prev,
          city: prev.city || "Indore",
          state: prev.state || "Madhya Pradesh",
          locality: prev.locality || `Vijay Nagar (GPS: ${lat}, ${lng})`,
          street: prev.street || `GPS Location (${lat}, ${lng})`,
          pincode: prev.pincode || "452010"
        }));
      },
      (err) => {
        setIsDetectingLocation(false);
        setModalError("Could not fetch GPS location. Please enter details manually.");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleOpenAddressForm = (addr = null) => {
    setModalError("");
    setOpenAddressMenuId(null);
    if (addr) {
      setEditingAddress(addr);
      setAddressForm({
        name: addr.name || user?.name || "",
        phone: addr.phone || user?.phone || "",
        pincode: addr.pincode || "",
        locality: addr.locality || "",
        street: addr.street || addr.address_line || "",
        city: addr.city || "",
        state: addr.state || "",
        landmark: addr.landmark || "",
        alt_phone: addr.alt_phone || "",
        type: (addr.type || "HOME").toUpperCase()
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        ...initialFormState,
        name: user?.name || "",
        phone: user?.phone || ""
      });
    }
    setShowAddressForm(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!addressForm.name.trim()) {
      setModalError("Name is required.");
      return;
    }
    if (!/^\d{10}$/.test(addressForm.phone.trim())) {
      setModalError("10-digit mobile number is required.");
      return;
    }
    if (!/^\d{6}$/.test(addressForm.pincode.trim())) {
      setModalError("Pincode must be exactly 6 digits.");
      return;
    }
    if (!addressForm.locality.trim()) {
      setModalError("Locality is required.");
      return;
    }
    if (!addressForm.street.trim()) {
      setModalError("Address (Area and Street) is required.");
      return;
    }
    if (!addressForm.city.trim()) {
      setModalError("City/District/Town is required.");
      return;
    }

    const formattedAddressLine = `${addressForm.street.trim()}, ${addressForm.locality.trim()}${addressForm.landmark ? ', Landmark: ' + addressForm.landmark.trim() : ''}, ${addressForm.city.trim()}, ${addressForm.state.trim()} - ${addressForm.pincode.trim()}`;

    const payload = {
      type: addressForm.type || "HOME",
      name: addressForm.name.trim(),
      phone: addressForm.phone.trim(),
      pincode: addressForm.pincode.trim(),
      locality: addressForm.locality.trim(),
      street: addressForm.street.trim(),
      address_line: formattedAddressLine,
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      landmark: addressForm.landmark.trim(),
      alt_phone: addressForm.alt_phone.trim()
    };

    try {
      if (editingAddress) {
        await api.put(`/addresses/${editingAddress.id}`, payload);
        showMessage("Address updated successfully!");
      } else {
        await api.post("/addresses", payload);
        showMessage("Address added successfully!");
      }
      setShowAddressForm(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data || "Failed to save address";
      setModalError(typeof errMsg === "string" ? errMsg : "Failed to save address");
    }
  };

  const handleAddressDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await api.delete(`/addresses/${id}`);
      showMessage("Address deleted successfully!");
      fetchAddresses();
    } catch (err) {
      console.error(err);
      showMessage("Failed to delete address", "error");
    }
  };

  // ==========================================
  // MODULE 4: MY SUBSCRIPTIONS
  // ==========================================
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(false);
  const [isSubmittingSubscription, setIsSubmittingSubscription] = useState(false);

  const fetchSubscriptions = async () => {
    setIsLoadingSubscriptions(true);
    let combinedSubscriptions = [];

    if (!user) {
      setSubscriptions([]);
      setIsLoadingSubscriptions(false);
      return;
    }

    const storageKey = `fillcarts_subscription_orders_${user.id || user.phone || user.email || 'user'}`;

    // 1. Fetch from LocalStorage for current authenticated user
    try {
      const storedLocal = localStorage.getItem(storageKey);
      if (storedLocal) {
        const parsed = JSON.parse(storedLocal);
        if (Array.isArray(parsed)) {
          combinedSubscriptions = parsed.map((item) => ({
            id: item.orderId,
            orderId: item.orderId,
            plan_name: item.name,
            frequency: item.frequency || "Daily",
            timeSlot: item.timeSlot || "6:30 AM - 7:30 AM",
            price: item.total,
            unit: `/${(item.frequency || "Daily").toLowerCase()}`,
            next_delivery: item.nextDate || "Tomorrow 7:00 AM",
            status: item.status?.includes("Active") || item.status === "Active" ? "Active" : "Paused",
            rawStatus: item.status || "Active Schedule",
            items: item.items || [],
            created_at: item.orderDate || new Date().toISOString(),
            isLocalCard: true,
          }));
        }
      }
    } catch (e) {
      console.warn("LocalStorage subscription parse warning:", e);
    }

    // 2. Fetch from Backend API
    try {
      const res = await api.get("/subscriptions");
      const apiSubs = (res.data.subscriptions || []).map((sub) => ({
        id: sub.id,
        orderId: `SUB-ORD-${sub.id}`,
        plan_name: sub.plan_name,
        frequency: sub.plan_key?.includes("daily") ? "Daily" : "Weekly",
        timeSlot: "6:30 AM - 7:30 AM",
        price: sub.price,
        unit: sub.unit || "/month",
        next_delivery: sub.next_delivery || "Tomorrow",
        status: sub.status || "Active",
        rawStatus: sub.status || "Active",
        items: [],
        created_at: sub.created_at || new Date().toISOString(),
        isLocalCard: false,
      }));

      combinedSubscriptions = [...combinedSubscriptions, ...apiSubs];
    } catch (err) {
      console.warn("Backend subscriptions warning:", err?.message);
    } finally {
      setSubscriptions(combinedSubscriptions);
      setIsLoadingSubscriptions(false);
    }
  };

  useEffect(() => {
    if (user && currentTab === "subscriptions") {
      fetchSubscriptions();
    }
  }, [user, currentTab]);

  const handleCreateSubscription = async (plan) => {
    setIsSubmittingSubscription(true);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDeliveryStr = tomorrow.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric"
    });

    try {
      await api.post("/subscriptions", {
        plan_key: plan.key,
        plan_name: plan.name,
        price: plan.price,
        unit: plan.unit,
        next_delivery: nextDeliveryStr
      });
      showMessage(`Subscribed to ${plan.name} successfully!`);
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
      showMessage("Failed to create subscription", "error");
    } finally {
      setIsSubmittingSubscription(false);
    }
  };

  const handleToggleSubscriptionStatus = async (sub) => {
    const nextStatus = sub.status === "Active" ? "Paused" : "Active";

    if (sub.isLocalCard && user) {
      try {
        const storageKey = `fillcarts_subscription_orders_${user.id || user.phone || user.email || 'user'}`;
        const storedLocal = localStorage.getItem(storageKey);
        if (storedLocal) {
          const parsed = JSON.parse(storedLocal);
          const updated = parsed.map((item) => {
            if (item.orderId === sub.orderId) {
              return {
                ...item,
                status: nextStatus === "Active" ? "Active Schedule" : "Paused by User",
              };
            }
            return item;
          });
          localStorage.setItem(storageKey, JSON.stringify(updated));
          window.dispatchEvent(new Event("fillcarts_subscriptions_updated"));
        }
        showMessage(`Subscription ${nextStatus === "Active" ? "resumed" : "paused"} successfully!`);
        fetchSubscriptions();
        return;
      } catch (e) {
        console.error("Local toggle error:", e);
      }
    }

    try {
      await api.put(`/subscriptions/${sub.id}/status`, { status: nextStatus });
      showMessage(`Subscription ${nextStatus === "Active" ? "resumed" : "paused"} successfully!`);
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
      showMessage("Failed to update subscription status", "error");
    }
  };

  const handleCancelSubscription = async (sub) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;

    if (sub.isLocalCard && user) {
      try {
        const storageKey = `fillcarts_subscription_orders_${user.id || user.phone || user.email || 'user'}`;
        const storedLocal = localStorage.getItem(storageKey);
        if (storedLocal) {
          const parsed = JSON.parse(storedLocal);
          const filtered = parsed.filter((item) => item.orderId !== sub.orderId);
          localStorage.setItem(storageKey, JSON.stringify(filtered));
          window.dispatchEvent(new Event("fillcarts_subscriptions_updated"));
        }
        showMessage("Subscription cancelled successfully.");
        fetchSubscriptions();
        return;
      } catch (e) {
        console.error("Local cancel error:", e);
      }
    }

    try {
      await api.delete(`/subscriptions/${sub.id}`);
      showMessage("Subscription cancelled successfully.");
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
      showMessage("Failed to cancel subscription", "error");
    }
  };

  // ==========================================
  // MODULE 5: E-GIFT CARDS
  // ==========================================
  const [giftBalance, setGiftBalance] = useState(0);
  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [buyAmount, setBuyAmount] = useState("");
  const [isBuyingGift, setIsBuyingGift] = useState(false);

  const fetchGiftBalance = async () => {
    try {
      const res = await api.get("/giftcard");
      setGiftBalance(res.data.balance || 0);
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (user && currentTab === "giftcards") {
      fetchGiftBalance();
    }
  }, [user, currentTab]);

  const handleRedeemGiftCard = async (e) => {
    e.preventDefault();
    if (!redeemCode.trim()) return;
    setIsRedeeming(true);
    try {
      const res = await api.post("/giftcard/redeem", { code: redeemCode });
      setGiftBalance(res.data.balance);
      showMessage(res.data.message || "Redeemed successfully!");
      setRedeemCode("");
      // Update local user object context
      setUser(prev => ({ ...prev, gift_card_balance: res.data.balance }));
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data || "Invalid code. Try GIFT100.", "error");
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleBuyCredits = async (e) => {
    e.preventDefault();
    const parsed = parseFloat(buyAmount);
    if (isNaN(parsed) || parsed <= 0) {
      showMessage("Please enter a valid amount", "error");
      return;
    }
    setIsBuyingGift(true);
    try {
      const res = await api.post("/giftcard/buy", { amount: parsed });
      setGiftBalance(res.data.balance);
      showMessage(`Added ₹${parsed} to your Gift Card balance!`);
      setBuyAmount("");
      setUser(prev => ({ ...prev, gift_card_balance: res.data.balance }));
    } catch (err) {
      console.error(err);
      showMessage("Failed to buy credits", "error");
    } finally {
      setIsBuyingGift(false);
    }
  };

  // ==========================================
  // MODULE 6: ACCOUNT PRIVACY
  // ==========================================
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleAccountDelete = async () => {
    const confirmation = window.confirm(
      "WARNING: This action is permanent. All your order history, profile details, active cart, and e-gift card balance will be deleted permanently. Do you wish to proceed?"
    );
    if (!confirmation) return;

    setIsDeletingAccount(true);
    try {
      await api.delete("/profile");
      setUser(null);
      showMessage("Your account has been deleted permanently.");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error(err);
      showMessage("Failed to delete account.", "error");
      setIsDeletingAccount(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 flex flex-col" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <Navbar />

      {/* Breadcrumb / Notification */}
      <div className="bg-white border-b border-slate-200 sticky top-[69px] z-40">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-slate-500 font-bold hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          {message.text && (
            <div className={`text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 border animate-[scaleUp_0.2s_ease-out] ${message.type === "error"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}>
              {message.type === "error" ? <AlertCircle size={13} /> : <Check size={13} />}
              {message.text}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-6xl w-full mx-auto px-6 py-8 flex-1">
        <div className="grid md:grid-cols-[240px_1fr] gap-8 items-start">
          {/* Side Tabs Navigation */}
          <aside className="bg-white border border-slate-200 rounded-3xl p-4 space-y-1 shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 mb-2">
              <h2 className="font-extrabold text-sm text-slate-800 leading-none">Hi, {user.name}</h2>
              <span className="text-[10px] text-slate-400 font-bold mt-1 block truncate">{user.email || user.phone}</span>
            </div>

            <button
              onClick={() => handleTabChange("profile")}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${currentTab === "profile"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <User size={15} /> Edit Profile
            </button>

            <button
              onClick={() => handleTabChange("orders")}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${currentTab === "orders"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <ShoppingBag size={15} /> My Orders
            </button>

            <button
              onClick={() => handleTabChange("wishlist")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${currentTab === "wishlist"
                ? "bg-rose-50 text-rose-600"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <span className="flex items-center gap-2.5">
                <Heart size={15} className={currentTab === "wishlist" ? "fill-rose-600 text-rose-600" : ""} /> My Wishlist
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                currentTab === "wishlist" ? "bg-rose-200 text-rose-800" : "bg-slate-100 text-slate-500"
              }`}>
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("addresses")}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${currentTab === "addresses"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <MapPin size={15} /> Saved Addresses
            </button>

            <button
              onClick={() => handleTabChange("subscriptions")}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${currentTab === "subscriptions"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <Repeat size={15} /> My Subscriptions
            </button>

            <button
              onClick={() => handleTabChange("giftcards")}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${currentTab === "giftcards"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <Gift size={15} /> E-Gift Cards
            </button>

            <button
              onClick={() => handleTabChange("help")}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${currentTab === "help"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <LifeBuoy size={15} /> Help Center
            </button>

            <button
              onClick={() => handleTabChange("privacy")}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold text-left transition-colors cursor-pointer ${currentTab === "privacy"
                ? "bg-red-50 text-red-600"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <ShieldAlert size={15} /> Account Privacy
            </button>
          </aside>

          {/* Right Side Content Panel */}
          <section className="bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 shadow-sm min-h-[450px] min-w-0">
            {/* TABS CONTAINER */}

            {/* TAB 1: PROFILE FORM */}
            {currentTab === "profile" && (
              <div>
                <h1 className="text-2xl font-bold mb-1.5" style={{ fontFamily: "'Fraunces', serif" }}>Edit Profile Details</h1>
                <p className="text-xs text-slate-400 font-semibold mb-6">Manage your primary details for quick ordering and notifications.</p>

                <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 font-semibold"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase tracking-wide">Mobile Number</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 font-semibold bg-slate-50 text-slate-500"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase tracking-wide">Email Address</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 font-semibold bg-slate-50 text-slate-500"
                        disabled
                      />
                    </div>
                  </div>

                  {addresses.length > 0 && (
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase tracking-wide">
                        Choose From Saved Addresses
                      </label>
                      <select
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          if (selectedId) {
                            const found = addresses.find(addr => addr.id.toString() === selectedId);
                            if (found) {
                              setProfileForm(prev => ({
                                ...prev,
                                address: found.address_line,
                                pincode: found.pincode || ""
                              }));
                            }
                          }
                        }}
                        className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 font-semibold bg-blue-50/50 text-slate-700 mb-4"
                      >
                        <option value="">-- Select a saved address to autofill --</option>
                        {addresses.map(addr => (
                          <option key={addr.id} value={addr.id}>
                            [{addr.type}] {addr.address_line.slice(0, 45)}... (Pincode: {addr.pincode})
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-slate-400 mt-1 block">Selecting an address will automatically copy details & detect pincode.</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase tracking-wide">Primary Delivery Address</label>
                    <textarea
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 min-h-24 font-medium mb-4"
                      placeholder="Add house number, street, city..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 mb-1.5 uppercase tracking-wide">Pincode</label>
                    <input
                      type="text"
                      value={profileForm.pincode}
                      onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 font-semibold"
                      placeholder="e.g. 110001"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Enter your 6-digit delivery pincode.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-extrabold px-6 py-3 rounded-full text-xs transition-colors flex items-center gap-2"
                  >
                    {isUpdatingProfile && <Loader2 size={14} className="animate-spin" />}
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: MY ORDERS */}
            {currentTab === "orders" && (
              <div>
                <h1 className="text-2xl font-bold mb-1.5" style={{ fontFamily: "'Fraunces', serif" }}>Your Orders</h1>
                <p className="text-xs text-slate-400 font-semibold mb-6">Track current orders or review past order history.</p>

                {isLoadingOrders ? (
                  <div className="py-12 flex justify-center">
                    <Loader2 size={24} className="animate-spin text-blue-600" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center max-w-sm mx-auto">
                    <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-100">
                      <ShoppingBag size={22} />
                    </div>
                    <h3 className="font-bold text-sm text-slate-800">No orders yet</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Once you buy items, your orders history will show up here.</p>
                    <Link to="/categories" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-full">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        {/* Order Meta Header */}
                        <div className="bg-slate-50/70 border-b border-slate-200 px-4 py-3 flex flex-wrap justify-between items-center gap-3">
                          <div className="flex gap-4">
                            <div>
                              <span className="block text-[10px] text-slate-400 font-extrabold uppercase">Order Placed</span>
                              <span className="text-xs font-bold text-slate-700">{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-slate-400 font-extrabold uppercase">Total Paid</span>
                              <span className="text-xs font-extrabold text-blue-600">₹{order.total}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-slate-400 font-extrabold uppercase">Payment</span>
                              <span className="text-xs font-bold text-slate-600 uppercase">{order.payment_method}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">Order ID: #{order.id}</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="p-4 divide-y divide-slate-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-3.5 flex justify-between items-center gap-4 first:pt-0 last:pb-0">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                  <img
                                    src={item.img?.startsWith("http") ? item.img : `https://picsum.photos/seed/${item.img || "item"}/100/100`}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                                  <span className="text-[10px] text-slate-400 font-bold">Qty: {item.quantity} · Price: ₹{item.price}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleBuyAgain(item)}
                                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Plus size={10} /> Buy Again
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Order Address Summary */}
                        <div className="bg-slate-50/30 border-t border-slate-100 px-4 py-2.5 text-[11px] font-semibold text-slate-500 truncate">
                          📍 Delivered to: {order.delivery_address}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MY WISHLIST */}
            {currentTab === "wishlist" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div>
                    <h1 className="text-xl font-extrabold text-[#17231A] flex items-center gap-2">
                      <Heart size={20} className="text-rose-600 fill-rose-600" /> My Saved Wishlist
                    </h1>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Bookmarked items saved for quick re-ordering.</p>
                  </div>
                  <span className="bg-rose-50 text-rose-700 text-[11px] font-black px-3 py-1 rounded-full border border-rose-200 self-start sm:self-auto">
                    {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {wishlist.length === 0 ? (
                  <div className="bg-[#FFFCF5] border border-slate-200 rounded-3xl p-8 text-center max-w-sm mx-auto space-y-3 shadow-2xs my-4">
                    <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                      <Heart size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#17231A]">Your Wishlist is empty</h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        Explore our daily essential categories and bookmark your favorite products.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/categories")}
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs px-5 py-2.5 rounded-full shadow-sm transition-all cursor-pointer"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-slate-200 hover:border-rose-300 rounded-2xl p-2.5 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between relative group"
                      >
                        <div>
                          {/* Item Image & Delete Button */}
                          <div className="h-28 sm:h-32 bg-slate-50 rounded-xl overflow-hidden mb-2 relative w-full flex items-center justify-center p-1.5">
                            <img
                              src={getProductImage(item.name, item.categoryKey || "dairy")}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                removeFromWishlist(item.id);
                                showMessage("Removed from Wishlist");
                              }}
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-rose-500 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                              title="Remove from Wishlist"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          <div className="text-[11px] font-extrabold text-[#17231A] line-clamp-1 leading-tight">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                            <span>{item.unit || "1 Pack"}</span>
                            <span>•</span>
                            <span className="text-amber-600 font-bold">⭐ {item.rating || "4.8"}</span>
                          </div>

                          <div className="flex items-baseline gap-1.5 mt-1.5">
                            <span className="font-mono text-xs font-black text-[#166534]">₹{item.price}</span>
                            {item.mrp && item.mrp > item.price && (
                              <span className="font-mono text-[10px] text-slate-400 line-through">₹{item.mrp}</span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            addToCart(item);
                            showMessage(`${item.name} added to Cart! 🛒`);
                          }}
                          className="w-full py-1.5 px-2 rounded-xl text-[11px] font-extrabold bg-[#16A34A] hover:bg-[#15803D] text-white shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer mt-2"
                        >
                          <ShoppingCart size={12} />
                          <span>Move to Cart</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SAVED ADDRESSES */}
            {currentTab === "addresses" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 mb-1">Manage Addresses</h1>
                  <p className="text-xs text-slate-500 font-semibold">Saved address locations for express doorstep deliveries.</p>
                </div>

                {/* TOP BANNER BUTTON: ADD A NEW ADDRESS (MATCHING IMAGE 2) */}
                {!showAddressForm && (
                  <button
                    type="button"
                    onClick={() => handleOpenAddressForm(null)}
                    className="w-full bg-white border border-slate-200 hover:border-blue-500 text-blue-600 font-bold p-4 rounded-xl text-xs flex items-center gap-2 transition-all shadow-2xs cursor-pointer group"
                  >
                    <Plus size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="uppercase tracking-wider font-extrabold">ADD A NEW ADDRESS</span>
                  </button>
                )}

                {/* FLIPKART STYLE ADDRESS FORM (MATCHING IMAGE 1) */}
                {showAddressForm && (
                  <div className="bg-slate-50/60 border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs text-left animate-[fadeIn_0.2s_ease-out]">
                    {/* Top Current Location Button */}
                    <div className="mb-5">
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={isDetectingLocation}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Navigation size={14} className={isDetectingLocation ? "animate-spin" : ""} />
                        <span>{isDetectingLocation ? "Fetching GPS Location..." : "Use my current location"}</span>
                      </button>
                    </div>

                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      {/* Row 1: Name & 10-digit mobile number */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          placeholder="Name"
                          className="w-full px-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 bg-white font-medium placeholder:text-slate-400"
                          required
                        />
                        <input
                          type="text"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          className="w-full px-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 bg-white font-medium placeholder:text-slate-400"
                          required
                        />
                      </div>

                      {/* Row 2: Pincode & Locality */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                          placeholder="Pincode"
                          maxLength={6}
                          className="w-full px-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 bg-white font-medium placeholder:text-slate-400"
                          required
                        />
                        <input
                          type="text"
                          value={addressForm.locality}
                          onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
                          placeholder="Locality"
                          className="w-full px-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 bg-white font-medium placeholder:text-slate-400"
                          required
                        />
                      </div>

                      {/* Row 3: Address (Area and Street) */}
                      <div>
                        <textarea
                          rows={3}
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          placeholder="Address (Area and Street)"
                          className="w-full px-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 bg-white font-medium placeholder:text-slate-400 resize-y"
                          required
                        ></textarea>
                      </div>

                      {/* Row 4: City/District/Town & State Dropdown */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="City/District/Town"
                          className="w-full px-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 bg-white font-medium placeholder:text-slate-400"
                          required
                        />
                        <div>
                          <select
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="w-full px-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 bg-white font-medium text-slate-800"
                            required
                          >
                            <option value="">--Select State--</option>
                            {INDIAN_STATES.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Row 5: Landmark (Optional) & Alternate Phone (Optional) */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={addressForm.landmark}
                          onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                          placeholder="Landmark (Optional)"
                          className="w-full px-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 bg-white font-medium placeholder:text-slate-400"
                        />
                        <input
                          type="text"
                          value={addressForm.alt_phone}
                          onChange={(e) => setAddressForm({ ...addressForm, alt_phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                          placeholder="Alternate Phone (Optional)"
                          maxLength={10}
                          className="w-full px-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 bg-white font-medium placeholder:text-slate-400"
                        />
                      </div>

                      {/* Row 6: Address Type Radios */}
                      <div className="pt-1">
                        <span className="block text-xs font-bold text-slate-500 mb-2">Address Type</span>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name="address_type"
                              value="HOME"
                              checked={addressForm.type === "HOME"}
                              onChange={() => setAddressForm({ ...addressForm, type: "HOME" })}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Home</span>
                          </label>
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name="address_type"
                              value="WORK"
                              checked={addressForm.type === "WORK"}
                              onChange={() => setAddressForm({ ...addressForm, type: "WORK" })}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Work</span>
                          </label>
                        </div>
                      </div>

                      {/* Validation Error Message */}
                      {modalError && (
                        <div className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg flex items-center gap-2">
                          <AlertCircle size={14} className="shrink-0 text-red-500" />
                          <span>{modalError}</span>
                        </div>
                      )}

                      {/* Row 7: Action Buttons: SAVE & CANCEL */}
                      <div className="flex items-center gap-4 pt-2">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3 rounded-lg text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                        >
                          {editingAddress ? "UPDATE" : "SAVE"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddress(null);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer px-2"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* SAVED ADDRESS CARDS LIST (MATCHING IMAGE 2) */}
                {isLoadingAddresses ? (
                  <div className="py-12 flex justify-center">
                    <Loader2 size={24} className="animate-spin text-blue-600" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="py-10 text-center max-w-sm mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3 border border-slate-100">
                      <MapPin size={20} />
                    </div>
                    <h3 className="font-bold text-sm text-slate-800">No Saved Addresses</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Add your shipping location for quick express deliveries.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs relative group text-left"
                      >
                        {/* Header Row: Type Tag & 3-Dots Options */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black tracking-wider uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {addr.type || "HOME"}
                          </span>

                          {/* 3-DOTS MENU BUTTON */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenAddressMenuId(openAddressMenuId === addr.id ? null : addr.id);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                              title="More Options"
                            >
                              <MoreVertical size={18} />
                            </button>

                            {/* Dropdown Popup Menu with Edit & Delete */}
                            {openAddressMenuId === addr.id && (
                              <div className="absolute right-0 top-8 w-28 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs font-semibold animate-[fadeIn_0.15s_ease-out]">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenAddressForm(addr);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit3 size={13} className="text-slate-500" /> Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenAddressMenuId(null);
                                    handleAddressDelete(addr.id);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 size={13} className="text-red-500" /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Name & Phone */}
                        <h4 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-3">
                          <span>{addr.name || user?.name || "Customer"}</span>
                          <span className="font-semibold text-slate-700 text-xs">{addr.phone || user?.phone || ""}</span>
                        </h4>

                        {/* Full Address Text */}
                        <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-2xl">
                          {addr.street || addr.address_line}
                          {addr.locality && `, ${addr.locality}`}
                          {addr.landmark && `, Landmark: ${addr.landmark}`}
                          {addr.city && `, ${addr.city}`}
                          {addr.state && `, ${addr.state}`}
                          {addr.pincode && (
                            <strong className="font-black text-slate-900 ml-1"> - {addr.pincode}</strong>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: MY SUBSCRIPTIONS */}
            {currentTab === "subscriptions" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-extrabold text-[#17231A] mb-1">My Subscriptions</h1>
                    <p className="text-xs text-slate-500 font-semibold">Track auto-deliveries, modify frequencies, and manage subscription cards.</p>
                  </div>
                  <Link
                    to="/subscriptions"
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold px-4 py-2.5 rounded-full text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
                  >
                    <span>Build & Track Subscriptions</span>
                    <ArrowLeft size={14} className="rotate-180" />
                  </Link>
                </div>

                {/* Subscription Builder Link Banner */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 mb-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 border border-blue-400/30">
                      <Sparkles size={12} className="text-amber-300 animate-pulse" /> Live Tracking & Builder Page
                    </div>
                    <h3 className="text-base font-extrabold text-white leading-tight">
                      Want to build custom subscription routines or track deliveries live?
                    </h3>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                      Customize daily milk, fresh fruits, vegetables, and pantry baskets on our dedicated Subscriptions Tracking Dashboard.
                    </p>
                  </div>
                  <Link
                    to="/subscriptions"
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs whitespace-nowrap transition-colors shadow-sm shrink-0 cursor-pointer"
                  >
                    Open Subscriptions Dashboard ➔
                  </Link>
                </div>

                {/* Subscriptions List */}
                <h3 className="font-extrabold text-sm text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Active & Tracked Subscription Cards ({subscriptions.length})</span>
                  <span className="text-xs text-slate-400 font-semibold">Real-time synced</span>
                </h3>

                {isLoadingSubscriptions ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 size={24} className="animate-spin text-blue-600" />
                  </div>
                ) : subscriptions.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Repeat size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">No active subscriptions found</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
                      Create your first automated subscription card to get fresh milk, vegetables, or pantry staples delivered automatically.
                    </p>
                    <Link
                      to="/subscriptions"
                      className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-full text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      Build Subscription Card ➔
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subscriptions.map((sub) => (
                      <div key={sub.id} className="border border-slate-200 rounded-2xl p-5 shadow-sm bg-white hover:border-slate-300 transition-all animate-[scaleUp_0.2s_ease-out]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                              <Repeat size={18} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-extrabold text-slate-900">{sub.plan_name}</h4>
                                <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {sub.orderId}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                                Frequency: <strong className="text-slate-800 font-bold">{sub.frequency}</strong> ({sub.timeSlot})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${sub.status === "Active"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}>
                              ● {sub.rawStatus || sub.status}
                            </span>
                          </div>
                        </div>

                        {/* Items preview if available */}
                        {sub.items && sub.items.length > 0 && (
                          <div className="py-2.5 flex flex-wrap gap-1.5 border-b border-slate-100">
                            {sub.items.map((item, idx) => (
                              <span key={idx} className="bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                                {item.name} {item.qty ? `(x${item.qty})` : ''}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="text-slate-600 font-medium">
                            <span>Next Scheduled Delivery: </span>
                            <strong className="text-blue-600 font-extrabold">{sub.next_delivery}</strong>
                            <span className="text-slate-400 font-bold ml-2">· ₹{sub.price}{sub.unit}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Link
                              to="/subscriptions"
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
                            >
                              <ExternalLink size={12} /> Track on Subscription Page
                            </Link>

                            <button
                              onClick={() => handleToggleSubscriptionStatus(sub)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border ${sub.status === "Active"
                                ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                }`}
                            >
                              {sub.status === "Active" ? "Pause" : "Resume"}
                            </button>

                            <button
                              onClick={() => handleCancelSubscription(sub)}
                              className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: E-GIFT CARDS */}
            {currentTab === "giftcards" && (
              <div>
                <h1 className="text-2xl font-extrabold text-[#17231A] mb-1.5">E-Gift Cards</h1>
                <p className="text-xs text-slate-500 font-semibold mb-6">Manage credits, purchase gift cards, or redeem promo card codes.</p>

                <div className="grid md:grid-cols-[300px_1fr] gap-6 items-start">
                  {/* Glowing Gift Card */}
                  <div className="relative w-full aspect-[1.6/1] bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-5 text-white flex flex-col justify-between shadow-xl border border-slate-700/50 overflow-hidden group">
                    {/* Glowing effect */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

                    <div className="flex justify-between items-start">
                      <div>
                        <span className="block text-[9px] font-black tracking-widest text-slate-400 uppercase">FillCarts Cash</span>
                        <h2 className="text-2xl font-bold font-serif leading-none mt-1">E-Gift Card</h2>
                      </div>
                      <Sparkles size={20} className="text-blue-400 animate-pulse" />
                    </div>

                    <div>
                      <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Available Credits</span>
                      <div className="text-3xl font-black text-white mt-0.5 flex items-baseline">
                        ₹{giftBalance}
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-700/50 pt-2.5">
                      <span className="text-[9px] font-bold text-slate-400">Cardholder: {user.name}</span>
                      <span className="text-[10px] font-mono text-slate-300 tracking-wider">**** **** {user.phone?.slice(-4)}</span>
                    </div>
                  </div>

                  {/* Transaction Actions */}
                  <div className="space-y-6">
                    {/* Redeem Promo Code Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <h3 className="text-xs font-extrabold text-slate-800 mb-2.5 uppercase tracking-wide">Redeem Gift Card Code</h3>
                      <form onSubmit={handleRedeemGiftCard} className="flex gap-2">
                        <input
                          type="text"
                          value={redeemCode}
                          onChange={(e) => setRedeemCode(e.target.value)}
                          placeholder="e.g. GIFT100"
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none flex-1 focus:border-blue-500 transition-colors uppercase"
                          required
                        />
                        <button
                          type="submit"
                          disabled={isRedeeming}
                          className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl px-4 py-2 transition-colors cursor-pointer"
                        >
                          {isRedeeming ? "Redeeming..." : "Redeem"}
                        </button>
                      </form>
                      <span className="block text-[9px] text-slate-400 mt-2 font-semibold">
                        Available test codes: <strong className="text-slate-600 font-bold">GIFT50</strong> (₹50), <strong className="text-slate-600 font-bold">GIFT100</strong> (₹100), <strong className="text-slate-600 font-bold">GIFT500</strong> (₹500).
                      </span>
                    </div>

                    {/* Buy Credits Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <h3 className="text-xs font-extrabold text-slate-800 mb-2.5 uppercase tracking-wide">Buy Gift Credits</h3>
                      <form onSubmit={handleBuyCredits} className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">₹</span>
                          <input
                            type="number"
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(e.target.value)}
                            placeholder="Enter amount (e.g. 200)"
                            className="bg-white border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs font-semibold outline-none w-full focus:border-blue-500 transition-colors"
                            min={1}
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isBuyingGift}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-xl px-4 py-2 transition-colors cursor-pointer"
                        >
                          {isBuyingGift ? "Adding..." : "Add Cash"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: HELP CENTER */}
            {currentTab === "help" && (
              <div>
                <h1 className="text-2xl font-bold mb-1.5" style={{ fontFamily: "'Fraunces', serif" }}>Help Center & FAQs</h1>
                <p className="text-xs text-slate-400 font-semibold mb-6">Need assistance? Explore our categorized topics or reach out to 24x7 customer support.</p>

                <SupportContent isEmbedded={true} />
              </div>
            )}

            {/* TAB 6: ACCOUNT PRIVACY */}
            {currentTab === "privacy" && (
              <div>
                <h1 className="text-2xl font-extrabold text-[#17231A] mb-1.5">Account Privacy</h1>
                <p className="text-xs text-slate-500 font-semibold mb-6">Manage data privacy settings, session authentication, and account state.</p>

                <div className="space-y-6 max-w-xl">
                  {/* Account Deletion Panel */}
                  <div className="border border-red-200 bg-red-50/30 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-red-700 mb-1 flex items-center gap-1.5">
                        <ShieldAlert size={16} /> Delete Customer Profile
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-md">
                        Permanently delete your entire customer profile record from our active databases. All orders, saved addresses, e-gift credits, and prescription details will be purged instantly and cannot be recovered.
                      </p>
                    </div>

                    <button
                      onClick={handleAccountDelete}
                      disabled={isDeletingAccount}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      {isDeletingAccount && <Loader2 size={13} className="animate-spin" />}
                      Delete Profile
                    </button>
                  </div>

                  {/* Safety notices */}
                  <div className="border border-slate-200 rounded-2xl p-5 space-y-3.5">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Data Protection Summary</h3>
                    <ul className="space-y-2 text-xs text-slate-600 font-medium">
                      <li className="flex gap-2 items-start">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>All database transactions are fully encrypted in transit using SSL protocol.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>Authorization validation tokens expire securely after 1 hour of session inactivity.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>Prescription details are locked specifically to your credentials and cannot be accessed by other clients.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* Global CSS for ScaleUp animation */}
      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
