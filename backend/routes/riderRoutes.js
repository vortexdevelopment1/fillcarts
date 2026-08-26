const express = require("express");
const router = express.Router();
const db = require("../db");

// In-memory fallback storage when DB is offline
const inMemoryRiders = new Map();

// Helper to generate unique Rider ID (e.g. RD-749102)
const generateRiderId = () => {
  return "RD-" + Math.floor(100000 + Math.random() * 900000);
};

/**
 * @route   POST /api/rider/register
 * @desc    Submit Delivery Rider Registration Form
 * @access  Public
 */
router.post("/register", (req, res) => {
  try {
    const { name, phone, city, vehicle = "Motorbike / Scooter" } = req.body;

    // 1. Input Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required." });
    }
    if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""))) {
      return res.status(400).json({ success: false, message: "A valid 10-digit Indian mobile number is required." });
    }
    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, message: "City/location is required." });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const cleanName = name.trim();
    const cleanCity = city.trim();
    const cleanVehicle = vehicle.trim() || "Motorbike / Scooter";

    const riderId = generateRiderId();
    const status = "Pending";

    // 2. Query Database (or use in-memory fallback)
    const sqlCheck = "SELECT * FROM riders WHERE phone = ?";
    db.query(sqlCheck, [cleanPhone], (checkErr, results) => {
      if (!checkErr && results && results.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Phone number +91 ${cleanPhone} is already registered as a delivery rider.`
        });
      }

      // In-memory fallback check if DB offline/error
      if (checkErr) {
        const existingInMemory = Array.from(inMemoryRiders.values()).find(
          (r) => r.phone === cleanPhone
        );
        if (existingInMemory) {
          return res.status(400).json({
            success: false,
            message: `Phone number +91 ${cleanPhone} is already registered as a delivery rider.`
          });
        }
      }

      const sqlInsert = `
        INSERT INTO riders (rider_id, name, phone, city, vehicle, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sqlInsert,
        [riderId, cleanName, cleanPhone, cleanCity, cleanVehicle, status],
        (insertErr, result) => {
          const newRider = {
            id: result ? result.insertId : inMemoryRiders.size + 1,
            riderId,
            name: cleanName,
            phone: cleanPhone,
            city: cleanCity,
            vehicle: cleanVehicle,
            status,
            createdAt: new Date().toISOString()
          };
          inMemoryRiders.set(riderId, newRider);

          return res.status(201).json({
            success: true,
            message: "Rider delivery application submitted successfully!",
            riderId: riderId,
            status: status,
            data: {
              riderId,
              name: cleanName,
              phone: cleanPhone,
              city: cleanCity,
              vehicle: cleanVehicle,
              status
            }
          });
        }
      );
    });
  } catch (error) {
    console.error("Rider Registration API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during rider registration."
    });
  }
});

/**
 * @route   GET /api/rider/status/:identifier
 * @desc    Get Rider Status by Rider ID or Phone
 * @access  Public
 */
router.get("/status/:identifier", (req, res) => {
  const { identifier } = req.params;
  if (!identifier) {
    return res.status(400).json({ success: false, message: "Rider ID or phone is required." });
  }

  const cleanQuery = identifier.trim();

  const sql = "SELECT rider_id, name, phone, city, vehicle, status, created_at FROM riders WHERE rider_id = ? OR phone = ?";
  db.query(sql, [cleanQuery, cleanQuery], (err, results) => {
    if (!err && results && results.length > 0) {
      const r = results[0];
      return res.json({
        success: true,
        data: {
          riderId: r.rider_id,
          name: r.name,
          phone: r.phone,
          city: r.city,
          vehicle: r.vehicle,
          status: r.status,
          createdAt: r.created_at
        }
      });
    }

    // In-memory fallback
    const inMem = Array.from(inMemoryRiders.values()).find(
      (r) => r.riderId === cleanQuery || r.phone === cleanQuery
    );

    if (inMem) {
      return res.json({
        success: true,
        data: {
          riderId: inMem.riderId,
          name: inMem.name,
          phone: inMem.phone,
          city: inMem.city,
          vehicle: inMem.vehicle,
          status: inMem.status,
          createdAt: inMem.createdAt
        }
      });
    }

    return res.status(404).json({
      success: false,
      message: "Rider registration application not found."
    });
  });
});

/**
 * @route   GET /api/rider/list
 * @desc    List All Registered Delivery Riders (Admin View)
 * @access  Public
 */
router.get("/list", (req, res) => {
  const sql = "SELECT rider_id, name, phone, city, vehicle, status, created_at FROM riders ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (!err && results && results.length > 0) {
      return res.json({ success: true, count: results.length, data: results });
    }

    const memoryList = Array.from(inMemoryRiders.values());
    return res.json({ success: true, count: memoryList.length, data: memoryList });
  });
});

module.exports = router;
