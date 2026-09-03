import express from "express";
import {
  registerRider,
  getRiderStatus,
  listRiders,
} from "../controllers/riderController.js";

const router = express.Router();

// ==========================================
// DELIVERY RIDER ONBOARDING & STATUS
// ==========================================
router.post("/register", registerRider);
router.get("/status/:identifier", getRiderStatus);
router.get("/list", listRiders);

export default router;
