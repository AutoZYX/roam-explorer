import { getAllIncidents } from "@/lib/data";
import { computeOperatorStats } from "@/lib/operators";
import OperatorsIndex from "@/components/operators-index";

export default function OperatorsPage() {
  const incidents = getAllIncidents();
  const stats = computeOperatorStats(incidents);
  return <OperatorsIndex stats={stats} />;
}
