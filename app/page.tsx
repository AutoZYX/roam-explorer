import Dashboard from "@/components/dashboard";
import { getAllStandards, getStats } from "@/lib/data";

export default function DashboardPage() {
  const stats = getStats();
  const all = getAllStandards();
  const recent = all.slice(0, 6);
  const today = new Date().toISOString().slice(0, 10);
  const consultations = all.filter(
    (s) =>
      s.status === "consultation" &&
      (!s.consultation_deadline || s.consultation_deadline >= today)
  );
  return <Dashboard stats={stats} recent={recent} consultations={consultations} />;
}
