
import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import otpRoutes from "./routes/otpRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;


app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/vendor", vendorRoutes);
app.use("/api/rider", riderRoutes);
app.use("/api", otpRoutes);
app.use("/api/auth", googleAuthRoutes);
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);