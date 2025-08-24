import React from 'react';
import { dummyShowsData } from '../assets/assets';
import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';

const Movies = () => {
  return dummyShowsData.length > 0 ? (
    <div
      className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 
      overflow-hidden min-h-[80vh]"
    >
      <BlurCircle top="150px" left="0px" />
      <BlurCircle top="300px" right="0px" />
      
      <h1 className="text-lg font-medium my-4">Now Showing</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyShowsData.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
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
