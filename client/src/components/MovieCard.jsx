import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col justify-between p-3 bg-gray-800 
      rounded-2xl hover:-translate-y-1 transition duration-300 w-66"
    >
      <img
        onClick={() => {
          navigate(`/movies/${movie.id}`);
          scrollTo(0, 0);
        }}
        src={movie.backdrop_path || movie.poster_url || "/fallback-poster.jpg"}
        alt={movie.title || "Movie poster"}
        className="rounded-lg h-52 w-full object-cover object-right cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()}.{" "}
        {(movie.genres || [])
          .slice(0, 2)
          .map((genre) => genre.name)
          .join(" | ")}
        . {timeFormat(movie.runtime || 0)}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={() => {
            navigate(`/movies/${movie.id}`);
            scrollTo(0, 0);
          }}
          className="px-4 py-2 text-xs bg-yellow-500 hover:bg-yellow-600
            transition rounded-full font-medium cursor-pointer text-black"
        >
          Buy Tickets
        </button>

        <p className="flex items-center gap-1">
          <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
