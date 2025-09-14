// routes/showRouter.js
import express from "express";
import { addShow, getNowPlayingMovies, getShow, getShows } from "../controllers/showController.js";
import { authenticate, protectAdmin } from "../Middleware/auth.js";

const showRouter = express.Router();

// Public route – Now Playing movies
showRouter.get("/now-playing", getNowPlayingMovies);

// Admin-only route – Add a show
showRouter.post("/add", authenticate, protectAdmin, addShow);

// Public routes for all shows
showRouter.get("/all", getShows);
showRouter.get("/:movieId", getShow);

export default showRouter;
