import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("@App:token");
  const location = useLocation();

  if (!token) {
    return (
      <Navigate to="/professor/login" state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};
