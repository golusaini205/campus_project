import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../api/client.js";

export default function AdminResources() {
  const { token, user } = useAuth();
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ name: "", type: "ROOM", location: "", capacity: 0 });

  if (!user || user.role !== "ADMIN") return <p>Access denied</p>;

  async function load() {
    const { items } = await apiFetch("/api/resources", { token });
    setResources(items);
  }

  async function create() {
    try {
      const { resource } = await apiFetch("/api/resources", { method: "POST", token, body: form });
      alert("Resource created!");
      setForm({ name: "", type: "ROOM", location: "", capacity: 0 });
      await load();
    } catch (e) { alert(e.message); }
  }

  async function update(id, updates) {
    try {
      await apiFetch(`/api/resources/${id}`, { method: "PUT", token, body: updates });
      alert("Resource updated!");
      await load();
    } catch (e) { alert(e.message); }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Admin: Manage Resources</h2>
      <h3>Create new resource</h3>
      <div style={{ display: "grid", gap: 8, maxWidth: 400 }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option>ROOM</option><option>LAB</option><option>SPORTS</option>
        </select>
        <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        <input type="number" placeholder="Capacity" value={form.capacity} onChange={e => setForm({ ...form, capacity: parseInt(e.target.value) })} />
        <button onClick={create}>Create</button>
      </div>

      <h3 style={{ marginTop: 24 }}>Existing resources</h3>
      <ul>
        {resources.map(r => (
          <li key={r.id}>
            <strong>{r.name}</strong> ({r.type}) — {r.location} — cap {r.capacity}
            <button onClick={() => update(r.id, { isActive: !r.isActive })}>
              {r.isActive ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
