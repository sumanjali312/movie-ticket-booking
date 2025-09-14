import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

// ✅ Check if user is admin (Clerk metadata)
export const isAdmin = (req, res) => {
  try {
    const user = req.user; // Clerk user from auth middleware

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No user found" });
    }

    if (user.privateMetadata?.role === "admin") {
      return res.status(200).json({
        success: true,
        message: "You are an admin",
        user,
      });
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: Not an admin" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Dashboard data (admin only)
export const getDashboardData = async (req, res) => {
  try {
    const bookings = await Booking.find({ isPaid: true });
    const activeShows = await Show.find({
      showDateTime: { $gte: new Date() },
    }).populate("movie");

    const totalUsers = await User.countDocuments();

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, b) => acc + (b.amount || 0), 0),
      activeShows,
      totalUsers,
    };

    return res.json({ success: true, dashboardData });
  } catch (error) {
    console.error("getDashboardData error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

// ✅ Fetch all upcoming shows (admin only)
export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({
      showDateTime: { $gte: new Date() },
    })
      .populate("movie")
      .sort({ showDateTime: 1 });

    return res.json({ success: true, shows });
  } catch (error) {
    console.error("getAllShows error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

// ✅ Fetch all bookings (admin only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user", "-password")
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.error("getAllBookings error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};
