"use client";

import type { Source } from "@/lib/types";
import { JURISDICTION_LABELS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

export default function SourcesList({ sources }: { sources: Source[] }) {
  const { t, lang } = useI18n();
  const cn = lang === "zh";

  const grouped = sources.reduce<Record<string, Source[]>>((acc, s) => {
    (acc[s.jurisdiction] ||= []).push(s);
    return acc;
  }, {});

  const order: (keyof typeof JURISDICTION_LABELS)[] = [
    "international",
    "china",
    "us",
    "eu",
    "uk",
    "japan",
    "korea",
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold">{t("sources.title")}</h1>
        <p className="text-[var(--muted)] mt-2 text-sm max-w-3xl">{t("sources.desc")}</p>
      </header>

      {order.map((j) => {
        const items = grouped[j];
        if (!items) return null;
        return (
          <section key={j} className="space-y-3">
            <h2 className="text-lg font-semibold border-b border-[var(--border)] pb-2">
              {JURISDICTION_LABELS[j][cn ? "cn" : "en"]}{" "}
              <span className="text-sm text-[var(--muted)] font-normal">({items.length})</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {items.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-4 block no-underline text-[var(--text)] hover:shadow-md transition"
                >
                  <div className="text-xs font-mono text-[var(--muted)] mb-1">{s.id}</div>
                  <div className="font-semibold text-[15px] mb-1">
                    {cn ? s.name_cn : s.name_en}
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    {cn ? s.name_en : s.name_cn}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <span className="badge badge-outline">{s.language.toUpperCase()}</span>
                    {s.crawl_frequency && (
                      <span className="badge badge-outline">{s.crawl_frequency}</span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-[var(--accent)] break-all">{s.url}</div>
                  {s.notes && <div className="mt-2 text-xs text-[var(--muted)]">{s.notes}</div>}
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
