import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Movie from "../models/Movie.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

// ------------------- SIGNUP -------------------
export const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Create Clerk user with default role
    const newUser = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
      emailVerified: true,
      privateMetadata: { role: "user" },
    });

    // Save in MongoDB
    await User.create({
      clerkId: newUser.id,
      email,
      name: `${firstName} ${lastName}`,
      role: "user",
      favorites: [],
    });

    return res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Signup failed" });
  }
};

// ------------------- LOGIN -------------------
export const login = async (req, res) => {
  try {
    const { email } = req.body;

    // Clerk handles login sessions via frontend
    const userList = await clerkClient.users.getUserList({ emailAddress: [email] });
    if (!userList || userList.length === 0) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const user = userList[0];
    return res.json({ success: true, message: "Login handled by Clerk frontend", user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

// ------------------- GET CURRENT USER -------------------
export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req; // set by authenticate middleware
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const clerkUser = await clerkClient.users.getUser(userId);
    return res.json({ success: true, user: clerkUser });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

// ------------------- FAVORITES -------------------
export const getFavorite = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    let user = await User.findOne({ clerkId: userId });
    if (!user) user = await User.create({ clerkId: userId, favorites: [] });

    const movies = await Movie.find({ _id: { $in: user.favorites || [] } });
    return res.json({ success: true, movies });
  } catch (err) {
    console.error("getFavorite error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch favorites" });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const { userId } = req;
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ success: false, message: "movieId is required" });

    let user = await User.findOne({ clerkId: userId });
    if (!user) user = await User.create({ clerkId: userId, favorites: [] });

    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
    } else {
      user.favorites = user.favorites.filter((id) => id.toString() !== movieId.toString());
    }

    await user.save();
    return res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    console.error("updateFavorite error:", err);
    return res.status(500).json({ success: false, message: "Failed to update favorites" });
  }
};

// ------------------- USER BOOKINGS -------------------
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: true, bookings: [] });

    const bookings = await Booking.find({ user: user._id })
      .populate("movie")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (err) {
    console.error("getUserBookings error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch user bookings" });
  }
};
