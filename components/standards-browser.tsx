"use client";

import { useMemo, useState } from "react";
import type { Standard } from "@/lib/types";
import StandardCard from "./standard-card";
import {
  JURISDICTION_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

export default function StandardsBrowser({ items }: { items: Standard[] }) {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [juris, setJuris] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [org, setOrg] = useState("");

  const orgs = useMemo(() => Array.from(new Set(items.map((i) => i.org))).sort(), [items]);
  const years = useMemo(
    () =>
      Array.from(new Set(items.map((i) => i.date.slice(0, 4))))
        .sort()
        .reverse(),
    [items]
  );

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return items.filter((s) => {
      if (juris && s.jurisdiction !== juris) return false;
      if (status && s.status !== status) return false;
      if (type && s.type !== type) return false;
      if (year && !s.date.startsWith(year)) return false;
      if (org && s.org !== org) return false;
      if (!qLower) return true;
      const hay = [
        s.title_en,
        s.title_cn,
        s.document_number,
        s.summary_en,
        s.summary_cn,
        s.org,
        ...(s.topics ?? []),
        ...(s.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(qLower);
    });
  }, [items, q, juris, status, type, year, org]);

  const clear = () => {
    setQ("");
    setJuris("");
    setStatus("");
    setType("");
    setYear("");
    setOrg("");
  };

  const hasFilter = q || juris || status || type || year || org;

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("std.filter.search")}
          className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-white focus:outline-none focus:border-[var(--accent)]"
        />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <Select value={juris} onChange={setJuris} label={t("std.filter.juris")}>
            {Object.entries(JURISDICTION_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v[lang === "zh" ? "cn" : "en"]}
              </option>
            ))}
          </Select>
          <Select value={status} onChange={setStatus} label={t("std.filter.status")}>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v[lang === "zh" ? "cn" : "en"]}
              </option>
            ))}
          </Select>
          <Select value={type} onChange={setType} label={t("std.filter.type")}>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v[lang === "zh" ? "cn" : "en"]}
              </option>
            ))}
          </Select>
          <Select value={year} onChange={setYear} label={t("std.filter.year")}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
          <Select value={org} onChange={setOrg} label={t("std.filter.org")}>
            {orgs.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <span>
            {filtered.length} {t("std.count")}
          </span>
          {hasFilter && (
            <button onClick={clear} className="text-[var(--accent)] hover:underline">
              {t("std.clear")}
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--muted)]">{t("std.empty")}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((s) => (
            <StandardCard key={s.id} s={s} />
          ))}
        </div>
      )}
    </div>
  );
}

function Select({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="px-2 py-2 text-sm rounded-md border border-[var(--border)] bg-white focus:outline-none focus:border-[var(--accent)]"
    >
      <option value="">
        {label} · {t("std.filter.all")}
      </option>
      {children}
    </select>
  );
}
