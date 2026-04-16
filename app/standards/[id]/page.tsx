import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllStandards, getStandardById } from "@/lib/data";
import StandardDetail from "@/components/standard-detail";

export function generateStaticParams() {
  return getAllStandards().map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getStandardById(id);
  if (!s) return { title: "Not found" };
  return { title: `${s.title_en} — AD Standards Tracker` };
}

export default async function StandardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getStandardById(id);
  if (!s) notFound();

  return (
    <div className="space-y-4">
      <Link href="/standards" className="text-sm">
        ← Standards
      </Link>
      <StandardDetail s={s} />
    </div>
  );
}
