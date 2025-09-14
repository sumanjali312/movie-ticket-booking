import express from "express";
import {
  signup,
  login,
  getFavorite,
  getUserBookings,
  updateFavorite,
  getCurrentUser,
} from "../controllers/userController.js";
import { authenticate } from "../Middleware/auth.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/signup", signup);
userRouter.post("/login", login);

// Protected routes
userRouter.get("/me", authenticate, getCurrentUser);
userRouter.get("/bookings", authenticate, getUserBookings);
userRouter.post("/update-favorite", authenticate, updateFavorite);
userRouter.get("/favorite", authenticate, getFavorite);

export default userRouter;
