import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Get trending movies
export const getTrendingMovies = async () => {
  const { data } = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
    params: { api_key: TMDB_API_KEY },
  });
  return data.results;
};

// Get movie details by TMDB id
export const getMovieDetails = async (id) => {
  const { data } = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
    params: { api_key: TMDB_API_KEY, append_to_response: "videos,credits" },
  });
  return data;
};
