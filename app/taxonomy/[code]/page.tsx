import { TAXONOMY } from "@/lib/constants";
import { getIncidentsByScenarioCode } from "@/lib/data";
import { notFound } from "next/navigation";
import TaxonomyDetailContent from "@/components/taxonomy-detail-content";

export function generateStaticParams() {
  const codes: { code: string }[] = [];
  for (const cat of TAXONOMY) {
    for (const sub of cat.subScenarios) {
      codes.push({ code: sub.id });
    }
  }
  return codes;
}

export default async function ScenarioDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  let category = null;
  let scenario = null;
  for (const cat of TAXONOMY) {
    const found = cat.subScenarios.find((s) => s.id === code);
    if (found) {
      category = cat;
      scenario = found;
      break;
    }
  }
  if (!scenario || !category) notFound();

  const incidents = getIncidentsByScenarioCode(code);

  return (
    <TaxonomyDetailContent
      category={category}
      scenario={scenario}
      incidents={incidents}
    />
  );
}
