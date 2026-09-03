import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import Address from "../models/Address.js";
import Order from "../models/Order.js";
import Subscription from "../models/Subscription.js";
import Cart from "../models/Cart.js";
import generateOTP from "../utils/otpGenerator.js";
import sendEmail from "../services/emailService.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  registerCustomerSchema,
  loginCustomerSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from "../utils/validationSchemas.js";

const router = express.Router();

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  return secret;
};

const buildAuthToken = (customer) =>
  jwt.sign(
    {
      id: String(customer._id || customer.id),
      phone: customer.phone,
      email: customer.email,
      name: customer.name,
    },
    getJwtSecret(),
    { expiresIn: "7d" }
  );

const setAuthCookie = (res, customer) => {
  const token = buildAuthToken(customer);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

const normalizeIdentifier = (value) => (value || "").trim();

const formatCustomerResponse = (user) => ({
  id: String(user._id || user.id),
  _id: user._id,
  name: user.name,
  phone: user.phone,
  email: user.email,
  address: user.address,
  pincode: user.pincode,
  gift_card_balance: Number(user.gift_card_balance || 0).toFixed(2),
  google_id: user.google_id || null,
  profile_picture: user.profile_picture || "",
  created_at: user.createdAt,
});

// REGISTER CUSTOMER PROFILE
router.post("/register-customer", async (req, res) => {
  try {
    const parseResult = registerCustomerSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors[0]?.message || "Invalid input data";
      return res.status(400).send(errorMsg);
    }

    const { name, phone, email, password, address, pincode } = parseResult.data;

    const existingUser = await User.findOne({
      $or: [{ phone }, { email }],
    });

    if (existingUser) {
      return res.status(409).send("A customer with this phone or email already exists");
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      address,
      pincode,
      gift_card_balance: 0.0,
    });

    return res.status(201).send("Customer registered successfully");
  } catch (error) {
    console.error("Register Customer Error:", error.message);
    return res.status(500).send("Internal server error during registration");
  }
});

// LOGIN CUSTOMER WITH SAVED PROFILE
router.post(["/login-customer", "/customer/login"], async (req, res) => {
  try {
    const parseResult = loginCustomerSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors[0]?.message || "Invalid credentials provided";
      return res.status(400).send(errorMsg);
    }

    const { phone, email, password } = req.body;
    const identifier = normalizeIdentifier(phone || email);

    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: identifier.toLowerCase() }],
    });

    if (!user) {
      return res.status(401).send("Invalid phone/email or password");
    }

    // Compare bcrypt password (with graceful legacy fallback if password wasn't hashed yet)
    let isPasswordValid = false;
    if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      isPasswordValid = user.password === password;
      if (isPasswordValid) {
        // Upgrade legacy plaintext password to bcrypt hash
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!isPasswordValid) {
      return res.status(401).send("Invalid phone/email or password");
    }

    setAuthCookie(res, user);
    return res.send({
      message: "Login successful",
      customer: formatCustomerResponse(user),
    });
  } catch (error) {
    console.error("Login Customer Error:", error.message);
    return res.status(500).send("Internal server error during login");
  }
});

