import { requireDashboardUser } from "@/lib/dashboard-session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardBrowseTuitionsClient } from "@/components/dashboard/DashboardBrowseTuitionsClient";

export default async function DashboardStudentTuitionsPage() {
  const user = await requireDashboardUser(["student"]);

  return (
    <DashboardShell user={user} breadcrumbLabel="Browse tuitions">
      <DashboardBrowseTuitionsClient />
    </DashboardShell>
  );
}