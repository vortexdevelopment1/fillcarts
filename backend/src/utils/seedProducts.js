import Product from "../models/Product.js";
import { SEED_PRODUCTS } from "./catalogSeedData.js";

/**
 * Auto-seed catalog products into MongoDB if the collection is empty
 */
export const seedProductsIfEmpty = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("🌱 Products collection is empty. Seeding catalog data...");
      await Product.insertMany(SEED_PRODUCTS);
      console.log(`✅ Seeded ${SEED_PRODUCTS.length} products successfully!`);
    }
  } catch (error) {
    console.warn("⚠️ Catalog auto-seed warning:", error.message);
  }
};

export default seedProductsIfEmpty;
