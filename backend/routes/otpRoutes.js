const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const db = require("../db");
const generateOTP = require("../utils/otpGenerator");
const sendEmail = require("../services/emailService");
const sendSMS = require("../services/smsService");
const authMiddleware = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET || "fillcarts-dev-secret";

const buildAuthToken = (customer) =>
  jwt.sign(
    {
      id: customer.id,
      phone: customer.phone,
      email: customer.email,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

const setAuthCookie = (res, customer) => {
  const token = buildAuthToken(customer);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 60 * 60 * 1000,
  });

  return token;
};

const normalizeIdentifier = (value) => (value || "").trim();

// REGISTER CUSTOMER PROFILE
router.post("/register-customer", (req, res) => {
  const { name, phone, email, password, address } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).send("Please fill all required fields");
  }

  db.query(
    "SELECT id FROM customers WHERE phone = ? OR email = ?",
    [phone, email],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database Error");
      }

      if (results.length > 0) {
        return res.status(409).send("A customer with this phone or email already exists");
      }

      db.query(
        "INSERT INTO customers (name, phone, email, password, address) VALUES (?, ?, ?, ?, ?)",
        [name.trim(), phone.trim(), email.trim(), password, address?.trim() || ""],
        (insertErr) => {
          if (insertErr) {
            console.error(insertErr);
            return res.status(500).send("Failed to create customer profile");
          }

          return res.status(201).send("Customer registered successfully");
        }
      );
    }
  );
});

// LOGIN CUSTOMER WITH SAVED PROFILE
router.post("/login-customer", (req, res) => {
  const { phone, email, password } = req.body;
  const identifier = normalizeIdentifier(phone || email);

  if (!identifier || !password) {
    return res.status(400).send("Phone/email and password are required");
  }

  db.query(
    "SELECT id, name, phone, email, address, created_at FROM customers WHERE (phone = ? OR email = ?) AND password = ?",
    [identifier, identifier, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database Error");
      }

      if (results.length === 0) {
        return res.status(401).send("Invalid phone/email or password");
      }

      const customer = results[0];
      setAuthCookie(res, customer);

      return res.send({
        message: "Login successful",
        customer,
      });
    }
  );
});

// FETCH AUTHENTICATED PROFILE
router.get("/profile", authMiddleware, (req, res) => {
  return res.send({
    message: "Profile fetched successfully",
    customer: req.user,
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.send({ message: "Logged out successfully" });
});

// SEND OTP
router.post("/send-otp", async (req, res) => {
  const { contact, phone, email, type = "sms" } = req.body;
  const targetContact = normalizeIdentifier(contact || phone || email);

  if (!targetContact) {
    return res.status(400).send("Contact is required");
  }

  db.query(
    "SELECT id FROM customers WHERE phone = ? OR email = ?",
    [targetContact, targetContact],
    async (lookupErr, lookupResults) => {
      if (lookupErr) {
        console.error(lookupErr);
        return res.status(500).send("Database Error");
      }

      if (lookupResults.length === 0) {
        return res.status(404).send("This mobile number or email is not registered");
      }

      const otp = generateOTP();

      console.log("==================================");
      console.log("📱 Contact:", targetContact);
      console.log("🔐 OTP:", otp);
      console.log("==================================");

      const expiry = Date.now() + 5 * 60 * 1000;

      db.query(
        "INSERT INTO otp_verification (contact, otp, expires_at) VALUES (?, ?, ?)",
        [targetContact, otp, expiry],
        async (err) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Database Error");
          }

          if (type === "email") {
            try {
              await sendEmail(targetContact, otp);
            } catch (emailErr) {
              console.error(emailErr);
            }
          } else {
            await sendSMS(targetContact, otp);
          }

          return res.send("OTP Generated Successfully");
        }
      );
    }
  );
});

// VERIFY OTP
router.post("/verify-otp", (req, res) => {
  const { contact, phone, email, otp } = req.body;
  const targetContact = normalizeIdentifier(contact || phone || email);

  if (!targetContact || !otp) {
    return res.status(400).send("Contact and OTP are required");
  }

  db.query(
    "SELECT * FROM otp_verification WHERE contact=? ORDER BY id DESC LIMIT 1",
    [targetContact],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database Error");
      }

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

      db.query("DELETE FROM otp_verification WHERE contact=?", [targetContact]);

      db.query(
        "SELECT id, name, phone, email, address, created_at FROM customers WHERE phone = ? OR email = ?",
        [targetContact, targetContact],
        (customerErr, customerResults) => {
          if (customerErr) {
            console.error(customerErr);
            return res.status(500).send("Database Error");
          }

          const customer = customerResults[0] || null;
          if (!customer) {
            return res.status(404).send("Customer profile not found");
          }

          setAuthCookie(res, customer);

          return res.send({
            message: "Login successful",
            customer,
          });
        }
      );
    }
  );
});

module.exports = router;