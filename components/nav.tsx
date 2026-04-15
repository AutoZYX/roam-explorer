"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n, LangToggle } from "@/lib/i18n";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const LINKS = [
    { href: "/", label: t("nav.dashboard") },
    { href: "/incidents", label: t("nav.incidents") },
    { href: "/map", label: t("nav.map") },
    { href: "/operators", label: t("nav.operators") },
    { href: "/taxonomy", label: t("nav.taxonomy") },
    { href: "/architecture", label: t("nav.architecture") },
    { href: "/kpis", label: t("nav.kpis") },
    { href: "/reports", label: t("nav.reports") },
    { href: "/about", label: t("nav.about") },
    { href: "/ask", label: t("nav.ask") },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg no-underline text-[var(--text)]">
          <span className="text-[var(--accent)] font-bold text-xl" style={{ fontFamily: "Playfair Display, serif" }}>
            ROAM
          </span>
          <span className="text-sm text-[var(--muted)] hidden sm:inline">Explorer</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => {
            const isActive = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            const isAsk = l.href === "/ask";

            if (isAsk) {
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`ml-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all no-underline inline-flex items-center gap-1 ${
                    isActive
                      ? "bg-[var(--accent)] text-white shadow-sm"
                      : "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)] hover:text-white"
                  }`}
                >
                  <span aria-hidden>✨</span>
                  {l.label}
                </Link>
              );
            }

            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors no-underline ${
                  isActive
                    ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <LangToggle />
          <a
            href="https://github.com/AutoZYX/ROAM"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-[var(--muted)] hover:text-[var(--text)] text-sm no-underline"
          >
            GitHub
          </a>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <LangToggle />
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-[var(--muted)] cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 5h14M3 10h14M3 15h14" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] px-4 pb-3">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm no-underline ${
                pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href))
                  ? "text-[var(--accent)] font-medium"
                  : "text-[var(--muted)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
