import mongoose from "mongoose";
import "dotenv/config";

const getMongoUri = () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fillcart";
  return uri.trim();
};

let isConnected = false;

export const connectMongoDB = async (retries = 3) => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = getMongoUri();

  while (retries > 0) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      isConnected = !!conn.connections[0].readyState;
      console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      retries -= 1;
      console.warn(`⚠️ MongoDB Connection Error (${error.message}). Retries left: ${retries}`);
      if (retries === 0) {
        console.warn("💡 If deploying on Render/Cloud, make sure 0.0.0.0/0 is added in MongoDB Atlas Network Access whitelist.");
        console.warn("💡 Also verify MONGO_URI is set in Render Environment Variables.");
      } else {
        await new Promise((res) => setTimeout(res, 2000));
      }
    }
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
