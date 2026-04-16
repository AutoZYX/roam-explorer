"use client";

import Link from "next/link";
import type { Standard } from "@/lib/types";
import type { TrackerStats } from "@/lib/data";
import StatCard from "./stat-card";
import StandardCard from "./standard-card";
import { JURISDICTION_LABELS, STATUS_LABELS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

export default function Dashboard({
  stats,
  recent,
  consultations,
}: {
  stats: TrackerStats;
  recent: Standard[];
  consultations: Standard[];
}) {
  const { t, lang } = useI18n();

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {t("site.name")}
        </h1>
        <p className="text-[var(--muted)] max-w-3xl text-[15px]">{t("site.tagline")}</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label={t("dash.total")} value={stats.total} />
        <StatCard label={t("dash.orgs")} value={stats.orgs.length} />
        <StatCard label={t("dash.open")} value={stats.consultationsOpen.length} />
        <StatCard label={t("dash.years")} value={stats.years.length} />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
            {t("dash.byJuris")}
          </h2>
          <ul className="space-y-1.5 text-sm">
            {Object.entries(stats.byJurisdiction)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => {
                const label =
                  JURISDICTION_LABELS[k as keyof typeof JURISDICTION_LABELS]?.[
                    lang === "zh" ? "cn" : "en"
                  ] ?? k;
                const pct = stats.total > 0 ? (v / stats.total) * 100 : 0;
                return (
                  <li key={k} className="flex items-center gap-3">
                    <span className="w-28 shrink-0">{label}</span>
                    <span className="flex-1 h-2 bg-[var(--badge-bg)] rounded-full overflow-hidden">
                      <span
                        className="block h-full"
                        style={{ width: `${pct}%`, background: "var(--accent)" }}
                      />
                    </span>
                    <span className="w-8 text-right tabular-nums text-[var(--muted)]">{v}</span>
                  </li>
                );
              })}
          </ul>
        </div>

        <div className="card p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
            {t("dash.byStatus")}
          </h2>
          <ul className="space-y-1.5 text-sm">
            {Object.entries(stats.byStatus)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => {
                const label =
                  STATUS_LABELS[k as keyof typeof STATUS_LABELS]?.[
                    lang === "zh" ? "cn" : "en"
                  ] ?? k;
                const pct = stats.total > 0 ? (v / stats.total) * 100 : 0;
                return (
                  <li key={k} className="flex items-center gap-3">
                    <span className="w-28 shrink-0">{label}</span>
                    <span className="flex-1 h-2 bg-[var(--badge-bg)] rounded-full overflow-hidden">
                      <span
                        className="block h-full"
                        style={{ width: `${pct}%`, background: "var(--accent)" }}
                      />
                    </span>
                    <span className="w-8 text-right tabular-nums text-[var(--muted)]">{v}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      </section>

      {consultations.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">{t("dash.openTitle")}</h2>
            <Link href="/standards?status=consultation" className="text-sm">
              {t("dash.viewAll")}
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {consultations.slice(0, 4).map((s) => (
              <StandardCard key={s.id} s={s} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">{t("dash.recent")}</h2>
          <Link href="/standards" className="text-sm">
            {t("dash.viewAll")}
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {recent.map((s) => (
            <StandardCard key={s.id} s={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
