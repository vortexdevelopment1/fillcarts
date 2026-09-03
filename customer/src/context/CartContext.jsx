import React, { createContext, useContext, useState, useEffect } from "react";
import api, { setOnUnauthorized } from "../api";
import { Lock, X } from "lucide-react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [cart, setCart] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Register global 401 unauthorized handler to clear invalid user session
  useEffect(() => {
    setOnUnauthorized(() => {
      localStorage.removeItem("token");
      setUser(null);
    });
  }, []);

  // Global Location State
  const [userLocation, setUserLocation] = useState(() => {
    const saved = localStorage.getItem("fillcarts_user_location");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      city: "Indore",
      area: "Vijay Nagar",
      pincode: "452010",
      state: "M.P.",
      formatted: "Vijay Nagar, Indore (452010)",
      isGps: false
    };
  });

  const changeLocation = (newLoc) => {
    setUserLocation(newLoc);
    localStorage.setItem("fillcarts_user_location", JSON.stringify(newLoc));
  };

  // Fetch authenticated user profile on mount
  const checkUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    try {
      const res = await api.get("/profile");
      if (res.data && res.data.customer) {
        setUser(res.data.customer);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    checkUserProfile();
  }, []);

  // When user logs in/out, load the user-specific cart from database or guest local storage
  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        const userKey = `fillcarts_cart_${user.phone || user.email || user.id}`;
        const localUserStored = localStorage.getItem(userKey);
        const parsedLocalUserCart = localUserStored ? JSON.parse(localUserStored) : [];

        try {
          const res = await api.get("/cart");
          if (res.data && Array.isArray(res.data.cart) && res.data.cart.length > 0) {
            setCart(res.data.cart);
            localStorage.setItem(userKey, JSON.stringify(res.data.cart));
          } else if (parsedLocalUserCart.length > 0) {
            setCart(parsedLocalUserCart);
            await api.post("/cart", { cart: parsedLocalUserCart });
          } else {
            // Transfer guest cart if present
            const guestKey = "fillcarts_guest_cart";
            const localStored = localStorage.getItem(guestKey);
            if (localStored) {
              const parsed = JSON.parse(localStored);
              if (parsed.length > 0) {
                await api.post("/cart", { cart: parsed });
                setCart(parsed);
                localStorage.setItem(userKey, JSON.stringify(parsed));
                localStorage.removeItem(guestKey);
                return;
              }
            }
            setCart([]);
          }
        } catch (e) {
          if (e.response?.status === 401) {
            setUser(null);
          } else {
            console.error("Failed to fetch cart from server", e);
          }
          setCart(parsedLocalUserCart);
        }
      } else {
        const guestKey = "fillcarts_guest_cart";
        const guestStored = localStorage.getItem(guestKey);
        setCart(guestStored ? JSON.parse(guestStored) : []);
      }
    };

    syncCart();
  }, [user]);

  // When cart changes, save to user-specific localStorage and backend if logged in
  useEffect(() => {
    if (user) {
      const userKey = `fillcarts_cart_${user.phone || user.email}`;
      localStorage.setItem(userKey, JSON.stringify(cart));

      const saveCartToServer = async () => {
        try {
          await api.post("/cart", { cart });
        } catch (e) {
          if (e.response?.status === 401) {
            setUser(null);
          } else {
            console.error("Failed to save cart to server", e);
          }
        }
      };
      saveCartToServer();
    } else {
      const guestKey = "fillcarts_guest_cart";
      localStorage.setItem(guestKey, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product) => {
    if (!product) return;
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const prodId = product.id || product.productId || product._id;
    if (!prodId) return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item && (item.id === prodId || item.productId === prodId || item._id === prodId));
      if (existing) {
        return prevCart.map((item) =>
          item && (item.id === prodId || item.productId === prodId || item._id === prodId)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, id: prodId, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    if (!id || !user) return;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item && (item.id === id || item.productId === id || item._id === id));
      if (!existing) return prevCart;
      if ((existing.quantity || 1) <= 1) {
        return prevCart.filter((item) => item && item.id !== id && item.productId !== id && item._id !== id);
      }
      return prevCart.map((item) =>
        item && (item.id === id || item.productId === id || item._id === id)
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const updateQuantity = (id, qty) => {
    if (!id || !user) return;
    if (qty <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item && item.id !== id && item.productId !== id && item._id !== id));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item && (item.id === id || item.productId === id || item._id === id)
            ? { ...item, quantity: qty }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const logoutUser = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      console.error("Logout failed", e);
    }
    localStorage.removeItem("token");
    setUser(null);
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + (item?.quantity || 0), 0);
  const cartTotal = cart.reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 0), 0);
  const cartSavings = cart.reduce((total, item) => {
    const savingsPerItem = Math.max(0, (item?.mrp || item?.price || 0) - (item?.price || 0));
    return total + savingsPerItem * (item?.quantity || 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        cartSavings,
        user,
        setUser,
        loadingUser,
        logoutUser,
        checkUserProfile,
        setShowLoginModal,
        userLocation,
        changeLocation
      }}
    >
      {children}

      {/* Global Login Prompt Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden text-center animate-[scaleUp_0.3s_ease-out]">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X size={14} />
            </button>

            <div className="mt-2 mb-6">
              <div className="w-12 h-12 bg-[#ECFDF3] text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock size={20} />
              </div>
              <h2 className="text-lg font-black text-[#17231A] leading-snug">
                Login Required
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1.5 max-w-[240px] mx-auto leading-relaxed">
                Please log in to add items to your cart, manage subscriptions, and track doorstep delivery.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <a
                href="/login"
                onClick={() => setShowLoginModal(false)}
                className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold py-3 rounded-xl text-xs transition-colors inline-block text-center shadow-md cursor-pointer"
              >
                Login Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for animations */}
      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
