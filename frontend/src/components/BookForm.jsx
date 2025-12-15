import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../api/client.js";

export default function BookForm({ resourceId, onBooked }) {
  const { token } = useAuth();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const { booking } = await apiFetch("/api/resources/book", {
        method: "POST",
        token,
        body: { resourceId, startTime, endTime, notes }
      });
      alert("Booking confirmed!");
      onBooked?.(booking);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: "1px solid #eee", padding: 12 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <label>Start
          <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
        </label>
        <label>End
          <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} />
        </label>
        <label>Notes
          <textarea value={notes} onChange={e => setNotes(e.target.value)} />
        </label>
      </div>
      <button disabled={loading || !startTime || !endTime} onClick={submit} style={{ marginTop: 8 }}>
        {loading ? "Booking..." : "Book"}
      </button>
    </div>
  );
}
