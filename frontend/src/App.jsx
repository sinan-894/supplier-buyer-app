import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Supplier from "./pages/Supplier";
import Buyer from "./pages/Buyer";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/supplier" element={<ProtectedRoute allowedRole="customer"><Supplier/></ProtectedRoute>} />
      <Route path="/buyer" element={<ProtectedRoute allowedRole="buyer"><Buyer/></ProtectedRoute>} />
      <Route path="*" element={<div style={{padding:20}}>404 - Not found</div>} />
    </Routes>
  );
}
