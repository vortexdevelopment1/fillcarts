import express from "express";
import Vendor from "../models/Vendor.js";
import { vendorRegisterSchema } from "../utils/validationSchemas.js";

const router = express.Router();

// Helper to generate unique Vendor ID (e.g. FC-849201)
const generateVendorId = () => {
  return "FC-" + Math.floor(100000 + Math.random() * 900000);
};

/**
 * @route   POST /api/vendor/register
 * @desc    Submit Merchant Registration Form
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const parseResult = vendorRegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0]?.message || "Invalid vendor registration data",
      });
    }

    const {
      storeName,
      category,
      address,
      city,
      pincode,
      ownerName,
      phone,
      email = "",
      gstNumber = "",
      panNumber = "",
    } = parseResult.data;

    const cleanPhone = phone.replace(/\D/g, "");
    const vendorId = generateVendorId();
    const status = "Pending";

    const existingVendor = await Vendor.findOne({ phone: cleanPhone });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: `Phone number +91 ${cleanPhone} is already registered as a merchant.`,
      });
    }

    await Vendor.create({
      vendorId,
      storeName,
      category,
      address,
      city,
      pincode,
      ownerName,
      phone: cleanPhone,
      email: (email || "").trim(),
      gstNumber: (gstNumber || "").trim().toUpperCase(),
      panNumber: (panNumber || "").trim().toUpperCase(),
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Merchant store application registered successfully!",
      vendorId: vendorId,
      status: status,
      data: {
        vendorId,
        storeName,
        ownerName,
        phone: cleanPhone,
        category,
        city,
        status,
      },
    });
  } catch (error) {
    console.error("Vendor Registration API Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error during merchant registration.",
    });
  }
});

/**
 * @route   GET /api/vendor/status/:identifier
 * @desc    Get Merchant Registration Status by Vendor ID or Phone
 * @access  Public
 */
router.get("/status/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    if (!identifier) {
      return res.status(400).json({ success: false, message: "Vendor ID or phone is required." });
    }

    const cleanQuery = identifier.trim();

    const v = await Vendor.findOne({
      $or: [{ vendorId: cleanQuery }, { phone: cleanQuery }],
    });

    if (v) {
      return res.json({
        success: true,
        data: {
          vendorId: v.vendorId,
          storeName: v.storeName,
          ownerName: v.ownerName,
          phone: v.phone,
          category: v.category,
          status: v.status,
          createdAt: v.createdAt,
        },
      });
    }

    return res.status(404).json({
      success: false,
      message: "Merchant registration application not found.",
    });
  } catch (error) {
    console.error("Vendor Status API Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error querying merchant status.",
    });
  }
});

/**
 * @route   GET /api/vendor/list
 * @desc    List All Registered Vendors with Pagination (Admin View)
 * @access  Public
 */
router.get("/list", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const total = await Vendor.countDocuments();
    const vendors = await Vendor.find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      count: vendors.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: vendors,
    });
  } catch (error) {
    console.error("Vendor List API Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error retrieving vendor list.",
    });
  }
});

export default router;
