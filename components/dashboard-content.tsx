"use client";

import { useI18n } from "@/lib/i18n";
import type { Incident, DashboardStats } from "@/lib/types";
import StatCard from "./stat-card";
import IncidentCard from "./incident-card";
import SeverityChart from "./charts/severity-chart";
import TimelineChart from "./charts/timeline-chart";
import OperatorChart from "./charts/operator-chart";
import ScenarioChart from "./charts/scenario-chart";
import Link from "next/link";

export default function DashboardContent({
  stats,
  recent,
}: {
  stats: DashboardStats;
  recent: Incident[];
}) {
  const { t } = useI18n();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-2">{t("dash.title")}</h1>
        <p className="text-[var(--muted)]">{t("dash.desc")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label={t("dash.totalIncidents")} value={stats.totalIncidents} />
        <StatCard label={t("dash.operators")} value={stats.totalOperators} />
        <StatCard label={t("dash.scenarioTypes")} value={stats.totalScenarios} />
        <StatCard label={t("dash.coverage")} value={stats.yearRange} sub={t("dash.years")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <SeverityChart data={stats.bySeverity} />
        <TimelineChart data={stats.byYear} />
        <OperatorChart data={stats.byOperator} />
        <ScenarioChart data={stats.byCategory} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">{t("dash.recent")}</h2>
        <Link href="/incidents" className="text-sm text-[var(--accent)] hover:underline no-underline">
          {t("dash.viewAll")} &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recent.map((inc) => (
          <IncidentCard key={inc.id} incident={inc} />
        ))}
      </div>
    </div>
  );
}
