import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();

// Connect to database
await connectDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware);

// Routes
app.get("/", (req, res) => res.send("Server is Live!"));
app.use("/api/inngest", serve({ client: inngest, functions }));

// Export app for Vercel (do not listen here)
export default app;
