import express from "express";
import { getAllMovies, getNowPlayingMovies, getMovieById } from "../controllers/movieController.js";

const router = express.Router();

// All movies
router.get("/", getAllMovies);

// Now playing
router.get("/now-playing", getNowPlayingMovies);

// Single movie by ID
router.get("/:id", getMovieById);

export default router;
