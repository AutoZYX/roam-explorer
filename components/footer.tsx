export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-16 py-8 text-center text-sm text-[var(--muted)]">
      <div className="mx-auto max-w-5xl px-4">
        <p>
          <strong style={{ fontFamily: "Playfair Display, serif" }}>ROAM</strong>{" "}
          &mdash; Remote Operations Anomaly Management
        </p>
        <p className="mt-1">
          Open-source L4 Robotaxi incident database &middot;{" "}
          <a
            href="https://github.com/zyx312/ROAM"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            GitHub
          </a>{" "}
          &middot; Apache 2.0
        </p>
      </div>
    </footer>
  );
}
