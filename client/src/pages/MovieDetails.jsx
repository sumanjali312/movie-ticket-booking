import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
import BlurCircle from '../components/BlurCircle';
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);

  const getShow = async () => {
    const showData = dummyShowsData.find(show => show._id === id);
    if (showData) {
      setShow({
        movie: showData,
        dateTime: dummyDateTimeData
      });
    } else {
      setShow(null);
    }
  };

  useEffect(() => {
    getShow();

    // Cleanup any video when leaving page
    return () => {
      const video = document.querySelector("video");
      if (video) {
        video.pause();
        video.src = "";
      }
    };
  }, [id]);

  const handlePlayTrailer = () => {
    const video = document.querySelector("video");
    if (video) {
      video.play().catch(() => {
        // Ignore play() error if user navigates away quickly
      });
    }
  };

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
              onClick={handlePlayTrailer}
              className="flex items-center gap-2 px-7 py-3 text-sm bg-yellow-500 hover:bg-yellow-500 text-white-100 rounded-md transition cursor-pointer"
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

      <p className='mt-8 text-lg font-semibold'>Your Favorite Cast</p>

      <div className='overflow-x-auto no-scrollbar mt-4 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
          {show.movie.casts.slice(0, 12).map((cast, index) => (
            <div key={index} className='flex flex-col items-center'>
              <img 
                src={cast.profile_path || 'https://via.placeholder.com/80'} 
                alt={cast.name} 
                className='rounded-full h-20 md:h-20 aspect-square object-cover' 
              />
              <p className='text-sm mt-1 text-center'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
