import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquare } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

const AdminSidebar = () => {
  const user = {
    firstName: "Admin",
    lastName: "User",
    imageUrl: assets.profile,
  };

  const adminNavlinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Add Shows", path: "/admin/add-shows", icon: PlusSquare },
    { name: "List Shows", path: "/admin/list-shows", icon: ListIcon },
    { name: "List Bookings", path: "/admin/list-bookings", icon: ListCollapseIcon },
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col items-center pt-8 w-full max-w-[15rem] md:max-w-[15rem] border-r border-gray-300/20 text-sm bg-zinc-900 text-white">
      {/* User Info */}
      <img
        className="h-14 w-14 rounded-full mx-auto"
        src={user.imageUrl}
        alt="Admin"
      />
      <p className="mt-2 text-base hidden md:block">
        {user.firstName} {user.lastName}
      </p>

      {/* Navigation Links */}
      <div className="w-full mt-6 flex flex-col gap-1">
        {adminNavlinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded
               ${isActive ? "bg-primary/15 text-primary font-medium" : ""}`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="hidden md:inline">{link.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
