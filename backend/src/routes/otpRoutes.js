import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  registerCustomer,
  loginCustomer,
  getProfile,
  updateProfile,
  deleteProfile,
  logoutCustomer,
  sendOtp,
  verifyOtp,
  forgotPasswordSendOtp,
  forgotPasswordReset,
} from "../controllers/authController.js";
import { getCart, saveCart } from "../controllers/cartController.js";
import { getOrders, createOrder } from "../controllers/orderController.js";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import {
  getSubscriptions,
  createSubscription,
  updateSubscriptionStatus,
  deleteSubscription,
} from "../controllers/subscriptionController.js";
import {
  getGiftCardBalance,
  redeemGiftCard,
  buyGiftCard,
} from "../controllers/giftCardController.js";

const router = express.Router();

// ==========================================
// 1. CUSTOMER AUTHENTICATION & PROFILE
// ==========================================
router.post("/register-customer", registerCustomer);
router.post(["/login-customer", "/customer/login"], loginCustomer);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.delete("/profile", authMiddleware, deleteProfile);
router.post("/logout", logoutCustomer);

// ==========================================
// 2. EMAIL OTP VERIFICATION
// ==========================================
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password/send-otp", forgotPasswordSendOtp);
router.post("/forgot-password/reset", forgotPasswordReset);

// ==========================================
// 3. SHOPPING CART
// ==========================================
router.get("/cart", authMiddleware, getCart);
router.post("/cart", authMiddleware, saveCart);

// ==========================================
// 4. ORDERS & CHECKOUT
// ==========================================
router.get("/orders", authMiddleware, getOrders);
router.post("/orders", authMiddleware, createOrder);

// ==========================================
// 5. DELIVERY ADDRESSES
// ==========================================
router.get("/addresses", authMiddleware, getAddresses);
router.post("/addresses", authMiddleware, createAddress);
router.put("/addresses/:id", authMiddleware, updateAddress);
router.delete("/addresses/:id", authMiddleware, deleteAddress);

// ==========================================
// 6. DAILY SUBSCRIPTIONS
// ==========================================
router.get("/subscriptions", authMiddleware, getSubscriptions);
router.post("/subscriptions", authMiddleware, createSubscription);
router.put("/subscriptions/:id/status", authMiddleware, updateSubscriptionStatus);
router.delete("/subscriptions/:id", authMiddleware, deleteSubscription);

// ==========================================
// 7. GIFT CARDS & WALLET
// ==========================================
router.get("/giftcard", authMiddleware, getGiftCardBalance);
router.post("/giftcard/redeem", authMiddleware, redeemGiftCard);
router.post("/giftcard/buy", authMiddleware, buyGiftCard);

export default router;