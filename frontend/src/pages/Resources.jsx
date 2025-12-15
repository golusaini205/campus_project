import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";
import ResourceCard from "../components/ResourceCard.jsx";

export default function Resources() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  async function load() {
    const { items } = await apiFetch(`/api/resources${q ? `/search?query=${encodeURIComponent(q)}` : ""}`);
    setItems(items);
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input 
          placeholder="Search resources..." 
          value={q} 
          onChange={e => setQ(e.target.value)}
          style={{ 
            flex: 1, 
            padding: "8px 12px", 
            border: "1px solid #ddd", 
            borderRadius: 6,
            backgroundColor: "#ffffff"
          }} 
        />
        <button 
          onClick={load}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 500
          }}
        >
          Search
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {items.map(r => <ResourceCard key={r.id} r={r} />)}
      </div>
    </div>
  );
}
