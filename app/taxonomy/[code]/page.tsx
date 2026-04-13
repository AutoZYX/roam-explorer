import { TAXONOMY, LAYER_CONFIG, CATEGORY_COLORS } from "@/lib/constants";
import { getIncidentsByScenarioCode } from "@/lib/data";
import { notFound } from "next/navigation";
import IncidentCard from "@/components/incident-card";
import Link from "next/link";

export function generateStaticParams() {
  const codes: { code: string }[] = [];
  for (const cat of TAXONOMY) {
    for (const sub of cat.subScenarios) {
      codes.push({ code: sub.id });
    }
  }
  return codes;
}

export default async function ScenarioDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  let category = null;
  let scenario = null;
  for (const cat of TAXONOMY) {
    const found = cat.subScenarios.find((s) => s.id === code);
    if (found) {
      category = cat;
      scenario = found;
      break;
    }
  }
  if (!scenario || !category) notFound();

  const incidents = getIncidentsByScenarioCode(code);
  const catColor = CATEGORY_COLORS[category.code];

  return (
    <div>
      <Link
        href="/taxonomy"
        className="text-sm text-[var(--accent)] hover:underline no-underline mb-4 inline-block"
      >
        &larr; All Scenarios
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
            <h1 className="text-2xl">{scenario.name_en}</h1>
            <p className="text-sm text-[var(--muted)]">{scenario.name_cn}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-4">{scenario.description}</p>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--muted)]">Category:</span>
            <span style={{ color: catColor }} className="font-medium">
              {category.code} &mdash; {category.name_en}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--muted)]">Primary Layer:</span>
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: `${LAYER_CONFIG[scenario.primaryLayer].color}20`,
                color: LAYER_CONFIG[scenario.primaryLayer].color,
              }}
            >
              Layer {scenario.primaryLayer} &mdash;{" "}
              {LAYER_CONFIG[scenario.primaryLayer].name}
            </span>
          </div>
          {scenario.escalationLayer && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--muted)]">Escalation:</span>
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
        Related Incidents ({incidents.length})
      </h2>
      {incidents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incidents.map((inc) => (
            <IncidentCard key={inc.id} incident={inc} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--muted)] text-sm py-8 text-center">
          No incidents documented for this scenario yet.
        </p>
      )}
    </div>
  );
}
