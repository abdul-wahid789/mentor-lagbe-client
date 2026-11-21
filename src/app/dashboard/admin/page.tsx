import { requireDashboardUser } from "@/lib/dashboard-session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AdminOverview } from "@/components/dashboard/AdminOverview";
import type { TuitionPostItem } from "@/types/dashboard";

// Replace with live aggregations from your Express / MongoDB Atlas API
const PENDING_TUITIONS: TuitionPostItem[] = [];

export default async function AdminDashboardPage() {
  const user = await requireDashboardUser(["admin"]);

  return (
    <DashboardShell user={user} breadcrumbLabel="Overview">
      <AdminOverview
        user={user}
        totalUsers={0}
        studentCount={0}
        tutorCount={0}
        adminCount={0}
        pendingTuitions={PENDING_TUITIONS}
        approvedTuitionsCount={0}
        totalRevenue={0}
      />
    </DashboardShell>
  );
}