import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { DeleteIcon, StarIcon } from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import { useAppContext } from "../../context/AppContext";

const AddShows = () => {
  const { nowPlayingMovies, fetchMovieCredits } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;
  const API_URL = import.meta.env.VITE_API_URL;

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [nowPlayingMovies]);

  const handleSelectMovie = async (movieId) => {
    setSelectedMovie(movieId);
    const movieCredits = await fetchMovieCredits(movieId);
    setCredits(movieCredits);
    console.log("Movie Credits:", movieCredits); // includes cast, crew, adult, genres, department
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time].sort() };
      }
      return prev;
    });
    setDateTimeInput("");
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    });
  };

  const handleAddShow = async () => {
    if (!selectedMovie) return alert("Please select a movie.");
    if (!showPrice) return alert("Please enter a show price.");
    if (Object.keys(dateTimeSelection).length === 0)
      return alert("Please select at least one date/time.");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        movieId: selectedMovie,
        showPrice: Number(showPrice),
        schedule: dateTimeSelection,
      };

      const res = await fetch(`${API_URL}/admin/show/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("Show added successfully!");
        setSelectedMovie(null);
        setCredits(null);
        setShowPrice("");
        setDateTimeSelection({});
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="Add" text2="Shows" />

      {/* Now Playing Movies */}
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className={`relative max-w-40 cursor-pointer transform transition ${
                selectedMovie === movie.id ? "scale-105 border-2 border-primary" : ""
              }`}
              onClick={() => handleSelectMovie(movie.id)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="w-full object-cover brightness-90"
                />
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-amber-300 fill-amber-300" />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-gray-300">{kConverter(movie.vote_count)} Votes</p>
                </div>
              </div>
              <p className="font-medium truncate">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Show Price */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            min={0}
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter show price"
            className="outline-none w-full"
          />
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Select Date and Time</label>
        <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="outline-none"
          />
          <button
            onClick={handleDateTimeAdd}
            className="bg-amber-300 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer"
          >
            Add Time
          </button>
        </div>
      </div>

      {/* Display Selected Dates & Times */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <p className="font-medium">Selected Dates & Times:</p>
          <div className="mt-2 space-y-3">
            {Object.entries(dateTimeSelection)
              .sort(([a], [b]) => new Date(a) - new Date(b))
              .map(([date, times]) => (
                <div key={date} className="border border-gray-600 rounded-lg p-3">
                  <p className="font-medium">{date}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {times.map((t) => (
                      <div
                        key={t}
                        className="flex items-center gap-2 bg-gray-700 px-2 py-1 rounded-md text-sm"
                      >
                        <span>{t}</span>
                        <DeleteIcon
                          onClick={() => handleRemoveTime(date, t)}
                          className="w-4 h-4 text-red-400 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Show Button */}
      <button
        onClick={handleAddShow}
        className="bg-amber-300 text-white px-8 py-2 mt-6 rounded hover:bg-primary transition cursor-pointer"
      >
        Add Show
      </button>

      {/* Display Selected Movie Credits */}
      {credits && (
        <div className="mt-6">
          <p className="font-medium text-lg">Movie Credits:</p>
          <div className="mt-2 space-y-2">
            <p><strong>Genres:</strong> {credits.genres?.map(g => g.name).join(", ")}</p>
            <p><strong>Adult:</strong> {credits.adult ? "Yes" : "No"}</p>
            <p><strong>Cast:</strong> {credits.cast?.map(c => c.name).join(", ")}</p>
            <p><strong>Crew (Acting):</strong> {credits.crew?.filter(c => c.department === "Acting").map(c => c.name).join(", ")}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AddShows;
