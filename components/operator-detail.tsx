"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { Incident } from "@/lib/types";
import type { OperatorStat } from "@/lib/operators";
import { OPERATOR_COLORS, SEVERITY_CONFIG } from "@/lib/constants";
import IncidentCard from "./incident-card";
import StatCard from "./stat-card";

export default function OperatorDetail({
  stat,
  incidents,
}: {
  stat: OperatorStat;
  incidents: Incident[];
}) {
  const { lang } = useI18n();
  const zh = lang === "zh";
  const color = OPERATOR_COLORS[stat.name] || "#6b6960";

  const years = Object.entries(stat.byYear).sort(([a], [b]) => a.localeCompare(b));
  const maxYearCount = Math.max(...Object.values(stat.byYear));
  const injuries = incidents.reduce((s, i) => s + (i.impact?.injuries ?? 0), 0);
  const fatalities = incidents.reduce((s, i) => s + (i.impact?.fatalities ?? 0), 0);
  const firstYear = years[0]?.[0];

  return (
    <div>
      <Link
        href="/operators"
        className="text-sm text-[var(--accent)] hover:underline no-underline mb-4 inline-block"
      >
        &larr; {zh ? "返回运营商列表" : "All Operators"}
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <span
          className="w-4 h-4 rounded-full inline-block"
          style={{ backgroundColor: color }}
        />
        <h1 className="text-3xl">{stat.name}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label={zh ? "事件总数" : "Total Incidents"} value={stat.total} />
        <StatCard
          label={zh ? "覆盖年份" : "Active Years"}
          value={firstYear ? `${firstYear}–${years[years.length - 1][0]}` : "-"}
        />
        <StatCard label={zh ? "受伤人数" : "Injuries"} value={injuries} />
        <StatCard label={zh ? "死亡人数" : "Fatalities"} value={fatalities} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {/* Severity distribution */}
        <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-5 shadow-[var(--card-shadow)]">
          <h3 className="text-sm font-semibold mb-3">
            {zh ? "严重度分布" : "Severity Distribution"}
          </h3>
          <div className="space-y-2">
            {Object.entries(SEVERITY_CONFIG).map(([sev, cfg]) => {
              const count = stat.bySeverity[sev] || 0;
              if (count === 0) return null;
              const pct = (count / stat.total) * 100;
              return (
                <div key={sev} className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium w-12 text-center ${cfg.bg} ${cfg.color}`}>
                    {sev}
                  </span>
                  <div className="flex-1 h-5 bg-[var(--badge-bg)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.7 }}
                    />
                  </div>
                  <span className="text-xs text-[var(--muted)] w-20 text-right">
                    {count} ({pct.toFixed(1)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Year trend */}
        <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-5 shadow-[var(--card-shadow)]">
          <h3 className="text-sm font-semibold mb-3">
            {zh ? "年度趋势" : "Year-over-Year"}
          </h3>
          <div className="flex items-end gap-1 h-32">
            {years.map(([year, count]) => (
              <div key={year} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-[var(--muted)]">{count}</span>
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${(count / maxYearCount) * 100}%`,
                    backgroundColor: color,
                    minHeight: "3px",
                  }}
                />
                <span className="text-[10px] text-[var(--muted)] font-mono">{year.substring(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-xl mb-3">
        {zh ? "主要场景（Top 5）" : "Top Scenarios"}
      </h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {stat.topScenarios.map((ts) => (
          <Link
            key={ts.code}
            href={`/taxonomy/${ts.code}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] text-sm no-underline text-[var(--text)] transition-colors"
          >
            <span className="font-mono font-medium">{ts.code}</span>
            <span className="text-xs text-[var(--muted)]">&times; {ts.count}</span>
          </Link>
        ))}
      </div>

      <h2 className="text-xl mb-4">
        {zh ? `近期事件（${Math.min(20, incidents.length)}/${incidents.length}）` : `Recent Incidents (${Math.min(20, incidents.length)} of ${incidents.length})`}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {incidents.slice(0, 20).map((inc) => (
          <IncidentCard key={inc.id} incident={inc} />
        ))}
      </div>
    </div>
  );
}
