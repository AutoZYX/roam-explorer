"use client";

import { useI18n } from "@/lib/i18n";

export default function IncidentsHeader() {
  const { t } = useI18n();
  return (
    <>
      <h1 className="text-3xl mb-2">{t("inc.title")}</h1>
      <p className="text-[var(--muted)] mb-6">{t("inc.desc")}</p>
    </>
  );
}
