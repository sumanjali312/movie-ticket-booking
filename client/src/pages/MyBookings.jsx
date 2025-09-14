import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const { user } = useUser();
  const { getToken } = useAuth();   // ✅ get Clerk token
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        // get Clerk session token
        const token = await getToken();

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/booking/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // ✅ send token
          }
        );

        setBookings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, getToken]);

  if (loading) return <p className="text-center mt-20">Loading bookings...</p>;
  if (bookings.length === 0)
    return <p className="text-center mt-20">No bookings available</p>;

  return (
    <div className="p-6 md:px-16 lg:px-40 xl:px-44 my-20">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-1">
              {b.show?.movie?.title || "Movie Name Not Available"}
            </h2>
            <p className="mb-1">Theatre: {b.show?.theatre}</p>
            <p className="mb-1">
              Date & Time:{" "}
              {b.show?.showDateTime
                ? new Date(b.show.showDateTime).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "N/A"}
            </p>
            <p className="mb-1">Seats: {b.bookedSeats.join(", ")}</p>
            <p className="mb-1">Amount: ₹{b.amount}</p>
            <p
              className={`mb-2 font-semibold ${
                b.isPaid ? "text-green-600" : "text-red-600"
              }`}
            >
              Status: {b.isPaid ? "Paid" : "Pending"}
            </p>
            {!b.isPaid && (
              <button
                onClick={() =>
                  navigate(
                    `/payment/${b._id}?showId=${b.show._id}&seats=${b.bookedSeats.join(",")}`
                  )
                }
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Pay
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
