import { getDashboardStats, getAllIncidents } from "@/lib/data";
import StatCard from "@/components/stat-card";
import IncidentCard from "@/components/incident-card";
import SeverityChart from "@/components/charts/severity-chart";
import TimelineChart from "@/components/charts/timeline-chart";
import OperatorChart from "@/components/charts/operator-chart";
import ScenarioChart from "@/components/charts/scenario-chart";
import Link from "next/link";

export default function Dashboard() {
  const stats = getDashboardStats();
  const recent = getAllIncidents().slice(0, 6);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-2">ROAM Explorer</h1>
        <p className="text-[var(--muted)]">
          Open-source database of L4+ robotaxi operational anomalies. Browse incidents,
          explore the scenario taxonomy, and reference the three-layer architecture.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Incidents" value={stats.totalIncidents} />
        <StatCard label="Operators" value={stats.totalOperators} />
        <StatCard label="Scenario Types" value={stats.totalScenarios} />
        <StatCard label="Coverage" value={stats.yearRange} sub="years" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <SeverityChart data={stats.bySeverity} />
        <TimelineChart data={stats.byYear} />
        <OperatorChart data={stats.byOperator} />
        <ScenarioChart data={stats.byCategory} />
      </div>

      {/* Recent incidents */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">Recent Incidents</h2>
        <Link href="/incidents" className="text-sm text-[var(--accent)] hover:underline no-underline">
          View all &rarr;
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
