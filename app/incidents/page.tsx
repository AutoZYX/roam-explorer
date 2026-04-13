import { getAllIncidents } from "@/lib/data";
import IncidentFilters from "@/components/incident-filters";
import IncidentsHeader from "@/components/incidents-header";

export default function IncidentsPage() {
  const incidents = getAllIncidents();

  return (
    <div>
      <IncidentsHeader />
      <IncidentFilters incidents={incidents} />
    </div>
  );
}
