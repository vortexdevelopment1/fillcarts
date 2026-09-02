import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    contact: {
      type: String,
      required: [true, "Contact is required"],
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Document will expire automatically when current time passes expiresAt
    },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema);

export default Otp;
