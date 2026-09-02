import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      required: [true, "Vendor ID is required"],
      unique: true,
      index: true,
      trim: true,
    },
    storeName: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Store address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
    },
    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    gstNumber: {
      type: String,
      default: "",
      trim: true,
    },
    panNumber: {
      type: String,
      default: "",
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

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);

export default Vendor;