// FETCH AUTHENTICATED PROFILE
router.get("/profile", authMiddleware, (req, res) => {
  return res.send({
    message: "Profile fetched successfully",
    customer: req.user,
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.send({ message: "Logged out successfully" });
});

// SEND OTP (EMAIL ONLY)
router.post("/send-otp", async (req, res) => {
  try {
    const parseResult = sendOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).send(parseResult.error.errors[0]?.message || "Email address is required");
    }

    const { contact, phone, email } = req.body;
    const rawInput = normalizeIdentifier(email || contact || phone);

    if (!rawInput) {
      return res.status(400).send("Email address is required");
    }

    let targetEmail = "";
    if (rawInput.includes("@")) {
      targetEmail = rawInput.toLowerCase();
    } else {
      // If user entered phone number, look up registered customer's email
      const existingUser = await User.findOne({ phone: rawInput });
      if (existingUser && existingUser.email && existingUser.email.includes("@")) {
        targetEmail = existingUser.email.toLowerCase();
      } else {
        return res
          .status(400)
          .send("Please enter your email address to receive the verification OTP.");
      }
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(targetEmail)) {
      return res.status(400).send("Please enter a valid email address format");
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP to MongoDB (expires automatically in 5 minutes via TTL index)
    await Otp.deleteMany({ contact: targetEmail });
    await Otp.create({
      contact: targetEmail,
      otp,
      expiresAt: expiry,
    });

    if (rawInput !== targetEmail) {
      await Otp.deleteMany({ contact: rawInput });
      await Otp.create({
        contact: rawInput,
        otp,
        expiresAt: expiry,
      });
    }

    // Ensure customer profile exists in database
    const existingCust = await User.findOne({
      $or: [{ email: targetEmail }, { phone: rawInput }],
    });

    if (!existingCust) {
      const defaultName = targetEmail.split("@")[0];
      const defaultPhone = rawInput.replace(/\D/g, "") || "9876543210";
      const defaultHashedPass = await bcrypt.hash("otp-user-pass", 10);

      await User.create({
        name: defaultName,
        phone: defaultPhone.slice(0, 10),
        email: targetEmail,
        password: defaultHashedPass,
        address: "Delivery Address",
        pincode: "110001",
        gift_card_balance: 0.0,
      });
    }

    // Send OTP via Nodemailer to the user's specific email
    try {
      await sendEmail(targetEmail, otp, "login");
    } catch (emailErr) {
      console.error("Email delivery failed:", emailErr.message);
      return res.status(500).send("Failed to send OTP email. Please check server email configuration.");
    }

    return res.send({
      success: true,
      message: `OTP sent successfully to ${targetEmail}`,
    });
  } catch (error) {
    console.error("Send OTP Error:", error.message);
    return res.status(500).send("Failed to send OTP");
  }
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const parseResult = verifyOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).send(parseResult.error.errors[0]?.message || "Email and OTP are required");
    }

    const { contact, phone, email, otp } = req.body;
    const rawInput = normalizeIdentifier(email || contact || phone);

    if (!rawInput || !otp) {
      return res.status(400).send("Email and OTP are required");
    }

    const lookupKeys = [rawInput, rawInput.toLowerCase()];

    // Validate real OTP against MongoDB
    const otpRecord = await Otp.findOne({
      contact: { $in: lookupKeys },
      otp: otp.trim(),
      expiresAt: { $gt: new Date() },
    }).sort({ _id: -1 });

    if (!otpRecord) {
      return res.status(400).send("OTP not found, invalid, or expired");
    }

    // Delete verified OTP to prevent replay attacks
    await Otp.deleteMany({ contact: { $in: lookupKeys } });

    let user = await User.findOne({
      $or: [{ email: rawInput.toLowerCase() }, { phone: rawInput }],
    });

    if (!user) {
      const isEmail = rawInput.includes("@");
      const defaultName = isEmail ? rawInput.split("@")[0] : `User ${rawInput.slice(-4)}`;
      const phoneVal = isEmail ? "9876543210" : rawInput;
      const emailVal = isEmail ? rawInput.toLowerCase() : `user_${rawInput}@fillcarts.local`;
      const defaultHashedPass = await bcrypt.hash("otp-user-pass", 10);

      user = await User.create({
        name: defaultName,
        phone: phoneVal,
        email: emailVal,
        password: defaultHashedPass,
        address: "Delivery Address",
        pincode: "110001",
        gift_card_balance: 0.0,
      });
    }

    setAuthCookie(res, user);
    return res.send({
      message: "Login successful",
      customer: formatCustomerResponse(user),
    });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    return res.status(500).send("Failed to verify OTP");
  }
});

// FORGOT PASSWORD - SEND OTP (EMAIL ONLY)
router.post("/forgot-password/send-otp", async (req, res) => {
  try {
    const parseResult = sendOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).send("Email address is required");
    }

    const { contact, phone, email } = req.body;
    const rawInput = normalizeIdentifier(email || contact || phone);

    if (!rawInput) {
      return res.status(400).send("Email address is required");
    }

    let targetEmail = "";
    if (rawInput.includes("@")) {
      targetEmail = rawInput.toLowerCase();
    } else {
      const existingUser = await User.findOne({ phone: rawInput });
      if (existingUser && existingUser.email) {
        targetEmail = existingUser.email.toLowerCase();
      } else {
        return res.status(404).send("No registered email found for this user");
      }
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.deleteMany({ contact: targetEmail });
    await Otp.create({
      contact: targetEmail,
      otp,
      expiresAt: expiry,
    });

    if (rawInput !== targetEmail) {
      await Otp.deleteMany({ contact: rawInput });
      await Otp.create({
        contact: rawInput,
        otp,
        expiresAt: expiry,
      });
    }

    try {
      await sendEmail(targetEmail, otp, "password_reset");
    } catch (emailErr) {
      console.error("Forgot Password Email delivery failed:", emailErr.message);
      return res.status(500).send("Failed to send password reset OTP email");
    }

    return res.send({
      success: true,
      message: `Password reset OTP sent successfully to ${targetEmail}`,
    });
  } catch (error) {
    console.error("Forgot Password OTP Error:", error.message);
    return res.status(500).send("Failed to send reset OTP");
  }
});

