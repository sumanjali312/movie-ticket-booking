// controllers/bookingController.js
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

/**
 * Helper to check seat availability.
 * showId - string/ObjectId
 * selectedSeats - array of seat identifiers (strings)
 */
const checkSeatAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupied = showData.occupiedSeats || new Map();

    // if occupied is a Map, convert to plain object for lookup
    // but Mongoose Map supports get() method
    const isAnyTaken = selectedSeats.some((seat) => {
      const val = showData.occupiedSeats.get ? showData.occupiedSeats.get(seat) : showData.occupiedSeats[seat];
      return !!val;
    });

    return !isAnyTaken;
  } catch (err) {
    console.error("checkSeatAvailability error:", err);
    return false;
  }
};

export const createBooking = async (req, res) => {
  try {
    // req.user must be set by authenticate middleware
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { showId, selectedSeats } = req.body;
    if (!showId || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({ success: false, message: "showId and selectedSeats are required" });
    }

    // check seat availability
    const isAvailable = await checkSeatAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: "Selected seats are not available." });
    }

    // get show and calculate amount
    const showData = await Show.findById(showId).populate("movie");
    if (!showData) return res.status(404).json({ success: false, message: "Show not found" });

    const amount = (showData.showPrice || 0) * selectedSeats.length;

    // create booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount,
      bookedSeats: selectedSeats,
      isPaid: false,
    });

    // mark seats as occupied (set seat -> userId)
    selectedSeats.forEach((seat) => {
      // if Map
      if (showData.occupiedSeats.set) {
        showData.occupiedSeats.set(seat, String(userId));
      } else {
        // fallback if stored as plain object/array
        showData.occupiedSeats[seat] = String(userId);
      }
    });

    // mark modified and save
    showData.markModified("occupiedSeats");
    await showData.save();

    // (Optional) Create payment link here and update booking.paymentLink

    return res.status(201).json({ success: true, message: "Booked successfully", booking });
  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    if (!showId) return res.status(400).json({ success: false, message: "showId required" });

    const showData = await Show.findById(showId);
    if (!showData) return res.status(404).json({ success: false, message: "Show not found" });

    // if Map -> convert to array of keys
    let occupiedSeats = [];
    if (showData.occupiedSeats) {
      if (showData.occupiedSeats.keys) {
        occupiedSeats = Array.from(showData.occupiedSeats.keys());
      } else if (typeof showData.occupiedSeats === "object") {
        occupiedSeats = Object.keys(showData.occupiedSeats);
      }
    }

    return res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.error("getOccupiedSeats error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
