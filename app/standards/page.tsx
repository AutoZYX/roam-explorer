import { getAllStandards } from "@/lib/data";
import StandardsBrowser from "@/components/standards-browser";
import StandardsHeader from "@/components/standards-header";

export const metadata = { title: "Standards · AD Standards Tracker" };

export default function StandardsPage() {
  const items = getAllStandards();
  return (
    <div className="space-y-6">
      <StandardsHeader />
      <StandardsBrowser items={items} />
    </div>
  );
}
