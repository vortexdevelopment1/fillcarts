import mongoose from "mongoose";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

/**
 * Helper to resolve product document by ObjectId or custom string productId
 */
const findProduct = async (id) => {
  if (!id) return null;
  const cleanId = String(id).trim();

  let product = null;
  if (mongoose.Types.ObjectId.isValid(cleanId)) {
    product = await Product.findById(cleanId);
  }
  if (!product) {
    product = await Product.findOne({ productId: cleanId });
  }
  return product;
};

/**
 * @desc    Add product to user's wishlist
 * @route   POST /api/wishlist/:productId
 * @access  Private
 */
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await findProduct(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if already in wishlist to prevent duplicate entries
    let wishlistItem = await Wishlist.findOne({
      userId,
      productId: product._id,
    }).populate("productId");

    if (wishlistItem) {
      return res.status(200).json({
        success: true,
        message: "Product already in wishlist",
        data: wishlistItem,
      });
    }

    wishlistItem = await Wishlist.create({
      userId,
      productId: product._id,
    });

    await wishlistItem.populate("productId");

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully",
      data: wishlistItem,
    });
  } catch (error) {
    console.error("Error in addToWishlist:", error.message);
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "Product is already in wishlist",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
      error: error.message,
    });
  }
};

/**
 * @desc    Remove product from user's wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await findProduct(productId);

    // Target either product._id or productId string
    const deleteFilter = { userId };
    if (product) {
      deleteFilter.productId = product._id;
    } else if (mongoose.Types.ObjectId.isValid(productId)) {
      deleteFilter.productId = productId;
    } else {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const deleted = await Wishlist.findOneAndDelete(deleteFilter);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found in your wishlist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
    });
  } catch (error) {
    console.error("Error in removeFromWishlist:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist",
      error: error.message,
    });
  }
};

/**
 * @desc    Get logged-in user's wishlist products
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const items = await Wishlist.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 });

    // Filter out items whose product might have been deleted from DB
    const formattedWishlist = items
      .filter((item) => item.productId !== null && item.productId !== undefined)
      .map((item) => {
        const prod = item.productId.toObject ? item.productId.toObject() : item.productId;
        return {
          ...prod,
          id: prod.productId || String(prod._id),
          wishlistEntryId: item._id,
          wishlistedAt: item.createdAt,
        };
      });

    return res.status(200).json({
      success: true,
      count: formattedWishlist.length,
      data: formattedWishlist,
    });
  } catch (error) {
    console.error("Error in getWishlist:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: error.message,
    });
  }
};

/**
 * @desc    Return logged-in user's wishlist item count
 * @route   GET /api/wishlist/count
 * @access  Private
 */
export const getWishlistCount = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const count = await Wishlist.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error in getWishlistCount:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist count",
      error: error.message,
    });
  }
};
