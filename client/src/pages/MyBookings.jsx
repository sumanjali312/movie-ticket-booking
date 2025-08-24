import React, { useEffect, useState } from 'react';
import BlurCircle from '../components/BlurCircle';
import Loading from '../components/Loading';
import { dummyBookingData } from '../assets/assets';
import { dateFormat } from '../lib/dateFormat';

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Format runtime as "Xh Ym"
  const formatRuntime = (minutes) => {
    if (!minutes) return '';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const getMyBooking = async () => {
    setBookings(dummyBookingData);
    setIsLoading(false);
  };

  useEffect(() => {
    getMyBooking();
  }, []);

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />

      <h1 className="text-lg font-semibold mb-4">My Bookings</h1>

      <ul>
        {bookings.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-3 max-w-3xl"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={item.show.movie.poster_path}
                alt={item.show.movie.title}
                className="max-w-[180px] aspect-video object-cover rounded"
              />
              <div className="flex flex-col justify-between">
                <p className="text-lg font-semibold">{item.show.movie.title}</p>
                <p className="text-gray-400 text-sm">
                  {formatRuntime(item.show.movie.runtime)}
                </p>
                <p className="text-gray-400 text-sm mt-auto">
                  {dateFormat(item.show.showDateTime)}
                </p>
              </div>
            </div>

            {/* Booking Details & Payment */}
            <div className="flex flex-col md:items-end md:text-right justify-between p-4">
              <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold mb-3">
                  {currency}{item.amount}
                </p>
                {!item.isPaid && (
                  <button className="bg-amber-300 px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer">
                    Pay Now
                  </button>
                )}
              </div>
              <div className="text-sm">
                <p>
                  <span>Total Tickets: </span>{item.bookedSeats.length}
                </p>
                <p>
                  <span>Seat Number: </span>{item.bookedSeats.join(", ")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  ) : (
    <Loading />
  );
};

export default MyBookings;
