"use client";

import { useI18n } from "@/lib/i18n";

export default function StandardsHeader() {
  const { lang } = useI18n();
  return (
    <header>
      <h1 className="text-2xl md:text-3xl font-semibold">
        {lang === "zh" ? "标准库" : "Standards Library"}
      </h1>
      <p className="text-[var(--muted)] mt-1 text-sm">
        {lang === "zh"
          ? "按辖区、状态、类型、年份和机构筛选。记录仅含元数据与官方链接。"
          : "Filter by jurisdiction, status, type, year and issuing body. Records are metadata only, with links to the official source."}
      </p>
    </header>
  );
}
