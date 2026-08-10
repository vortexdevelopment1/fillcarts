const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const db = require("../db");

// Proactive database column check to ensure columns exist
db.query("SHOW COLUMNS FROM customers LIKE 'pincode'", (err, results) => {
  if (!err && results && results.length === 0) {
    db.query("ALTER TABLE customers ADD COLUMN pincode VARCHAR(10) DEFAULT ''", (alterErr) => {
      if (alterErr) console.error("Proactive alter customers failed:", alterErr.message);
      else console.log("Proactive check: added pincode column to customers table");
    });
  }
});

db.query("SHOW COLUMNS FROM saved_addresses LIKE 'pincode'", (err, results) => {
  if (!err && results && results.length === 0) {
    db.query("ALTER TABLE saved_addresses ADD COLUMN pincode VARCHAR(10) DEFAULT ''", (alterErr) => {
      if (alterErr) console.error("Proactive alter saved_addresses failed:", alterErr.message);
      else console.log("Proactive check: added pincode column to saved_addresses table");
    });
  }
});

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
  const { name, phone, email, password, address, pincode } = req.body;

  if (!name || !phone || !email || !password || !address || !pincode) {
    return res.status(400).send("Please fill all required fields, including address and pincode");
  }

  const cleanPincode = (pincode || "").trim();
  if (!/^\d{6}$/.test(cleanPincode)) {
    return res.status(400).send("Pincode must be exactly 6 digits");
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
        "INSERT INTO customers (name, phone, email, password, address, pincode) VALUES (?, ?, ?, ?, ?, ?)",
        [name.trim(), phone.trim(), email.trim(), password, address.trim(), cleanPincode],
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
    "SELECT id, name, phone, email, address, pincode, gift_card_balance, created_at FROM customers WHERE (phone = ? OR email = ?) AND password = ?",
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

const inMemoryOtps = new Map();
const inMemoryCustomers = new Map();

const getFallbackCustomer = (targetContact) => {
  const isEmail = targetContact.includes("@");
  const phoneVal = isEmail ? targetContact.replace(/\D/g, "") || "9876543210" : targetContact;
  const emailVal = isEmail ? targetContact : `user_${targetContact}@fillcarts.local`;
  const defaultName = isEmail ? targetContact.split("@")[0] : `User ${targetContact.slice(-4)}`;

  const existing = Array.from(inMemoryCustomers.values()).find(
    (c) => c.phone === phoneVal || c.email === emailVal
  );
  if (existing) return existing;

  const newCust = {
    id: inMemoryCustomers.size + 100,
    name: defaultName,
    phone: phoneVal,
    email: emailVal,
    address: "Delivery Address",
    pincode: "110001",
    gift_card_balance: "0.00",
    created_at: new Date().toISOString(),
  };
  inMemoryCustomers.set(newCust.id, newCust);
  return newCust;
};

// SEND OTP
router.post("/send-otp", async (req, res) => {
  const { contact, phone, email, type = "sms" } = req.body;
  const targetContact = normalizeIdentifier(contact || phone || email);

  if (!targetContact) {
    return res.status(400).send("Contact is required");
  }

  const processOtpGeneration = (targetContact, type, res) => {
    const otp = generateOTP();

    console.log("==================================");
    console.log("📱 Contact:", targetContact);
    console.log("🔐 OTP:", otp);
    console.log("==================================");

    const expiry = Date.now() + 5 * 60 * 1000;
    inMemoryOtps.set(targetContact, { otp, expiresAt: expiry });

    // Try saving to MySQL database asynchronously if available
    db.query(
      "INSERT INTO otp_verification (contact, otp, expires_at) VALUES (?, ?, ?)",
      [targetContact, otp, expiry],
      (err) => {
        if (err) {
          console.warn("MySQL OTP storage warning (using in-memory fallback):", err.message);
        }
      }
    );

    // Asynchronously send SMS / Email without blocking HTTP response
    if (type === "email") {
      sendEmail(targetContact, otp).catch((emailErr) => console.error("Email send error:", emailErr));
    } else {
      sendSMS(targetContact, otp).catch((smsErr) => console.error("SMS send error:", smsErr));
    }

    return res.send({
      message: "OTP Generated Successfully",
    });
  };

  db.query(
    "SELECT id FROM customers WHERE phone = ? OR email = ?",
    [targetContact, targetContact],
    (lookupErr, lookupResults) => {
      if (lookupErr || !lookupResults) {
        console.warn("MySQL lookup failed, using fallback:", lookupErr?.message || "No results");
        getFallbackCustomer(targetContact);
        return processOtpGeneration(targetContact, type, res);
      }

      if (lookupResults.length === 0) {
        const isEmail = targetContact.includes("@");
        const phoneVal = isEmail ? targetContact.replace(/\D/g, "") || "9876543210" : targetContact;
        const emailVal = isEmail ? targetContact : `user_${targetContact}@fillcarts.local`;
        const defaultName = isEmail ? targetContact.split("@")[0] : `User ${targetContact.slice(-4)}`;

        db.query(
          "INSERT INTO customers (name, phone, email, password, address, pincode) VALUES (?, ?, ?, ?, ?, ?)",
          [defaultName, phoneVal, emailVal, "otp-user-pass", "Delivery Address", "110001"],
          () => {
            getFallbackCustomer(targetContact);
            processOtpGeneration(targetContact, type, res);
          }
        );
      } else {
        processOtpGeneration(targetContact, type, res);
      }
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

  const finishLoginWithCustomer = (customer) => {
    setAuthCookie(res, customer);
    return res.send({
      message: "Login successful",
      customer,
    });
  };

  // Check in-memory store first
  const memOtpRecord = inMemoryOtps.get(targetContact);
  const isMemOtpValid = memOtpRecord && memOtpRecord.otp === otp && Date.now() <= memOtpRecord.expiresAt;

  if (isMemOtpValid) {
    inMemoryOtps.delete(targetContact);
    db.query(
      "SELECT id, name, phone, email, address, pincode, gift_card_balance, created_at FROM customers WHERE phone = ? OR email = ?",
      [targetContact, targetContact],
      (err, results) => {
        if (!err && results && results.length > 0) {
          return finishLoginWithCustomer(results[0]);
        }
        return finishLoginWithCustomer(getFallbackCustomer(targetContact));
      }
    );
    return;
  }

  // Fallback to MySQL query
  db.query(
    "SELECT * FROM otp_verification WHERE contact=? ORDER BY id DESC LIMIT 1",
    [targetContact],
    (err, results) => {
      if (err || !results || results.length === 0) {
        return res.status(400).send("OTP not found or invalid");
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
        "SELECT id, name, phone, email, address, pincode, gift_card_balance, created_at FROM customers WHERE phone = ? OR email = ?",
        [targetContact, targetContact],
        (customerErr, customerResults) => {
          if (!customerErr && customerResults && customerResults.length > 0) {
            return finishLoginWithCustomer(customerResults[0]);
          }
          return finishLoginWithCustomer(getFallbackCustomer(targetContact));
        }
      );
    }
  );
});

// PUT /profile
router.put("/profile", authMiddleware, (req, res) => {
  const { name, phone, email, address, pincode } = req.body;
  const customerId = req.user.id;

  if (!name || !phone || !email || !address || !pincode) {
    return res.status(400).send("Please fill all required fields, including address and pincode");
  }

  const cleanPincode = (pincode || "").trim();
  if (!/^\d{6}$/.test(cleanPincode)) {
    return res.status(400).send("Pincode must be exactly 6 digits");
  }

  db.query(
    "UPDATE customers SET name = ?, phone = ?, email = ?, address = ?, pincode = ? WHERE id = ?",
    [name.trim(), phone.trim(), email.trim(), address.trim(), cleanPincode, customerId],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database Error");
      }

      db.query(
        "SELECT id, name, phone, email, address, pincode, gift_card_balance, created_at FROM customers WHERE id = ?",
        [customerId],
        (fetchErr, results) => {
          if (fetchErr || results.length === 0) {
            return res.status(500).send("Database Error");
          }
          return res.send({
            message: "Profile updated successfully",
            customer: results[0],
          });
        }
      );
    }
  );
});

// DELETE /profile (Account deletion)
router.delete("/profile", authMiddleware, (req, res) => {
  const customerId = req.user.id;
  db.query("DELETE FROM customers WHERE id = ?", [customerId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database Error");
    }
    res.clearCookie("token");
    return res.send({ message: "Account deleted successfully" });
  });
});

