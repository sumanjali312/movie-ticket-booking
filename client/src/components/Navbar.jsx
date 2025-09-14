import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  XIcon,
  MenuIcon,
  SearchIcon,
  TicketPlus,
  MapPin,
} from "lucide-react";
import { useUser, UserButton, useClerk } from "@clerk/clerk-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const cities = [
    "Bangalore",
    "Hyderabad",
    "Mumbai",
    "Delhi",
    "Chennai",
    "Pune",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(
        `/search?q=${encodeURIComponent(search.trim())}&city=${selectedCity}`
      );
      setSearch("");
    }
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Theaters", path: "/theaters" },
    { name: "Releases", path: "/releases" },
    { name: "Favorites", path: "/favorites" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-black text-white px-4 md:px-12 lg:px-20 py-3 shadow-md flex items-center justify-between">
      {/* Logo + Location */}
      <div className="flex items-center gap-4 relative">
        <Link to="/" className="flex items-center">
          <img
            src={assets.logo}
            alt="Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Location Selector */}
        <div className="relative">
          <button
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-700"
          >
            <MapPin size={16} /> {selectedCity}
          </button>

          {showCityDropdown && (
            <div className="absolute left-0 mt-2 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">
              {cities.map((city) => (
                <div
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setShowCityDropdown(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-3">
        {menuItems.map(({ name, path }) => (
          <Link
            key={name}
            to={path}
            className="px-4 py-2 rounded-full hover:bg-gray-700 hover:text-[#F84565] transition"
          >
            {name}
          </Link>
        ))}
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center ml-4 bg-white rounded-full overflow-hidden"
      >
        <input
          type="text"
          placeholder={`Search in ${selectedCity}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 text-black outline-none w-48 md:w-64"
        />
        <button type="submit" className="px-3 bg-[#F84565] text-white">
          <SearchIcon className="h-5 w-5" />
        </button>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Search */}
        <button onClick={() => navigate("/search")} className="md:hidden">
          <SearchIcon className="h-5 w-5" />
        </button>

        {/* Auth Actions with Clerk */}
        {!isSignedIn ? (
          <button
            onClick={() => openSignIn({})}
            className="h-10 px-5 bg-[#F84565] hover:bg-[#D63854] transition rounded-full text-sm font-medium"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus size={16} />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(true)}>
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center gap-10 text-white text-xl font-medium">
          <XIcon
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 w-7 h-7 cursor-pointer"
          />
          {menuItems.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              onClick={() => {
                scrollTo(0, 0);
                setMenuOpen(false);
              }}
              className="hover:text-[#F84565]"
            >
              {name}
            </Link>
          ))}
          {!isSignedIn ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                openSignIn({});
              }}
              className="px-6 py-2 bg-[#F84565] rounded-full text-white text-base"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/my-bookings");
                setMenuOpen(false);
              }}
              className="px-6 py-2 bg-[#F84565] rounded-full text-white text-base"
            >
              My Bookings
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
