// components/admin/ProtectedAdminRoute.jsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const ProtectedAdminRoute = () => {
  const { isSignedIn, user } = useUser();

  // Not signed in
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Signed in but not admin
  if (user?.publicMetadata?.role !== "admin") {
    return <Navigate to="/sign-in" replace />;
  }

  // Admin allowed
  return <Outlet />;
};

export default ProtectedAdminRoute;
