"use client";

import type { Standard } from "@/lib/types";
import { JurisdictionBadge, StatusBadge, TopicBadge, TypeBadge } from "./badges";
import { useI18n } from "@/lib/i18n";

export default function StandardDetail({ s }: { s: Standard }) {
  const { t, lang } = useI18n();
  const cn = lang === "zh";
  const title = cn ? s.title_cn || s.title_en : s.title_en || s.title_cn;
  const summary = cn ? s.summary_cn || s.summary_en : s.summary_en || s.summary_cn;
  const otherTitle = cn ? s.title_en : s.title_cn;

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <JurisdictionBadge j={s.jurisdiction} />
          <StatusBadge s={s.status} />
          <TypeBadge t={s.type} />
          <span className="text-xs text-[var(--muted)] ml-auto font-mono">{s.id}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold leading-tight">{title}</h1>
        {otherTitle && otherTitle !== title && (
          <div className="text-[var(--muted)] text-base">{otherTitle}</div>
        )}
        <div className="text-sm text-[var(--muted)]">
          {s.org_full || s.org}
        </div>
      </header>

      <dl className="card p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <Field label={t("detail.published")} value={s.date} />
        {s.effective_date && <Field label={t("detail.effective")} value={s.effective_date} />}
        {s.consultation_deadline && (
          <Field label={t("detail.deadline")} value={s.consultation_deadline} />
        )}
        {s.document_number && <Field label={t("detail.docnum")} value={s.document_number} />}
      </dl>

      {summary && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
            {t("detail.summary")}
          </h2>
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{summary}</p>
        </section>
      )}

      {s.impact_note && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
            {t("detail.impact")}
          </h2>
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{s.impact_note}</p>
        </section>
      )}

      {s.topics && s.topics.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
            {t("detail.topics")}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {s.topics.map((tp) => (
              <TopicBadge key={tp} topic={tp} />
            ))}
          </div>
        </section>
      )}

      {s.automation_level && s.automation_level.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
            {t("detail.levels")}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {s.automation_level.map((lv) => (
              <span key={lv} className="badge badge-outline font-mono">{lv}</span>
            ))}
          </div>
        </section>
      )}

      {s.related_standards && s.related_standards.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
            {t("detail.related")}
          </h2>
          <ul className="list-disc list-inside text-sm">
            {s.related_standards.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="card p-4">
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
          {t("detail.source")}
        </div>
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] break-words"
        >
          {s.url}
        </a>
        {s.last_updated && (
          <div className="text-xs text-[var(--muted)] mt-2">
            {cn ? "记录最后核对" : "Record last verified"}: {s.last_updated}
          </div>
        )}
      </section>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">{label}</dt>
      <dd className="mt-0.5 font-medium tabular-nums">{value}</dd>
    </div>
  );
}
