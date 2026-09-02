import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: [true, "Customer ID is required"],
      index: true,
    },
    items: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: [],
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Delivered",
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
