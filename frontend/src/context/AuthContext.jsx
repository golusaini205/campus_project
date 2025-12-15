import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  async function login(email, password) {
    const { token: t, user: u } = await apiFetch("/api/auth/login", { method: "POST", body: { email, password } });
    setToken(t); setUser(u);
  }

  async function signup(name, email, password) {
    const { token: t, user: u } = await apiFetch("/api/auth/signup", { method: "POST", body: { name, email, password } });
    setToken(t); setUser(u);
  }

  function logout() { setToken(null); setUser(null); }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
