"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function SubscribeContent() {
  const { t, lang } = useI18n();
  const cn = lang === "zh";
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // MVP: no backend yet — persist locally and prompt manual mailto fallback.
    try {
      localStorage.setItem("ad-stds-email", email);
    } catch {}
    setSubmitted(true);
  };

  return (
    <article className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold">{t("sub.title")}</h1>
        <p className="text-[var(--muted)] mt-2">{t("sub.desc")}</p>
      </header>

      <section className="card p-5 space-y-3">
        {submitted ? (
          <div className="space-y-3">
            <p className="text-[var(--status-published)] font-medium">
              {cn ? "谢谢！订阅接口尚未上线。" : "Thanks! The subscription backend is not live yet."}
            </p>
            <p className="text-sm">
              {cn
                ? "请直接发送邮件至下面的地址，并在正文写上“订阅”，我会手动加入首批名单："
                : "Please send an email to the address below with the word ‘subscribe’; you will be added to the early list manually:"}
            </p>
            <a
              href={`mailto:zhangyuxin@jlu.edu.cn?subject=${encodeURIComponent(
                "AD Standards Tracker - subscribe"
              )}&body=${encodeURIComponent(email)}`}
              className="inline-block px-4 py-2 bg-[var(--accent)] text-white rounded-md font-medium no-underline"
            >
              {cn ? "打开邮件客户端" : "Open mail client"}
            </a>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-sm font-medium">{t("sub.email")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-white focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--accent)] text-white rounded-md font-medium hover:bg-[var(--accent-hover)] transition"
            >
              {t("sub.submit")}
            </button>
          </form>
        )}
      </section>

      <section className="card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
          RSS / Atom
        </h2>
        <p className="text-sm mb-2">{t("sub.rss")}</p>
        <a href="/api/feed.xml" className="font-mono text-sm">
          /api/feed.xml
        </a>
      </section>

      <section className="text-xs text-[var(--muted)]">
        {cn
          ? "隐私声明：邮箱仅用于本订阅，不转售、不对外共享，随时可退订。"
          : "Privacy: your email is used for this digest only. No resale, no sharing. Unsubscribe any time."}
      </section>
    </article>
  );
}
