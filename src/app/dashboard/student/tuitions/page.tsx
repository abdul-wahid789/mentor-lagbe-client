import { requireDashboardUser } from "@/lib/dashboard-session";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { DashboardBrowseTuitionsClient } from "@/components/dashboard/tutor/DashboardBrowseTuitionsClient";

export default async function DashboardStudentTuitionsPage() {
  const user = await requireDashboardUser(["student"]);

  return (
    <DashboardShell user={user} breadcrumbLabel="Browse tuitions">
      <DashboardBrowseTuitionsClient />
    </DashboardShell>
  );
}