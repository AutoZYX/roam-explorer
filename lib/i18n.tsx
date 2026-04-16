"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Lang = "en" | "zh";

const T = {
  "nav.dashboard": { en: "Dashboard", zh: "仪表盘" },
  "nav.standards": { en: "Standards", zh: "标准库" },
  "nav.sources": { en: "Sources", zh: "数据源" },
  "nav.subscribe": { en: "Subscribe", zh: "订阅" },
  "nav.about": { en: "About", zh: "关于" },

  "site.name": { en: "AD Standards Tracker", zh: "自动驾驶标准追踪" },
  "site.tagline": {
    en: "Global autonomous-driving standards, regulations & consultations — tracked daily.",
    zh: "全球自动驾驶 / 智能网联汽车标准、法规与征求意见，每日更新。",
  },

  "dash.total": { en: "Records", zh: "记录总数" },
  "dash.orgs": { en: "Issuing Bodies", zh: "发布机构" },
  "dash.open": { en: "Open Consultations", zh: "开放征求意见" },
  "dash.years": { en: "Years Covered", zh: "覆盖年份" },
  "dash.recent": { en: "Recently Published", zh: "近期发布" },
  "dash.openTitle": { en: "Open for Consultation", zh: "正在征求意见" },
  "dash.viewAll": { en: "View all →", zh: "查看全部 →" },
  "dash.byJuris": { en: "By Jurisdiction", zh: "按辖区" },
  "dash.byStatus": { en: "By Status", zh: "按状态" },

  "std.filter.all": { en: "All", zh: "全部" },
  "std.filter.juris": { en: "Jurisdiction", zh: "辖区" },
  "std.filter.status": { en: "Status", zh: "状态" },
  "std.filter.type": { en: "Type", zh: "类型" },
  "std.filter.year": { en: "Year", zh: "年份" },
  "std.filter.org": { en: "Org", zh: "机构" },
  "std.filter.search": { en: "Search title, number, topic...", zh: "搜索标题 / 编号 / 主题..." },
  "std.empty": { en: "No records match your filters.", zh: "没有匹配的记录。" },
  "std.count": { en: "records", zh: "条" },
  "std.clear": { en: "Clear filters", zh: "清除筛选" },

  "detail.published": { en: "Published", zh: "发布日期" },
  "detail.effective": { en: "Effective", zh: "实施日期" },
  "detail.deadline": { en: "Deadline", zh: "截止日期" },
  "detail.docnum": { en: "Document №", zh: "文件编号" },
  "detail.topics": { en: "Topics", zh: "主题" },
  "detail.levels": { en: "Automation Levels", zh: "自动化等级" },
  "detail.summary": { en: "Summary", zh: "摘要" },
  "detail.impact": { en: "Impact Note", zh: "影响分析" },
  "detail.related": { en: "Related Standards", zh: "关联标准" },
  "detail.source": { en: "Official source", zh: "官方链接" },
  "detail.back": { en: "← Back", zh: "← 返回" },

  "sources.title": { en: "Data Sources", zh: "数据源" },
  "sources.desc": {
    en: "The 25 primary sources monitored by the daily crawler. Only official pages — no full-text redistribution.",
    zh: "每日爬虫监控的 25 个主要数据源。仅抓取官方公开页面元数据，不转发标准全文。",
  },

  "about.title": { en: "About", zh: "关于" },
  "sub.title": { en: "Subscribe", zh: "订阅" },
  "sub.desc": {
    en: "A free, low-volume digest of new standards, drafts, and open consultations — roughly twice a month.",
    zh: "免费低频订阅，覆盖新标准、征求意见与重要更新，约每月两期。",
  },
  "sub.email": { en: "Email address", zh: "邮箱地址" },
  "sub.submit": { en: "Get the digest", zh: "订阅" },
  "sub.rss": { en: "Prefer RSS / Atom? Subscribe via the feed:", zh: "RSS 订阅：" },

  "ui.lang": { en: "中文", zh: "EN" },
} as const;

type Key = keyof typeof T;

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
}

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ad-stds-lang") as Lang | null;
      if (stored === "en" || stored === "zh") setLang(stored);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ad-stds-lang", lang);
      document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    } catch {}
  }, [lang]);

  const t = (k: Key) => T[k][lang];
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export function LangToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "zh" : "en")}
      className="px-2.5 py-1 text-xs font-medium border border-[var(--border)] rounded-md hover:bg-[var(--badge-bg)] transition"
      aria-label="Toggle language"
    >
      {t("ui.lang")}
    </button>
  );
}
