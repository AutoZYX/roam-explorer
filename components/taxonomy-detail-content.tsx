"use client";

import { LAYER_CONFIG, CATEGORY_COLORS } from "@/lib/constants";
import type { Incident, ScenarioCategory, SubScenario } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import IncidentCard from "./incident-card";
import Link from "next/link";

export default function TaxonomyDetailContent({
  category,
  scenario,
  incidents,
}: {
  category: ScenarioCategory;
  scenario: SubScenario;
  incidents: Incident[];
}) {
  const { t, lang } = useI18n();
  const catColor = CATEGORY_COLORS[category.code];

  return (
    <div>
      <Link
        href="/taxonomy"
        className="text-sm text-[var(--accent)] hover:underline no-underline mb-4 inline-block"
      >
        &larr; {t("tax.back")}
      </Link>

      <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-6 shadow-[var(--card-shadow)] mb-8">
        <div className="flex items-start gap-3 mb-4">
          <span
            className="text-3xl font-bold font-mono"
            style={{ color: catColor }}
          >
            {scenario.id}
          </span>
          <div>
            <h1 className="text-2xl">
              {lang === "zh" ? scenario.name_cn : scenario.name_en}
            </h1>
            <p className="text-sm text-[var(--muted)]">
              {lang === "zh" ? scenario.name_en : scenario.name_cn}
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-4">{scenario.description}</p>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--muted)]">{t("tax.category")}:</span>
            <span style={{ color: catColor }} className="font-medium">
              {category.code} &mdash;{" "}
              {lang === "zh" ? category.name_cn : category.name_en}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--muted)]">{t("tax.primaryLayer")}:</span>
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: `${LAYER_CONFIG[scenario.primaryLayer].color}20`,
                color: LAYER_CONFIG[scenario.primaryLayer].color,
              }}
            >
              Layer {scenario.primaryLayer} &mdash;{" "}
              {lang === "zh"
                ? LAYER_CONFIG[scenario.primaryLayer].cn
                : LAYER_CONFIG[scenario.primaryLayer].name}
            </span>
          </div>
          {scenario.escalationLayer && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--muted)]">{t("tax.escalation")}:</span>
              <span
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${LAYER_CONFIG[scenario.escalationLayer].color}20`,
                  color: LAYER_CONFIG[scenario.escalationLayer].color,
                }}
              >
                Layer {scenario.escalationLayer}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Related incidents */}
      <h2 className="text-xl mb-4">
        {t("tax.related")} ({incidents.length})
      </h2>
      {incidents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incidents.map((inc) => (
            <IncidentCard key={inc.id} incident={inc} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--muted)] text-sm py-8 text-center">
          {t("tax.noIncidents")}
        </p>
      )}
    </div>
  );
}
