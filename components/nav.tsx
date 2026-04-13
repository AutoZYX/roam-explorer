"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/incidents", label: "Incidents" },
  { href: "/taxonomy", label: "Taxonomy" },
  { href: "/architecture", label: "Architecture" },
  { href: "/kpis", label: "KPIs" },
  { href: "/ask", label: "Ask ROAM" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors no-underline ${
                pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href))
                  ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/zyx312/ROAM"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-[var(--muted)] hover:text-[var(--text)] text-sm no-underline"
          >
            GitHub
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[var(--muted)]"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M4 4l12 12M16 4L4 16" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
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
