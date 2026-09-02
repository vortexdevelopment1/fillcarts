import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getWishlistCount,
} from "../controllers/wishlistController.js";

const router = express.Router();

// All wishlist routes require customer JWT authentication
router.use(authMiddleware);

// Get count of items in wishlist
router.get("/count", getWishlistCount);

// Get all wishlist items for logged in user
router.get("/", getWishlist);

// Add product to wishlist
router.post("/:productId", addToWishlist);

// Remove product from wishlist
router.delete("/:productId", removeFromWishlist);

export default router;
