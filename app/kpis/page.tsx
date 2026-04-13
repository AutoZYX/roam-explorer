"use client";

import { KPIS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

export default function KPIsPage() {
  const { t } = useI18n();

  return (
    <div>
      <h1 className="text-3xl mb-2">{t("kpi.title")}</h1>
      <p className="text-[var(--muted)] mb-8">{t("kpi.desc")}</p>

      <div className="space-y-6">
        {KPIS.map((kpi) => (
          <div
            key={kpi.number}
            className="rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-5 shadow-[var(--card-shadow)]"
          >
            <div className="flex items-start gap-3 mb-3">
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-bold shrink-0"
              >
                {kpi.number}
              </span>
              <div>
                <h2 className="text-lg leading-tight">{kpi.name}</h2>
                <p className="text-xs text-[var(--muted)]">
                  {kpi.unit} &middot; {kpi.frequency}
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--muted)] mb-4">{kpi.definition}</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-1.5 pr-4 text-[var(--muted)] font-medium text-xs">
                      {t("kpi.category")}
                    </th>
                    <th className="text-center py-1.5 px-3 text-[var(--muted)] font-medium text-xs">
                      {t("kpi.target")}
                    </th>
                    <th className="text-center py-1.5 px-3 text-[var(--muted)] font-medium text-xs">
                      {t("kpi.stretch")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {kpi.targets.map((tgt, i) => (
                    <tr key={i} className="border-b border-[var(--border)]/50">
                      <td className="py-1.5 pr-4 text-sm">{tgt.label}</td>
                      <td className="py-1.5 px-3 text-center font-mono text-sm font-medium">
                        {tgt.target}
                      </td>
                      <td className="py-1.5 px-3 text-center font-mono text-sm text-[var(--muted)]">
                        {tgt.stretch}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
