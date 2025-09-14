import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
import BlurCircle from '../components/BlurCircle';
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import ReactPlayer from 'react-player';

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [playTrailer, setPlayTrailer] = useState(false);

  useEffect(() => {
    const showData = dummyShowsData.find(show => show._id === id);
    if (showData) {
      setShow({
        movie: showData,
        dateTime: dummyDateTimeData
      });
    } else {
      setShow(null);
    }

    return () => {
      setPlayTrailer(false); // stop trailer when leaving page
    };
  }, [id]);

  if (!show) return <div className='text-center mt-10'>Loading...</div>;

  return (
    <div className='px-6 md:px-16 lg:px-40 pt-10 md:pt-16'>
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
        {/* Movie Poster */}
        <img
          src={show.movie.poster_path || 'https://via.placeholder.com/300x450'}
          alt={show.movie.title}
          className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'
        />

        {/* Movie Details */}
        <div className='relative flex flex-col gap-3'>
          <BlurCircle top='-100px' left='-100px' />
          <p className='text-yellow-400 font-semibold'>ALL TYPE OF MOVIES</p>
          <h1 className='text-4xl font-semibold max-w-96 text-balance'>
            {show.movie.title}
          </h1>

          {/* Rating */}
          <div className='flex items-center gap-2 text-gray-300'>
            <StarIcon className='w-5 h-5 text-yellow-400 fill-yellow-400' />
            {show.movie.vote_average.toFixed(1)} User Rating
          </div>

          {/* Overview */}
          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>
            {show.movie.overview}
          </p>

          {/* Runtime, genres, release year */}
          <p className='text-gray-400 mt-1 text-sm'>
            {timeFormat(show.movie.runtime)} · {show.movie.genres?.map(g => g.name).join(', ')} · {show.movie.release_date?.split('-')[0]}
          </p>

          {/* Action Buttons */}
          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <button
              onClick={() => setPlayTrailer(true)}
              className="flex items-center gap-2 px-7 py-3 text-sm bg-yellow-500 text-white rounded-md transition cursor-pointer"
            >
              <PlayCircleIcon className="w-5 h-5 text-white" /> Watch Trailer
            </button>

            <button
              onClick={() => navigate(`/showtimes/${show.movie._id}`)}
              className="px-10 py-3 text-sm bg-yellow-500 text-white rounded-md font-medium cursor-pointer active:scale-95"
            >
              Buy Tickets
            </button>

            <button className='text-yellow-500 fill-yellow-500 rounded-full transition cursor-pointer active:scale-95'>
              <Heart className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {playTrailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-[90%] md:w-[70%]">
            <ReactPlayer
              url={show.movie.trailerUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
              controls
              playing
              width="100%"
              height="500px"
            />
            <button
              onClick={() => setPlayTrailer(false)}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
