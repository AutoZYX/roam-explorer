import { getAllIncidents, getIncidentById } from "@/lib/data";
import { notFound } from "next/navigation";
import IncidentDetailContent from "@/components/incident-detail-content";

export function generateStaticParams() {
  return getAllIncidents().map((inc) => ({ id: inc.id }));
}

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const incident = getIncidentById(id);
  if (!incident) notFound();

  return <IncidentDetailContent incident={incident} />;
}
