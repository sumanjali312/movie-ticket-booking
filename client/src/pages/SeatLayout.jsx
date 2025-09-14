import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { ArrowRightIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const SeatLayout = () => {
  const { id } = useParams(); // showId
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const theatre = searchParams.get("theatre");
  const time = searchParams.get("time");
  const date = searchParams.get("date");

  const [selectedTime, setSelectedTime] = useState(time || null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [show, setShow] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);

  // Seat Layout
  const seatLayout = [
    { section: "Front Rows", rows: [{ row: "A", seats: ["A1","A2","A3","A4","A5","A6","A7","A8","A9"] }, { row: "B", seats: ["B1","B2","B3","B4","B5","B6","B7","B8","B9"] }] },
    { section: "Middle Rows", rows: [{ row: "C", seats: ["C1","C2","C3","C4","C5","C6","C7","C8","C9"] }, { row: "D", seats: ["D1","D2","D3","D4","D5","D6","D7","D8","D9"] }] },
    { section: "Premium Rows", rows: [{ row: "E", seats: ["E1","E2","E3","E4","E5","E6","E7","E8","E9"] }, { row: "F", seats: ["F1","F2","F3","F4","F5","F6","F7","F8","F9"] }] }
  ];

  // Load show data & booked seats from backend
  useEffect(() => {
    const fetchShow = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/show/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShow(res.data);

        // also fetch booked seats
        const bookingsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/booking/show/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookedSeats(bookingsRes.data.flatMap((b) => b.bookedSeats));
      } catch (err) {
        console.error("Error loading show:", err);
        toast.error("Failed to load show details");
      }
    };
    fetchShow();
  }, [id, getToken]);

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      toast.error("Please select a time first!");
      return;
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      toast.error("You can select up to 5 seats only!");
      return;
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const handleCheckout = async () => {
    if (!selectedTime) {
      toast.error("Please select a time before proceeding!");
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error("Please select at least 1 seat!");
      return;
    }

    try {
      const token = await getToken();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/booking`,
        {
          showId: id,
          bookedSeats: selectedSeats,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking created!");
      navigate(`/payment/${res.data._id}?showId=${id}&seats=${selectedSeats.join(",")}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create booking");
    }
  };

  if (!show) return <Loading />;

  return (
    <div className="flex flex-col lg:flex-row px-6 md:px-16 lg:px-40 pt-20 gap-8">
      <div className="flex-1 flex flex-col items-center">
        {/* Screen Display */}
        <div className="relative flex flex-col items-center mb-8">
          <BlurCircle top="-100px" left="-100px" />
          <BlurCircle bottom="0" right="0" />
          <h1 className="text-2xl font-semibold mb-2">Select Your Seats</h1>
          {assets?.screenImage && (
            <img src={assets.screenImage} alt="screen" className="mb-2" />
          )}
          <p className="text-gray-400 text-sm mb-4">SCREEN SIDE</p>
          <p className="text-gray-500 text-sm">
            {theatre} | {date} | {selectedTime}
          </p>
        </div>

        {/* Seat Sections */}
        {seatLayout.map((section, index) => (
          <div key={index} className="mb-10 w-full text-center">
            <h2 className="text-lg font-semibold mb-3 text-blue-700">
              {section.section}
            </h2>
            {section.rows.map((row) => (
              <div
                key={row.row}
                className="flex items-center justify-center gap-4 mb-2"
              >
                <span className="w-6 text-gray-700 font-bold">{row.row}</span>
                <div className="flex gap-2 justify-center">
                  {row.seats.map((seatId) => {
                    const isSelected = selectedSeats.includes(seatId);
                    const isBooked = bookedSeats.includes(seatId);
                    const locked = !selectedTime || isBooked;
                    return (
                      <div
                        key={seatId}
                        onClick={() => !locked && handleSeatClick(seatId)}
                        className={`w-10 h-10 flex items-center justify-center border rounded transition duration-200
                          ${
                            isBooked
                              ? "bg-red-500 text-white cursor-not-allowed"
                              : locked
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : isSelected
                              ? "bg-green-600 text-white border-green-800 scale-110"
                              : "bg-gray-100 text-gray-800 border-gray-400 hover:bg-green-500 hover:text-white cursor-pointer"
                          }`}
                      >
                        {seatId}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}

        <p className="text-sm text-gray-500 mt-2">
          {selectedSeats.length} / 5 seats selected
        </p>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="flex items-center text-white bg-red-500 gap-1 mt-10 px-10 py-3 text-sm hover:bg-red-600 transition rounded-full font-medium cursor-pointer active:scale-95"
        >
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SeatLayout;