const inMemoryUserCarts = new Map();

// GET /cart
router.get("/cart", authMiddleware, (req, res) => {
  const customerId = req.user.id;
  db.query("SELECT items FROM customer_carts WHERE customer_id = ?", [customerId], (err, results) => {
    if (err || !results) {
      console.warn("MySQL GET cart warning (using in-memory cart fallback):", err?.message);
      const savedItems = inMemoryUserCarts.get(customerId) || [];
      return res.send({ cart: savedItems });
    }
    if (results.length === 0) {
      const savedItems = inMemoryUserCarts.get(customerId) || [];
      return res.send({ cart: savedItems });
    }
    try {
      const dbCart = JSON.parse(results[0].items);
      return res.send({ cart: Array.isArray(dbCart) ? dbCart : [] });
    } catch (e) {
      const savedItems = inMemoryUserCarts.get(customerId) || [];
      return res.send({ cart: savedItems });
    }
  });
});

// POST /cart
router.post("/cart", authMiddleware, (req, res) => {
  const { cart } = req.body;
  const customerId = req.user.id;
  const safeCart = Array.isArray(cart) ? cart : [];
  inMemoryUserCarts.set(customerId, safeCart);

  const itemsStr = JSON.stringify(safeCart);
  db.query(
    "INSERT INTO customer_carts (customer_id, items) VALUES (?, ?) ON DUPLICATE KEY UPDATE items = ?",
    [customerId, itemsStr, itemsStr],
    (err) => {
      if (err) {
        console.warn("MySQL POST cart warning (saved to in-memory fallback):", err.message);
      }
      return res.send({ message: "Cart saved successfully", cart: safeCart });
    }
  );
});

