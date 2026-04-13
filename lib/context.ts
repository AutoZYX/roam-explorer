import { getAllIncidents } from "./data";
import { TAXONOMY, KPIS, LAYER_CONFIG } from "./constants";

export function buildSystemContext(): string {
  const incidents = getAllIncidents();

  const incidentSummaries = incidents
    .map(
      (inc) =>
        `[${inc.id}] ${inc.date} | ${inc.operator} | ${inc.location.city} | ${inc.severity}${inc.urgency ? "/" + inc.urgency : ""} | Scenario: ${inc.scenario.primary}${inc.scenario.secondary?.length ? "+" + inc.scenario.secondary.join("+") : ""}\n${inc.description.trim().substring(0, 300)}${inc.root_cause ? "\nRoot cause: " + inc.root_cause.description : ""}${inc.systemic_issues?.length ? "\nSystemic: " + inc.systemic_issues.join("; ") : ""}`
    )
    .join("\n\n");

  const taxonomySummary = TAXONOMY.map(
    (cat) =>
      `## ${cat.code}. ${cat.name_en} (${cat.name_cn})\n${cat.description}\n${cat.subScenarios
        .map(
          (s) =>
            `- ${s.id}: ${s.name_en} (${s.name_cn}) — Layer ${s.primaryLayer}${s.escalationLayer ? " → L" + s.escalationLayer : ""}: ${s.description}`
        )
        .join("\n")}`
  ).join("\n\n");

  const layerSummary = Object.entries(LAYER_CONFIG)
    .map(
      ([n, c]) =>
        `Layer ${n}: ${c.name} (${c.cn}) — Target: ${c.target}, Latency: ${c.latency}`
    )
    .join("\n");

  const kpiSummary = KPIS.map(
    (k) => `KPI ${k.number}: ${k.name} — ${k.definition} Target: ${k.target}`
  ).join("\n");

  return `You are ROAM Explorer's AI assistant — an expert on L4+ robotaxi remote operations incidents and safety.

You answer questions based ONLY on the ROAM database below. If the answer is not in the data, say so honestly.
Be concise, cite incident IDs (e.g. ROAM-2026-001) when relevant, and use the scenario taxonomy codes (e.g. C5, B1).
Answer in the same language as the question (Chinese or English).

## THREE-LAYER ARCHITECTURE
${layerSummary}

## SCENARIO TAXONOMY (6 categories, 27 sub-scenarios)
${taxonomySummary}

## KPI DEFINITIONS
${kpiSummary}

## INCIDENT DATABASE (${incidents.length} records)
${incidentSummaries}`;
}
