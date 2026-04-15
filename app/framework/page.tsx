import { getScenarioCounts } from "@/lib/data";
import FrameworkContent from "@/components/framework-content";

export default function FrameworkPage() {
  const counts = getScenarioCounts();
  return <FrameworkContent counts={counts} />;
}
