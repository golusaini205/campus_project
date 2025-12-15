import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../api/client.js";

export default function MyBookings() {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);

  async function load() {
    const { bookings } = await apiFetch(`/api/users/${user.id}/bookings`, { token });
    setBookings(bookings);
  }

  async function cancel(bookingId, resourceId) {
    await apiFetch(`/api/resources/${resourceId}/cancel`, { method: "PUT", token, body: { bookingId } });
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>My bookings</h2>
      <ul>
        {bookings.map(b => (
          <li key={b.id} style={{ marginBottom: 8 }}>
            <strong>{b.resource.name}</strong> — {new Date(b.startTime).toLocaleString()} to {new Date(b.endTime).toLocaleString()} — {b.status}
            {b.status === "BOOKED" && (
              <>
                {" "}
                <button onClick={() => cancel(b.id, b.resourceId)}>Cancel</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
