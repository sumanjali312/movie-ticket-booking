import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { dummyShowsData } from "../assets/assets";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = await getToken();

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/show/now-playing`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data && res.data.movies && res.data.movies.length > 0) {
          setMovies(res.data.movies);
        } else {
          setMovies(dummyShowsData); // fallback if backend returns empty
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setMovies(dummyShowsData); // fallback if backend fails
      }
    };

    fetchMovies();
  }, [getToken]);

  return movies.length > 0 ? (
    <div
      className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 
      overflow-hidden min-h-[80vh]"
    >
      <BlurCircle top="150px" left="0px" />
      <BlurCircle top="300px" right="0px" />

      <h1 className="text-lg font-medium my-4">Now Showing</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {movies.map((movie) => (
          <MovieCard
            movie={movie}
            key={movie.id || movie._id || movie.tmdbId}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-center text-3xl font-bold">No movies available</p>
    </div>
  );
};

export default Movies;
