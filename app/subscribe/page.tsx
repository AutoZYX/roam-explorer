"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

const ROLES_EN = [
  "Automotive OEM",
  "Tier 1 supplier",
  "Robotaxi operator",
  "Consultancy",
  "Third-party test house",
  "Regulator / government",
  "Academic researcher",
  "Journalist",
  "Other",
];

const ROLES_ZH = [
  "整车厂",
  "Tier 1 供应商",
  "Robotaxi 运营商",
  "咨询机构",
  "第三方测试机构",
  "监管机构 / 政府",
  "学术研究者",
  "媒体",
  "其他",
];

const INTERESTS_EN = [
  "Monthly PDF report",
  "Tier 1 curated incident alerts",
  "Scenario-specific alerts (e.g., pedestrian, emergency vehicle)",
  "Operator-specific alerts (e.g., Waymo, Cruise)",
  "Quarterly trend analysis",
];

const INTERESTS_ZH = [
  "月度 PDF 报告",
  "Tier 1 精选事件推送",
  "场景订阅（如行人、紧急车辆等）",
  "运营商订阅（如 Waymo、Cruise 等）",
  "季度趋势分析",
];

export default function SubscribePage() {
  const { lang } = useI18n();
  const zh = lang === "zh";
  const roles = zh ? ROLES_ZH : ROLES_EN;
  const interests = zh ? INTERESTS_ZH : INTERESTS_EN;

  const [email, setEmail] = useState("");
  const [role, setRole] = useState(roles[0]);
  const [selected, setSelected] = useState<string[]>([interests[0]]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, interests: selected }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  const toggleInterest = (i: string) => {
    setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl mb-2">
        {zh ? "订阅 ROAM 报告" : "Subscribe to ROAM Reports"}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {zh
          ? "订阅免费的月度报告、事件推送和趋势分析。面向车企、供应商、咨询机构、监管者、研究者。"
          : "Free monthly reports, incident alerts, and trend analysis — for OEMs, suppliers, consultancies, regulators, and researchers."}
      </p>

      {status === "success" ? (
        <div className="rounded-xl bg-green-50 border border-green-200 p-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            {zh ? "订阅成功 ✓" : "Subscribed ✓"}
          </h2>
          <p className="text-sm text-green-700">
            {zh
              ? "每月 1 号你会收到 ROAM 月度报告。新事件或趋势更新会按你选择的订阅推送。"
              : "You'll receive the monthly report on the 1st. Alerts based on your selections will follow."}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              {zh ? "邮箱地址" : "Email address"}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {zh ? "你的角色" : "Your role"}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {zh ? "订阅内容（可多选）" : "Subscribe to (multi-select)"}
            </label>
            <div className="space-y-2">
              {interests.map((i) => (
                <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(i)}
                    onChange={() => toggleInterest(i)}
                    className="mt-0.5"
                  />
                  <span>{i}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading" || !email}
            className="rounded-lg bg-[var(--accent)] text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {status === "loading" ? "..." : zh ? "订阅" : "Subscribe"}
          </button>

          {status === "error" && (
            <p className="text-sm text-red-600">
              {zh ? "提交失败，请重试。" : "Submission failed. Please try again."}
            </p>
          )}

          <p className="text-xs text-[var(--muted)] pt-2">
            {zh
              ? "免费。随时可退订。我们不会将你的邮箱转给第三方。"
              : "Free. Unsubscribe anytime. We never share your email with third parties."}
          </p>
        </form>
      )}
    </div>
  );
}
