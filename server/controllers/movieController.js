import Movie from "../models/Movie.js";

// Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json({ success: true, movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get "Now Playing" movies
export const getNowPlayingMovies = async (req, res) => {
  try {
    const today = new Date();

    // Example: movies released in the last 30 days OR releasing today
    const movies = await Movie.find({
      release_date: { $lte: today },
    }).sort({ release_date: -1 });

    res.json({ success: true, movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get a movie by ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: "Movie not found" });
    res.json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
