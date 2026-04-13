export default function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-5 shadow-[var(--card-shadow)]">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="text-2xl font-bold mt-1" style={{ fontFamily: "Playfair Display, serif" }}>
        {value}
      </p>
      {sub && <p className="text-xs text-[var(--muted)] mt-1">{sub}</p>}
    </div>
  );
}
