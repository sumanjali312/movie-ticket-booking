import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const API_URL = import.meta.env.VITE_API_URL;

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all shows from backend
  const getAllShows = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/admin/shows`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setShows(data.shows);
      } else {
        console.error("Failed to fetch shows:", data.message);
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllShows();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="List" text2="Shows" />

      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium pl-5">Show Time</th>
              <th className="p-2 font-medium pl-5">Total Bookings</th>
              <th className="p-2 font-medium pl-5">Earnings</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {shows.map((show, index) => (
              <tr
                key={show._id || index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 min-w-[150px] pl-5">{show.movie?.title || "N/A"}</td>
                <td className="p-2">
                  {show.showDateTime ? dateFormat(show.showDateTime) : "N/A"}
                </td>
                <td className="p-2">
                  {show.occupiedSeats ? Object.keys(show.occupiedSeats).length : 0}
                </td>
                <td className="p-2">
                  {currency}
                  {show.occupiedSeats
                    ? Object.keys(show.occupiedSeats).length * (show.showPrice || 0)
                    : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListShows;
