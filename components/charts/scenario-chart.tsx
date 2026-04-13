"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CATEGORY_COLORS, TAXONOMY } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

export default function ScenarioChart({ data }: { data: Record<string, number> }) {
  const { t } = useI18n();
  const chartData = TAXONOMY.map((cat) => ({
    code: cat.code,
    name: cat.name_en,
    count: data[cat.code] || 0,
    color: CATEGORY_COLORS[cat.code],
  }));

  return (
    <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-5 shadow-[var(--card-shadow)]">
      <h3 className="text-sm font-semibold text-[var(--text)] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
        {t("chart.scenario")}
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData}>
          <XAxis dataKey="code" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value, _name, props) => [
              value,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (props as any).payload?.name ?? "",
            ]}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.code} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
