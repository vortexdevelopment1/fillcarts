import mongoose from "mongoose";
import Product from "../models/Product.js";
import { SEED_PRODUCTS } from "../utils/catalogSeedData.js";
import { productValidationSchema } from "../utils/validationSchemas.js";

// Helper to escape regex special characters and prevent ReDoS attacks
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// In-memory fallback storage
let inMemoryProductStore = [...SEED_PRODUCTS];

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc    Seed products into MongoDB
 * @route   POST /api/products/seed
 * @access  Public / Admin
 */
export const seedProducts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      inMemoryProductStore = [...SEED_PRODUCTS];
      return res.status(200).json({
        success: true,
        message: "Database offline. In-memory products reset successfully.",
        count: inMemoryProductStore.length,
        data: inMemoryProductStore,
      });
    }

    const operations = SEED_PRODUCTS.map((prod) => ({
      updateOne: {
        filter: { productId: prod.productId },
        update: { $set: prod },
        upsert: true,
      },
    }));

    await Product.bulkWrite(operations);
    const count = await Product.countDocuments();

    return res.status(200).json({
      success: true,
      message: `Successfully seeded ${count} products into MongoDB!`,
      count,
    });
  } catch (error) {
    console.error("Error seeding products:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to seed products",
    });
  }
};

/**
 * @desc    Get all products with filtering, search, sorting and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      categoryKey,
      search,
      q,
      store,
      tag,
      minPrice,
      maxPrice,
      sortBy,
      order = "asc",
      page = 1,
      limit = 50,
    } = req.query;

    const cat = (categoryKey || category || "").trim();
    const rawSearch = (search || q || "").trim();
    const rawStore = (store || "").trim();
    const rawTag = (tag || "").trim();

    if (isDbConnected()) {
      const filter = {};

      if (cat && cat !== "all") {
        filter.categoryKey = escapeRegex(cat.toLowerCase());
      }

      if (rawStore && rawStore !== "all") {
        filter.store = new RegExp(escapeRegex(rawStore), "i");
      }

      if (rawTag) {
        filter.tags = escapeRegex(rawTag);
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      if (rawSearch) {
        const safeQuery = escapeRegex(rawSearch);
        const searchRegex = new RegExp(safeQuery, "i");
        filter.$or = [
          { name: searchRegex },
          { categoryName: searchRegex },
          { keywords: { $in: [new RegExp(`^${safeQuery}$`, "i")] } },
          { tags: { $in: [new RegExp(`^${safeQuery}$`, "i")] } },
          { description: searchRegex },
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sortBy === "price") {
        sortOptions = { price: order === "desc" ? -1 : 1 };
      } else if (sortBy === "rating") {
        sortOptions = { rating: -1 };
      } else if (sortBy === "name") {
        sortOptions = { name: order === "desc" ? -1 : 1 };
      }

      const pageNum = Math.max(1, parseInt(page, 10));
      const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10)));
      const skip = (pageNum - 1) * pageSize;

      const total = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);

      return res.status(200).json({
        success: true,
        count: products.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / pageSize),
        data: products,
      });
    }

    // In-memory fallback
    let filtered = [...inMemoryProductStore];

    if (cat && cat !== "all") {
      filtered = filtered.filter(
        (p) => (p.categoryKey || "").toLowerCase() === cat.toLowerCase()
      );
    }

    if (rawStore && rawStore !== "all") {
      filtered = filtered.filter((p) =>
        (p.store || "").toLowerCase().includes(rawStore.toLowerCase())
      );
    }

    if (rawTag) {
      filtered = filtered.filter((p) => (p.tags || []).includes(rawTag));
    }

    if (rawSearch) {
      const qLower = rawSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(qLower) ||
          (p.categoryName || "").toLowerCase().includes(qLower) ||
          (p.keywords || []).some((k) => k.toLowerCase().includes(qLower))
      );
    }

    if (sortBy === "price") {
      filtered.sort((a, b) =>
        order === "desc" ? b.price - a.price : a.price - b.price
      );
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      total: filtered.length,
      page: 1,
      pages: 1,
      data: filtered,
    });
  } catch (error) {
    console.error("Error in getProducts:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching products",
    });
  }
};

/**
 * @desc    Get single product by ID or productId
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (isDbConnected()) {
      let product = null;

      if (mongoose.Types.ObjectId.isValid(id)) {
        product = await Product.findById(id);
      }

      if (!product) {
        product = await Product.findOne({ productId: id.trim() });
      }

      if (product) {
        return res.status(200).json({
          success: true,
          data: product,
        });
      }
    }

    // Fallback lookup
    const fallback = inMemoryProductStore.find(
      (p) => p.productId === id || p.id === id || String(p._id) === id
    );

    if (fallback) {
      return res.status(200).json({
        success: true,
        data: fallback,
      });
    }

    return res.status(404).json({
      success: false,
      message: `Product with ID '${id}' not found`,
    });
  } catch (error) {
    console.error("Error in getProductById:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error retrieving product",
    });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Public / Admin
 */
