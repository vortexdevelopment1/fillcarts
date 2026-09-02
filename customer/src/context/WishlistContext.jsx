import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";
import { useCart } from "./CartContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const cartContext = useCart() || {};
  const { user, setShowLoginModal } = cartContext;

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all wishlist items from MongoDB for logged in user
  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/wishlist");
      if (res.data && Array.isArray(res.data.data)) {
        setWishlist(res.data.data);
      } else if (res.data && Array.isArray(res.data)) {
        setWishlist(res.data);
      } else {
        setWishlist([]);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist from server:", err.message);
      if (err.response?.status === 401) {
        setWishlist([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Sync wishlist whenever authenticated user changes
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user, fetchWishlist]);

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      const cleanTargetId = String(productId).trim();
      return wishlist.some((item) => {
        if (!item) return false;
        const itemId = String(item.id || item.productId || item._id || "");
        const mongoId = item._id ? String(item._id) : "";
        const customId = item.productId ? String(item.productId) : "";
        return (
          itemId === cleanTargetId ||
          mongoId === cleanTargetId ||
          customId === cleanTargetId
        );
      });
    },
    [wishlist]
  );

  // Add product to MongoDB wishlist with optimistic update
  const addToWishlist = async (product) => {
    if (!product) return false;

    if (!user) {
      if (typeof setShowLoginModal === "function") {
        setShowLoginModal(true);
      }
      return false;
    }

    const prodId = product.productId || product._id || product.id;
    if (!prodId) return false;

    // Optimistic UI update
    const previousWishlist = [...wishlist];
    setWishlist((prev) => {
      const exists = prev.some((item) => {
        const iId = String(item.id || item.productId || item._id || "");
        return iId === String(prodId);
      });
      if (exists) return prev;
      return [
        {
          ...product,
          id: product.productId || product.id || String(product._id),
          wishlistedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });

    try {
      await api.post(`/wishlist/${encodeURIComponent(prodId)}`);
      // Re-sync with backend to get populated and normalized MongoDB document
      await fetchWishlist();
      return true;
    } catch (err) {
      console.error("Error adding to wishlist:", err.message);
      // Rollback optimistic update on error
      setWishlist(previousWishlist);
      return false;
    }
  };

  // Remove product from MongoDB wishlist with optimistic update
  const removeFromWishlist = async (productId) => {
    if (!productId) return false;

    if (!user) {
      if (typeof setShowLoginModal === "function") {
        setShowLoginModal(true);
      }
      return false;
    }

    const cleanTargetId = String(productId).trim();
    const previousWishlist = [...wishlist];

    // Optimistic UI update
    setWishlist((prev) =>
      prev.filter((item) => {
        if (!item) return false;
        const itemId = String(item.id || item.productId || item._id || "");
        const mongoId = item._id ? String(item._id) : "";
        const customId = item.productId ? String(item.productId) : "";
        return (
          itemId !== cleanTargetId &&
          mongoId !== cleanTargetId &&
          customId !== cleanTargetId
        );
      })
    );

    try {
      await api.delete(`/wishlist/${encodeURIComponent(cleanTargetId)}`);
      await fetchWishlist();
      return true;
    } catch (err) {
      console.error("Error removing from wishlist:", err.message);
      // Rollback on error
      setWishlist(previousWishlist);
      return false;
    }
  };

  // Toggle wishlist state
  const toggleWishlist = async (product) => {
    if (!product) return false;
    if (!user) {
      if (typeof setShowLoginModal === "function") {
        setShowLoginModal(true);
      }
      return false;
    }

    const prodId = product.productId || product._id || product.id;
    if (!prodId) return false;

    if (isInWishlist(prodId)) {
      await removeFromWishlist(prodId);
      return false; // Removed
    } else {
      await addToWishlist(product);
      return true; // Added
    }
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        loading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

export default WishlistContext;
