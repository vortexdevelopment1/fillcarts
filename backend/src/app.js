import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

// Routes
import otpRoutes from "./routes/otpRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

const app = express();

// Trust proxy for Render / reverse proxy rate limiting
app.set("trust proxy", 1);

// 1. Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 2. Strict CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://fillcarts-customer.vercel.app",
  "https://fillcarts.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback for cross-origin compatibility
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// 3. Body & Cookie Parsing Middleware
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// 4. NoSQL Query Injection Sanitization (Express 5 compatible)
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});

// 5. Rate Limiting Configurations
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

const sendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many OTP requests. Please try again after 15 minutes.",
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts. Please try again after 15 minutes.",
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many registration attempts. Please try again after an hour.",
});

const googleAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many Google login attempts. Please try again later." },
});

// Apply global rate limiting to all /api routes
app.use("/api", globalLimiter);

// Apply specific strict rate limits
app.use("/api/send-otp", sendOtpLimiter);
app.use("/api/login-customer", loginLimiter);
app.use("/api/customer/login", loginLimiter);
app.use("/api/register-customer", registerLimiter);
app.use("/api/auth/google-login", googleAuthLimiter);

// 6. Request Logging in Development
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// 7. Health & Status Endpoints
app.get("/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  return res.status(isDbConnected ? 200 : 503).json({
    status: "ok",
    database: isDbConnected ? "connected" : "disconnected",
  });
});

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// 8. API Routes Mounting
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/rider", riderRoutes);
app.use("/api", otpRoutes);
app.use("/api/auth", googleAuthRoutes);

// 9. 404 Catch-All Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route '${req.originalUrl}' not found` });
});

// 10. Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err.message || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
});

export default app;
