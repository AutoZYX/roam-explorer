"use client";

import dynamic from "next/dynamic";
import type { Incident } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

const IncidentMap = dynamic(() => import("./incident-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-xl border border-[var(--border)] bg-[var(--card-bg)] flex items-center justify-center">
      <p className="text-[var(--muted)] text-sm">Loading map...</p>
    </div>
  ),
});

export default function MapWrapper({ incidents }: { incidents: Incident[] }) {
  const { lang } = useI18n();
  const zh = lang === "zh";

  return (
    <div>
      <h1 className="text-3xl mb-2">{zh ? "事件地图" : "Incident Map"}</h1>
      <p className="text-[var(--muted)] mb-6">
        {zh
          ? "将 ROAM 数据库中的事件按城市聚合到地图上，气泡大小反映事件密度，颜色表示最严重等级。"
          : "ROAM incidents clustered by city. Bubble size = incident count, color = highest severity."}
      </p>
      <IncidentMap incidents={incidents} />
    </div>
  );
}
