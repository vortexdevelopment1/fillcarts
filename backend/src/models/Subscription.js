import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: [true, "Customer ID is required"],
      index: true,
    },
    planKey: {
      type: String,
      required: true,
      trim: true,
    },
    planName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      default: null,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "Active",
      trim: true,
    },
    nextDelivery: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
