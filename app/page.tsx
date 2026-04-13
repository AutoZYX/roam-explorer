import { getDashboardStats, getAllIncidents } from "@/lib/data";
import DashboardContent from "@/components/dashboard-content";

export default function Dashboard() {
  const stats = getDashboardStats();
  const recent = getAllIncidents().slice(0, 6);
  return <DashboardContent stats={stats} recent={recent} />;
}
