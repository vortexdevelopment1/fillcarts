import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
} from "../controllers/productController.js";

const router = express.Router();

// Seed catalog data
router.get("/seed", seedProducts);
router.post("/seed", seedProducts);

// Product CRUD routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
