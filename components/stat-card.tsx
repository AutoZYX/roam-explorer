export default function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{label}</div>
      <div className="text-3xl font-semibold mt-1 tabular-nums">{value}</div>
      {hint ? <div className="text-xs text-[var(--muted)] mt-1">{hint}</div> : null}
    </div>
  );
}
