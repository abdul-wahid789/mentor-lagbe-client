import { requireDashboardUser } from "@/lib/dashboard-session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { MyTuitionsClient } from "@/components/dashboard/MyTuitionsClient";

export default async function MyTuitionsPage() {
  const user = await requireDashboardUser(["tutor"]);

  return (
    <DashboardShell user={user} breadcrumbLabel="My tuitions">
      <MyTuitionsClient />
    </DashboardShell>
  );
}