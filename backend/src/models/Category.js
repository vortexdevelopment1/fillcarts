import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sub: {
      type: String,
      default: "",
      trim: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
      default: "",
    },
    aliases: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