// GET /orders
router.get("/orders", authMiddleware, (req, res) => {
  db.query(
    "SELECT id, items, total, status, payment_method, delivery_address, created_at FROM orders WHERE customer_id = ? ORDER BY id DESC",
    [req.user.id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database Error");
      }
      const orders = results.map(row => {
        try {
          return { ...row, items: JSON.parse(row.items) };
        } catch (e) {
          return { ...row, items: [] };
        }
      });
      return res.send({ orders });
    }
  );
});

// POST /orders
router.post("/orders", authMiddleware, (req, res) => {
  const { items, total, payment_method, delivery_address } = req.body;
  if (!items || !total || !payment_method || !delivery_address) {
    return res.status(400).send("Missing order details");
  }

  const itemsStr = JSON.stringify(items);
  db.query(
    "INSERT INTO orders (customer_id, items, total, payment_method, delivery_address) VALUES (?, ?, ?, ?, ?)",
    [req.user.id, itemsStr, total, payment_method, delivery_address],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database Error");
      }

      // Clear customer cart on order success
      db.query("DELETE FROM customer_carts WHERE customer_id = ?", [req.user.id], (cartErr) => {
        if (cartErr) console.error("Failed to clear cart database:", cartErr);
        return res.status(201).send({
          message: "Order placed successfully",
          orderId: result.insertId
        });
      });
    }
  );
});

// GET /addresses
router.get("/addresses", authMiddleware, (req, res) => {
  db.query(
    "SELECT id, type, address_line, phone, pincode FROM saved_addresses WHERE customer_id = ? ORDER BY id DESC",
    [req.user.id],
    (err, results) => {
      if (err) {
        console.error("GET addresses failed, trying to auto-repair table:", err);
        if (err.code === "ER_BAD_FIELD_ERROR") {
          db.query("ALTER TABLE saved_addresses ADD COLUMN pincode VARCHAR(10) DEFAULT ''", (alterErr) => {
            if (alterErr) {
              return res.status(500).send("Database Error: " + err.message);
            }
            db.query(
              "SELECT id, type, address_line, phone, pincode FROM saved_addresses WHERE customer_id = ? ORDER BY id DESC",
              [req.user.id],
              (retryErr, retryResults) => {
                if (retryErr) {
                  return res.status(500).send("Database Error: " + retryErr.message);
                }
                return res.send({ addresses: retryResults });
              }
            );
          });
        } else {
          return res.status(500).send("Database Error: " + err.message);
        }
      } else {
        return res.send({ addresses: results });
      }
    }
  );
});

