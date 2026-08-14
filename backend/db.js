const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "authentication",
  connectTimeout: 2000
});

const createRequiredTables = () => {
  db.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL UNIQUE,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      address TEXT,
      pincode VARCHAR(10),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.query(`
    ALTER TABLE customers ADD COLUMN gift_card_balance DECIMAL(10, 2) DEFAULT 0.00
  `, (err) => {
    // Ignore error if column already exists (Error 1060: Duplicate column name)
    if (err && err.errno !== 1060) {
      console.error("Error adding gift_card_balance column:", err.message);
    }
  });

  db.query(`
    ALTER TABLE customers ADD COLUMN pincode VARCHAR(10)
  `, (err) => {
    if (err && err.errno !== 1060) {
      console.error("Error adding pincode column to customers:", err.message);
    }
  });

  db.query(`
    CREATE TABLE IF NOT EXISTS otp_verification (
      id INT AUTO_INCREMENT PRIMARY KEY,
      contact VARCHAR(20) NOT NULL,
      otp VARCHAR(10) NOT NULL,
      expires_at BIGINT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT NOT NULL,
      items TEXT NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'Delivered',
      payment_method VARCHAR(50) NOT NULL,
      delivery_address TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS saved_addresses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT NOT NULL,
      type VARCHAR(50) NOT NULL,
      address_line TEXT NOT NULL,
      phone VARCHAR(20) NOT NULL,
      pincode VARCHAR(10) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )
  `);

  db.query(`
    ALTER TABLE saved_addresses ADD COLUMN pincode VARCHAR(10) DEFAULT ''
  `, (err) => {
    if (err && err.errno !== 1060) {
      console.error("Error adding pincode column to saved_addresses:", err.message);
    }
  });

  db.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT NOT NULL,
      plan_key VARCHAR(100) NOT NULL,
      plan_name VARCHAR(150) NOT NULL,
      price DECIMAL(10, 2),
      unit VARCHAR(50) NOT NULL,
      status VARCHAR(50) DEFAULT 'Active',
      next_delivery VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS customer_carts (
      customer_id INT PRIMARY KEY,
      items TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )
  `);
};

let isDbConnected = false;

db.on("error", (err) => {
  console.error("⚠️ MySQL DB Event Warning:", err.message);
  isDbConnected = false;
});

const originalQuery = db.query.bind(db);
db.query = function (sql, params, callback) {
  if (typeof params === "function") {
    callback = params;
    params = [];
  }
  if (!isDbConnected) {
    if (typeof callback === "function") {
      setImmediate(() => callback(new Error("Database offline"), []));
    }
    return;
  }
  return originalQuery(sql, params, callback);
};

db.connect((err) => {
  if (err) {
    console.warn("⚠️ MySQL Connection Failed:", err.message);
    console.warn("💡 Note: Server will continue running in fallback mode so testing and OTP generation work without database errors.");
    isDbConnected = false;
  } else {
    console.log("✅ MySQL Connected Successfully!");
    isDbConnected = true;
    try {
      createRequiredTables();
    } catch (tableErr) {
      console.error("Error creating tables:", tableErr.message);
    }
  }
});

module.exports = db;

module.exports = db;