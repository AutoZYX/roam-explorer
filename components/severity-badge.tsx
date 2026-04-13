import { SEVERITY_CONFIG } from "@/lib/constants";

export default function SeverityBadge({ severity }: { severity: string }) {
  const config = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.S0;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config.bg} ${config.color}`}>
      {severity} &middot; {config.label}
    </span>
  );
}
