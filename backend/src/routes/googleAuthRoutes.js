import express from "express";
import { googleLogin } from "../controllers/googleAuthController.js";

const router = express.Router();

// ==========================================
// GOOGLE IDENTITY LOGIN & SIGN-IN
// ==========================================
router.post("/google-login", googleLogin);

export default router;