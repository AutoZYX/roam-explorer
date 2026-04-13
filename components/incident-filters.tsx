"use client";

import { useState, useMemo } from "react";
import type { Incident } from "@/lib/types";
import IncidentCard from "./incident-card";

export default function IncidentFilters({ incidents }: { incidents: Incident[] }) {
  const [search, setSearch] = useState("");
  const [operator, setOperator] = useState<string>("");
  const [severity, setSeverity] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const operators = useMemo(() => [...new Set(incidents.map((i) => i.operator))].sort(), [incidents]);
  const years = useMemo(() => [...new Set(incidents.map((i) => i.date.substring(0, 4)))].sort(), [incidents]);

  const filtered = useMemo(() => {
    return incidents.filter((inc) => {
      if (search && !inc.description.toLowerCase().includes(search.toLowerCase()) && !inc.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (operator && inc.operator !== operator) return false;
      if (severity && inc.severity !== severity) return false;
      if (category && inc.scenario.primary.charAt(0) !== category) return false;
      if (year && !inc.date.startsWith(year)) return false;
      return true;
    });
  }, [incidents, search, operator, severity, category, year]);

  const selClass = "rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search incidents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${selClass} flex-1 min-w-[180px]`}
        />
        <select value={operator} onChange={(e) => setOperator(e.target.value)} className={selClass}>
          <option value="">All Operators</option>
          {operators.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={selClass}>
          <option value="">All Severity</option>
          {["S0", "S1", "S2", "S3", "S4"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selClass}>
          <option value="">All Categories</option>
          {["A", "B", "C", "D", "E", "F"].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} className={selClass}>
          <option value="">All Years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <p className="text-sm text-[var(--muted)] mb-4">
        {filtered.length} incident{filtered.length !== 1 ? "s" : ""} found
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((inc) => (
          <IncidentCard key={inc.id} incident={inc} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[var(--muted)] py-12">
          No incidents match the current filters.
        </p>
      )}
    </div>
  );
}
