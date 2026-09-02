import mongoose from "mongoose";

const riderSchema = new mongoose.Schema(
  {
    riderId: {
      type: String,
      required: [true, "Rider ID is required"],
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Rider name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      index: true,
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    vehicle: {
      type: String,
      default: "Motorbike / Scooter",
      trim: true,
    },
    status: {
      type: String,
      default: "Pending",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rider = mongoose.models.Rider || mongoose.model("Rider", riderSchema);

export default Rider;
