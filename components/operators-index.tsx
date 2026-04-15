"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { OperatorStat } from "@/lib/operators";
import { OPERATOR_COLORS, SEVERITY_CONFIG } from "@/lib/constants";

export default function OperatorsIndex({ stats }: { stats: OperatorStat[] }) {
  const { lang } = useI18n();
  const zh = lang === "zh";

  return (
    <div>
      <h1 className="text-3xl mb-2">{zh ? "运营商对比" : "Operator Comparison"}</h1>
      <p className="text-[var(--muted)] mb-8">
        {zh
          ? "按运营商分组统计事件，快速对比不同公司的事件规模、严重度分布和主要场景。"
          : "Incidents grouped by operator — compare fleet size, severity distribution, and dominant scenarios."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((s) => {
          const color = OPERATOR_COLORS[s.name] || "#6b6960";
          const maxSev = s.bySeverity["S4"] || s.bySeverity["S3"] || 0;
          return (
            <Link
              key={s.slug}
              href={`/operators/${s.slug}`}
              className="block rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-5 shadow-[var(--card-shadow)] hover:border-[var(--accent)] transition-colors no-underline"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-semibold text-[var(--text)]">{s.name}</span>
                </div>
                <span className="text-2xl font-bold" style={{ fontFamily: "Playfair Display, serif", color }}>
                  {s.total}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {Object.entries(s.bySeverity)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([sev, count]) => {
                    const cfg = SEVERITY_CONFIG[sev];
                    return (
                      <span
                        key={sev}
                        className={`text-xs px-2 py-0.5 rounded font-medium ${cfg.bg} ${cfg.color}`}
                      >
                        {sev} &times; {count}
                      </span>
                    );
                  })}
              </div>

              <p className="text-xs text-[var(--muted)]">
                {zh ? "主要场景：" : "Top scenarios: "}
                {s.topScenarios.map((ts) => `${ts.code}(${ts.count})`).join(" · ")}
              </p>
              {maxSev > 0 && (
                <p className="text-xs text-red-600 mt-1">
                  {zh ? `⚠ 含 ${maxSev} 条严重事件` : `⚠ ${maxSev} severe incident${maxSev > 1 ? "s" : ""}`}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
