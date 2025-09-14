import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UsersIcon } from "lucide-react";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import BlurCircle from "../../components/BlurCircle";
import { dateFormat } from "../../lib/dateFormat";

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const currency = import.meta.env.VITE_CURRENCY;

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const dashboardCards = [
    { title: "Total Bookings", value: dashboardData.totalBookings || "0", icon: ChartLineIcon },
    { title: "Total Revenue", value: dashboardData.totalRevenue || "0", icon: CircleDollarSignIcon },
    { title: "Active Shows", value: dashboardData.activeShows.length || "0", icon: PlayCircleIcon },
    { title: "Total Users", value: dashboardData.totalUsers || "0", icon: UsersIcon },
  ];

  // ✅ Fetch if user is admin
  const fetchIsAdmin = async (token) => {
    try {
      const res = await fetch(`${API_URL}/admin/is-admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.isAdmin) {
        setIsAdmin(true);
      } else {
        console.error("Not an admin or access denied");
      }
    } catch (err) {
      console.error("Admin check failed:", err);
    }
  };

  // ✅ Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (!isLoaded || !user) return; // wait for Clerk user

      const token = await getToken();

      // Check if admin first
      await fetchIsAdmin(token);

      // Fetch dashboard data only if admin
      if (isAdmin) {
        const res = await fetch(`${API_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setDashboardData(data.dashboardData);
        } else {
          console.error("Failed to fetch dashboard data:", data.message);
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isLoaded, user, isAdmin]);

  if (loading) return <Loading />;

  if (!isAdmin)
    return <p className="text-red-500 mt-10 text-center">Access Denied: Admins only</p>;

  return (
    <>
      <Title text1="Admin" text2="Dashboard" />

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 relative">
        <BlurCircle top="-100px" left="0" />
        {dashboardCards.map((card, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-6 shadow-md"
          >
            <card.icon className="w-8 h-8 mb-2 text-primary" />
            <h1 className="text-lg font-medium text-white">{card.title}</h1>
            <p className="text-xl font-bold text-white">
              {card.value} {card.title === "Total Revenue" ? currency : ""}
            </p>
          </div>
        ))}
      </div>

      {/* Active Shows */}
      <p className="mt-10 text-lg font-medium">Active Shows</p>
      <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
        <BlurCircle top="100px" left="10%" />

        {dashboardData.activeShows.map((show) => (
          <div
            key={show._id}
            className="w-56 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl overflow-hidden shadow-md hover:-translate-y-1 transition duration-300"
          >
            <img
              src={show.movie?.poster_path || "/fallback-poster.jpg"}
              alt={show.movie?.title || "Movie"}
              className="h-60 w-full object-cover"
            />
            <div className="p-3">
              <p className="font-semibold truncate text-white">{show.movie?.title || "N/A"}</p>

              <div className="flex items-center justify-between mt-2">
                <p className="text-lg font-medium text-white">
                  {currency}{show.showPrice || "0"}
                </p>
                <p className="flex items-center gap-1 text-sm text-gray-300">
                  <StarIcon className="w-4 h-4 text-primary fill-primary" />
                  {show.movie?.vote_average?.toFixed(1) || "N/A"}
                </p>
              </div>

              <p className="text-sm text-gray-400 mt-2">{dateFormat(show.showDateTime)}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
