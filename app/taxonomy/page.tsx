import { getScenarioCounts } from "@/lib/data";
import TaxonomyContent from "@/components/taxonomy-content";

export default function TaxonomyPage() {
  const counts = getScenarioCounts();
  return <TaxonomyContent counts={counts} />;
}
