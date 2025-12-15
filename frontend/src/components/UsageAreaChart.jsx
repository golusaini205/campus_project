import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function UsageAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="count" stroke="#10B981" fill="#A7F3D0" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
