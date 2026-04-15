import type { Incident } from "./types";

export interface OperatorStat {
  name: string;
  slug: string;
  total: number;
  bySeverity: Record<string, number>;
  byYear: Record<string, number>;
  byScenario: Record<string, number>;
  topScenarios: { code: string; count: number }[];
  mostRecent?: Incident;
}

export function operatorSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function computeOperatorStats(incidents: Incident[]): OperatorStat[] {
  const byOp = new Map<string, Incident[]>();
  for (const inc of incidents) {
    const op = inc.operator || "Unknown";
    if (!byOp.has(op)) byOp.set(op, []);
    byOp.get(op)!.push(inc);
  }

  const stats: OperatorStat[] = [];
  for (const [name, incs] of byOp) {
    const bySeverity: Record<string, number> = {};
    const byYear: Record<string, number> = {};
    const byScenario: Record<string, number> = {};

    for (const inc of incs) {
      bySeverity[inc.severity] = (bySeverity[inc.severity] || 0) + 1;
      const year = inc.date.substring(0, 4);
      byYear[year] = (byYear[year] || 0) + 1;
      const scn = inc.scenario?.primary || "?";
      byScenario[scn] = (byScenario[scn] || 0) + 1;
    }

    const topScenarios = Object.entries(byScenario)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([code, count]) => ({ code, count }));

    const mostRecent = [...incs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    stats.push({
      name,
      slug: operatorSlug(name),
      total: incs.length,
      bySeverity,
      byYear,
      byScenario,
      topScenarios,
      mostRecent,
    });
  }

  return stats.sort((a, b) => b.total - a.total);
}

export function getIncidentsByOperator(
  incidents: Incident[],
  slug: string
): { stat: OperatorStat | null; incidents: Incident[] } {
  const stats = computeOperatorStats(incidents);
  const stat = stats.find((s) => s.slug === slug) || null;
  if (!stat) return { stat: null, incidents: [] };
  const opIncidents = incidents
    .filter((i) => operatorSlug(i.operator) === slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return { stat, incidents: opIncidents };
}