// FORGOT PASSWORD - RESET PASSWORD WITH OTP
router.post("/forgot-password/reset", async (req, res) => {
  try {
    const { contact, phone, email, otp, newPassword } = req.body;
    const rawInput = normalizeIdentifier(email || contact || phone);

    if (!rawInput || !otp || !newPassword) {
      return res.status(400).send("Email, OTP, and new password are required");
    }

    if (newPassword.length < 6) {
      return res.status(400).send("Password must be at least 6 characters long");
    }

    const lookupKeys = [rawInput, rawInput.toLowerCase()];

    const otpRecord = await Otp.findOne({
      contact: { $in: lookupKeys },
      otp: String(otp).trim(),
      expiresAt: { $gt: new Date() },
    }).sort({ _id: -1 });

    if (!otpRecord) {
      return res.status(400).send("Invalid or expired OTP");
    }

    await Otp.deleteMany({ contact: { $in: lookupKeys } });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    let user = await User.findOneAndUpdate(
      { $or: [{ email: rawInput.toLowerCase() }, { phone: rawInput }] },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      const isEmail = rawInput.includes("@");
      const defaultName = isEmail ? rawInput.split("@")[0] : `User ${rawInput.slice(-4)}`;
      const phoneVal = isEmail ? "9876543210" : rawInput;
      const emailVal = isEmail ? rawInput.toLowerCase() : `user_${rawInput}@fillcarts.local`;

      user = await User.create({
        name: defaultName,
        phone: phoneVal,
        email: emailVal,
        password: hashedPassword,
        address: "Delivery Address",
        pincode: "110001",
        gift_card_balance: 0.0,
      });
    }

    setAuthCookie(res, user);
    return res.send({
      message: "Password reset successful! Logging you in...",
      customer: formatCustomerResponse(user),
    });
  } catch (error) {
    console.error("Password Reset Error:", error.message);
    return res.status(500).send("Failed to reset password");
  }
});

// PUT /profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, email, address, pincode } = req.body;
    const customerId = req.user.id;

    if (!name || !phone || !email || !address || !pincode) {
      return res.status(400).send("Please fill all required fields, including address and pincode");
    }

    const cleanPincode = (pincode || "").trim();
    if (!/^\d{6}$/.test(cleanPincode)) {
      return res.status(400).send("Pincode must be exactly 6 digits");
    }

    const updated = await User.findByIdAndUpdate(
      customerId,
      {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        pincode: cleanPincode,
      },
      { new: true }
    );

    const result = updated ? formatCustomerResponse(updated) : {
      ...(req.user || {}),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      pincode: cleanPincode,
    };

    return res.send({
      message: "Profile updated successfully",
      customer: result,
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    return res.status(500).send("Failed to update profile");
  }
});

