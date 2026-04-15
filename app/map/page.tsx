import { getAllIncidents } from "@/lib/data";
import MapWrapper from "@/components/map-wrapper";

export default function MapPage() {
  const incidents = getAllIncidents();
  return <MapWrapper incidents={incidents} />;
}
