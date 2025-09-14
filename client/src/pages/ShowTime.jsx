import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ShowTimes = () => {
  const { id } = useParams(); // Movie ID from URL
  const navigate = useNavigate();

  const [dates, setDates] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch showtimes from backend
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const res = await axios.get(`http://localhost:8082/api/show/movie/${id}`);
        // Expecting backend to return { dates: [], theatres: [] }
        if (res.data) {
          setDates(res.data.dates || []);
          setTheatres(res.data.theatres || []);
          setSelectedDate(res.data.dates?.[0] || null); // default to first date
        }
      } catch (err) {
        console.error("Error fetching showtimes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [id]);

  const handleTimeClick = (theatre, time) => {
    navigate(
      `/seat-layout/${id}?theatre=${encodeURIComponent(theatre)}&time=${encodeURIComponent(
        time
      )}&date=${selectedDate?.date}-${selectedDate?.month}`
    );
  };

  const openMap = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  if (loading) {
    return <p className="text-center mt-10">Loading showtimes...</p>;
  }

  if (!dates.length || !theatres.length) {
    return <p className="text-center mt-10 text-red-500">No showtimes available.</p>;
  }

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-6">
      <h1 className="text-2xl font-bold mb-4">Select Showtimes</h1>

      {/* Date Selector */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {dates.map((d, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedDate(d)}
            className={`flex flex-col items-center px-4 py-2 rounded-md cursor-pointer transition ${
              selectedDate?.date === d.date
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            <span className="text-sm">{d.day}</span>
            <span className="text-lg font-bold">{d.date}</span>
            <span className="text-sm">{d.month}</span>
          </div>
        ))}
      </div>

      {/* Theatre List */}
      {theatres.map((t, idx) => (
        <div key={idx} className="border-b pb-4 mb-4">
          <h2
            className="font-semibold text-blue-600 cursor-pointer"
            onClick={() => openMap(t.lat, t.lng)}
          >
            {t.name} (View on Map)
          </h2>
          <p className="text-gray-500 text-sm">
            {t.cancellable ? "Cancellation available" : "Non-cancellable"}
          </p>
          <div className="flex gap-3 mt-2 flex-wrap">
            {t.timings.map((time, i) => (
              <button
                key={i}
                onClick={() => handleTimeClick(t.name, time)}
                className="border border-green-500 text-green-500 px-4 py-2 rounded hover:bg-green-500 hover:text-white transition"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowTimes;
