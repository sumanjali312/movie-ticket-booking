import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react';
import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-start justify-center gap-4
      px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.jpeg")]
      bg-cover bg-center h-screen text-white'>

      {/* Marvel Logo */}
      <img src={assets.marvelLogo} alt="" className='max-h-11 lg:h-11 mt-20' />

      {/* Title */}
      <h1 className='text-5xl md:text-[70px] md:leading-[1.2] font-semibold max-w-[1100px] drop-shadow-lg'>
        Book Your Movie Tickets <br /> Anytime, Anywhere!
      </h1>

      {/* Movie Details */}
      <div className='flex items-center gap-4 text-gray-200'>
        <span>Action | Adventure | Sci-Fi</span>
        <div className='flex items-center gap-1'>
          <CalendarIcon className='w-5 h-5' /> 2025
        </div>
        <div className='flex items-center gap-1'>
          <ClockIcon className='w-5 h-5' /> 2h 8m
        </div>
      </div>

      {/* Description */}
      <p className='max-w-md text-gray-200'>
        In a post-apocalyptic world where cities ride on wheels and consume each other to survive, 
        two people meet in London and try to stop a deadly conspiracy.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate('/movies')}
        className='flex items-center gap-1 px-6 py-3 text-sm bg-[#F84565]
          hover:bg-[#D63854] transition rounded-full font-medium cursor-pointer'>
        Explore Movies
        <ArrowRight className='w-5 h-5' />
      </button>
    </div>
  );
};

export default HeroSection;
