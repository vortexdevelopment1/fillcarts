import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../utils/productImages";
import Navbar from "./Navbar";
import Footer from "./Footer";
import api from "../api";
import {
  Trash2, Plus, Minus, ShoppingCart, MapPin, CreditCard, Check,
  Truck, Percent, ArrowLeft, AlertCircle, Loader2, Clock, Sparkles, QrCode, X, ChevronRight
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    cartSavings,
    user
  } = useCart();

  const navigate = useNavigate();

  // Checkout form states
  const [selectedAddress, setSelectedAddress] = useState("profile");
  const [selectedPayment, setSelectedPayment] = useState("upi");

  // Promo code states
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discount, type }
  const [promoError, setPromoError] = useState("");

  // Order flow states
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [dbAddresses, setDbAddresses] = useState([]);
  const [pastItems, setPastItems] = useState([]);

  // Fetch unique items from past orders
  useEffect(() => {
    const loadPastItems = async () => {
      if (user) {
        try {
          const res = await api.get("/orders");
          const ordersList = res.data.orders || [];
          const itemsMap = new Map();
          ordersList.forEach(order => {
            if (Array.isArray(order.items)) {
              order.items.forEach(item => {
                itemsMap.set(item.id, item);
              });
            }
          });
          setPastItems(Array.from(itemsMap.values()));
        } catch (e) {
          console.error("Failed to load purchase history", e);
        }
      }
    };
    loadPastItems();
  }, [user]);

  // Fetch user's saved addresses
  useEffect(() => {
    const loadAddresses = async () => {
      if (user) {
        try {
          const res = await api.get("/addresses");
          setDbAddresses(res.data.addresses || []);
          if (res.data.addresses && res.data.addresses.length > 0) {
            setSelectedAddress(res.data.addresses[0].id.toString());
          } else if (user.address) {
            setSelectedAddress("profile");
          }
        } catch (e) {
          console.error("Failed to load saved addresses", e);
        }
      }
    };
    loadAddresses();
  }, [user]);

  const finalAddresses = [
    ...(user?.address ? [{
      id: "profile",
      type: "Primary Profile",
      address_line: user.address,
      phone: user.phone || "",
      pincode: user.pincode || ""
    }] : []),
    ...dbAddresses.map(addr => ({
      id: addr.id.toString(),
      type: addr.type,
      address_line: addr.address_line,
      phone: addr.phone,
      pincode: addr.pincode || ""
    }))
  ];

  const deliveryThreshold = 299;
  const standardDeliveryFee = 39;
  const taxesAndHandling = 15;

  // Compute shipping fee
  const isFreeDelivery = cartTotal >= deliveryThreshold || (appliedPromo && appliedPromo.code === "FREEDEL");
  const deliveryFee = cartTotal === 0 ? 0 : (isFreeDelivery ? 0 : standardDeliveryFee);

  // Compute discount
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "percent") {
      discount = Math.round(cartTotal * (appliedPromo.value / 100));
    } else if (appliedPromo.type === "flat") {
      discount = Math.min(cartTotal, appliedPromo.value);
    }
  }

  const grandTotal = Math.max(0, cartTotal - discount + deliveryFee + taxesAndHandling);
  const totalSavingsAmount = cartSavings + discount + (isFreeDelivery && cartTotal > 0 ? standardDeliveryFee : 0);

  // Apply promo code handler
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    const cleanCode = promoCode.trim().toUpperCase();

    if (!cleanCode) {
      setPromoError("Please enter a promo code.");
      return;
    }

    if (cleanCode === "FILLCARTS20") {
      setAppliedPromo({ code: "FILLCARTS20", type: "percent", value: 20, description: "20% off on all items" });
      setPromoCode("");
    } else if (cleanCode === "WELCOME100") {
      if (cartTotal >= 500) {
        setAppliedPromo({ code: "WELCOME100", type: "flat", value: 100, description: "Flat ₹100 off on orders above ₹500" });
        setPromoCode("");
      } else {
        setPromoError("This coupon is only applicable for orders above ₹500.");
      }
    } else if (cleanCode === "FREEDEL") {
      setAppliedPromo({ code: "FREEDEL", type: "freedel", value: 0, description: "Free delivery applied" });
      setPromoCode("");
    } else {
      setPromoError("Invalid coupon code. Try 'FILLCARTS20' or 'FREEDEL'.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  // Place Order handler - Redirects user to App Checkout & QR Code Modal
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setShowAppModal(true);
  };

  if (orderSuccess) {
    const chosenAddressObj = finalAddresses.find(a => a.id === selectedAddress);
    return (
      <div className="bg-slate-50 min-h-screen text-slate-900 flex flex-col" style={{ fontFamily: "'Manrope', sans-serif" }}>
        <Navbar />
        <main className="max-w-xl w-full mx-auto px-6 py-16 flex-1 flex flex-col justify-center items-center text-center">
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-lg max-w-md w-full animate-[scaleUp_0.3s_ease-out]">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-inner">
              <Check size={32} strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Order Placed!
            </h1>
            <p className="text-sm text-slate-500 font-semibold mb-6">
              Thank you for your order. Your delivery is scheduled to arrive at your door in 15 minutes!
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 mb-8">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>ORDER ID</span>
                <span className="text-slate-800">#{orderId}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>DELIVERY TO</span>
                <span className="text-slate-800 text-right truncate max-w-[200px]">{chosenAddressObj?.address_line || user?.address || "Primary Address"}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>TOTAL PAID</span>
                <span className="text-blue-600 font-extrabold">₹{grandTotal}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/profile?tab=orders"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-full text-xs transition-colors block text-center"
              >
                Track Order History
              </Link>
              <Link
                to="/"
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold py-3.5 rounded-full text-xs transition-colors block text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <Navbar />

      {/* Breadcrumb / Back button */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center gap-3">
          <Link to="/categories" className="flex items-center gap-1.5 text-sm text-slate-500 font-bold hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8" style={{ fontFamily: "'Fraunces', serif" }}>
          Your <span className="text-blue-600">Cart</span>
        </h1>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto my-8 shadow-sm">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={36} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Looks like you haven't added anything to your cart yet. Browse our categories and grab some fresh items!
            </p>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-3.5 rounded-full shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Active Cart State */
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

            {/* Left Column: Items, Address, Payments */}
            <div className="space-y-6">

              {/* Cart Items List */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                  <h2 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                    🛒 Items in Cart <span className="text-sm font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{cartCount}</span>
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-xs text-slate-400 hover:text-red-500 font-bold transition-colors flex items-center gap-1"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                        <img
                          src={item.img && item.img.startsWith("http") ? item.img : getProductImage(item.name)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-slate-900 truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-extrabold text-slate-900">₹{item.price}</span>
                          {item.mrp && item.mrp > item.price && (
                            <span className="text-xs text-slate-400 line-through">₹{item.mrp}</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full p-1">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded-full bg-white text-slate-600 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm"
                        >
                          {item.quantity === 1 ? <Trash2 size={13} className="text-red-500" /> : <Minus size={13} />}
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-7 h-7 rounded-full bg-white text-slate-600 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Item Subtotal */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-sm font-extrabold text-slate-900">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Buy It Again Section */}
                {user && pastItems.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mt-6">
                    <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-1.5 uppercase tracking-wide">
                      <Sparkles size={14} className="text-blue-600 animate-pulse" /> From Your Purchase History
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {pastItems.slice(0, 4).map((item) => (
                        <div key={item.id} className="border border-slate-100 rounded-2xl p-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                          <div>
                            <div className="w-full aspect-square rounded-xl bg-slate-50 overflow-hidden mb-2">
                              <img
                                src={item.img?.startsWith("http") ? item.img : `https://picsum.photos/seed/${item.img || "item"}/150/150`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                            <span className="text-xs font-extrabold text-slate-950 block mt-1">₹{item.price}</span>
                          </div>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-extrabold py-2 rounded-xl mt-3 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus size={10} /> Buy Again
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Address */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                    📍 Delivery Address
                  </h2>
                  <Link to="/profile?tab=addresses" className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1">
                    Manage Addresses <ChevronRight size={12} />
                  </Link>
                </div>
                {finalAddresses.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold mb-3">No delivery addresses found.</p>
                    <Link to="/profile?tab=addresses" className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold">
                      Add Address
                    </Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {finalAddresses.map((addr) => {
                      const isSelected = selectedAddress === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddress(addr.id)}
                          className={`border rounded-2xl p-4 cursor-pointer relative transition-all ${isSelected
                            ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-600"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                              }`}>
                              {addr.type}
                            </span>
                            {isSelected && <Check size={16} className="text-blue-600" />}
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium mb-2">{addr.address_line}</p>
                          <span className="text-[11px] text-slate-700 font-extrabold block mb-1">Pincode: {addr.pincode}</span>
                          <span className="text-[11px] text-slate-400 font-bold block">{addr.phone}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h2 className="font-extrabold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  💳 Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { id: "upi", label: "UPI (Google Pay / PhonePe / Paytm)", desc: "Pay instantly using your UPI app", icon: Sparkles },
                    { id: "card", label: "Credit or Debit Card", desc: "Visa, Mastercard, RuPay, Maestro", icon: CreditCard },
                    { id: "cod", label: "Cash on Delivery (COD)", desc: "Pay cash/UPI at the time of delivery", icon: MapPin }
                  ].map((pm) => {
                    const isSelected = selectedPayment === pm.id;
                    return (
                      <div
                        key={pm.id}
                        onClick={() => setSelectedPayment(pm.id)}
                        className={`border rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all ${isSelected
                          ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-600"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                          }`}>
                          <pm.icon size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-900">{pm.label}</div>
                          <div className="text-xs text-slate-500 font-medium">{pm.desc}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"
                          }`}>
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Pricing Summary & Promos */}
            <div className="space-y-6 sticky top-24">

              {/* Promo Code Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
                  <Percent size={15} className="text-blue-600" /> Apply Coupon
                </h3>

                {appliedPromo ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-emerald-800 flex items-center gap-1">
                        Code <span className="bg-emerald-100 px-1.5 py-0.5 rounded">{appliedPromo.code}</span> Applied!
                      </div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">{appliedPromo.description}</div>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-xs text-slate-400 hover:text-red-500 font-extrabold ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. FILLCARTS20"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none flex-1 focus:border-blue-500 transition-colors uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl px-4 py-2 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <div className="text-red-500 text-[11px] font-bold mt-2 flex items-center gap-1">
                    <AlertCircle size={11} /> {promoError}
                  </div>
                )}

                {!appliedPromo && (
                  <div className="mt-3.5 bg-blue-50/50 rounded-xl p-3 border border-blue-100">
                    <div className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider mb-1">Available Coupons</div>
                    <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                      <li className="flex justify-between items-center">
                        <span>🏷️ <strong className="font-bold text-slate-800">FILLCARTS20</strong> (20% Off)</span>
                        <button
                          onClick={() => { setPromoCode("FILLCARTS20"); setPromoError(""); }}
                          className="text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          Tap to use
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>🏷️ <strong className="font-bold text-slate-800">FREEDEL</strong> (Free delivery)</span>
                        <button
                          onClick={() => { setPromoCode("FREEDEL"); setPromoError(""); }}
                          className="text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          Tap to use
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Delivery Progress Bar threshold indicator */}
              {!isFreeDelivery && cartTotal > 0 && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-5 shadow-sm text-center">
                  <div className="flex justify-between text-xs font-extrabold text-amber-800 mb-1.5">
                    <span className="flex items-center gap-1">🚚 Delivery Fee: ₹39</span>
                    <span>Add ₹{deliveryThreshold - cartTotal} more for FREE delivery</span>
                  </div>
                  <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (cartTotal / deliveryThreshold) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-amber-600 mt-2 font-semibold">
                    Tip: Add a small snack or drink to waive the delivery charges!
                  </p>
                </div>
              )}

              {/* Bill Details */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
                  Bill Summary
                </h3>

                <div className="space-y-2.5 text-sm font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="text-slate-900">₹{cartTotal}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Partner Fee</span>
                    <span className="text-slate-900">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxes & Handling Charges</span>
                    <span className="text-slate-900">₹{taxesAndHandling}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-center">
                  <span className="font-extrabold text-base text-slate-900">Grand Total</span>
                  <span className="font-extrabold text-xl text-blue-600">₹{grandTotal}</span>
                </div>

                {totalSavingsAmount > 0 && (
                  <div className="bg-emerald-50 text-emerald-700 text-xs font-extrabold p-3 rounded-2xl flex items-center gap-2 justify-center border border-emerald-100 animate-pulse">
                    🎉 You save ₹{totalSavingsAmount} on this order!
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-extrabold py-4 rounded-full text-base transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-slate-200"
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Processing Checkout...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout · ₹{grandTotal}
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        )}
      </main>

      <Footer />

      {/* App Checkout QR Code Modal */}
      {showAppModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl relative overflow-hidden animate-[scaleUp_0.3s_ease-out] text-center">
            {/* Close Button */}
            <button
              onClick={() => setShowAppModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X size={14} />
            </button>

            {/* Header */}
            <div className="mt-2 mb-5">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <ShoppingCart size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-snug" style={{ fontFamily: "'Fraunces', serif" }}>
                Complete Order on Mobile App
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                To guarantee express 15-minute delivery, orders must be checked out through our mobile application.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center mb-4">
              <div className="relative p-3 bg-white border border-slate-200 rounded-2xl shadow-sm mb-2.5">
                <QrCode size={120} className="text-slate-900" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center border-2 border-white shadow">
                  <span className="text-[9px] font-black text-white leading-none">FC</span>
                </div>
              </div>

              <div className="text-xs font-extrabold text-slate-900 mb-0.5">
                Scan with phone camera to open app
              </div>
              <div className="text-[10px] font-semibold text-slate-400">
                Cart Total: <strong className="text-blue-600 font-extrabold">₹{grandTotal}</strong> ({cartCount} items)
              </div>
            </div>

            {/* Sync Alert message */}
            <div className="bg-blue-50/70 text-blue-900 text-xs font-bold p-3.5 rounded-2xl border border-blue-100 mb-5 text-left leading-relaxed">
              💡 <strong className="font-extrabold text-blue-950">Your cart is saved!</strong> Logging into the app using {user?.phone ? `+91 ${user.phone}` : "your phone number"} will automatically sync your cart for instant 15-minute delivery.
            </div>

            {/* Store Download Links */}
            <div className="flex gap-2">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl text-xs transition-colors inline-block cursor-pointer shadow-sm"
              >
                App Store
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-xs transition-colors inline-block cursor-pointer shadow-sm shadow-blue-100"
              >
                Google Play
              </a>
            </div>

          </div>
        </div>
      )}

      {/* CSS Anim keyframe injection */}
      <style>{`
        @keyframes scaleUp {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

    </div>
  );
}
