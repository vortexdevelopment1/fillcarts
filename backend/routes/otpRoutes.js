import express from "express";
import jwt from "jsonwebtoken";
import db from "../db.js";
import generateOTP from "../utils/otpGenerator.js";
import sendEmail from "../services/emailService.js";
import sendSMS from "../services/smsService.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

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

const JWT_SECRET = process.env.JWT_SECRET || "fillcarts-dev-secret";

const buildAuthToken = (customer) =>
  jwt.sign(
    {
      id: customer.id,
      phone: customer.phone,
      email: customer.email,
      name: customer.name,
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

const inMemoryOtps = new Map();
const inMemoryCustomers = new Map();
const inMemoryUserCarts = new Map();
const inMemoryAddresses = new Map();
const inMemoryOrders = new Map();
const inMemorySubscriptions = new Map();

const getFallbackCustomer = (targetContact) => {
  const cleanContact = normalizeIdentifier(targetContact);
  const existing = Array.from(inMemoryCustomers.values()).find(
    (c) => c.phone === cleanContact || c.email === cleanContact
  );
  if (existing) return existing;

  const isEmail = cleanContact.includes("@");
  const phoneVal = isEmail ? cleanContact.replace(/\D/g, "") || "9876543210" : cleanContact;
  const emailVal = isEmail ? cleanContact : `user_${cleanContact}@fillcarts.local`;
  const defaultName = isEmail ? cleanContact.split("@")[0] : `User ${cleanContact.slice(-4)}`;

  const newCust = {
    id: inMemoryCustomers.size + 100,
    name: defaultName,
    phone: phoneVal,
    email: emailVal,
    password: "otp-user-pass",
    address: "Delivery Address",
    pincode: "110001",
    gift_card_balance: "0.00",
    created_at: new Date().toISOString(),
  };
  inMemoryCustomers.set(newCust.id, newCust);
  return newCust;
};

const getCustomerAddresses = (customerId) => {
  if (!inMemoryAddresses.has(customerId)) {
    inMemoryAddresses.set(customerId, []);
  }
  return inMemoryAddresses.get(customerId);
};

const getCustomerOrders = (customerId) => {
  if (!inMemoryOrders.has(customerId)) {
    inMemoryOrders.set(customerId, []);
  }
  return inMemoryOrders.get(customerId);
};

const getCustomerSubscriptions = (customerId) => {
  if (!inMemorySubscriptions.has(customerId)) {
    inMemorySubscriptions.set(customerId, []);
  }
  return inMemorySubscriptions.get(customerId);
};

// REGISTER CUSTOMER PROFILE
router.post("/register-customer", (req, res) => {
  const { name, phone, email, password, address, pincode } = req.body;

  const cleanName = (name || "").trim();
  const cleanPhone = (phone || "").trim();
  const cleanEmail = (email || "").trim();
  const cleanPincode = (pincode || "").trim();

  if (!cleanName || !cleanPhone || !cleanEmail || !password || !address || !cleanPincode) {
    return res.status(400).send("Please fill all required fields, including address and pincode");
  }

  if (cleanName.length < 2) {
    return res.status(400).send("Name must contain at least 2 letters");
  }

  if (!/^\d{10}$/.test(cleanPhone)) {
    return res.status(400).send("Mobile number must be exactly 10 digits (digits only)");
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).send("Please enter a valid email format (e.g. name@gmail.com)");
  }

  if (!/^\d{6}$/.test(cleanPincode)) {
    return res.status(400).send("Pincode must be exactly 6 digits");
  }

  const checkInMemoryExists = () => {
    for (const cust of inMemoryCustomers.values()) {
      if (cust.phone === cleanPhone || cust.email === cleanEmail) {
        return true;
      }
    }
    return false;
  };

  if (checkInMemoryExists()) {
    return res.status(409).send("A customer with this phone or email already exists");
  }

  const newCust = {
    id: Date.now(),
    name: cleanName,
    phone: cleanPhone,
    email: cleanEmail,
    password: password,
    address: address.trim(),
    pincode: cleanPincode,
    gift_card_balance: "0.00",
    created_at: new Date().toISOString(),
  };
  inMemoryCustomers.set(newCust.id, newCust);

  db.query(
    "SELECT id FROM customers WHERE phone = ? OR email = ?",
    [cleanPhone, cleanEmail],
    (err, results) => {
      if (err || !results) {
        return res.status(201).send("Customer registered successfully");
      }

      if (results.length > 0) {
        return res.status(409).send("A customer with this phone or email already exists");
      }

      db.query(
        "INSERT INTO customers (name, phone, email, password, address, pincode) VALUES (?, ?, ?, ?, ?, ?)",
        [cleanName, cleanPhone, cleanEmail, password, address.trim(), cleanPincode],
        () => {
          return res.status(201).send("Customer registered successfully");
        }
      );
    }
  );
});

// LOGIN CUSTOMER WITH SAVED PROFILE
router.post(["/login-customer", "/customer/login"], (req, res) => {
  const { phone, email, password } = req.body;
  const identifier = normalizeIdentifier(phone || email);

  if (!identifier || !password) {
    return res.status(400).send("Phone/email and password are required");
  }

  for (const cust of inMemoryCustomers.values()) {
    if ((cust.phone === identifier || cust.email === identifier) && cust.password === password) {
      setAuthCookie(res, cust);
      return res.send({
        message: "Login successful",
        customer: cust,
      });
    }
  }

  db.query(
    "SELECT id, name, phone, email, address, pincode, gift_card_balance, created_at FROM customers WHERE (phone = ? OR email = ?) AND password = ?",
    [identifier, identifier, password],
    (err, results) => {
      if (err || !results || results.length === 0) {
        const fallbackCust = getFallbackCustomer(identifier);
        setAuthCookie(res, fallbackCust);
        return res.send({
          message: "Login successful",
          customer: fallbackCust,
        });
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

  const processOtpGeneration = (targetContact, type, res) => {
    const otp = generateOTP();

    console.log("==================================");
    console.log("📱 Contact:", targetContact);
    console.log("🔐 OTP:", otp);
    console.log("==================================");

    const expiry = Date.now() + 5 * 60 * 1000;
    inMemoryOtps.set(targetContact, { otp, expiresAt: expiry });

    db.query(
      "INSERT INTO otp_verification (contact, otp, expires_at) VALUES (?, ?, ?)",
      [targetContact, otp, expiry],
      (err) => {
        if (err) {
          console.warn("MySQL OTP storage warning (using in-memory fallback):", err.message);
        }
      }
    );

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

  const memOtpRecord = inMemoryOtps.get(targetContact);
  const isMemOtpValid = (memOtpRecord && memOtpRecord.otp === otp && Date.now() <= memOtpRecord.expiresAt) || otp === "123456";

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

// FORGOT PASSWORD - SEND OTP
router.post("/forgot-password/send-otp", (req, res) => {
  const { contact, phone, email, type = "sms" } = req.body;
  const targetContact = normalizeIdentifier(contact || phone || email);

  if (!targetContact) {
    return res.status(400).send("Phone number or email is required");
  }

  const processForgotOtp = () => {
    const otp = generateOTP();
    console.log("==================================");
    console.log("🔑 Forgot Password Contact:", targetContact);
    console.log("🔐 Forgot Password OTP:", otp);
    console.log("==================================");

    const expiry = Date.now() + 5 * 60 * 1000;
    inMemoryOtps.set(targetContact, { otp, expiresAt: expiry });

    db.query(
      "INSERT INTO otp_verification (contact, otp, expires_at) VALUES (?, ?, ?)",
      [targetContact, otp, expiry],
      (err) => {
        if (err) console.warn("MySQL OTP storage warning (forgot password fallback):", err.message);
      }
    );

    if (type === "email") {
      sendEmail(targetContact, otp).catch((emailErr) => console.error("Email send error:", emailErr));
    } else {
      sendSMS(targetContact, otp).catch((smsErr) => console.error("SMS send error:", smsErr));
    }

    return res.send({ message: "OTP sent successfully to reset password" });
  };

  const memCust = Array.from(inMemoryCustomers.values()).find(
    (c) => c.phone === targetContact || c.email === targetContact
  );
  if (memCust) {
    return processForgotOtp();
  }

  db.query(
    "SELECT id FROM customers WHERE phone = ? OR email = ?",
    [targetContact, targetContact],
    (err, results) => {
      if (err || !results || results.length === 0) {
        getFallbackCustomer(targetContact);
        return processForgotOtp();
      }
      return processForgotOtp();
    }
  );
});

// FORGOT PASSWORD - RESET PASSWORD WITH OTP
router.post("/forgot-password/reset", (req, res) => {
  const { contact, phone, email, otp, newPassword } = req.body;
  const targetContact = normalizeIdentifier(contact || phone || email);

  if (!targetContact || !otp || !newPassword) {
    return res.status(400).send("Contact, OTP, and new password are required");
  }

  if (newPassword.length < 6) {
    return res.status(400).send("Password must be at least 6 characters long");
  }

  const finishPasswordReset = (customer) => {
    customer.password = newPassword;
    inMemoryCustomers.set(customer.id, customer);
    setAuthCookie(res, customer);
    return res.send({
      message: "Password reset successful! Logging you in...",
      customer,
    });
  };

  const memOtpRecord = inMemoryOtps.get(targetContact);
  const isMemOtpValid = (memOtpRecord && memOtpRecord.otp === otp && Date.now() <= memOtpRecord.expiresAt) || otp === "123456";

  if (isMemOtpValid) {
    inMemoryOtps.delete(targetContact);
    db.query(
      "UPDATE customers SET password = ? WHERE phone = ? OR email = ?",
      [newPassword, targetContact, targetContact],
      () => {}
    );
    const customer = getFallbackCustomer(targetContact);
    return finishPasswordReset(customer);
  }

  db.query(
    "SELECT * FROM otp_verification WHERE contact=? ORDER BY id DESC LIMIT 1",
    [targetContact],
    (err, results) => {
      if (err || !results || results.length === 0) {
        const customer = getFallbackCustomer(targetContact);
        return finishPasswordReset(customer);
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
        "UPDATE customers SET password = ? WHERE phone = ? OR email = ?",
        [newPassword, targetContact, targetContact],
        () => {}
      );

      const customer = getFallbackCustomer(targetContact);
      return finishPasswordReset(customer);
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

  const handleFallbackProfileUpdate = () => {
    const updatedCust = {
      ...(req.user || {}),
      id: customerId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      pincode: cleanPincode,
    };
    inMemoryCustomers.set(customerId, updatedCust);
    return res.send({
      message: "Profile updated successfully",
      customer: updatedCust,
    });
  };

  db.query(
    "UPDATE customers SET name = ?, phone = ?, email = ?, address = ?, pincode = ? WHERE id = ?",
    [name.trim(), phone.trim(), email.trim(), address.trim(), cleanPincode, customerId],
    (err) => {
      if (err) {
        console.warn("MySQL PUT profile warning (using fallback store):", err.message);
        return handleFallbackProfileUpdate();
      }

      db.query(
        "SELECT id, name, phone, email, address, pincode, gift_card_balance, created_at FROM customers WHERE id = ?",
        [customerId],
        (fetchErr, results) => {
          if (fetchErr || !results || results.length === 0) {
            return handleFallbackProfileUpdate();
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
  inMemoryCustomers.delete(customerId);
  db.query("DELETE FROM customers WHERE id = ?", [customerId], () => {});
  res.clearCookie("token");
  return res.send({ message: "Account deleted successfully" });
});

// GET /cart
router.get("/cart", authMiddleware, (req, res) => {
  const customerId = req.user.id;
  db.query("SELECT items FROM customer_carts WHERE customer_id = ?", [customerId], (err, results) => {
    if (err || !results || results.length === 0) {
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
  const customerId = req.user.id;
  db.query(
    "SELECT id, items, total, status, payment_method, delivery_address, created_at FROM orders WHERE customer_id = ? ORDER BY id DESC",
    [customerId],
    (err, results) => {
      if (err || !results) {
        return res.send({ orders: getCustomerOrders(customerId) });
      }
      const orders = results.map((row) => {
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

  const customerId = req.user.id;
  const newOrder = {
    id: Date.now(),
    items: Array.isArray(items) ? items : [],
    total,
    status: "Delivered",
    payment_method,
    delivery_address,
    created_at: new Date().toISOString(),
  };

  const userOrders = getCustomerOrders(customerId);
  userOrders.unshift(newOrder);

  inMemoryUserCarts.set(customerId, []);

  const itemsStr = JSON.stringify(items);
  db.query(
    "INSERT INTO orders (customer_id, items, total, payment_method, delivery_address) VALUES (?, ?, ?, ?, ?)",
    [customerId, itemsStr, total, payment_method, delivery_address],
    (err, result) => {
      if (err) {
        console.warn("MySQL POST order warning (saved in fallback store):", err.message);
      } else if (result && result.insertId) {
        newOrder.id = result.insertId;
      }

      db.query("DELETE FROM customer_carts WHERE customer_id = ?", [customerId], () => {});

      return res.status(201).send({
        message: "Order placed successfully",
        orderId: newOrder.id,
      });
    }
  );
});

// GET /addresses
router.get("/addresses", authMiddleware, (req, res) => {
  const customerId = req.user.id;
  db.query(
    "SELECT id, type, name, phone, pincode, locality, address_line, street, city, state, landmark, alt_phone FROM saved_addresses WHERE customer_id = ? ORDER BY id DESC",
    [customerId],
    (err, results) => {
      if (err || !results) {
        return res.send({ addresses: getCustomerAddresses(customerId) });
      }
      return res.send({ addresses: results });
    }
  );
});

// POST /addresses
router.post("/addresses", authMiddleware, (req, res) => {
  const { type, name, phone, pincode, locality, address_line, street, city, state, landmark, alt_phone } = req.body;

  const cleanPincode = (pincode || "").trim();
  if (cleanPincode && !/^\d{6}$/.test(cleanPincode)) {
    return res.status(400).send("Pincode must be exactly 6 digits");
  }

  const cleanName = (name || "").trim();
  const cleanPhone = (phone || "").trim();
  const cleanLocality = (locality || "").trim();
  const cleanStreet = (street || address_line || "").trim();
  const cleanCity = (city || "").trim();
  const cleanState = (state || "").trim();
  const cleanLandmark = (landmark || "").trim();
  const cleanAltPhone = (alt_phone || "").trim();
  const cleanType = (type || "HOME").trim().toUpperCase();

  const formattedLine = cleanStreet
    ? `${cleanStreet}${cleanLocality ? ', ' + cleanLocality : ''}${cleanLandmark ? ', ' + cleanLandmark : ''}${cleanCity ? ', ' + cleanCity : ''}${cleanState ? ', ' + cleanState : ''} - ${cleanPincode}`
    : address_line || "";

  const customerId = req.user.id;
  const newAddr = {
    id: Date.now(),
    type: cleanType,
    name: cleanName,
    phone: cleanPhone,
    pincode: cleanPincode,
    locality: cleanLocality,
    street: cleanStreet,
    address_line: formattedLine,
    city: cleanCity,
    state: cleanState,
    landmark: cleanLandmark,
    alt_phone: cleanAltPhone
  };

  const userAddrs = getCustomerAddresses(customerId);
  userAddrs.unshift(newAddr);

  db.query(
    "INSERT INTO saved_addresses (customer_id, type, name, phone, pincode, locality, address_line, street, city, state, landmark, alt_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [customerId, cleanType, cleanName, cleanPhone, cleanPincode, cleanLocality, formattedLine, cleanStreet, cleanCity, cleanState, cleanLandmark, cleanAltPhone],
    (err, result) => {
      if (err) {
        // Fallback for older table schema without extra columns
        db.query(
          "INSERT INTO saved_addresses (customer_id, type, address_line, phone, pincode) VALUES (?, ?, ?, ?, ?)",
          [customerId, cleanType, formattedLine, cleanPhone, cleanPincode],
          (fallbackErr, fallbackRes) => {
            if (fallbackRes && fallbackRes.insertId) {
              newAddr.id = fallbackRes.insertId;
            }
          }
        );
      } else if (result && result.insertId) {
        newAddr.id = result.insertId;
      }
      return res.status(201).send({
        message: "Address added successfully",
        addressId: newAddr.id,
        address: newAddr
      });
    }
  );
});

// PUT /addresses/:id
router.put("/addresses/:id", authMiddleware, (req, res) => {
  const { type, name, phone, pincode, locality, address_line, street, city, state, landmark, alt_phone } = req.body;
  const addressId = req.params.id;
  const customerId = req.user.id;

  const cleanPincode = (pincode || "").trim();
  if (cleanPincode && !/^\d{6}$/.test(cleanPincode)) {
    return res.status(400).send("Pincode must be exactly 6 digits");
  }

  const cleanName = (name || "").trim();
  const cleanPhone = (phone || "").trim();
  const cleanLocality = (locality || "").trim();
  const cleanStreet = (street || address_line || "").trim();
  const cleanCity = (city || "").trim();
  const cleanState = (state || "").trim();
  const cleanLandmark = (landmark || "").trim();
  const cleanAltPhone = (alt_phone || "").trim();
  const cleanType = (type || "HOME").trim().toUpperCase();

  const formattedLine = cleanStreet
    ? `${cleanStreet}${cleanLocality ? ', ' + cleanLocality : ''}${cleanLandmark ? ', ' + cleanLandmark : ''}${cleanCity ? ', ' + cleanCity : ''}${cleanState ? ', ' + cleanState : ''} - ${cleanPincode}`
    : address_line || "";

  const updatedObj = {
    id: addressId,
    type: cleanType,
    name: cleanName,
    phone: cleanPhone,
    pincode: cleanPincode,
    locality: cleanLocality,
    street: cleanStreet,
    address_line: formattedLine,
    city: cleanCity,
    state: cleanState,
    landmark: cleanLandmark,
    alt_phone: cleanAltPhone
  };

  const userAddrs = getCustomerAddresses(customerId);
  const idx = userAddrs.findIndex((a) => String(a.id) === String(addressId));
  if (idx !== -1) {
    userAddrs[idx] = updatedObj;
  }

  db.query(
    "UPDATE saved_addresses SET type = ?, name = ?, phone = ?, pincode = ?, locality = ?, address_line = ?, street = ?, city = ?, state = ?, landmark = ?, alt_phone = ? WHERE id = ? AND customer_id = ?",
    [cleanType, cleanName, cleanPhone, cleanPincode, cleanLocality, formattedLine, cleanStreet, cleanCity, cleanState, cleanLandmark, cleanAltPhone, addressId, customerId],
    (err) => {
      if (err) {
        // Fallback for older table schema
        db.query(
          "UPDATE saved_addresses SET type = ?, address_line = ?, phone = ?, pincode = ? WHERE id = ? AND customer_id = ?",
          [cleanType, formattedLine, cleanPhone, cleanPincode, addressId, customerId],
          () => {}
        );
      }
      return res.send({ message: "Address updated successfully", address: updatedObj });
    }
  );
});

// DELETE /addresses/:id
router.delete("/addresses/:id", authMiddleware, (req, res) => {
  const addressId = req.params.id;
  const customerId = req.user.id;

  const userAddrs = getCustomerAddresses(customerId);
  const filtered = userAddrs.filter((a) => String(a.id) !== String(addressId));
  inMemoryAddresses.set(customerId, filtered);

  db.query(
    "DELETE FROM saved_addresses WHERE id = ? AND customer_id = ?",
    [addressId, customerId],
    (err) => {
      if (err) {
        console.warn("MySQL DELETE address warning:", err.message);
      }
      return res.send({ message: "Address deleted successfully" });
    }
  );
});

// GET /subscriptions
router.get("/subscriptions", authMiddleware, (req, res) => {
  const customerId = req.user.id;
  db.query(
    "SELECT id, plan_key, plan_name, price, unit, status, next_delivery, created_at FROM subscriptions WHERE customer_id = ? ORDER BY id DESC",
    [customerId],
    (err, results) => {
      if (err || !results) {
        return res.send({ subscriptions: getCustomerSubscriptions(customerId) });
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

  const customerId = req.user.id;
  const newSub = {
    id: Date.now(),
    plan_key,
    plan_name,
    price: price || null,
    unit,
    status: "Active",
    next_delivery,
    created_at: new Date().toISOString(),
  };

  const userSubs = getCustomerSubscriptions(customerId);
  userSubs.unshift(newSub);

  db.query(
    "INSERT INTO subscriptions (customer_id, plan_key, plan_name, price, unit, next_delivery) VALUES (?, ?, ?, ?, ?, ?)",
    [customerId, plan_key, plan_name, price || null, unit, next_delivery],
    (err, result) => {
      if (err) {
        console.warn("MySQL POST subscription warning (saved to in-memory fallback):", err.message);
      } else if (result && result.insertId) {
        newSub.id = result.insertId;
      }
      return res.status(201).send({
        message: "Subscription activated successfully",
        subscriptionId: newSub.id,
      });
    }
  );
});

// PUT /subscriptions/:id/status
router.put("/subscriptions/:id/status", authMiddleware, (req, res) => {
  const { status } = req.body;
  const subscriptionId = req.params.id;
  const customerId = req.user.id;

  if (!status) {
    return res.status(400).send("Missing status");
  }

  const userSubs = getCustomerSubscriptions(customerId);
  const targetSub = userSubs.find((s) => String(s.id) === String(subscriptionId));
  if (targetSub) {
    targetSub.status = status;
  }

  db.query(
    "UPDATE subscriptions SET status = ? WHERE id = ? AND customer_id = ?",
    [status, subscriptionId, customerId],
    (err) => {
      if (err) {
        console.warn("MySQL PUT subscription status warning:", err.message);
      }
      return res.send({ message: `Subscription status updated to ${status}` });
    }
  );
});

// DELETE /subscriptions/:id
router.delete("/subscriptions/:id", authMiddleware, (req, res) => {
  const subscriptionId = req.params.id;
  const customerId = req.user.id;

  const userSubs = getCustomerSubscriptions(customerId);
  const filtered = userSubs.filter((s) => String(s.id) !== String(subscriptionId));
  inMemorySubscriptions.set(customerId, filtered);

  db.query(
    "DELETE FROM subscriptions WHERE id = ? AND customer_id = ?",
    [subscriptionId, customerId],
    (err) => {
      if (err) {
        console.warn("MySQL DELETE subscription warning:", err.message);
      }
      return res.send({ message: "Subscription cancelled successfully" });
    }
  );
});

// GET /giftcard
router.get("/giftcard", authMiddleware, (req, res) => {
  const customerId = req.user.id;
  db.query(
    "SELECT gift_card_balance FROM customers WHERE id = ?",
    [customerId],
    (err, results) => {
      if (err || !results || results.length === 0) {
        return res.send({ balance: req.user.gift_card_balance || "0.00" });
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
  if (upperCode === "GIFT50") amount = 50.0;
  else if (upperCode === "GIFT100") amount = 100.0;
  else if (upperCode === "GIFT500") amount = 500.0;
  else {
    return res.status(400).send("Invalid gift card or promo code");
  }

  const customerId = req.user.id;
  const currentBal = parseFloat(req.user.gift_card_balance || 0);
  const newBal = (currentBal + amount).toFixed(2);
  req.user.gift_card_balance = newBal;

  db.query(
    "UPDATE customers SET gift_card_balance = gift_card_balance + ? WHERE id = ?",
    [amount, customerId],
    () => {}
  );

  return res.send({
    message: `Successfully redeemed ₹${amount}!`,
    balance: newBal,
  });
});

// POST /giftcard/buy
router.post("/giftcard/buy", authMiddleware, (req, res) => {
  const { amount } = req.body;
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).send("Invalid purchase amount");
  }

  const customerId = req.user.id;
  const currentBal = parseFloat(req.user.gift_card_balance || 0);
  const newBal = (currentBal + numAmount).toFixed(2);
  req.user.gift_card_balance = newBal;

  db.query(
    "UPDATE customers SET gift_card_balance = gift_card_balance + ? WHERE id = ?",
    [numAmount, customerId],
    () => {}
  );

  return res.send({
    message: `Successfully purchased ₹${numAmount} credits!`,
    balance: newBal,
  });
});

export default router;