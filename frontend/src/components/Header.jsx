import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header style={{ borderBottom: "1px solid #eee", marginBottom: 16, backgroundColor: "#ffffff" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">Resources</Link>
        {user && <Link to="/bookings">My bookings</Link>}
        {user && <Link to="/analytics">Analytics</Link>}
        <div style={{ marginLeft: "auto" }}>
          {user ? (
            <>
              <span style={{ marginRight: 8 }}>{user.name} ({user.role})</span>
              <button onClick={() => { logout(); nav("/login"); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              {" / "}
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
