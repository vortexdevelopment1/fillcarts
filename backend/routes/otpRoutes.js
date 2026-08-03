const express = require("express");
const router = express.Router();

const db = require("../db");
const generateOTP = require("../utils/otpGenerator");
const sendEmail = require("../services/emailService");
const sendSMS = require("../services/smsService");

// SEND OTP
router.post("/send-otp", async (req, res) => {
  const { contact } = req.body;

  const otp = generateOTP();

  // Terminal me OTP print hoga
  console.log("==================================");
  console.log("📱 Mobile:", contact);
  console.log("🔐 OTP:", otp);
  console.log("==================================");

  const expiry = Date.now() + 5 * 60 * 1000;

  db.query(
    "INSERT INTO otp_verification (contact, otp, expires_at) VALUES (?, ?, ?)",
    [contact, otp, expiry],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database Error");
      }

      // Testing mode me SMS send nahi karenge
      res.send("OTP Generated Successfully");
    }
  );
});

// VERIFY OTP
router.post("/verify-otp", (req, res) => {
  const { contact, otp } = req.body;

  db.query(
    "SELECT * FROM otp_verification WHERE contact=? ORDER BY id DESC LIMIT 1",
    [contact],
    (err, results) => {
      if (results.length === 0) {
        return res.status(400).send("OTP not found");
      }

      const record = results[0];

      if (Date.now() > record.expires_at) {
        return res.status(400).send("OTP expired");
      }

      if (record.otp !== otp) {
        return res.status(400).send("Invalid OTP");
      }

      db.query("DELETE FROM otp_verification WHERE contact=?", [contact]);

      res.send("Login successful");
    }
  );
});

module.exports = router;