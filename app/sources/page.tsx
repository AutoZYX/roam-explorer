import SourcesList from "@/components/sources-list";
import { SOURCES } from "@/lib/sources";

export const metadata = { title: "Sources · AD Standards Tracker" };

export default function SourcesPage() {
  return <SourcesList sources={SOURCES} />;
}
