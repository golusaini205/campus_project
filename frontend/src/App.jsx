import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AdminResources from "./pages/AdminResources.jsx";
import Resources from "./pages/Resources.jsx";
import ResourceDetail from "./pages/ResourceDetail.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Analytics from "./pages/Analytics.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
      <Header />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
        <Routes>
          <Route path="/" element={<Resources />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/resources" element={user?.role === "ADMIN" ? <AdminResources /> : <Navigate to="/" />} />
          <Route path="/resources/:id" element={<ResourceDetail />} />
          <Route path="/bookings" element={user ? <MyBookings /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}