// POST /addresses
router.post("/addresses", authMiddleware, (req, res) => {
  const { type, address_line, phone, pincode } = req.body;
  if (!type || !address_line || !phone || !pincode) {
    return res.status(400).send("Missing address details");
  }

  const cleanPincode = (pincode || "").trim();
  if (!/^\d{6}$/.test(cleanPincode)) {
    return res.status(400).send("Pincode must be exactly 6 digits");
  }

  db.query(
    "INSERT INTO saved_addresses (customer_id, type, address_line, phone, pincode) VALUES (?, ?, ?, ?, ?)",
    [req.user.id, type.trim(), address_line.trim(), phone.trim(), cleanPincode],
    (err, result) => {
      if (err) {
        console.error("POST address failed, trying to auto-repair table:", err);
        if (err.code === "ER_BAD_FIELD_ERROR") {
          db.query("ALTER TABLE saved_addresses ADD COLUMN pincode VARCHAR(10) DEFAULT ''", (alterErr) => {
            if (alterErr) {
              return res.status(500).send("Database Error: " + err.message);
            }
            db.query(
              "INSERT INTO saved_addresses (customer_id, type, address_line, phone, pincode) VALUES (?, ?, ?, ?, ?)",
              [req.user.id, type.trim(), address_line.trim(), phone.trim(), cleanPincode],
              (retryErr, retryResult) => {
                if (retryErr) {
                  return res.status(500).send("Database Error: " + retryErr.message);
                }
                return res.status(201).send({
                  message: "Address added successfully (after auto-repair)",
                  addressId: retryResult.insertId
                });
              }
            );
          });
        } else {
          return res.status(500).send("Database Error: " + err.message);
        }
      } else {
        return res.status(201).send({
          message: "Address added successfully",
          addressId: result.insertId
        });
      }
    }
  );
});

// PUT /addresses/:id
router.put("/addresses/:id", authMiddleware, (req, res) => {
  const { type, address_line, phone, pincode } = req.body;
  const addressId = req.params.id;

  if (!type || !address_line || !phone || !pincode) {
    return res.status(400).send("Missing address details");
  }

  const cleanPincode = (pincode || "").trim();
  if (!/^\d{6}$/.test(cleanPincode)) {
    return res.status(400).send("Pincode must be exactly 6 digits");
  }

  db.query(
    "UPDATE saved_addresses SET type = ?, address_line = ?, phone = ?, pincode = ? WHERE id = ? AND customer_id = ?",
    [type.trim(), address_line.trim(), phone.trim(), cleanPincode, addressId, req.user.id],
    (err) => {
      if (err) {
        console.error("PUT address failed, trying to auto-repair table:", err);
        if (err.code === "ER_BAD_FIELD_ERROR") {
          db.query("ALTER TABLE saved_addresses ADD COLUMN pincode VARCHAR(10) DEFAULT ''", (alterErr) => {
            if (alterErr) {
              return res.status(500).send("Database Error: " + err.message);
            }
            db.query(
              "UPDATE saved_addresses SET type = ?, address_line = ?, phone = ?, pincode = ? WHERE id = ? AND customer_id = ?",
              [type.trim(), address_line.trim(), phone.trim(), cleanPincode, addressId, req.user.id],
              (retryErr) => {
                if (retryErr) {
                  return res.status(500).send("Database Error: " + retryErr.message);
                }
                return res.send({ message: "Address updated successfully (after auto-repair)" });
              }
            );
          });
        } else {
          return res.status(500).send("Database Error: " + err.message);
        }
      } else {
        return res.send({ message: "Address updated successfully" });
      }
    }
  );
});

// DELETE /addresses/:id
router.delete("/addresses/:id", authMiddleware, (req, res) => {
  const addressId = req.params.id;
  db.query(
    "DELETE FROM saved_addresses WHERE id = ? AND customer_id = ?",
    [addressId, req.user.id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database Error");
      }
      return res.send({ message: "Address deleted successfully" });
    }
  );
});

