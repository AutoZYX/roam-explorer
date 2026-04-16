"use client";

import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { lang } = useI18n();
  const cn = lang === "zh";
  return (
    <footer className="border-t border-[var(--border)] mt-12 py-6 text-xs text-[var(--muted)]">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          {cn ? (
            <>
              © 2026 自动驾驶标准追踪 · 维护者：张玉新，吉林大学汽车工程学院
              <span className="mx-2">·</span>
              数据 CC BY 4.0 · 代码 MIT
            </>
          ) : (
            <>
              © 2026 AD Standards Tracker · Maintained by Zhang Yuxin, Jilin University
              <span className="mx-2">·</span>
              Data CC BY 4.0 · Code MIT
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <a href="/api/feed.xml">RSS</a>
          <a href="https://github.com/AutoZYX/ad-standards-tracker" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="mailto:zhangyuxin@jlu.edu.cn">Contact</a>
        </div>
      </div>
    </footer>
  );
}
