import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("FATAL: JWT_SECRET environment variable is not defined!");
    return res.status(500).json({ message: "Internal server authentication configuration error" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (!decoded || (!decoded.id && !decoded.email && !decoded.phone)) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    let user = null;
    if (decoded.id) {
      try {
        user = await User.findById(decoded.id);
      } catch (err) {
        user = null;
      }
    }

    if (!user) {
      user = await User.findOne({
        $or: [
          { email: decoded.email ? String(decoded.email).toLowerCase() : "" },
          { phone: decoded.phone ? String(decoded.phone) : "" },
        ],
      });
    }

    // Strict check: User must exist in the database. No synthetic/mock users allowed.
    if (!user) {
      return res.status(401).json({ message: "User account not found or session revoked" });
    }

    req.user = {
      id: String(user._id),
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
      pincode: user.pincode,
      gift_card_balance: Number(user.gift_card_balance || 0).toFixed(2),
      google_id: user.google_id,
      profile_picture: user.profile_picture,
      created_at: user.createdAt,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};

export default authMiddleware;
