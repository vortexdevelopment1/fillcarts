import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true,
    },
    categoryKey: {
      type: String,
      required: [true, "Category key is required"],
      trim: true,
      index: true,
    },
    categoryName: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    mrp: {
      type: Number,
      required: [true, "Product MRP is required"],
      min: [0, "MRP cannot be negative"],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    store: {
      type: String,
      default: "Fresh Mart",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    keywords: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      default: "",
    },
    unit: {
      type: String,
      default: "",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    countInStock: {
      type: Number,
      default: 50,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", categoryName: "text", keywords: "text", tags: "text" });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
