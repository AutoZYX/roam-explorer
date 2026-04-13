import { getAllIncidents } from "@/lib/data";
import IncidentFilters from "@/components/incident-filters";

export default function IncidentsPage() {
  const incidents = getAllIncidents();

  return (
    <div>
      <h1 className="text-3xl mb-2">Incidents</h1>
      <p className="text-[var(--muted)] mb-6">
        All documented L4+ robotaxi operational anomalies in the ROAM database.
      </p>
      <IncidentFilters incidents={incidents} />
    </div>
  );
}
