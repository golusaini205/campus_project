import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../api/client.js";
import TopRoomsChart from "../components/TopRoomsChart.jsx";
import UsageAreaChart from "../components/UsageAreaChart.jsx";
import BookingTimeline from "../components/BookingTimeline.jsx";

export default function Analytics() {
  const { user, token } = useAuth();
  const [topRooms, setTopRooms] = useState([]);
  const [usage, setUsage] = useState([]);
  const [myTimeline, setMyTimeline] = useState([]);

  useEffect(() => {
    apiFetch("/api/analytics/top-rooms?limit=7", { token }).then(({ data }) => setTopRooms(data)).catch(console.error);
    apiFetch("/api/analytics/usage?granularity=day", { token }).then(({ data }) => setUsage(data)).catch(console.error);
    apiFetch(`/api/users/${user.id}/bookings`, { token }).then(({ bookings }) => {
      setMyTimeline(bookings.map(b => ({
        title: b.resource.name,
        cardTitle: `${new Date(b.startTime).toLocaleString()} — ${new Date(b.endTime).toLocaleString()}`,
        cardSubtitle: b.status
      })));
    }).catch(console.error);
  }, []);

  return (
    <>
      <h2>Analytics</h2>
      <h3>Top rooms</h3>
      <TopRoomsChart data={topRooms} />
      <h3>Usage trends</h3>
      <UsageAreaChart data={usage} />
      <h3>My booking timeline</h3>
      <BookingTimeline items={myTimeline} />
    </>
  );
}
