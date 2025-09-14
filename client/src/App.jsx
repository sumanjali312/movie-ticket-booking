import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { SignIn } from "@clerk/clerk-react";

// Context
import { useAppContext } from "./context/AppContext";

// Pages
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favorite from "./pages/Favorite";
import PaymentPage from "./pages/PaymentPage";
import ShowTimes from "./pages/ShowTime";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AddShows from "./pages/admin/AddShows";
import ListShows from "./pages/admin/ListShows";
import ListBookings from "./pages/admin/ListBookings";

// Layouts
import Layout from "./pages/admin/Layout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchResults from "./components/SearchResults";

const App = () => {
  const location = useLocation();
  const { loading } = useAppContext();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/seat-layout/:id" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorites" element={<Favorite />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/showtimes/:id" element={<ShowTimes />} />
        <Route path="/payment/:id" element={<PaymentPage />} />

        {/* Admin Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-shows" element={<AddShows />} />
            <Route path="list-shows" element={<ListShows />} />
            <Route path="list-bookings" element={<ListBookings />} />
          </Route>
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
