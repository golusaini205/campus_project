import React from "react";
import { Chrono } from "react-chrono";

export default function BookingTimeline({ items }) {
  // items: [{ title, cardTitle, cardSubtitle }]
  return (
    <div style={{ width: "100%", height: "450px" }}>
      <Chrono items={items} mode="VERTICAL_ALTERNATING" />
    </div>
  );
}
