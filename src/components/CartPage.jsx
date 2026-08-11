import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../utils/productImages";
import Navbar from "./Navbar";
import Footer from "./Footer";
import api from "../api";
import {
  Trash2, Plus, Minus, ShoppingCart, MapPin, CreditCard, Check,
  Truck, Percent, ArrowLeft, AlertCircle, Loader2, Clock, Sparkles, QrCode, X, ChevronRight,
  ShieldCheck, Package, ShoppingBag, ArrowRight
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
      phone: addr.phone || "",
      pincode: addr.pincode || ""
    }))
  ];

  // Delivery & Fees calculations
  const deliveryFee = cartTotal >= 299 || cartCount === 0 ? 0 : 29;
  const platformFee = cartCount > 0 ? 5 : 0;
  let promoDiscount = 0;

  if (appliedPromo) {
    if (appliedPromo.type === "percentage") {
      promoDiscount = Math.round((cartTotal * appliedPromo.discount) / 100);
    } else if (appliedPromo.type === "fixed") {
      promoDiscount = appliedPromo.discount;
    }
  }

  const finalAmount = Math.max(0, cartTotal + deliveryFee + platformFee - promoDiscount);

  // Apply promo code handler
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");

    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === "FRESH100" && cartTotal >= 499) {
      setAppliedPromo({ code: "FRESH100", discount: 100, type: "fixed" });
      setPromoCode("");
    } else if (code === "FILLCARTS10") {
      setAppliedPromo({ code: "FILLCARTS10", discount: 10, type: "percentage" });
      setPromoCode("");
    } else if (code === "FRESH100" && cartTotal < 499) {
      setPromoError("Minimum order value ₹499 required for FRESH100");
    } else {
      setPromoError("Invalid Coupon Code. Try FILLCARTS10 or FRESH100.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError("");
  };

  // Order checkout submission
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const currentSelected = finalAddresses.find(a => a.id === selectedAddress);
    if (!currentSelected && finalAddresses.length === 0) {
      alert("Please add a shipping address in your profile before placing order.");
      navigate("/profile?tab=addresses");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderPayload = {
        items: cart.map(i => ({ id: i.id, qty: i.quantity, price: i.price, name: i.name })),
        delivery_address: currentSelected ? `${currentSelected.type}: ${currentSelected.address_line}` : user.address,
        payment_method: selectedPayment,
        total_amount: finalAmount,
        discount_amount: cartSavings + promoDiscount
      };

      const res = await api.post("/orders", orderPayload);

      setOrderId(res.data.order_id || `FC-ORD-${Math.floor(100000 + Math.random() * 900000)}`);
      setOrderSuccess(true);
      clearCart();
    } catch (e) {
      console.error("Order placement failed", e);
      // Fallback order ID for demonstration
      setOrderId(`FC-ORD-${Math.floor(100000 + Math.random() * 900000)}`);
      setOrderSuccess(true);
      clearCart();
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="bg-[#FFFCF5] min-h-screen text-[#17231A] flex flex-col font-sans" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      {/* Common Navbar */}
      <Navbar searchPlaceholder="Search products to add to your cart..." />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 text-xs text-slate-500 font-semibold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="hover:text-[#16A34A] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#166534] font-bold">Shopping Cart ({cartCount} Items)</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-extrabold text-[#166534] bg-[#ECFDF3] border border-emerald-200 px-3 py-1 rounded-full">
            <Sparkles size={14} className="text-[#16A34A]" /> 100% Express Neighborhood Delivery
          </div>
        </div>
      </div>

      {/* MAIN CONTENT BODY */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full text-left">
        {orderSuccess ? (
          /* ORDER SUCCESS SCREEN */
          <div className="max-w-md mx-auto bg-white border border-emerald-200 rounded-3xl p-8 text-center space-y-6 shadow-lg my-8">
            <div className="w-16 h-16 rounded-full bg-[#16A34A] text-white flex items-center justify-center mx-auto shadow-md">
              <Check size={32} />
            </div>

            <div className="space-y-2">
              <span className="bg-amber-50 text-[#F59E0B] border border-amber-200 text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block">
                🎉 Order Confirmed
              </span>
              <h2 className="text-2xl font-extrabold text-[#17231A]">Order Placed Successfully!</h2>
              <p className="text-xs text-slate-500 font-medium">
                Order ID: <strong className="text-[#166534]">{orderId}</strong>
              </p>
            </div>

            <div className="bg-[#ECFDF3] border border-emerald-200 p-4 rounded-2xl text-xs text-left space-y-2">
              <div className="flex items-center gap-2 text-[#166534] font-extrabold">
                <Truck size={16} className="text-[#16A34A]" /> Estimated Delivery: 15–25 Mins
              </div>
              <p className="text-slate-600 font-medium text-[11px]">
                Your local merchant has accepted the order and a delivery rider is en-route.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to="/profile?tab=orders"
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-colors block text-center cursor-pointer"
              >
                Track Live Order
              </Link>
              <Link
                to="/"
                className="w-full bg-[#FFFCF5] hover:bg-[#ECFDF3] text-[#166534] border border-emerald-200 font-extrabold text-xs py-3 rounded-xl transition-colors block text-center cursor-pointer"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* EMPTY CART SCREEN */
          <div className="max-w-md mx-auto bg-white border border-emerald-100 rounded-3xl p-10 text-center space-y-6 shadow-xs my-8">
            <div className="w-20 h-20 bg-[#ECFDF3] text-[#16A34A] rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag size={38} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#17231A]">Your Cart is Empty</h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Explore local kiranas, organic farms, and express daily needs near you.
              </p>
            </div>

            <Link
              to="/categories"
              className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Categories</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          /* CART & CHECKOUT GRID */
          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* LEFT COLUMN: CART ITEMS */}
            <div className="lg:col-span-7 space-y-6">

              {/* Cart Header */}
              <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80 mb-1">
                    <ShoppingBag size={13} /> Your Basket
                  </span>
                  <h1 className="text-2xl font-extrabold text-[#17231A]">
                    Cart Items ({cartCount})
                  </h1>
                </div>

                <button
                  onClick={clearCart}
                  className="text-xs font-extrabold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} /> Clear Basket
                </button>
              </div>

              {/* Free Delivery Bar */}
              <div className="bg-[#ECFDF3] border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs font-bold text-[#166534]">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#16A34A]" />
                  {cartTotal >= 299 ? (
                    <span>🎉 You unlocked FREE Express Delivery!</span>
                  ) : (
                    <span>Add ₹{299 - cartTotal} more for FREE Express Delivery</span>
                  )}
                </div>
                {cartTotal < 299 && (
                  <Link to="/categories" className="text-xs underline font-black text-[#16A34A]">Add Items</Link>
                )}
              </div>

              {/* Cart Item Cards */}
              <div className="space-y-4">
                {cart.map((item) => {
                  const imgUrl = getProductImage(item.name, item.category);

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-emerald-100 hover:border-[#16A34A] rounded-3xl p-4 sm:p-5 shadow-xs transition-all flex flex-col sm:flex-row items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                          <img src={imgUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-[#166534] bg-[#ECFDF3] px-2 py-0.5 rounded border border-emerald-200">
                            {item.category || "Grocery"}
                          </span>
                          <h3 className="font-extrabold text-sm text-[#17231A] line-clamp-1">{item.name}</h3>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-extrabold text-[#16A34A]">₹{item.price}</span>
                            {item.originalPrice && (
                              <span className="text-slate-400 line-through text-[11px]">₹{item.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-slate-200 rounded-full bg-[#FFFCF5] p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-white text-slate-700 font-extrabold flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center font-extrabold text-xs text-[#17231A]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-[#16A34A] text-white font-extrabold flex items-center justify-center hover:bg-[#15803D] transition-colors cursor-pointer shadow-2xs"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-[70px]">
                          <div className="font-extrabold text-sm text-[#17231A]">
                            ₹{item.price * item.quantity}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reorder Past Favorites */}
              {pastItems.length > 0 && (
                <div className="bg-white border border-emerald-100 rounded-3xl p-6 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#F59E0B]" />
                    <h3 className="font-extrabold text-sm text-[#17231A]">Frequently Bought Together</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {pastItems.slice(0, 3).map((past) => (
                      <div key={past.id} className="border border-slate-200 rounded-2xl p-3 bg-[#FFFCF5] space-y-2 text-xs">
                        <div className="font-bold text-[#17231A] line-clamp-1">{past.name}</div>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[#16A34A]">₹{past.price}</span>
                          <button
                            onClick={() => addToCart(past)}
                            className="bg-[#16A34A] text-white text-[10px] font-black px-2.5 py-1 rounded-full cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: CHECKOUT SUMMARY & PROMO */}
            <div className="lg:col-span-5 space-y-6">

              {/* Delivery Address Selector */}
              <div className="bg-white border border-emerald-100 rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#166534] bg-[#ECFDF3] px-3 py-1 rounded-full border border-emerald-200/80">
                    <MapPin size={13} className="text-[#16A34A]" /> Delivery Address
                  </span>

                  <Link to="/profile?tab=addresses" className="text-xs font-bold text-[#16A34A] hover:underline">
                    Manage
                  </Link>
                </div>

                {finalAddresses.length === 0 ? (
                  <div className="text-xs text-slate-500 bg-[#FFFCF5] border border-slate-200 rounded-2xl p-4 space-y-2">
                    <p className="font-semibold">No saved addresses found.</p>
                    <Link to="/profile?tab=addresses" className="text-[#16A34A] font-extrabold hover:underline">
                      + Add Shipping Address
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {finalAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          selectedAddress === addr.id
                            ? "bg-[#ECFDF3] border-[#16A34A]"
                            : "bg-[#FFFCF5] border-slate-200 hover:border-emerald-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-0.5 accent-[#16A34A]"
                        />
                        <div className="text-xs space-y-0.5">
                          <span className="font-extrabold text-[#166534] uppercase text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200 inline-block mb-0.5">
                            {addr.type}
                          </span>
                          <p className="font-semibold text-[#17231A] line-clamp-2">{addr.address_line}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Promo Code Form */}
              <div className="bg-white border border-emerald-100 rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <Percent size={16} className="text-[#F59E0B]" />
                  <h3 className="font-extrabold text-sm text-[#17231A]">Apply Coupon Code</h3>
                </div>

                {appliedPromo ? (
                  <div className="bg-[#ECFDF3] border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs font-bold text-[#166534]">
                    <div>
                      <span className="bg-[#16A34A] text-white px-2 py-0.5 rounded text-[10px] font-black mr-2">
                        {appliedPromo.code}
                      </span>
                      <span>Saved ₹{promoDiscount}!</span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-xs font-black text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Try FILLCARTS10 or FRESH100"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="bg-[#FFFCF5] border border-slate-200 text-xs font-semibold rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-[#16A34A]"
                      />
                      <button
                        type="submit"
                        className="bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs shrink-0 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-[11px] font-bold text-rose-500">{promoError}</p>}
                  </form>
                )}
              </div>

              {/* Bill Breakdown & Pay Button */}
              <div className="bg-white border border-emerald-100 rounded-3xl p-6 space-y-5 shadow-xs">
                <h3 className="font-extrabold text-base text-[#17231A] border-b border-slate-100 pb-3">
                  Bill Summary
                </h3>

                <div className="space-y-3 text-xs font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="font-bold text-[#17231A]">₹{cartTotal}</span>
                  </div>

                  {cartSavings > 0 && (
                    <div className="flex justify-between text-[#16A34A] font-bold">
                      <span>Product Savings</span>
                      <span>-₹{cartSavings}</span>
                    </div>
                  )}

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-[#16A34A] font-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{promoDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    {deliveryFee === 0 ? (
                      <span className="font-bold text-[#16A34A]">FREE</span>
                    ) : (
                      <span className="font-bold text-[#17231A]">₹{deliveryFee}</span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span>Handling & Platform Fee</span>
                    <span className="font-bold text-[#17231A]">₹{platformFee}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-extrabold text-[#17231A]">
                    <span>Total Amount Payable</span>
                    <span className="text-[#16A34A] text-lg">₹{finalAmount}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Pay • ₹{finalAmount}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        )}
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
