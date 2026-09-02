import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token missing",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("FATAL: JWT_SECRET environment variable is missing");
      return res.status(500).json({
        success: false,
        message: "Server authentication error",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const name = payload.name;
    const email = payload.email.toLowerCase();
    const picture = payload.picture;

    // Look for existing user by email
    let user = await User.findOne({ email });

    if (user) {
      // Update google_id or profile_picture if missing
      if (!user.google_id || !user.profile_picture) {
        user.google_id = user.google_id || googleId;
        user.profile_picture = user.profile_picture || picture;
        await user.save();
      }

      const authToken = jwt.sign(
        {
          id: String(user._id),
          email: user.email,
        },
        jwtSecret,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("token", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        token: authToken,
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          profile_picture: user.profile_picture,
        },
      });
    }

    // Create New Google User
    const newUser = await User.create({
      name,
      email,
      google_id: googleId,
      profile_picture: picture,
      address: "Delivery Address",
      pincode: "110001",
      gift_card_balance: 0.0,
    });

    const authToken = jwt.sign(
      {
        id: String(newUser._id),
        email: newUser.email,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token: authToken,
      user: {
        id: String(newUser._id),
        name: newUser.name,
        email: newUser.email,
        profile_picture: newUser.profile_picture,
      },
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Google verification failed",
    });
  }
});

export default router;