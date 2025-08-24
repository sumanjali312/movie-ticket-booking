import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ShowTimes = () => {
  const { id } = useParams(); // Movie ID from URL
  const navigate = useNavigate();

  // Sample Date Data
  const dates = [
    { day: "SAT", date: "24", month: "AUG" },
    { day: "SUN", date: "25", month: "AUG" },
    { day: "MON", date: "26", month: "AUG" },
    { day: "TUE", date: "27", month: "AUG" },
    { day: "WED", date: "28", month: "AUG" },
  ];

  // Sample Theatre Data with GPS Coordinates
  const theatres = [
    {
      name: "PVR Cinemas",
      cancellable: true,
      timings: ["10:00 AM", "01:00 PM", "04:30 PM", "08:00 PM"],
      lat: 17.4375,
      lng: 78.4483, // Example GPS (Hyderabad)
    },
    {
      name: "INOX",
      cancellable: false,
      timings: ["09:30 AM", "12:30 PM", "03:45 PM", "07:15 PM"],
      lat: 17.441,
      lng: 78.391, // Example GPS
    },
    {
      name: "Cinepolis",
      cancellable: true,
      timings: ["11:00 AM", "02:00 PM", "05:30 PM", "09:00 PM"],
      lat: 17.456,
      lng: 78.509, // Example GPS
    },
  ];

  const [selectedDate, setSelectedDate] = useState(dates[0]); // Default to first date

  const handleTimeClick = (theatre, time) => {
    navigate(
      `/seat-layout/${id}?theatre=${encodeURIComponent(theatre)}&time=${encodeURIComponent(
        time
      )}&date=${selectedDate.date}-${selectedDate.month}`
    );
  };

  const openMap = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

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
              selectedDate.date === d.date
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
