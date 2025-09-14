// routes/bookingRoutes.js
import express from "express";
import { createBooking, getOccupiedSeats } from "../controllers/bookingController.js";
import { authenticate } from "../Middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/create", authenticate, createBooking);
bookingRouter.get("/seats/:showId", getOccupiedSeats);

export default bookingRouter;
