"use client";

import Link from "next/link";
import type { Standard } from "@/lib/types";
import { JurisdictionBadge, StatusBadge, TypeBadge } from "./badges";
import { useI18n } from "@/lib/i18n";

export default function StandardCard({ s }: { s: Standard }) {
  const { lang } = useI18n();
  const title = lang === "zh" ? s.title_cn || s.title_en : s.title_en || s.title_cn;
  const summary =
    lang === "zh" ? s.summary_cn || s.summary_en : s.summary_en || s.summary_cn;

  return (
    <Link
      href={`/standards/${s.id}`}
      className="card block p-4 no-underline text-[var(--text)] hover:shadow-md transition"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
        <JurisdictionBadge j={s.jurisdiction} />
        <StatusBadge s={s.status} />
        <TypeBadge t={s.type} />
        <span className="text-[var(--muted)] ml-auto tabular-nums">{s.date}</span>
      </div>
      <h3 className="text-base font-semibold mb-1 leading-snug">{title}</h3>
      <div className="text-xs text-[var(--muted)] mb-2">
        {s.org}
        {s.document_number ? <span className="ml-2">· {s.document_number}</span> : null}
      </div>
      {summary ? (
        <p className="text-sm text-[var(--text)]/80 line-clamp-3">{summary}</p>
      ) : null}
    </Link>
  );
}
