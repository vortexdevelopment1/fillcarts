import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: [true, "Customer ID is required"],
      index: true,
    },
    type: {
      type: String,
      default: "HOME",
      trim: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    pincode: {
      type: String,
      default: "",
      trim: true,
    },
    locality: {
      type: String,
      default: "",
      trim: true,
    },
    street: {
      type: String,
      default: "",
      trim: true,
    },
    addressLine: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    state: {
      type: String,
      default: "",
      trim: true,
    },
    landmark: {
      type: String,
      default: "",
      trim: true,
    },
    altPhone: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
