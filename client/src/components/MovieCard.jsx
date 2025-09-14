import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const poster =
    movie.backdrop_path ||
    movie.poster_path ||
    movie.poster_url ||
    "/fallback-poster.jpg";

  const title = movie.title || movie.name || "Untitled Movie";
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const genres = movie.genres
    ? movie.genres.map((g) => g.name || g).slice(0, 2).join(" | ")
    : "";

  const runtime = movie.runtime ? timeFormat(movie.runtime) : "";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  // Use the correct trailer property (check your API/database)
  const trailerUrl = movie.trailer_url || movie.trailerUrl || "";

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
        src={poster}
        alt={title}
        className="rounded-lg h-52 w-full object-cover object-right cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate">{title}</p>

      <p className="text-sm text-gray-400 mt-2">
        {releaseYear}. {genres} {runtime && `. ${runtime}`}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={() => navigate(`/showtimes/${movie.id}`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Buy Ticket
        </button>

        <p className="flex items-center gap-1">
          <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          {rating}
        </p>
      </div>

      {/* Trailer Button */}
      {trailerUrl && (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600"
          onClick={() => window.open(trailerUrl, "_blank")}
        >
          Watch Trailer
        </button>
      )}
    </div>
  );
};

export default MovieCard;
