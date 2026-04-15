"use client";

import { useI18n } from "@/lib/i18n";
import { TAXONOMY, CATEGORY_COLORS } from "@/lib/constants";
import { STANDARDS_MAPPING, GB_EVENT_CODE_NAMES } from "@/lib/standards";

export default function StandardsContent({ showHeader = true }: { showHeader?: boolean }) {
  const { lang } = useI18n();
  const zh = lang === "zh";

  const scenarioLookup = new Map<string, { name: string; cat: string }>();
  for (const cat of TAXONOMY) {
    for (const sub of cat.subScenarios) {
      scenarioLookup.set(sub.id, {
        name: zh ? sub.name_cn : sub.name_en,
        cat: cat.code,
      });
    }
  }

  const gapCount = STANDARDS_MAPPING.filter((m) => m.gbEventCodes.length === 0).length;

  return (
    <div>
      {showHeader && (
        <>
          <h1 className="text-3xl mb-2">
            {zh ? "标准对齐：ROAM × GB/T × ISO × NHTSA" : "Standards Alignment: ROAM × GB/T × ISO × NHTSA"}
          </h1>
          <p className="text-[var(--muted)] mb-8">
            {zh
              ? "ROAM 27 个子场景与三大标准族的对照映射。帮助车企、供应商、监管机构建立跨标准的事件分类参考。"
              : "Mapping ROAM's 27 sub-scenarios to three major standard families. For OEMs, suppliers, and regulators to reference across jurisdictions."}
          </p>
        </>
      )}

      {/* Standards overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🇨🇳</span>
            <h3 className="font-semibold">GB/T 草案</h3>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            {zh
              ? "《智能网联汽车 安全事件数据交互与管理系统技术规范》，2026 年 SAC/TC114/SC34 起草。规定企业平台→国家平台的数据上报架构及 14 种事件编码（0x01-0x0E）。"
              : "China national standard (draft, 2026) defining the enterprise→national platform data reporting architecture and 14 event type codes (0x01-0x0E)."}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🌐</span>
            <h3 className="font-semibold">ISO 34502 / 21448</h3>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            {zh
              ? "ISO 34502（场景化安全保证）+ ISO 21448 SOTIF（预期功能安全）。定义场景库、功能不足、触发条件和合理可预见的误用。"
              : "ISO 34502 (scenario-based safety assurance) + ISO 21448 SOTIF. Defines scenario libraries, functional insufficiencies, triggering conditions, and reasonably foreseeable misuse."}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🇺🇸</span>
            <h3 className="font-semibold">NHTSA SGO</h3>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            {zh
              ? "美国国家公路交通安全管理局 Standing General Order（强制令，2021 起）。要求 L2+ 和 ADS 车辆在碰撞、接管、伤亡后 1-5 日内向联邦报告。"
              : "NHTSA Standing General Order (2021-). Requires Level 2+ and ADS vehicles to report crashes, disengagements, and injuries to the federal government within 1-5 days."}
          </p>
        </div>
      </div>

      {/* GB/T event code legend */}
      <h2 className="text-xl mb-3">
        {zh ? "GB/T 草案 14 种事件编码" : "GB/T Draft: 14 Event Type Codes"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
        {Object.entries(GB_EVENT_CODE_NAMES).map(([code, names]) => (
          <div
            key={code}
            className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-sm"
          >
            <code className="font-mono text-xs bg-[var(--badge-bg)] px-2 py-0.5 rounded">
              {code}
            </code>
            <span>{zh ? names.zh : names.en}</span>
          </div>
        ))}
      </div>

      {/* Mapping table */}
      <h2 className="text-xl mb-3">
        {zh ? "完整映射表" : "Complete Mapping Table"}
      </h2>

      {gapCount > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-4 text-sm">
          <strong className="text-amber-800">
            {zh ? "⚠ GB/T 草案覆盖缺口：" : "⚠ GB/T Draft Coverage Gap: "}
          </strong>
          <span className="text-amber-700">
            {zh
              ? `${gapCount} 个 ROAM 场景（F 类乘客端异常）在当前 GB/T 草案中没有对应的事件编码。这是武汉萝卜快跑"乘客被困 2 小时"等事件暴露的盲区。`
              : `${gapCount} ROAM scenarios (F-category passenger-side issues) have no matching GB/T event code. This is the blind spot exposed by incidents like the Wuhan Apollo Go passenger entrapment.`}
          </span>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card-bg)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--badge-bg)]">
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-2 px-3 font-medium text-[var(--muted)]">ROAM</th>
              <th className="text-left py-2 px-3 font-medium text-[var(--muted)]">{zh ? "场景" : "Scenario"}</th>
              <th className="text-left py-2 px-3 font-medium text-[var(--muted)]">GB/T</th>
              <th className="text-left py-2 px-3 font-medium text-[var(--muted)]">ISO 34502 / 21448</th>
              <th className="text-left py-2 px-3 font-medium text-[var(--muted)]">NHTSA SGO</th>
            </tr>
          </thead>
          <tbody>
            {STANDARDS_MAPPING.map((m) => {
              const sc = scenarioLookup.get(m.scenarioCode);
              if (!sc) return null;
              const catColor = CATEGORY_COLORS[sc.cat];
              const hasGbGap = m.gbEventCodes.length === 0;
              return (
                <tr key={m.scenarioCode} className="border-b border-[var(--border)]/50 align-top">
                  <td className="py-2 px-3">
                    <span
                      className="font-mono font-semibold text-xs"
                      style={{ color: catColor }}
                    >
                      {m.scenarioCode}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs">{sc.name}</td>
                  <td className="py-2 px-3 text-xs">
                    {hasGbGap ? (
                      <span className="text-amber-700 font-medium">{zh ? "⚠ 未覆盖" : "⚠ Not covered"}</span>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {m.gbEventCodes.map((c) => (
                            <code key={c} className="bg-[var(--badge-bg)] px-1.5 py-0.5 rounded text-[10px]">
                              {c}
                            </code>
                          ))}
                        </div>
                        {m.gbNote && <div className="text-[10px] text-[var(--muted)]">{m.gbNote}</div>}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3 text-xs text-[var(--muted)]">
                    <div>{m.iso34502 || "—"}</div>
                    {m.iso21448 && <div className="text-[10px] mt-0.5">{m.iso21448}</div>}
                  </td>
                  <td className="py-2 px-3 text-xs text-[var(--muted)]">{m.nhtsaSgo || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Key takeaway */}
      <div className="mt-8 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/30 p-5">
        <h3 className="font-semibold mb-2">
          {zh ? "关键判断" : "Key Insight"}
        </h3>
        <p className="text-sm text-[var(--text)] leading-relaxed">
          {zh
            ? "GB/T 草案规定了「必须上报哪些数据」，ROAM 补充了「这些数据如何分类、如何设计响应、如何量化评估」。两者结合可以形成完整的「采集→分类→响应→评估」治理闭环。"
            : "GB/T draft specifies \u201cwhat data must be collected and reported.\u201d ROAM complements with \u201chow to classify the data, how to design responses, and how to measure performance.\u201d Together they form a complete collection\u2192classification\u2192response\u2192evaluation governance loop."}
        </p>
      </div>
    </div>
  );
}
