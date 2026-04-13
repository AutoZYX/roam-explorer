import Link from "next/link";
import { CATEGORY_COLORS } from "@/lib/constants";

export default function ScenarioTag({
  code,
  linked = true,
}: {
  code: string;
  linked?: boolean;
}) {
  const cat = code.charAt(0);
  const color = CATEGORY_COLORS[cat] || "#6b7280";
  const className =
    "inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium no-underline transition-opacity hover:opacity-80";

  if (!linked) {
    return (
      <span className={className} style={{ backgroundColor: `${color}15`, color }}>
        {code}
      </span>
    );
  }

  return (
    <Link
      href={`/taxonomy/${code}`}
      className={className}
      style={{ backgroundColor: `${color}15`, color }}
    >
      {code}
    </Link>
  );
}