export const createProduct = async (req, res) => {
  try {
    const parseResult = productValidationSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0]?.message || "Invalid product data",
      });
    }

    const {
      name,
      categoryKey,
      categoryName,
      price,
      mrp,
      rating = 4.5,
      store = "Fresh Mart",
      tags = [],
      keywords = [],
      img = "",
      image = "",
      unit = "",
      inStock = true,
      countInStock = 50,
      description = "",
    } = parseResult.data;

    const productId = req.body.productId || `${categoryKey}-${Date.now()}`;

    const newProductData = {
      productId,
      name,
      categoryKey,
      categoryName,
      price,
      mrp,
      rating,
      store,
      tags,
      keywords,
      img: img || image || "",
      image: image || img || "",
      unit,
      inStock,
      countInStock,
      description,
    };

    if (isDbConnected()) {
      const created = await Product.create(newProductData);
      return res.status(201).json({
        success: true,
        message: "Product created successfully in MongoDB",
        data: created,
      });
    }

    // Fallback store
    inMemoryProductStore.push(newProductData);
    return res.status(201).json({
      success: true,
      message: "Product created in temporary store (DB offline)",
      data: newProductData,
    });
  } catch (error) {
    console.error("Error in createProduct:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Public / Admin
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      let filter = { productId: id };
      if (mongoose.Types.ObjectId.isValid(id)) {
        filter = { $or: [{ _id: id }, { productId: id }] };
      }

      const updated = await Product.findOneAndUpdate(filter, req.body, {
        new: true,
        runValidators: true,
      });

      if (updated) {
        return res.status(200).json({
          success: true,
          message: "Product updated successfully",
          data: updated,
        });
      }
    }

    // In-memory update
    const idx = inMemoryProductStore.findIndex(
      (p) => p.productId === id || p.id === id || String(p._id) === id
    );

    if (idx !== -1) {
      inMemoryProductStore[idx] = {
        ...inMemoryProductStore[idx],
        ...req.body,
      };
      return res.status(200).json({
        success: true,
        message: "Product updated in temporary store",
        data: inMemoryProductStore[idx],
      });
    }

    return res.status(404).json({
      success: false,
      message: `Product with ID '${id}' not found`,
    });
  } catch (error) {
    console.error("Error in updateProduct:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Public / Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      let filter = { productId: id };
      if (mongoose.Types.ObjectId.isValid(id)) {
        filter = { $or: [{ _id: id }, { productId: id }] };
      }

      const deleted = await Product.findOneAndDelete(filter);
      if (deleted) {
        return res.status(200).json({
          success: true,
          message: "Product deleted successfully from MongoDB",
          data: deleted,
        });
      }
    }

    const idx = inMemoryProductStore.findIndex(
      (p) => p.productId === id || p.id === id || String(p._id) === id
    );

    if (idx !== -1) {
      const removed = inMemoryProductStore.splice(idx, 1);
      return res.status(200).json({
        success: true,
        message: "Product removed from temporary store",
        data: removed[0],
      });
    }

    return res.status(404).json({
      success: false,
      message: `Product with ID '${id}' not found`,
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
