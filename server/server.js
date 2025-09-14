import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; 
import movieRoutes from "./routes/movieRoutes.js";
import showRoutes from "./routes/showRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// ✅ Import Clerk middleware
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Clerk middleware MUST be registered before any routes that use getAuth()
app.use(clerkMiddleware());

// Test route
app.get("/", (req, res) => res.send("Server is Live"));

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/show", showRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes); 

// Connect MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
