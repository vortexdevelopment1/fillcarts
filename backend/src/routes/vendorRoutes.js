import express from "express";
import {
  registerVendor,
  getVendorStatus,
  listVendors,
} from "../controllers/vendorController.js";

const router = express.Router();

// ==========================================
// MERCHANT ONBOARDING & STATUS
// ==========================================
router.post("/register", registerVendor);
router.get("/status/:identifier", getVendorStatus);
router.get("/list", listVendors);

export default router;
