import "dotenv/config";
import app from "./src/app.js";
import { connectMongoDB } from "./src/config/mongodb.js";
import { seedProductsIfEmpty } from "./src/utils/seedProducts.js";
import { verifyEmailService } from "./src/services/emailService.js";

const PORT = process.env.PORT || 3000;

// Initialize Database & Services on startup, then start listening
const startServer = async () => {
  try {
    await connectMongoDB();
    await seedProductsIfEmpty();
    await verifyEmailService();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();