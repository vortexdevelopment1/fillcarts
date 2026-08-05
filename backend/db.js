const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "authentication"
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS otp_verification (
      id INT AUTO_INCREMENT PRIMARY KEY,
      contact VARCHAR(20) NOT NULL,
      otp VARCHAR(10) NOT NULL,
      expires_at BIGINT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

db.connect(err => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    throw err;
  }

  console.log("MySQL Connected");
  createRequiredTables();
});

module.exports = db;