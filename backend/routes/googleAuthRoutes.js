const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const db = require("../db");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token missing",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const name = payload.name;
    const email = payload.email;
    const picture = payload.picture;

    db.query(
      "SELECT * FROM customers WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          console.log("DB ERROR:", err);

          return res.status(500).json({
            success: false,
            message: "Database error",
          });
        }

        // Existing User
        if (results.length > 0) {
          const user = results[0];

          const authToken = jwt.sign(
            {
              id: user.id,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "7d",
            }
          );

          // IMPORTANT
          res.cookie("token", authToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          return res.json({
            success: true,
            token: authToken,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              profile_picture: user.profile_picture,
            },
          });
        }

        // New Google User
        db.query(
          `
          INSERT INTO customers
          (
            name,
            email,
            password,
            google_id,
            profile_picture
          )
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            name,
            email,
            null,
            googleId,
            picture,
          ],
          (insertErr, result) => {
            if (insertErr) {
              console.log("INSERT ERROR:", insertErr);

              return res.status(500).json({
                success: false,
                message: "Insert failed",
              });
            }

            const authToken = jwt.sign(
              {
                id: result.insertId,
                email,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "7d",
              }
            );

            // IMPORTANT
            res.cookie("token", authToken, {
              httpOnly: true,
              secure: false,
              sameSite: "lax",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({
              success: true,
              token: authToken,
              user: {
                id: result.insertId,
                name,
                email,
                profile_picture: picture,
              },
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Google verification failed",
    });
  }
});

module.exports = router;