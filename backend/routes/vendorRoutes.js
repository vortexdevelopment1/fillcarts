const express = require("express");
const router = express.Router();
const db = require("../db");

// In-memory fallback storage when DB is offline
const inMemoryVendors = new Map();

// Helper to generate unique Vendor ID (e.g. FC-849201)
const generateVendorId = () => {
  return "FC-" + Math.floor(100000 + Math.random() * 900000);
};

/**
 * @route   POST /api/vendor/register
 * @desc    Submit Merchant Registration Form
 * @access  Public
 */
router.post("/register", (req, res) => {
  try {
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
      panNumber = ""
    } = req.body;

    // 1. Input Validation
    if (!storeName || !storeName.trim()) {
      return res.status(400).json({ success: false, message: "Store name is required." });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: "Business category is required." });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ success: false, message: "Store address is required." });
    }
    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, message: "City is required." });
    }
    if (!pincode || !/^\d{6}$/.test(pincode.trim())) {
      return res.status(400).json({ success: false, message: "A valid 6-digit pincode is required." });
    }
    if (!ownerName || !ownerName.trim()) {
      return res.status(400).json({ success: false, message: "Owner full name is required." });
    }
    if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""))) {
      return res.status(400).json({ success: false, message: "A valid 10-digit Indian mobile number is required." });
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const cleanStoreName = storeName.trim();
    const cleanOwnerName = ownerName.trim();
    const cleanAddress = address.trim();
    const cleanCity = city.trim();
    const cleanPincode = pincode.trim();
    const cleanEmail = (email || "").trim();
    const cleanGst = (gstNumber || "").trim().toUpperCase();
    const cleanPan = (panNumber || "").trim().toUpperCase();

    const vendorId = generateVendorId();
    const status = "Pending";

    // 2. Query Database (or use in-memory fallback)
    const sqlCheck = "SELECT * FROM vendors WHERE phone = ?";
    db.query(sqlCheck, [cleanPhone], (checkErr, results) => {
      if (!checkErr && results && results.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Phone number +91 ${cleanPhone} is already registered as a merchant.`
        });
      }

      // Check in-memory fallback if DB error/offline
      if (checkErr) {
        const existingInMemory = Array.from(inMemoryVendors.values()).find(
          (v) => v.phone === cleanPhone
        );
        if (existingInMemory) {
          return res.status(400).json({
            success: false,
            message: `Phone number +91 ${cleanPhone} is already registered as a merchant.`
          });
        }
      }

      const sqlInsert = `
        INSERT INTO vendors (vendor_id, store_name, category, address, city, pincode, owner_name, phone, email, gst_number, pan_number, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sqlInsert,
        [vendorId, cleanStoreName, category, cleanAddress, cleanCity, cleanPincode, cleanOwnerName, cleanPhone, cleanEmail, cleanGst, cleanPan, status],
        (insertErr, result) => {
          // Store in-memory fallback
          const newVendor = {
            id: result ? result.insertId : inMemoryVendors.size + 1,
            vendorId,
            storeName: cleanStoreName,
            category,
            address: cleanAddress,
            city: cleanCity,
            pincode: cleanPincode,
            ownerName: cleanOwnerName,
            phone: cleanPhone,
            email: cleanEmail,
            gstNumber: cleanGst,
            panNumber: cleanPan,
            status,
            createdAt: new Date().toISOString()
          };
          inMemoryVendors.set(vendorId, newVendor);

          return res.status(201).json({
            success: true,
            message: "Merchant store application registered successfully!",
            vendorId: vendorId,
            status: status,
            data: {
              vendorId,
              storeName: cleanStoreName,
              ownerName: cleanOwnerName,
              phone: cleanPhone,
              category,
              city: cleanCity,
              status
            }
          });
        }
      );
    });
  } catch (error) {
    console.error("Vendor Registration API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during merchant registration."
    });
  }
});

/**
 * @route   GET /api/vendor/status/:identifier
 * @desc    Get Merchant Registration Status by Vendor ID or Phone
 * @access  Public
 */
router.get("/status/:identifier", (req, res) => {
  const { identifier } = req.params;
  if (!identifier) {
    return res.status(400).json({ success: false, message: "Vendor ID or phone is required." });
  }

  const cleanQuery = identifier.trim();

  // Database query
  const sql = "SELECT vendor_id, store_name, owner_name, phone, category, status, created_at FROM vendors WHERE vendor_id = ? OR phone = ?";
  db.query(sql, [cleanQuery, cleanQuery], (err, results) => {
    if (!err && results && results.length > 0) {
      const v = results[0];
      return res.json({
        success: true,
        data: {
          vendorId: v.vendor_id,
          storeName: v.store_name,
          ownerName: v.owner_name,
          phone: v.phone,
          category: v.category,
          status: v.status,
          createdAt: v.created_at
        }
      });
    }

    // In-memory fallback search
    const inMem = Array.from(inMemoryVendors.values()).find(
      (v) => v.vendorId === cleanQuery || v.phone === cleanQuery
    );

    if (inMem) {
      return res.json({
        success: true,
        data: {
          vendorId: inMem.vendorId,
          storeName: inMem.storeName,
          ownerName: inMem.ownerName,
          phone: inMem.phone,
          category: inMem.category,
          status: inMem.status,
          createdAt: inMem.createdAt
        }
      });
    }

    return res.status(404).json({
      success: false,
      message: "Merchant registration application not found."
    });
  });
});

/**
 * @route   GET /api/vendor/list
 * @desc    List All Registered Vendors (Admin View)
 * @access  Public
 */
router.get("/list", (req, res) => {
  const sql = "SELECT vendor_id, store_name, category, owner_name, phone, city, status, created_at FROM vendors ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (!err && results && results.length > 0) {
      return res.json({ success: true, count: results.length, data: results });
    }

    const memoryList = Array.from(inMemoryVendors.values());
    return res.json({ success: true, count: memoryList.length, data: memoryList });
  });
});

module.exports = router;
