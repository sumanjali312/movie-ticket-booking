import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser, useAuth, useClerk } from "@clerk/clerk-react";

// Set base URL for backend
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:8082";

// Create context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user: clerkUser, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [shows, setShows] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  // ------------------ Fetch user & admin role ------------------
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);

      if (isSignedIn && clerkUser) {
        try {
          // Get JWT from Clerk
          const token = await getToken({ template: "default" });

          // Check if admin via backend
          const res = await axios.get("/api/admin/check", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUser(clerkUser);
          setIsAdmin(res.data.success === true);

          // Redirect based on role
          if (res.data.success && !window.location.pathname.startsWith("/admin")) {
            navigate("/admin");
          } else if (!res.data.success && window.location.pathname.startsWith("/admin")) {
            navigate("/sign-in"); // block non-admin access
          }
        } catch (err) {
          console.error("Admin check failed:", err.response?.data || err);
          setUser(clerkUser);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkUser();
  }, [clerkUser, isSignedIn, getToken, navigate]);

  // ------------------ Fetch shows ------------------
  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) setShows(data.shows);
    } catch (err) {
      console.error("Fetch shows error:", err);
    }
  };

  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get("/api/movies/now-playing");
      if (data.success) setNowPlayingMovies(data.movies);
    } catch (err) {
      console.error("Failed to fetch now playing movies:", err);
    }
  };

  const fetchFavoriteMovies = async () => {
    if (!isSignedIn) return;
    try {
      const token = await getToken({ template: "default" });
      const { data } = await axios.get("/api/users/favorite", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setFavoriteMovies(data.movies);
    } catch (err) {
      console.error("Fetch favorites error:", err);
    }
  };

  // ------------------ Initial fetch ------------------
  useEffect(() => {
    fetchShows();
    fetchNowPlayingMovies();
  }, []);

  useEffect(() => {
    if (user) fetchFavoriteMovies();
  }, [user]);

  // ------------------ Logout ------------------
  const logout = async () => {
    try {
      await signOut(); // clears Clerk session
      setUser(null);
      setIsAdmin(false);
      navigate("/sign-in");
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Failed to log out");
    }
  };

  // ------------------ Context value ------------------
  const value = {
    user,
    isAdmin,
    loading,
    shows,
    nowPlayingMovies,
    favoriteMovies,
    logout,
    fetchShows,
    fetchNowPlayingMovies,
    fetchFavoriteMovies,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
