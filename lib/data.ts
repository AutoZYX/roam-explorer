import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { Incident, DashboardStats } from "./types";
import { TAXONOMY } from "./constants";

const DATA_DIR = path.join(process.cwd(), "data", "incidents");

export function getAllIncidents(): Incident[] {
  const incidents: Incident[] = [];
  const years = fs.readdirSync(DATA_DIR).filter((d) => {
    const full = path.join(DATA_DIR, d);
    return fs.statSync(full).isDirectory();
  });

  for (const year of years) {
    const yearDir = path.join(DATA_DIR, year);
    const files = fs.readdirSync(yearDir).filter((f) => f.endsWith(".yaml"));
    for (const file of files) {
      const content = fs.readFileSync(path.join(yearDir, file), "utf-8");
      const incident = yaml.load(content) as Incident;
      // Default tier for legacy records without an explicit tier
      if (!incident.tier) {
        incident.tier = incident.id.startsWith("ROAM-DMV-") ? 2 : 1;
      }
      incidents.push(incident);
    }
  }

  return incidents.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getIncidentById(id: string): Incident | null {
  const all = getAllIncidents();
  return all.find((i) => i.id === id) ?? null;
}

export function getDashboardStats(): DashboardStats {
  const incidents = getAllIncidents();
  const operators = new Set(incidents.map((i) => i.operator));
  const years = new Set(incidents.map((i) => i.date.substring(0, 4)));

  const bySeverity: Record<string, number> = {};
  const byOperator: Record<string, number> = {};
  const byYear: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const inc of incidents) {
    bySeverity[inc.severity] = (bySeverity[inc.severity] || 0) + 1;
    byOperator[inc.operator] = (byOperator[inc.operator] || 0) + 1;
    const year = inc.date.substring(0, 4);
    byYear[year] = (byYear[year] || 0) + 1;
    const cat = inc.scenario.primary.charAt(0);
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  }

  const sortedYears = [...years].sort();

  return {
    totalIncidents: incidents.length,
    totalOperators: operators.size,
    totalScenarios: TAXONOMY.reduce((s, c) => s + c.subScenarios.length, 0),
    yearRange: `${sortedYears[0]}\u2013${sortedYears[sortedYears.length - 1]}`,
    bySeverity,
    byOperator,
    byYear,
    byCategory,
  };
}

export function getIncidentsByScenarioCode(code: string): Incident[] {
  const all = getAllIncidents();
  return all.filter(
    (i) =>
      i.scenario.primary === code ||
      (i.scenario.secondary && i.scenario.secondary.includes(code))
  );
}

export function getScenarioCounts(): Record<string, number> {
  const incidents = getAllIncidents();
  const counts: Record<string, number> = {};
  for (const inc of incidents) {
    const codes = [inc.scenario.primary, ...(inc.scenario.secondary || [])];
    for (const c of codes) {
      counts[c] = (counts[c] || 0) + 1;
    }
  }
  return counts;
}
