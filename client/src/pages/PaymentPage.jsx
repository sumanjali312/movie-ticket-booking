import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const PaymentPage = () => {
  const { id } = useParams(); // bookingId
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const showId = searchParams.get("showId");
  const seats = searchParams.get("seats")?.split(",") || [];
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const total = showDetails ? seats.length * showDetails.showPrice : 0;

  // Fetch show details
  useEffect(() => {
    const fetchShow = async () => {
      try {
        if (!showId) return;
        const token = await getToken();

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/show/${showId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setShowDetails(res.data);
      } catch (err) {
        console.error("Error fetching show details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [showId, getToken]);

  const handlePayNow = async () => {
    try {
      const token = await getToken();

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/booking/pay/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment successful!");
      navigate("/mybooking");
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading show details...</p>;

  return (
    <div className="flex flex-col items-center mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Page</h1>

      <p className="mb-2">
        <strong>Movie:</strong> {showDetails?.movie?.title || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Theatre:</strong> {showDetails?.theatre || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Date & Time:</strong>{" "}
        {showDetails?.showDateTime
          ? new Date(showDetails.showDateTime).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "N/A"}
      </p>
      <p className="mb-2">
        <strong>Seats:</strong> {seats.join(", ")}
      </p>
      <h2 className="text-xl font-bold mt-4">Total: ₹{total}</h2>

      <button
        onClick={handlePayNow}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
