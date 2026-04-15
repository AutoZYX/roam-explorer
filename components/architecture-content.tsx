"use client";

import {
  LAYER_CONFIG,
  TAXONOMY,
  URGENCY_SEVERITY_MATRIX,
  SEVERITY_CONFIG,
  URGENCY_CONFIG,
} from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

export default function ArchitectureContent({ showHeader = true }: { showHeader?: boolean }) {
  const { t, lang } = useI18n();

  return (
    <div>
      {showHeader && (
        <>
          <h1 className="text-3xl mb-2">{t("arch.title")}</h1>
          <p className="text-[var(--muted)] mb-8">{t("arch.desc")}</p>
        </>
      )}

      {/* Three layers */}
      <div className="space-y-4 mb-12">
        {Object.entries(LAYER_CONFIG).map(([num, cfg]) => (
          <div
            key={num}
            className="rounded-xl border-l-4 bg-[var(--card-bg)] border border-[var(--border)] p-5 shadow-[var(--card-shadow)]"
            style={{ borderLeftColor: cfg.color }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-lg">
                  Layer {num}: {lang === "zh" ? cfg.cn : cfg.name}
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  {lang === "zh" ? cfg.name : cfg.cn}
                </p>
              </div>
              <div className="text-right">
                <span
                  className="text-2xl font-bold"
                  style={{ color: cfg.color, fontFamily: "Playfair Display, serif" }}
                >
                  {cfg.target}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
              <span>
                {t("arch.latency")}: {cfg.latency}
              </span>
              <span>
                {t("arch.humanRole")}:{" "}
                {num === "1"
                  ? t("arch.none")
                  : num === "2"
                  ? t("arch.confirm")
                  : t("arch.direct")}
              </span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl mb-4">{t("arch.mapping")}</h2>
      <div className="overflow-x-auto mb-12">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-2 pr-4 text-[var(--muted)] font-medium">ID</th>
              <th className="text-left py-2 pr-4 text-[var(--muted)] font-medium">
                {t("arch.scenario")}
              </th>
              <th className="text-center py-2 px-3 text-[var(--muted)] font-medium">
                {t("arch.primary")}
              </th>
              <th className="text-center py-2 px-3 text-[var(--muted)] font-medium">
                {t("arch.escHeader")}
              </th>
            </tr>
          </thead>
          <tbody>
            {TAXONOMY.flatMap((cat) =>
              cat.subScenarios.map((sub) => (
                <tr key={sub.id} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-mono font-medium">
                    {sub.id}
                  </td>
                  <td className="py-2 pr-4">
                    {lang === "zh" ? sub.name_cn : sub.name_en}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${LAYER_CONFIG[sub.primaryLayer].color}20`,
                        color: LAYER_CONFIG[sub.primaryLayer].color,
                      }}
                    >
                      L{sub.primaryLayer}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    {sub.escalationLayer ? (
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${LAYER_CONFIG[sub.escalationLayer].color}20`,
                          color: LAYER_CONFIG[sub.escalationLayer].color,
                        }}
                      >
                        L{sub.escalationLayer}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--muted)]">&mdash;</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl mb-4">{t("arch.matrix")}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="py-2 pr-4"></th>
              {Object.keys(URGENCY_CONFIG).map((u) => (
                <th key={u} className="py-2 px-3 text-center text-[var(--muted)] font-medium">
                  {u}
                  <br />
                  <span className="text-xs font-normal">
                    {lang === "zh" ? URGENCY_CONFIG[u].cn : URGENCY_CONFIG[u].label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(SEVERITY_CONFIG).map((s) => (
              <tr key={s} className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 font-medium">
                  {s}{" "}
                  <span className="text-xs text-[var(--muted)] font-normal">
                    {lang === "zh" ? SEVERITY_CONFIG[s].cn : SEVERITY_CONFIG[s].label}
                  </span>
                </td>
                {Object.keys(URGENCY_CONFIG).map((u) => {
                  const val = URGENCY_SEVERITY_MATRIX[s]?.[u] || "\u2014";
                  const isEmergency = val === "Emergency";
                  const isCritical = val === "Critical";
                  const isPriority = val === "Priority";
                  return (
                    <td
                      key={u}
                      className={`py-2 px-3 text-center text-xs font-medium rounded ${
                        isEmergency
                          ? "bg-red-100 text-red-700"
                          : isCritical
                          ? "bg-orange-100 text-orange-700"
                          : isPriority
                          ? "bg-amber-50 text-amber-700"
                          : "text-[var(--muted)]"
                      }`}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
