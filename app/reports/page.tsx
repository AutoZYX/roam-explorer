"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function ReportsPage() {
  const { lang } = useI18n();
  const zh = lang === "zh";

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl mb-2">
        {zh ? "ROAM 月度报告" : "ROAM Monthly Reports"}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {zh
          ? "每月 1 号自动生成的 Robotaxi 运营异常报告，涵盖新事件、趋势变化、行业洞察。"
          : "Monthly robotaxi operational anomaly reports, auto-generated on the 1st of each month. New incidents, trend shifts, industry insights."}
      </p>

      <div className="rounded-xl border-2 border-dashed border-[var(--border)] p-8 text-center mb-8">
        <p className="text-[var(--muted)] mb-4">
          {zh
            ? "第一期报告将于 2026 年 5 月 1 日发布。"
            : "First issue arrives May 1, 2026."}
        </p>
        <Link
          href="/subscribe"
          className="inline-block rounded-lg bg-[var(--accent)] text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 no-underline"
        >
          {zh ? "订阅获取报告" : "Subscribe to receive"}
        </Link>
      </div>

      <h2 className="text-xl mb-3">
        {zh ? "报告内容" : "What's in each report"}
      </h2>
      <ul className="list-disc list-inside text-sm space-y-2 text-[var(--muted)] mb-8">
        <li>{zh ? "本月新增事件（按严重度排序）" : "New incidents this month (sorted by severity)"}</li>
        <li>{zh ? "运营商同比数据对比" : "Operator year-over-year comparison"}</li>
        <li>{zh ? "突出场景变化（哪些场景在增加/减少）" : "Scenario shifts (which categories are up/down)"}</li>
        <li>{zh ? "监管动态（NHTSA、CPUC、DMV 最新动作）" : "Regulatory updates (NHTSA, CPUC, DMV actions)"}</li>
        <li>{zh ? "深度案例分析（1-2 个标志性事件）" : "Deep-dive case studies (1-2 landmark events)"}</li>
      </ul>

      <h2 className="text-xl mb-3">
        {zh ? "面向受众" : "Who it's for"}
      </h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          { en: "Automotive OEMs", zh: "整车厂" },
          { en: "Tier 1 suppliers", zh: "Tier 1 供应商" },
          { en: "Robotaxi operators", zh: "Robotaxi 运营商" },
          { en: "Safety consultancies", zh: "安全咨询机构" },
          { en: "Test houses", zh: "第三方测试机构" },
          { en: "Regulators", zh: "监管者" },
        ].map((r) => (
          <div key={r.en} className="rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2">
            {zh ? r.zh : r.en}
          </div>
        ))}
      </div>
    </div>
  );
}
