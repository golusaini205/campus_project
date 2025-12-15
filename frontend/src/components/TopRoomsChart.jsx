import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TopRoomsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#4F46E5" />
      </BarChart>
    </ResponsiveContainer>
  );
}
