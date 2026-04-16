import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { Jurisdiction, Standard } from "./types";

const DATA_DIR = path.join(process.cwd(), "standards");

let _cache: Standard[] | null = null;

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && (entry.name.endsWith(".yaml") || entry.name.endsWith(".yml"))) {
      out.push(full);
    }
  }
  return out;
}

export function getAllStandards(): Standard[] {
  if (_cache) return _cache;
  const files = walk(DATA_DIR);
  const items: Standard[] = [];
  for (const file of files) {
    try {
      const doc = yaml.load(fs.readFileSync(file, "utf-8")) as Standard;
      if (doc && doc.id) items.push(doc);
    } catch (err) {
      console.warn(`[data] failed to parse ${file}:`, err);
    }
  }
  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  _cache = items;
  return items;
}

export function getStandardById(id: string): Standard | null {
  return getAllStandards().find((s) => s.id === id) ?? null;
}

export function getByJurisdiction(j: Jurisdiction): Standard[] {
  return getAllStandards().filter((s) => s.jurisdiction === j);
}

export interface TrackerStats {
  total: number;
  byJurisdiction: Record<string, number>;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  byYear: Record<string, number>;
  byOrg: Record<string, number>;
  consultationsOpen: Standard[];
  recentlyPublished: Standard[];
  years: string[];
  orgs: string[];
}

export function getStats(): TrackerStats {
  const items = getAllStandards();
  const byJurisdiction: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const byYear: Record<string, number> = {};
  const byOrg: Record<string, number> = {};
  const today = new Date().toISOString().slice(0, 10);

  for (const s of items) {
    byJurisdiction[s.jurisdiction] = (byJurisdiction[s.jurisdiction] || 0) + 1;
    byStatus[s.status] = (byStatus[s.status] || 0) + 1;
    byType[s.type] = (byType[s.type] || 0) + 1;
    const y = s.date.slice(0, 4);
    byYear[y] = (byYear[y] || 0) + 1;
    byOrg[s.org] = (byOrg[s.org] || 0) + 1;
  }

  const consultationsOpen = items.filter(
    (s) => s.status === "consultation" && (!s.consultation_deadline || s.consultation_deadline >= today)
  );
  const recentlyPublished = items.filter((s) => s.status === "published").slice(0, 8);

  return {
    total: items.length,
    byJurisdiction,
    byStatus,
    byType,
    byYear,
    byOrg,
    consultationsOpen,
    recentlyPublished,
    years: Object.keys(byYear).sort().reverse(),
    orgs: Object.keys(byOrg).sort(),
  };
}
