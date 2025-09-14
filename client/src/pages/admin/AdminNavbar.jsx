import React from "react";
import { Link } from "react-router-dom";
import { LogOutIcon } from "lucide-react";

const AdminNavbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT token
    window.location.href = "/login"; // redirect to login page
  };

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo / Title */}
      <div className="text-xl font-bold">
        Admin Panel
      </div>

      {/* Navigation links */}
      <ul className="flex space-x-6">
        <li>
          <Link to="/admin/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/shows" className="hover:text-primary">
            Shows
          </Link>
        </li>
        <li>
          <Link to="/admin/bookings" className="hover:text-primary">
            Bookings
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="hover:text-primary">
            Users
          </Link>
        </li>
      </ul>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
      >
        <LogOutIcon className="w-4 h-4" />
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;
