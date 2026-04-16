"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LangToggle, useI18n } from "@/lib/i18n";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const LINKS = [
    { href: "/", label: t("nav.dashboard") },
    { href: "/standards", label: t("nav.standards") },
    { href: "/sources", label: t("nav.sources") },
    { href: "/subscribe", label: t("nav.subscribe") },
    { href: "/about", label: t("nav.about") },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 no-underline text-[var(--text)]">
          <span
            className="text-[var(--accent)] font-bold text-lg tracking-tight"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            AD · Standards
          </span>
          <span className="text-xs text-[var(--muted)] hidden sm:inline">
            Tracker
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition no-underline ${
                isActive(l.href)
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text)] hover:bg-[var(--badge-bg)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <span className="ml-2">
            <LangToggle />
          </span>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="md:hidden p-2 text-[var(--text)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] px-4 py-2 space-y-1 bg-[var(--bg)]">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm no-underline ${
                isActive(l.href)
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text)] hover:bg-[var(--badge-bg)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2"><LangToggle /></div>
        </div>
      )}
    </nav>
  );
}
