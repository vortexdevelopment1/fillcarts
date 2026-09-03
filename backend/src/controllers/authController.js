import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import Subscription from "../models/Subscription.js";
import generateOTP from "../utils/otpGenerator.js";
import sendEmail from "../services/emailService.js";
import {
  registerCustomerSchema,
  loginCustomerSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from "../utils/validationSchemas.js";

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
  const isProduction = process.env.NODE_ENV === "production" || !process.env.NODE_ENV;

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
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

/**
 * Register Customer Profile
 * POST /api/register-customer
 */
export const registerCustomer = async (req, res) => {
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
};

/**
 * Login Customer with Saved Profile
 * POST /api/login-customer & POST /api/customer/login
 */
export const loginCustomer = async (req, res) => {
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

    const token = setAuthCookie(res, user);
    return res.send({
      message: "Login successful",
      token,
      customer: formatCustomerResponse(user),
    });
  } catch (error) {
    console.error("Login Customer Error:", error.message);
    return res.status(500).send("Internal server error during login");
  }
};

/**
 * Fetch Authenticated Customer Profile
 * GET /api/profile
 */
export const getProfile = (req, res) => {
  return res.send({
    message: "Profile fetched successfully",
    customer: req.user,
  });
};

/**
 * Update Customer Profile
 * PUT /api/profile
 */
export const updateProfile = async (req, res) => {
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

    const result = updated
      ? formatCustomerResponse(updated)
      : {
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
};

/**
 * Delete Customer Account
 * DELETE /api/profile
 */
export const deleteProfile = async (req, res) => {
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
};

/**
 * Logout Customer
 * POST /api/logout
 */
export const logoutCustomer = (req, res) => {
  res.clearCookie("token");
  return res.send({ message: "Logged out successfully" });
};

/**
 * Send OTP via Email
 * POST /api/send-otp
 */
export const sendOtp = async (req, res) => {
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

    // Send OTP via Resend Email API to the user's specific email
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
};

/**
 * Verify OTP & Login
 * POST /api/verify-otp
 */
export const verifyOtp = async (req, res) => {
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

    const token = setAuthCookie(res, user);
    return res.send({
      message: "Login successful",
      token,
      customer: formatCustomerResponse(user),
    });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    return res.status(500).send("Failed to verify OTP");
  }
};

/**
 * Forgot Password - Send OTP
 * POST /api/forgot-password/send-otp
 */
export const forgotPasswordSendOtp = async (req, res) => {
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
};

/**
 * Forgot Password - Reset Password with OTP
 * POST /api/forgot-password/reset
 */
export const forgotPasswordReset = async (req, res) => {
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

    const token = setAuthCookie(res, user);
    return res.send({
      message: "Password reset successful! Logging you in...",
      token,
      customer: formatCustomerResponse(user),
    });
  } catch (error) {
    console.error("Password Reset Error:", error.message);
    return res.status(500).send("Failed to reset password");
  }
};
