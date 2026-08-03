
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const otpRoutes = require("./routes/otpRoutes");

const app = express();

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(cors());
app.use(express.json());

app.use("/api", otpRoutes);
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);