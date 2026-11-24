import { requireDashboardUser } from "@/lib/dashboard-session";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { MyTuitionsClient } from "@/components/dashboard/tutor/MyTuitionsClient";

export default async function MyTuitionsPage() {
  const user = await requireDashboardUser(["tutor"]);

  return (
    <DashboardShell user={user} breadcrumbLabel="My tuitions">
      <MyTuitionsClient />
    </DashboardShell>
  );
}