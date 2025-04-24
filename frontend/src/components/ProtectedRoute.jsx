import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("role"); // Ambil role langsung dari localStorage
  console.log("Allowed Roles:", allowedRoles); // Debug allowedRoles
  console.log("User Role:", userRole); // Debug userRole

  if (!userRole || !allowedRoles.includes(userRole)) {
    console.log("Access denied. Redirecting to /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;