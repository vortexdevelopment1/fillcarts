import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      sparse: true,
    },
    password: {
      type: String,
      default: "otp-user-pass",
    },
    address: {
      type: String,
      default: "Delivery Address",
      trim: true,
    },
    pincode: {
      type: String,
      default: "110001",
      trim: true,
    },
    gift_card_balance: {
      type: Number,
      default: 0.0,
      min: [0, "Balance cannot be negative"],
    },
    google_id: {
      type: String,
      default: null,
      sparse: true,
    },
    profile_picture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