// DELETE /profile (Account deletion)
router.delete("/profile", authMiddleware, async (req, res) => {
  try {
    const customerId = req.user.id;
    await User.findByIdAndDelete(customerId);
    await Address.deleteMany({ customerId });
    await Cart.deleteOne({ customerId });
    await Subscription.deleteMany({ customerId });

    res.clearCookie("token");
    return res.send({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete Account Error:", error.message);
    return res.status(500).send("Failed to delete account");
  }
});

// GET /cart
router.get("/cart", authMiddleware, async (req, res) => {
  try {
    const customerId = req.user.id;
    const cartDoc = await Cart.findOne({ customerId });
    return res.send({ cart: cartDoc?.items || [] });
  } catch (error) {
    console.error("Get Cart Error:", error.message);
    return res.send({ cart: [] });
  }
});

// POST /cart
router.post("/cart", authMiddleware, async (req, res) => {
  try {
    const { cart } = req.body;
    const customerId = req.user.id;
    const safeCart = Array.isArray(cart) ? cart : [];

    await Cart.findOneAndUpdate(
      { customerId },
      { items: safeCart },
      { upsert: true, new: true }
    );

    return res.send({ message: "Cart saved successfully", cart: safeCart });
  } catch (error) {
    console.error("Save Cart Error:", error.message);
    return res.status(500).send("Failed to save cart");
  }
});

// GET /orders (with Pagination)
router.get("/orders", authMiddleware, async (req, res) => {
  try {
    const customerId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ customerId });
    const orders = await Order.find({ customerId })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const formattedOrders = orders.map((o) => ({
      id: String(o._id),
      _id: o._id,
      items: o.items || [],
      total: o.total,
      status: o.status,
      payment_method: o.paymentMethod,
      delivery_address: o.deliveryAddress,
      created_at: o.createdAt,
    }));

    return res.send({
      orders: formattedOrders,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get Orders Error:", error.message);
    return res.send({ orders: [] });
  }
});

// POST /orders
router.post("/orders", authMiddleware, async (req, res) => {
  try {
    const { items, total, payment_method, delivery_address } = req.body;
    if (!items || !total || !payment_method || !delivery_address) {
      return res.status(400).send("Missing order details");
    }

    const customerId = req.user.id;
    const newOrder = await Order.create({
      customerId,
      items: Array.isArray(items) ? items : [],
      total: Number(total),
      paymentMethod: payment_method,
      deliveryAddress: delivery_address,
      status: "Delivered",
    });

    // Clear cart
    await Cart.deleteOne({ customerId });

    return res.status(201).send({
      message: "Order placed successfully",
      orderId: String(newOrder._id),
    });
  } catch (error) {
    console.error("Create Order Error:", error.message);
    return res.status(500).send("Failed to place order");
  }
});

// GET /addresses (with Pagination)
router.get("/addresses", authMiddleware, async (req, res) => {
  try {
    const customerId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const total = await Address.countDocuments({ customerId });
    const addresses = await Address.find({ customerId })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const formattedAddresses = addresses.map((a) => ({
      id: String(a._id),
      _id: a._id,
      type: a.type,
      name: a.name,
      phone: a.phone,
      pincode: a.pincode,
      locality: a.locality,
      street: a.street,
      address_line: a.addressLine,
      city: a.city,
      state: a.state,
      landmark: a.landmark,
      alt_phone: a.altPhone,
    }));

    return res.send({
      addresses: formattedAddresses,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get Addresses Error:", error.message);
    return res.send({ addresses: [] });
  }
});

// POST /addresses
router.post("/addresses", authMiddleware, async (req, res) => {
  try {
    const {
      type,
      name,
      phone,
      pincode,
      locality,
      address_line,
      street,
      city,
      state,
      landmark,
      alt_phone,
    } = req.body;

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
      ? `${cleanStreet}${cleanLocality ? ", " + cleanLocality : ""}${cleanLandmark ? ", " + cleanLandmark : ""}${cleanCity ? ", " + cleanCity : ""}${cleanState ? ", " + cleanState : ""} - ${cleanPincode}`
      : address_line || "";

    const customerId = req.user.id;

    const newAddr = await Address.create({
      customerId,
      type: cleanType,
      name: cleanName,
      phone: cleanPhone,
      pincode: cleanPincode,
      locality: cleanLocality,
      street: cleanStreet,
      addressLine: formattedLine,
      city: cleanCity,
      state: cleanState,
      landmark: cleanLandmark,
      altPhone: cleanAltPhone,
    });

    const responseAddr = {
      id: String(newAddr._id),
      _id: newAddr._id,
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
      alt_phone: cleanAltPhone,
    };

    return res.status(201).send({
      message: "Address added successfully",
      addressId: String(newAddr._id),
      address: responseAddr,
    });
  } catch (error) {
    console.error("Create Address Error:", error.message);
    return res.status(500).send("Failed to save address");
  }
});

// PUT /addresses/:id
router.put("/addresses/:id", authMiddleware, async (req, res) => {
  try {
    const {
      type,
      name,
      phone,
      pincode,
      locality,
      address_line,
      street,
      city,
      state,
      landmark,
      alt_phone,
    } = req.body;
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
      ? `${cleanStreet}${cleanLocality ? ", " + cleanLocality : ""}${cleanLandmark ? ", " + cleanLandmark : ""}${cleanCity ? ", " + cleanCity : ""}${cleanState ? ", " + cleanState : ""} - ${cleanPincode}`
      : address_line || "";

    await Address.findOneAndUpdate(
      { _id: addressId, customerId },
      {
        type: cleanType,
        name: cleanName,
        phone: cleanPhone,
        pincode: cleanPincode,
        locality: cleanLocality,
        street: cleanStreet,
        addressLine: formattedLine,
        city: cleanCity,
        state: cleanState,
        landmark: cleanLandmark,
        altPhone: cleanAltPhone,
      },
      { new: true }
    );

    const responseObj = {
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
      alt_phone: cleanAltPhone,
    };

    return res.send({
      message: "Address updated successfully",
      address: responseObj,
    });
  } catch (error) {
    console.error("Update Address Error:", error.message);
    return res.status(500).send("Failed to update address");
  }
});

// DELETE /addresses/:id
router.delete("/addresses/:id", authMiddleware, async (req, res) => {
  try {
    const addressId = req.params.id;
    const customerId = req.user.id;

    await Address.findOneAndDelete({ _id: addressId, customerId });
    return res.send({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Delete Address Error:", error.message);
    return res.status(500).send("Failed to delete address");
  }
});

// GET /subscriptions
router.get("/subscriptions", authMiddleware, async (req, res) => {
  try {
    const customerId = req.user.id;
    const subs = await Subscription.find({ customerId }).sort({ _id: -1 });

    const formattedSubs = subs.map((s) => ({
      id: String(s._id),
      _id: s._id,
      plan_key: s.planKey,
      plan_name: s.planName,
      price: s.price,
      unit: s.unit,
      status: s.status,
      next_delivery: s.nextDelivery,
      created_at: s.createdAt,
    }));

    return res.send({ subscriptions: formattedSubs });
  } catch (error) {
    console.error("Get Subscriptions Error:", error.message);
    return res.send({ subscriptions: [] });
  }
});

// POST /subscriptions
router.post("/subscriptions", authMiddleware, async (req, res) => {
  try {
    const { plan_key, plan_name, price, unit, next_delivery } = req.body;
    if (!plan_key || !plan_name || !unit || !next_delivery) {
      return res.status(400).send("Missing subscription details");
    }

    const customerId = req.user.id;
    const newSub = await Subscription.create({
      customerId,
      planKey: plan_key,
      planName: plan_name,
      price: price ? Number(price) : null,
      unit,
      status: "Active",
      nextDelivery: next_delivery,
    });

    return res.status(201).send({
      message: "Subscription activated successfully",
      subscriptionId: String(newSub._id),
    });
  } catch (error) {
    console.error("Create Subscription Error:", error.message);
    return res.status(500).send("Failed to activate subscription");
  }
});

// PUT /subscriptions/:id/status
router.put("/subscriptions/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const subscriptionId = req.params.id;
    const customerId = req.user.id;

    if (!status) {
      return res.status(400).send("Missing status");
    }

    await Subscription.findOneAndUpdate(
      { _id: subscriptionId, customerId },
      { status },
      { new: true }
    );

    return res.send({ message: `Subscription status updated to ${status}` });
  } catch (error) {
    console.error("Update Subscription Status Error:", error.message);
    return res.status(500).send("Failed to update subscription status");
  }
});

// DELETE /subscriptions/:id
router.delete("/subscriptions/:id", authMiddleware, async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const customerId = req.user.id;

    await Subscription.findOneAndDelete({ _id: subscriptionId, customerId });
    return res.send({ message: "Subscription cancelled successfully" });
  } catch (error) {
    console.error("Cancel Subscription Error:", error.message);
    return res.status(500).send("Failed to cancel subscription");
  }
});

// GET /giftcard
router.get("/giftcard", authMiddleware, async (req, res) => {
  try {
    const customerId = req.user.id;
    const user = await User.findById(customerId);
    return res.send({ balance: Number(user?.gift_card_balance || 0).toFixed(2) });
  } catch (error) {
    console.error("Get Giftcard Error:", error.message);
    return res.send({ balance: "0.00" });
  }
});

// POST /giftcard/redeem (Atomic $inc update)
router.post("/giftcard/redeem", authMiddleware, async (req, res) => {
  try {
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

    // Atomic update to prevent race conditions
    const updatedUser = await User.findByIdAndUpdate(
      customerId,
      { $inc: { gift_card_balance: amount } },
      { new: true }
    );

    const newBal = Number(updatedUser?.gift_card_balance || 0).toFixed(2);

    return res.send({
      message: `Successfully redeemed ₹${amount}!`,
      balance: newBal,
    });
  } catch (error) {
    console.error("Redeem Giftcard Error:", error.message);
    return res.status(500).send("Failed to redeem gift card");
  }
});

// POST /giftcard/buy (Atomic $inc update)
router.post("/giftcard/buy", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).send("Invalid purchase amount");
    }

    const customerId = req.user.id;

    // Atomic update to prevent race conditions
    const updatedUser = await User.findByIdAndUpdate(
      customerId,
      { $inc: { gift_card_balance: numAmount } },
      { new: true }
    );

    const newBal = Number(updatedUser?.gift_card_balance || 0).toFixed(2);

    return res.send({
      message: `Successfully purchased ₹${numAmount} credits!`,
      balance: newBal,
    });
  } catch (error) {
    console.error("Buy Giftcard Error:", error.message);
    return res.status(500).send("Failed to purchase gift card");
  }
});

export default router;