"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import TaxonomyContent from "./taxonomy-content";
import ArchitectureContent from "./architecture-content";
import KPIsContent from "./kpis-content";

type Tab = "taxonomy" | "architecture" | "kpis";

export default function FrameworkContent({
  counts,
}: {
  counts: Record<string, number>;
}) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("taxonomy");

  // Sync with URL hash for deep linking
  useEffect(() => {
    const hash = window.location.hash.slice(1) as Tab;
    if (hash === "taxonomy" || hash === "architecture" || hash === "kpis") {
      setTab(hash);
    }
  }, []);

  const switchTab = (next: Tab) => {
    setTab(next);
    window.history.replaceState(null, "", `#${next}`);
  };

  const tabs: { key: Tab; labelKey: "fw.tab.taxonomy" | "fw.tab.architecture" | "fw.tab.kpis" }[] = [
    { key: "taxonomy", labelKey: "fw.tab.taxonomy" },
    { key: "architecture", labelKey: "fw.tab.architecture" },
    { key: "kpis", labelKey: "fw.tab.kpis" },
  ];

  return (
    <div>
      <h1 className="text-3xl mb-2">{t("fw.title")}</h1>
      <p className="text-[var(--muted)] mb-6">{t("fw.desc")}</p>

      {/* Tab bar */}
      <div className="flex border-b border-[var(--border)] mb-8 overflow-x-auto">
        {tabs.map((tbDef) => (
          <button
            key={tbDef.key}
            onClick={() => switchTab(tbDef.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors cursor-pointer ${
              tab === tbDef.key
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {t(tbDef.labelKey)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "taxonomy" && <TaxonomyContent counts={counts} showHeader={false} />}
      {tab === "architecture" && <ArchitectureContent showHeader={false} />}
      {tab === "kpis" && <KPIsContent showHeader={false} />}
    </div>
  );
}
