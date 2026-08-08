const jwt = require("jsonwebtoken");
const db = require("../db");

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fillcarts-dev-secret");

    db.query(
      "SELECT id, name, phone, email, address, pincode, gift_card_balance, created_at FROM customers WHERE id = ?",
      [decoded.id],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database Error" });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: "Invalid session" });
        }

        req.user = results[0];
        next();
      }
    );
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};

module.exports = authMiddleware;
