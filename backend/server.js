
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const otpRoutes = require("./routes/otpRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const riderRoutes = require("./routes/riderRoutes");

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
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);