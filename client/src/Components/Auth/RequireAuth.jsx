import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUserStore from "../../stores/userStore";

export default function RequireAuth({ children }) {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const loading = useUserStore((s) => s.loading);
  const location = useLocation();

  if (loading) return null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