// GET /subscriptions
router.get("/subscriptions", authMiddleware, (req, res) => {
  db.query(
    "SELECT id, plan_key, plan_name, price, unit, status, next_delivery, created_at FROM subscriptions WHERE customer_id = ? ORDER BY id DESC",
    [req.user.id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database Error");
      }
      return res.send({ subscriptions: results });
    }
  );
});

// POST /subscriptions
router.post("/subscriptions", authMiddleware, (req, res) => {
  const { plan_key, plan_name, price, unit, next_delivery } = req.body;
  if (!plan_key || !plan_name || !unit || !next_delivery) {
    return res.status(400).send("Missing subscription details");
  }

  db.query(
    "INSERT INTO subscriptions (customer_id, plan_key, plan_name, price, unit, next_delivery) VALUES (?, ?, ?, ?, ?, ?)",
    [req.user.id, plan_key, plan_name, price || null, unit, next_delivery],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database Error");
      }
      return res.status(201).send({
        message: "Subscription activated successfully",
        subscriptionId: result.insertId
      });
    }
  );
});

// PUT /subscriptions/:id/status
router.put("/subscriptions/:id/status", authMiddleware, (req, res) => {
  const { status } = req.body;
  const subscriptionId = req.params.id;
  if (!status) {
    return res.status(400).send("Missing status");
  }

  db.query(
    "UPDATE subscriptions SET status = ? WHERE id = ? AND customer_id = ?",
    [status, subscriptionId, req.user.id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database Error");
      }
      return res.send({ message: `Subscription status updated to ${status}` });
    }
  );
});

// DELETE /subscriptions/:id
router.delete("/subscriptions/:id", authMiddleware, (req, res) => {
  const subscriptionId = req.params.id;
  db.query(
    "DELETE FROM subscriptions WHERE id = ? AND customer_id = ?",
    [subscriptionId, req.user.id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database Error");
      }
      return res.send({ message: "Subscription cancelled successfully" });
    }
  );
});

// GET /giftcard
router.get("/giftcard", authMiddleware, (req, res) => {
  db.query(
    "SELECT gift_card_balance FROM customers WHERE id = ?",
    [req.user.id],
    (err, results) => {
      if (err || results.length === 0) {
        console.error(err);
        return res.status(500).send("Database Error");
      }
      return res.send({ balance: results[0].gift_card_balance });
    }
  );
});

// POST /giftcard/redeem
router.post("/giftcard/redeem", authMiddleware, (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).send("Missing promo/gift card code");
  }

  const upperCode = code.trim().toUpperCase();
  let amount = 0;
  if (upperCode === "GIFT50") amount = 50.00;
  else if (upperCode === "GIFT100") amount = 100.00;
  else if (upperCode === "GIFT500") amount = 500.00;
  else {
    return res.status(400).send("Invalid gift card or promo code");
  }

  db.query(
    "UPDATE customers SET gift_card_balance = gift_card_balance + ? WHERE id = ?",
    [amount, req.user.id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database Error");
      }

      db.query("SELECT gift_card_balance FROM customers WHERE id = ?", [req.user.id], (fetchErr, results) => {
        if (fetchErr || results.length === 0) {
          return res.status(500).send("Database Error");
        }
        return res.send({
          message: `Successfully redeemed ₹${amount}!`,
          balance: results[0].gift_card_balance
        });
      });
    }
  );
});

// POST /giftcard/buy
router.post("/giftcard/buy", authMiddleware, (req, res) => {
  const { amount } = req.body;
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).send("Invalid purchase amount");
  }

  db.query(
    "UPDATE customers SET gift_card_balance = gift_card_balance + ? WHERE id = ?",
    [numAmount, req.user.id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database Error");
      }

      db.query("SELECT gift_card_balance FROM customers WHERE id = ?", [req.user.id], (fetchErr, results) => {
        if (fetchErr || results.length === 0) {
          return res.status(500).send("Database Error");
        }
        return res.send({
          message: `Successfully purchased ₹${numAmount} credits!`,
          balance: results[0].gift_card_balance
        });
      });
    }
  );
});

module.exports = router;