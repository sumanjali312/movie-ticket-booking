import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import BlurCircle from './BlurCircle';
import { dummyTrailers } from '../assets/assets';
import { PlayCircleIcon } from 'lucide-react';

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const [thumbnails, setThumbnails] = useState({});

  const loadThumbnail = async (videoUrl) => {
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) return '';

    const maxRes = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const fallback = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(maxRes);
      img.onerror = () => resolve(fallback);
      img.src = maxRes;
    });
  };

  useEffect(() => {
    const fetchThumbnails = async () => {
      const results = {};
      for (const trailer of dummyTrailers) {
        const url = await loadThumbnail(trailer.videoUrl);
        results[trailer.videoUrl] = url;
      }
      setThumbnails(results);
    };
    fetchThumbnails();
  }, []);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">Trailers</p>

      {/* Main Trailer Player */}
      {currentTrailer && (
        <div className="relative mt-6">
          <BlurCircle top="-100px" right="-100px" />
          <ReactPlayer
            url={currentTrailer.videoUrl}
            controls
            playing
            muted
            className="mx-auto max-w-full"
            width="960px"
            height="540px"
          />
        </div>
      )}

      {/* Trailer Thumbnails */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.videoUrl}
            onClick={() => setCurrentTrailer(trailer)}
            className={`relative hover:-translate-y-1 transition duration-300 cursor-pointer 
              ${trailer.videoUrl === currentTrailer?.videoUrl ? 'ring-2 ring-blue-500' : ''}`}
          >
            {thumbnails[trailer.videoUrl] ? (
              <img
                src={thumbnails[trailer.videoUrl]}
                alt="trailer thumbnail"
                className="rounded-lg w-full h-full object-cover brightness-75"
              />
            ) : (
              <div className="w-full h-40 bg-gray-700 rounded-lg animate-pulse"></div>
            )}
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-8 h-8 md:w-12 md:h-12 transform -translate-x-1/2 -translate-y-1/2 text-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;
