"use client";

import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-[var(--border)] mt-16 py-8 text-center text-sm text-[var(--muted)]">
      <div className="mx-auto max-w-5xl px-4">
        <p>
          <strong style={{ fontFamily: "Playfair Display, serif" }}>ROAM</strong>{" "}
          &mdash; {t("footer.desc")}
        </p>
        <p className="mt-1">
          {t("footer.open")} &middot;{" "}
          <a
            href="https://github.com/AutoZYX/ROAM"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            GitHub
          </a>{" "}
          &middot; Apache 2.0
        </p>
      </div>
    </footer>
  );
}
