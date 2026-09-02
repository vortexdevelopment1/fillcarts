import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/fillcart";

let isConnected = false;

export const connectMongoDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = !!conn.connections[0].readyState;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn("⚠️ MongoDB Connection Warning:", error.message);
    console.warn("💡 Note: Server continues running. Please verify your MONGO_URI in .env.");
  }
};

mongoose.connection.on("connected", () => {
  isConnected = true;
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.warn("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("⚠️ MongoDB connection error:", err.message);
});

export default mongoose;
