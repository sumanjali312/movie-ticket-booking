// routes/adminRoutes.js
import express from "express";
import {
  isAdmin,
  getDashboardData,
  getAllShows,
  getAllBookings,
} from "../controllers/adminController.js";
import { protectAdmin } from "../Middleware/auth.js";

const router = express.Router();

// Route to check if current user is admin
router.get("/check", protectAdmin, isAdmin);

// Dashboard data (admin only)
router.get("/dashboard", protectAdmin, getDashboardData);

// Fetch all upcoming shows
router.get("/shows", protectAdmin, getAllShows);

// Fetch all bookings
router.get("/bookings", protectAdmin, getAllBookings);

export default router;
