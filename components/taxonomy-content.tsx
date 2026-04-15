"use client";

import { TAXONOMY, LAYER_CONFIG, CATEGORY_COLORS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function TaxonomyContent({
  counts,
  showHeader = true,
}: {
  counts: Record<string, number>;
  showHeader?: boolean;
}) {
  const { t, lang } = useI18n();

  return (
    <div>
      {showHeader && (
        <>
          <h1 className="text-3xl mb-2">{t("tax.title")}</h1>
          <p className="text-[var(--muted)] mb-8">{t("tax.desc")}</p>
        </>
      )}

      {/* Layer key */}
      <div className="flex flex-wrap gap-3 mb-8">
        {Object.entries(LAYER_CONFIG).map(([num, cfg]) => (
          <div key={num} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: cfg.color }}
            />
            <span>
              Layer {num}: {lang === "zh" ? cfg.cn : cfg.name} ({cfg.target})
            </span>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {TAXONOMY.map((cat) => (
          <div key={cat.code}>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-2xl font-bold"
                style={{ color: CATEGORY_COLORS[cat.code], fontFamily: "Playfair Display, serif" }}
              >
                {cat.code}
              </span>
              <div>
                <h2 className="text-lg leading-tight">
                  {lang === "zh" ? cat.name_cn : cat.name_en}
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  {lang === "zh" ? cat.name_en : cat.name_cn}
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mb-3">{cat.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cat.subScenarios.map((sub) => {
                const incCount = counts[sub.id] || 0;
                return (
                  <Link
                    key={sub.id}
                    href={`/taxonomy/${sub.id}`}
                    className="block rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-4 hover:border-[var(--accent)] transition-colors no-underline"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span
                        className="font-mono font-bold text-sm"
                        style={{ color: CATEGORY_COLORS[cat.code] }}
                      >
                        {sub.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: `${LAYER_CONFIG[sub.primaryLayer].color}20`,
                            color: LAYER_CONFIG[sub.primaryLayer].color,
                          }}
                        >
                          L{sub.primaryLayer}
                        </span>
                        {incCount > 0 && (
                          <span className="text-xs text-[var(--muted)]">
                            {incCount} {incCount !== 1 ? t("tax.incidents") : t("tax.incident")}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-[var(--text)]">
                      {lang === "zh" ? sub.name_cn : sub.name_en}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {lang === "zh" ? sub.name_en : sub.name_cn}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
