import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute expects localStorage key "user" to be a JSON string:
 * { role: "supplier" } or { role: "buyer" }
 */
export default function ProtectedRoute({ allowedRole, children }) {
  const stored = localStorage.getItem("role");
  const role = stored ? stored : null;
  console.log(role)

  if (!role) {
    return <Navigate to="/login" replace />;
  }
  if (role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
