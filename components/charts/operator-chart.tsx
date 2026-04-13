"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useI18n } from "@/lib/i18n";

const COLORS: Record<string, string> = {
  Waymo: "#4285F4",
  "Cruise (GM)": "#FF6D00",
  Apollo: "#1A73E8",
  "Apollo (Baidu)": "#1A73E8",
  "Pony.ai": "#6C3AED",
};

export default function OperatorChart({ data }: { data: Record<string, number> }) {
  const { t } = useI18n();
  const chartData = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .map(([k, v]) => ({ operator: k, count: v, fill: COLORS[k] || "#6b6960" }));

  return (
    <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-5 shadow-[var(--card-shadow)]">
      <h3 className="text-sm font-semibold text-[var(--text)] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
        {t("chart.operator")}
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} layout="vertical">
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="operator" width={100} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, i) => (
              <rect key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
