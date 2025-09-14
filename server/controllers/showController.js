import Show from "../models/Show.js";
import Movie from "../models/Movie.js";
import axios from "axios";

const TMDB_API_KEY = "0cbcdf34b45209ffadb4eed559436096";

/**
 * Add multiple shows for a movie
 * Admin endpoint: POST /api/show/add
 */
export const addShow = async (req, res) => {
  try {
    const { movieId, theatre, showsInput, showPrice } = req.body;

    // Validate input
    if (!movieId || !theatre || !showsInput || showsInput.length === 0 || !showPrice) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if movie exists in MongoDB
    let movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: { api_key: TMDB_API_KEY, language: "en-US" },
      });

      const movieData = response.data;

      movie = new Movie({
        tmdbId: movieData.id,
        title: movieData.title,
        overview: movieData.overview,
        poster_path: movieData.poster_path,
        backdrop_path: movieData.backdrop_path,
        genres: movieData.genres,
        release_date: movieData.release_date,
        original_language: movieData.original_language,
        tagline: movieData.tagline,
        vote_average: movieData.vote_average,
        vote_count: movieData.vote_count,
        runtime: movieData.runtime,
      });

      await movie.save();
    }

    // Prepare shows array for bulk insert
    const showsToAdd = [];
    for (const showData of showsInput) {
      const date = showData.data; // from input JSON
      if (!showData.time || !Array.isArray(showData.time)) continue;

      for (const t of showData.time) {
        const dateTimeString = `${date}T${t}:00`; // "YYYY-MM-DDTHH:mm:ss"
        const showDateTime = new Date(dateTimeString);

        if (isNaN(showDateTime)) continue;

        showsToAdd.push({
          movie: movie._id,
          theatre,
          showDateTime: showDateTime.toISOString(),
          showPrice,
        });
      }
    }

    if (showsToAdd.length === 0) {
      return res.status(400).json({ success: false, message: "No valid shows to add" });
    }

    const createdShows = await Show.insertMany(showsToAdd);

    res.status(201).json({
      success: true,
      message: "Shows added successfully",
      shows: createdShows,
    });
  } catch (error) {
    console.error("Error adding shows:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get now playing movies from TMDb
 * Endpoint: GET /api/show/now-playing
 */
export const getNowPlayingMovies = async (req, res) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/now_playing`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
        page: req.query.page || 1, // optional pagination
      },
    });

    const movies = response.data.results.map(movie => ({
      tmdbId: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    }));

    res.status(200).json({
      success: true,
      total: movies.length,
      movies,
    });
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    res.status(500).json({ success: false, message: "Failed to fetch now playing movies" });
  }
};

/**
 * Get all shows (with optional filters)
 * Endpoint: GET /api/show?movieId=&theatre=
 */
export const getShows = async (req, res) => {
  try {
    const { movieId, theatre } = req.query;
    const filter = {};

    if (movieId) filter.movie = movieId;
    if (theatre) filter.theatre = theatre;

    const shows = await Show.find(filter)
      .populate("movie", "title poster_path")
      .sort({ showDateTime: 1 });

    res.json({
      success: true,
      total: shows.length,
      shows,
    });
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get shows for a specific movie
 * Endpoint: GET /api/show/:movieId
 */
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({ success: false, message: "Movie ID is required" });
    }

    const shows = await Show.find({ movie: movieId })
      .populate("movie", "title poster_path")
      .sort({ showDateTime: 1 });

    if (!shows.length) {
      return res.status(404).json({ success: false, message: "No shows found for this movie" });
    }

    res.json({
      success: true,
      total: shows.length,
      shows,
    });
  } catch (error) {
    console.error("Error fetching show by movieId:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
