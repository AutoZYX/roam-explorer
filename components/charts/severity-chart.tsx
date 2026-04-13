"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS: Record<string, string> = {
  S0: "#9ca3af",
  S1: "#3b82f6",
  S2: "#f59e0b",
  S3: "#ef4444",
  S4: "#c85a3a",
};

export default function SeverityChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data).map(([k, v]) => ({ name: k, value: v }));

  return (
    <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-5 shadow-[var(--card-shadow)]">
      <h3 className="text-sm font-semibold text-[var(--text)] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
        Severity Distribution
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || "#ccc"} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
