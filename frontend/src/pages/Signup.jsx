import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      await signup(name, email, password);
      nav("/");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", backgroundColor: "#ffffff", padding: 24, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <form onSubmit={submit}>
        <h2 style={{ marginTop: 0 }}>Signup</h2>
        <input 
          placeholder="Name" 
          value={name} 
          onChange={e => setName(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "10px", 
            marginBottom: 12, 
            border: "1px solid #ddd", 
            borderRadius: 6,
            backgroundColor: "#ffffff",
            boxSizing: "border-box"
          }} 
        />
        <input 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "10px", 
            marginBottom: 12, 
            border: "1px solid #ddd", 
            borderRadius: 6,
            backgroundColor: "#ffffff",
            boxSizing: "border-box"
          }} 
        />
        <input 
          placeholder="Password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "10px", 
            marginBottom: 12, 
            border: "1px solid #ddd", 
            borderRadius: 6,
            backgroundColor: "#ffffff",
            boxSizing: "border-box"
          }} 
        />
        <button 
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 500,
            fontSize: 16
          }}
        >
          Create account
        </button>
      </form>
    </div>
  );
}
