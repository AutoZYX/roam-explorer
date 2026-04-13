"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useI18n } from "@/lib/i18n";

export default function TimelineChart({ data }: { data: Record<string, number> }) {
  const { t } = useI18n();
  const chartData = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => ({ year: k, count: v }));

  return (
    <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-5 shadow-[var(--card-shadow)]">
      <h3 className="text-sm font-semibold text-[var(--text)] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
        {t("chart.timeline")}
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData}>
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#c85a3a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
