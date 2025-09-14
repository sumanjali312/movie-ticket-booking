import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  overview: String,
  poster_path: String,
  backdrop_path: String,
  genres: [{ id: Number, name: String }],
  casts: [{ name: String, profile_path: String }],
  release_date: String,
  original_language: String,
  tagline: String,
  vote_average: Number,
  vote_count: Number,
  runtime: Number,
  nowPlaying: { type: Boolean, default: false }, // 👈 Add this
});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
