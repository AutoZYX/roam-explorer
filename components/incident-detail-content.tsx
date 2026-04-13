"use client";

import type { Incident } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import SeverityBadge from "./severity-badge";
import UrgencyBadge from "./urgency-badge";
import ScenarioTag from "./scenario-tag";
import Link from "next/link";

export default function IncidentDetailContent({
  incident,
}: {
  incident: Incident;
}) {
  const { t } = useI18n();

  const section = "mb-6";
  const sectionTitle =
    "text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-2";

  return (
    <div>
      <Link
        href="/incidents"
        className="text-sm text-[var(--accent)] hover:underline no-underline mb-4 inline-block"
      >
        &larr; {t("inc.back")}
      </Link>

      <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-6 shadow-[var(--card-shadow)]">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div>
            <span className="text-xs font-mono text-[var(--muted)]">
              {incident.id}
            </span>
            <h1 className="text-2xl mt-1">
              {incident.operator} &mdash; {incident.location.city}
            </h1>
          </div>
          <div className="text-right text-sm text-[var(--muted)]">
            <div>{incident.date}</div>
            {incident.time && <div>{incident.time}</div>}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <SeverityBadge severity={incident.severity} />
          {incident.urgency && <UrgencyBadge urgency={incident.urgency} />}
          <ScenarioTag code={incident.scenario.primary} />
          {incident.scenario.secondary?.map((s) => (
            <ScenarioTag key={s} code={s} />
          ))}
        </div>

        {/* Location */}
        <div className={section}>
          <h3 className={sectionTitle}>{t("detail.location")}</h3>
          <p className="text-sm">
            {incident.location.city}
            {incident.location.road_type &&
              ` \u2014 ${incident.location.road_type.replace(/_/g, " ")}`}
          </p>
          {incident.location.specific && (
            <p className="text-sm text-[var(--muted)]">
              {incident.location.specific}
            </p>
          )}
        </div>

        {/* Description */}
        <div className={section}>
          <h3 className={sectionTitle}>{t("detail.description")}</h3>
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {incident.description.trim()}
          </p>
        </div>

        {/* Impact */}
        {incident.impact && (
          <div className={section}>
            <h3 className={sectionTitle}>{t("detail.impact")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {incident.impact.vehicles_affected != null && (
                <div className="rounded-lg bg-[var(--badge-bg)] p-3">
                  <p className="text-xs text-[var(--muted)]">{t("detail.vehicles")}</p>
                  <p className="font-semibold">
                    {incident.impact.vehicles_affected}
                  </p>
                </div>
              )}
              {incident.impact.duration_minutes != null && (
                <div className="rounded-lg bg-[var(--badge-bg)] p-3">
                  <p className="text-xs text-[var(--muted)]">{t("detail.duration")}</p>
                  <p className="font-semibold">
                    {incident.impact.duration_minutes} {t("common.min")}
                  </p>
                </div>
              )}
              {incident.impact.injuries != null && (
                <div className="rounded-lg bg-[var(--badge-bg)] p-3">
                  <p className="text-xs text-[var(--muted)]">{t("detail.injuries")}</p>
                  <p className="font-semibold">{incident.impact.injuries}</p>
                </div>
              )}
              {incident.impact.fatalities != null && (
                <div className="rounded-lg bg-[var(--badge-bg)] p-3">
                  <p className="text-xs text-[var(--muted)]">{t("detail.fatalities")}</p>
                  <p className="font-semibold">{incident.impact.fatalities}</p>
                </div>
              )}
            </div>
            {incident.impact.traffic_disruption && (
              <p className="text-sm mt-2 text-[var(--muted)]">
                {t("detail.traffic")}: {incident.impact.traffic_disruption}
              </p>
            )}
          </div>
        )}

        {/* Emergency Response */}
        {incident.emergency_response && (
          <div className={section}>
            <h3 className={sectionTitle}>{t("detail.emergency")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {incident.emergency_response.sos_button && (
                <div>
                  <span className="text-[var(--muted)]">{t("detail.sos")}: </span>
                  {incident.emergency_response.sos_button}
                </div>
              )}
              {incident.emergency_response.customer_service && (
                <div>
                  <span className="text-[var(--muted)]">{t("detail.customerService")}: </span>
                  {incident.emergency_response.customer_service}
                </div>
              )}
              {incident.emergency_response.remote_intervention && (
                <div>
                  <span className="text-[var(--muted)]">{t("detail.remoteIntervention")}: </span>
                  {incident.emergency_response.remote_intervention}
                </div>
              )}
              {incident.emergency_response.on_site_response && (
                <div>
                  <span className="text-[var(--muted)]">{t("detail.onSite")}: </span>
                  {incident.emergency_response.on_site_response}
                </div>
              )}
            </div>
            {incident.emergency_response.resolution_method && (
              <p className="text-sm mt-2">
                <span className="text-[var(--muted)]">{t("detail.resolution")}: </span>
                {incident.emergency_response.resolution_method}
              </p>
            )}
          </div>
        )}

        {/* Root Cause */}
        {incident.root_cause && (
          <div className={section}>
            <h3 className={sectionTitle}>{t("detail.rootCause")}</h3>
            <p className="text-sm font-medium">{incident.root_cause.category}</p>
            <p className="text-sm text-[var(--muted)] mt-1">
              {incident.root_cause.description}
            </p>
            <p className="text-xs mt-1">
              {incident.root_cause.confirmed
                ? `\u2705 ${t("detail.confirmed")}`
                : `\u26a0\ufe0f ${t("detail.unconfirmed")}`}
            </p>
          </div>
        )}

        {/* Systemic Issues */}
        {incident.systemic_issues && incident.systemic_issues.length > 0 && (
          <div className={section}>
            <h3 className={sectionTitle}>{t("detail.systemic")}</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-[var(--muted)]">
              {incident.systemic_issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Regulatory Action */}
        {incident.regulatory_action && (
          <div className={section}>
            <h3 className={sectionTitle}>{t("detail.regulatory")}</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {incident.regulatory_action.trim()}
            </p>
          </div>
        )}

        {/* Sources */}
        {incident.sources && incident.sources.length > 0 && (
          <div className={section}>
            <h3 className={sectionTitle}>{t("detail.sources")}</h3>
            <ul className="space-y-1">
              {incident.sources.map((src, i) => (
                <li key={i} className="text-sm">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:underline"
                  >
                    {src.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)] flex flex-wrap gap-4">
          {incident.contributor && <span>Contributor: {incident.contributor}</span>}
          {incident.last_updated && <span>Updated: {incident.last_updated}</span>}
        </div>
      </div>
    </div>
  );
}
