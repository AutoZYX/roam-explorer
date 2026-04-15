import { getAllIncidents } from "@/lib/data";
import { computeOperatorStats, getIncidentsByOperator } from "@/lib/operators";
import { notFound } from "next/navigation";
import OperatorDetail from "@/components/operator-detail";

export function generateStaticParams() {
  const stats = computeOperatorStats(getAllIncidents());
  return stats.map((s) => ({ name: s.slug }));
}

export default async function OperatorPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const all = getAllIncidents();
  const { stat, incidents } = getIncidentsByOperator(all, name);
  if (!stat) notFound();
  return <OperatorDetail stat={stat} incidents={incidents} />;
}
