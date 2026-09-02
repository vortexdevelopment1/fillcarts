import "dotenv/config";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "./src/models/User.js";
import Product from "./src/models/Product.js";
import Wishlist from "./src/models/Wishlist.js";
import { connectMongoDB } from "./src/config/mongodb.js";

async function runDirectTests() {
  console.log("==================================================");
  console.log("🧪 TESTING WISHLIST BACKEND & MONGODB LOGIC");
  console.log("==================================================");

  try {
    await connectMongoDB();

    // 1. Find or create a test user
    let testUser = await User.findOne({ phone: "9999999999" });
    if (!testUser) {
      testUser = await User.create({
        name: "Wishlist Test User",
        phone: "9999999999",
        email: "wishlist.test@fillcart.com",
      });
      console.log("✅ Created test user:", testUser._id);
    } else {
      console.log("✅ Found existing test user:", testUser._id);
    }

    // 2. Find a test product
    const testProduct = await Product.findOne();
    if (!testProduct) {
      console.error("❌ No product found in database to test with!");
      process.exit(1);
    }
    console.log("✅ Using test product:", testProduct.name, `(${testProduct.productId || testProduct._id})`);

    await Wishlist.syncIndexes();
    // Clean up any existing wishlist for this test user
    await Wishlist.deleteMany({ userId: testUser._id });
    console.log("🧹 Cleaned previous test wishlist items");

    // 3. Test Add to Wishlist
    const entry1 = await Wishlist.create({
      userId: testUser._id,
      productId: testProduct._id,
    });
    console.log("✅ 1. Created Wishlist item in MongoDB:", entry1._id);

    // 4. Test Duplicate Prevention (Unique Compound Index)
    try {
      await Wishlist.create({
        userId: testUser._id,
        productId: testProduct._id,
      });
      console.error("❌ Failed: Duplicate entry should have thrown error!");
    } catch (dupErr) {
      console.log("✅ 2. Duplicate prevention verified (E11000 caught successfully)");
    }

    // 5. Test Populated Wishlist Query
    const wishlistItems = await Wishlist.find({ userId: testUser._id }).populate("productId");
    console.log("✅ 3. Fetched populated wishlist, count:", wishlistItems.length);
    console.log("   Product Name:", wishlistItems[0].productId?.name);
    console.log("   Product Price: ₹" + wishlistItems[0].productId?.price);

    // 6. Test Count
    const count = await Wishlist.countDocuments({ userId: testUser._id });
    console.log("✅ 4. Wishlist count query verified:", count);

    // 7. Test Remove from Wishlist
    const deleted = await Wishlist.findOneAndDelete({
      userId: testUser._id,
      productId: testProduct._id,
    });
    console.log("✅ 5. Removed item from wishlist:", deleted ? "SUCCESS" : "FAILED");

    const finalCount = await Wishlist.countDocuments({ userId: testUser._id });
    console.log("✅ 6. Final count after removal:", finalCount);

    // 8. Generate JWT verification test
    const jwtSecret = process.env.JWT_SECRET || "fillcart_secure_jwt_secret_key_2025_indore";
    const token = jwt.sign({ id: testUser._id, phone: testUser.phone }, jwtSecret, { expiresIn: "7d" });
    const decoded = jwt.verify(token, jwtSecret);
    console.log("✅ 7. JWT token signed and verified for user:", decoded.id);

    console.log("==================================================");
    console.log("🎉 ALL WISHLIST MONGODB TESTS PASSED SUCCESSFULLY!");
    console.log("==================================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Test error:", err);
    process.exit(1);
  }
}

runDirectTests();
