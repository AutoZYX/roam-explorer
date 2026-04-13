import Link from "next/link";
import type { Incident } from "@/lib/types";
import SeverityBadge from "./severity-badge";
import UrgencyBadge from "./urgency-badge";
import ScenarioTag from "./scenario-tag";

export default function IncidentCard({ incident }: { incident: Incident }) {
  const desc =
    incident.description.length > 140
      ? incident.description.substring(0, 140).trim() + "..."
      : incident.description;

  return (
    <Link
      href={`/incidents/${incident.id}`}
      className="block rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-5 shadow-[var(--card-shadow)] hover:border-[var(--accent)] transition-colors no-underline"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-[var(--muted)]">{incident.id}</span>
        <span className="text-xs text-[var(--muted)]">{incident.date}</span>
      </div>
      <p className="font-medium text-sm text-[var(--text)] mb-2">
        {incident.operator} &mdash; {incident.location.city}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <SeverityBadge severity={incident.severity} />
        {incident.urgency && <UrgencyBadge urgency={incident.urgency} />}
        <ScenarioTag code={incident.scenario.primary} linked={false} />
        {incident.scenario.secondary?.map((s) => (
          <ScenarioTag key={s} code={s} linked={false} />
        ))}
      </div>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{desc}</p>
    </Link>
  );
}
