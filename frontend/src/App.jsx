import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Supplier from "./pages/Supplier";
import Buyer from "./pages/Buyer";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
   <Supplier/>
  );
}
