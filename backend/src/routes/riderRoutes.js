import express from "express";
import Rider from "../models/Rider.js";
import { riderRegisterSchema } from "../utils/validationSchemas.js";

const router = express.Router();

// Helper to generate unique Rider ID (e.g. RD-749102)
const generateRiderId = () => {
  return "RD-" + Math.floor(100000 + Math.random() * 900000);
};

/**
 * @route   POST /api/rider/register
 * @desc    Submit Delivery Rider Registration Form
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const parseResult = riderRegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0]?.message || "Invalid rider registration data",
      });
    }

    const { name, phone, city, vehicle = "Motorbike / Scooter" } = parseResult.data;

    const cleanPhone = phone.replace(/\D/g, "");
    const riderId = generateRiderId();
    const status = "Pending";

    const existingRider = await Rider.findOne({ phone: cleanPhone });
    if (existingRider) {
      return res.status(400).json({
        success: false,
        message: `Phone number +91 ${cleanPhone} is already registered as a delivery rider.`,
      });
    }

    await Rider.create({
      riderId,
      name,
      phone: cleanPhone,
      city,
      vehicle: vehicle || "Motorbike / Scooter",
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Rider delivery application submitted successfully!",
      riderId: riderId,
      status: status,
      data: {
        riderId,
        name,
        phone: cleanPhone,
        city,
        vehicle,
        status,
      },
    });
  } catch (error) {
    console.error("Rider Registration API Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error during rider registration.",
    });
  }
});

/**
 * @route   GET /api/rider/status/:identifier
 * @desc    Get Rider Status by Rider ID or Phone
 * @access  Public
 */
router.get("/status/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    if (!identifier) {
      return res.status(400).json({ success: false, message: "Rider ID or phone is required." });
    }

    const cleanQuery = identifier.trim();

    const r = await Rider.findOne({
      $or: [{ riderId: cleanQuery }, { phone: cleanQuery }],
    });

    if (r) {
      return res.json({
        success: true,
        data: {
          riderId: r.riderId,
          name: r.name,
          phone: r.phone,
          city: r.city,
          vehicle: r.vehicle,
          status: r.status,
          createdAt: r.createdAt,
        },
      });
    }

    return res.status(404).json({
      success: false,
      message: "Rider registration application not found.",
    });
  } catch (error) {
    console.error("Rider Status API Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error querying rider status.",
    });
  }
});

/**
 * @route   GET /api/rider/list
 * @desc    List All Registered Delivery Riders with Pagination (Admin View)
 * @access  Public
 */
router.get("/list", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const total = await Rider.countDocuments();
    const riders = await Rider.find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      count: riders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: riders,
    });
  } catch (error) {
    console.error("Rider List API Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error retrieving rider list.",
    });
  }
});

export default router;
