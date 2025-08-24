import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import BlurCircle from './BlurCircle';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const DateSelect = ({ dateTime = {}, id }) => {
  const dates = Object.keys(dateTime || {});
  const navigate = useNavigate(); // ✅ useNavigate properly

  const [selected, setSelected] = useState(null);

  const onBookHandler = () => {
    if (!selected) {
      return toast.error('Please select a date'); // ✅ Show error toast
    }
    navigate(`/movies/${id}/${selected}`);
 // ✅ Correct route with backticks
    window.scrollTo(0, 0); // ✅ Use window.scrollTo
  };

  return (
    <div id="dateSelect" className="pt-20">
      <div className="flex flex-col items-center justify-center gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
        {/* Blur Effects */}
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="-100px" right="-100px" />

        {/* Choose Date Section */}
        <div className="w-full text-center">
          <p className="text-lg font-semibold mb-5">Choose Date</p>
          <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
            <ChevronLeftIcon width={28} className="cursor-pointer" />

            <div className="grid grid-cols-3 md:flex flex-wrap gap-4 md:max-w-3xl">
              {dates.length > 0 ? (
                dates.map((date) => (
                  <button
                    onClick={() => setSelected(date)}
                    key={date}
                    className={`flex flex-col items-center justify-center h-14 w-14 rounded text-white transition-all ${
                      selected === date
                        ? 'bg-primary text-white'
                        : 'bg-primary/20 hover:bg-primary/40 border border-primary/70'
                    }`}
                  >
                    <span>{new Date(date).getDate()}</span>
                    <span>
                      {new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-gray-400">No Dates Available</p>
              )}
            </div>

            <ChevronRightIcon width={28} className="cursor-pointer" />
          </div>
        </div>

        {/* Book Now Button */}
        <button
          onClick={onBookHandler}
          className="bg-primary text-white px-8 py-2 rounded hover:bg-primary/90 transition-all cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DateSelect;
