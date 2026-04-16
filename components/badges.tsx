"use client";

import {
  JURISDICTION_COLOR,
  JURISDICTION_LABELS,
  STATUS_COLOR,
  STATUS_LABELS,
  TYPE_LABELS,
  TOPIC_LABELS,
} from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import type { Jurisdiction, StandardStatus, StandardType, Topic } from "@/lib/types";

export function JurisdictionBadge({ j }: { j: Jurisdiction }) {
  const { lang } = useI18n();
  return (
    <span
      className="badge"
      style={{ background: JURISDICTION_COLOR[j], color: "#fff" }}
    >
      {JURISDICTION_LABELS[j][lang === "zh" ? "cn" : "en"]}
    </span>
  );
}

export function StatusBadge({ s }: { s: StandardStatus }) {
  const { lang } = useI18n();
  return (
    <span
      className="badge"
      style={{ background: STATUS_COLOR[s], color: "#fff" }}
    >
      {STATUS_LABELS[s][lang === "zh" ? "cn" : "en"]}
    </span>
  );
}

export function TypeBadge({ t }: { t: StandardType }) {
  const { lang } = useI18n();
  return <span className="badge badge-outline">{TYPE_LABELS[t][lang === "zh" ? "cn" : "en"]}</span>;
}

export function TopicBadge({ topic }: { topic: Topic }) {
  const { lang } = useI18n();
  const label = TOPIC_LABELS[topic];
  if (!label) return <span className="badge badge-outline">{topic}</span>;
  return <span className="badge badge-outline">{label[lang === "zh" ? "cn" : "en"]}</span>;
}
