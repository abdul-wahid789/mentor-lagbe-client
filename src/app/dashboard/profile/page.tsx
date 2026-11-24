import { requireDashboardUser } from "@/lib/dashboard-session";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { MyProfileClient } from "@/components/dashboard/shared/MyProfileClient";

export default async function DashboardProfilePage() {
  const user = await requireDashboardUser();

  return (
    <DashboardShell user={user} breadcrumbLabel="My profile">
      <MyProfileClient user={user} />
    </DashboardShell>
  );
}