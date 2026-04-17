"use client";

import { useState, useEffect, ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

// Simple email check — same shape as the server-side regex in
// /api/register, so the client-side error mirrors what the server
// would reject.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterGate({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [registered, setRegistered] = useState(false);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("roam-registered");
    if (saved) setRegistered(true);
    setChecking(false);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedCompany = company.trim();
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError(t("reg.email_invalid"));
      return;
    }
    if (!trimmedCompany) {
      setError(t("reg.company_required"));
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Fire-and-forget — don't block the user if the relay is slow or
      // fails. The API route writes a structured log line as a backup.
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, company: trimmedCompany }),
      });
    } catch {
      // Swallow — see comment above.
    }

    localStorage.setItem("roam-registered", trimmedEmail);
    setRegistered(true);
    setLoading(false);
  }

  if (checking) return null;
  if (registered) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-8 shadow-[var(--card-shadow)]">
        <h2
          className="text-xl mb-2 text-center"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {t("reg.title")}
        </h2>
        <p className="text-sm text-[var(--muted)] text-center mb-6">
          {t("reg.desc")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("reg.email")}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
          />
          <input
            type="text"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={t("reg.company")}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
          />
          {error && (
            <p className="text-xs text-red-500 text-center" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--accent)] text-white py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? "..." : t("reg.submit")}
          </button>
        </form>

        <p className="text-xs text-[var(--muted)] text-center mt-4">
          {t("reg.privacy")}
        </p>
      </div>
    </div>
  );
}
